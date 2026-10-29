import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Tharanesh\\.gemini\\antigravity-ide\\brain\\007a5c4f-f6dc-4b30-8db5-bc73a1e4fd41";
const shotNavbarDesktop = path.join(artifactDir, "phase63_navbar_dynamic_desktop.png");
const shotNavbarMobile = path.join(artifactDir, "phase63_navbar_dynamic_mobile.png");

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function runPhase63Test() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 6.3 NAVIGATION TELEMETRY VERIFICATION");
  console.log("================================================================================\n");

  const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_phase63_test_" + Date.now());

  const edge = spawn(edgePath, [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-fre",
    "--remote-debugging-port=9222",
    "--window-size=1440,1000",
    "--user-data-dir=" + userDataDir,
    "http://localhost:3000"
  ]);

  edge.stderr.on("data", () => {});

  await new Promise((r) => setTimeout(r, 2500));

  let pageWsUrl = "";
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch("http://localhost:9222/json/list");
      const list = await res.json();
      const target = list.find(t => t.url && t.url.includes("localhost:3000") && t.webSocketDebuggerUrl) 
        || list.find(t => t.type === "page" && t.webSocketDebuggerUrl)
        || list[0];
      if (target && target.webSocketDebuggerUrl) {
        pageWsUrl = target.webSocketDebuggerUrl;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!pageWsUrl) {
    console.error("Could not find WebSocket debugger URL on port 9222");
    edge.kill();
    process.exit(1);
  }

  const ws = new WebSocket(pageWsUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const cb = callbacks.get(data.id);
      callbacks.delete(data.id);
      cb(data);
    }
  };

  function sendCDP(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, (res) => {
        if (res.error) reject(res.error);
        else resolve(res.result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expr) {
    const res = await sendCDP("Runtime.evaluate", {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  try {
    await sendCDP("Page.enable");
    await sendCDP("DOM.enable");
    await sendCDP("Runtime.enable");

    // Wait for SecurityGate to load and unlock
    await new Promise((r) => setTimeout(r, 1500));

    console.log("--- 1. Authenticating to Workspace ---");
    await evaluate(`
      (() => {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
      })()
    `);

    await new Promise((r) => setTimeout(r, 1500));

    console.log("--- 2. Inspecting Desktop Navigation Badge ---");
    // Find the ATS Resume nav button
    const resumeNavBtnText = await evaluate(`
      (() => {
        const navButtons = Array.from(document.querySelectorAll('header nav button'));
        const resumeBtn = navButtons.find(b => b.textContent && b.textContent.includes('ATS Resume'));
        return resumeBtn ? resumeBtn.innerText.replace(/\\s+/g, ' ').trim() : null;
      })()
    `);

    console.log(`   ATS Resume Nav Button Text: "${resumeNavBtnText}"`);

    if (resumeNavBtnText?.includes("Dynamic")) {
      logPass("Desktop navigation displays 'Dynamic' label beside ATS Resume");
    } else {
      logFail(`Expected 'Dynamic' label, got '${resumeNavBtnText}'`);
    }

    if (!resumeNavBtnText?.includes("Online")) {
      logPass("Misleading 'Online' label is completely absent from navigation");
    } else {
      logFail("Navigation still contains 'Online' text!");
    }

    // Check for absence of pulse animation and presence of accessibility attributes
    const indicatorDetails = await evaluate(`
      (() => {
        const navButtons = Array.from(document.querySelectorAll('header nav button'));
        const resumeBtn = navButtons.find(b => b.textContent && b.textContent.includes('ATS Resume'));
        if (!resumeBtn) return null;
        
        const badgeSpan = resumeBtn.querySelector('span[aria-label="Dynamic resume generation"]');
        const dotSpan = badgeSpan?.querySelector('span[aria-hidden="true"]');
        const hasPulse = dotSpan?.classList.contains('animate-pulse');
        const tooltip = badgeSpan?.getAttribute('title');
        const ariaLabel = badgeSpan?.getAttribute('aria-label');
        
        return {
          foundBadge: Boolean(badgeSpan),
          foundDot: Boolean(dotSpan),
          hasPulse: Boolean(hasPulse),
          tooltip,
          ariaLabel
        };
      })()
    `);

    console.log("   Indicator Details:", indicatorDetails);

    if (indicatorDetails?.foundBadge && indicatorDetails?.foundDot) {
      logPass("Indicator dot and container rendered properly");
    } else {
      logFail("Could not locate indicator dot or container");
    }

    if (!indicatorDetails?.hasPulse) {
      logPass("Pulsing live-connectivity animation ('animate-pulse') removed");
    } else {
      logFail("Indicator dot still has 'animate-pulse' class!");
    }

    if (indicatorDetails?.tooltip?.includes("Dynamically compiled")) {
      logPass(`Descriptive hover tooltip present: "${indicatorDetails.tooltip}"`);
    } else {
      logFail(`Tooltip missing or unexpected: "${indicatorDetails?.tooltip}"`);
    }

    if (indicatorDetails?.ariaLabel === "Dynamic resume generation") {
      logPass("Accessible aria-label 'Dynamic resume generation' verified");
    } else {
      logFail(`Unexpected aria-label: "${indicatorDetails?.ariaLabel}"`);
    }

    // Capture desktop navbar screenshot
    const shotDesk = await sendCDP("Page.captureScreenshot", {
      clip: { x: 0, y: 0, width: 1440, height: 180, scale: 1 }
    });
    fs.writeFileSync(shotNavbarDesktop, Buffer.from(shotDesk.data, "base64"));
    logPass(`Saved desktop navbar screenshot: ${shotNavbarDesktop}`);

    console.log("\n--- 3. Responsive Viewport Audits (320px to 1440px) ---");
    const viewports = [
      { w: 320, h: 800, name: "320px Mobile" },
      { w: 375, h: 812, name: "375px Mobile" },
      { w: 768, h: 1024, name: "768px Tablet" },
      { w: 1024, h: 768, name: "1024px Laptop" },
      { w: 1440, h: 1000, name: "1440px Desktop" }
    ];

    for (const vp of viewports) {
      await sendCDP("Emulation.setDeviceMetricsOverride", {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 768,
      });
      await new Promise((r) => setTimeout(r, 400));

      const overflow = await evaluate(`
        (() => {
          const scrollW = document.documentElement.scrollWidth;
          const clientW = document.documentElement.clientWidth;
          return { scrollW, clientW, diff: scrollW - clientW };
        })()
      `);

      if (overflow.diff <= 0) {
        logPass(`Viewport ${vp.name} (${vp.w}x${vp.h}): 0px horizontal overflow (scrollWidth=${overflow.scrollW}px)`);
      } else {
        logFail(`Viewport ${vp.name} has ${overflow.diff}px horizontal overflow!`);
      }
    }

    console.log("\n--- 4. Mobile Menu Drawer Inspection (375px) ---");
    await sendCDP("Emulation.setDeviceMetricsOverride", {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 400));

    // Open hamburger menu
    await evaluate(`
      (() => {
        const hamburgerBtn = Array.from(document.querySelectorAll('header button')).find(
          b => b.querySelector('svg.lucide-menu') || b.getAttribute('aria-label')?.includes('menu') || b.querySelector('svg')
        );
        // Specifically the button containing Menu icon
        const btns = Array.from(document.querySelectorAll('header button'));
        const menuBtn = btns[btns.length - 1]; // Hamburger is rightmost button on mobile
        if (menuBtn) menuBtn.click();
      })()
    `);

    await new Promise((r) => setTimeout(r, 600));

    const mobileResumeBadge = await evaluate(`
      (() => {
        // Look for ATS Resume item inside mobile menu container
        const buttons = Array.from(document.querySelectorAll('header div.md\\\\:hidden button, header div.space-y-1 button'));
        const resumeBtn = buttons.find(b => b.textContent && b.textContent.includes('ATS Resume'));
        if (!resumeBtn) return null;
        
        const badge = resumeBtn.querySelector('span[aria-label="Dynamic resume generation"]');
        return {
          fullText: resumeBtn.innerText.replace(/\\s+/g, ' ').trim(),
          badgeText: badge?.innerText?.trim(),
          hasOnline: resumeBtn.innerText.includes('Online'),
          hasDynamic: resumeBtn.innerText.includes('Dynamic')
        };
      })()
    `);

    console.log("   Mobile ATS Resume Item:", mobileResumeBadge);

    if (mobileResumeBadge?.hasDynamic) {
      logPass("Mobile navigation drawer displays 'Dynamic' label beside ATS Resume");
    } else {
      logFail(`Expected 'Dynamic' in mobile drawer, got: ${JSON.stringify(mobileResumeBadge)}`);
    }

    if (!mobileResumeBadge?.hasOnline) {
      logPass("Misleading 'Online' label is completely absent from mobile drawer");
    } else {
      logFail("Mobile drawer still contains 'Online' label!");
    }

    const shotMob = await sendCDP("Page.captureScreenshot", {
      clip: { x: 0, y: 0, width: 375, height: 450, scale: 2 }
    });
    fs.writeFileSync(shotNavbarMobile, Buffer.from(shotMob.data, "base64"));
    logPass(`Saved mobile navigation drawer screenshot: ${shotNavbarMobile}`);

    console.log("\n================================================================================");
    if (failures === 0) {
      console.log("🎉 ALL PHASE 6.3 NAVIGATION TELEMETRY TESTS PASSED WITH 0 FAILURES!");
    } else {
      console.error(`💥 PHASE 6.3 FAILED WITH ${failures} FAILURE(S)!`);
    }
    console.log("================================================================================\n");

  } catch (err) {
    console.error("Test execution error:", err);
    failures++;
  } finally {
    ws.close();
    edge.kill();
    process.exit(failures > 0 ? 1 : 0);
  }
}

runPhase63Test();
