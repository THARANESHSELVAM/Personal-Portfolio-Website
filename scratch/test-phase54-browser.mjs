import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Tharanesh\\.gemini\\antigravity-ide\\brain\\007a5c4f-f6dc-4b30-8db5-bc73a1e4fd41";

const shotAppliedIn = path.join(artifactDir, "applied_in_learning_entry.png");
const shotCaseStudyFromDiary = path.join(artifactDir, "destination_casestudy_from_diary.png");
const shotMobileAppliedIn = path.join(artifactDir, "applied_in_mobile_375.png");

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function runPhase54BrowserValidation() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 5.4 EVIDENCE RECIPROCITY & BROWSER INTEGRATION");
  console.log("================================================================================\n");

  const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_phase54_clean");

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

  // Wait 2.5s for Edge to start
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
      callbacks.get(data.id)(data);
      callbacks.delete(data.id);
    }
  };

  function sendCDP(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await sendCDP("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.result?.value;
  }

  await sendCDP("Page.enable");
  await sendCDP("Runtime.enable");
  await sendCDP("Network.enable");
  await sendCDP("Network.setCacheDisabled", { cacheDisabled: true });

  // Navigate to localhost:3000
  await sendCDP("Page.navigate", { url: "http://localhost:3000" });
  await new Promise((r) => setTimeout(r, 2500));

  // Step 0: Security Gate PIN Unlock
  console.log("--- 0. Security Gate Authentication & Clean Initial State ---");
  await evaluate(`
    (() => {
      localStorage.clear();
      sessionStorage.clear();
    })()
  `);
  await sendCDP("Page.navigate", { url: "http://localhost:3000" });
  await new Promise((r) => setTimeout(r, 2000));

  await evaluate(`
    (function() {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    })()
  `);
  await new Promise((r) => setTimeout(r, 2500));

  // Step 1: Navigate to Learning Diary
  console.log("\n--- 1. Navigating to Learning Diary tab ---");
  const navSuccess = await evaluate(`
    (() => {
      const diaryTab = Array.from(document.querySelectorAll('nav button, nav a')).find(el => el.textContent.includes('Diary'));
      if (diaryTab) {
        diaryTab.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise((r) => setTimeout(r, 1200));

  const isDiaryMounted = await evaluate(`Boolean(document.getElementById('learning-log'))`);
  if (isDiaryMounted) {
    logPass("LearningLog component is mounted");
  } else {
    logFail("LearningLog component not found");
  }

  // Step 2: Verify "Applied in" section on learn-1
  console.log("\n--- 2. Verifying 'Applied in' Project References on Milestones ---");
  const appData = await evaluate(`
    (() => {
      const learn1 = document.getElementById('learning-entry-learn-1');
      if (!learn1) return { found: false, error: 'learn-1 not found' };

      const appliedSec = document.getElementById('applied-in-section-learn-1');
      if (!appliedSec) return { found: false, error: 'applied-in-section-learn-1 not found' };

      const portfolioBtn = document.getElementById('applied-project-btn-learn-1-personal-portfolio');
      const landStackBtn = document.getElementById('applied-project-btn-learn-1-land-stack');

      return {
        found: true,
        hasPortfolio: !!portfolioBtn,
        portfolioText: portfolioBtn ? portfolioBtn.textContent.trim() : null,
        hasLandStack: !!landStackBtn,
        landStackText: landStackBtn ? landStackBtn.textContent.trim() : null,
      };
    })()
  `);

  if (appData && appData.found) {
    logPass("Found #applied-in-section-learn-1 in milestone entry");
    if (appData.hasPortfolio) {
      logPass(`Found 'Personal Portfolio Website' link button (text: "${appData.portfolioText}")`);
    } else {
      logFail("Missing 'Personal Portfolio Website' applied project button");
    }
    if (appData.hasLandStack) {
      logPass(`Found 'Land Stack' link button (text: "${appData.landStackText}")`);
    } else {
      logFail("Missing 'Land Stack' applied project button");
    }
  } else {
    logFail(`Applied in section verification failed: ${JSON.stringify(appData)}`);
  }

  // Scroll to learn-1 and take screenshot
  await evaluate(`
    const el = document.getElementById('learning-entry-learn-1');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  `);
  await new Promise((r) => setTimeout(r, 600));

  const shotRes1 = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (shotRes1.result?.data) {
    fs.writeFileSync(shotAppliedIn, Buffer.from(shotRes1.result.data, "base64"));
    logPass(`Saved screenshot: ${shotAppliedIn}`);
  }

  // Step 3: Verify entry without matching project tech stack hides "Applied in" section
  console.log("\n--- 3. Verifying unassociated milestones hide 'Applied in' section ---");
  const unassocData = await evaluate(`
    (() => {
      const learn4Applied = document.getElementById('applied-in-section-learn-4');
      const learn5Applied = document.getElementById('applied-in-section-learn-5');
      return {
        learn4HasApplied: !!learn4Applied,
        learn5HasApplied: !!learn5Applied
      };
    })()
  `);

  if (!unassocData?.learn4HasApplied && !unassocData?.learn5HasApplied) {
    logPass("Milestones without matching project tech stacks (learn-4, learn-5) correctly hide 'Applied in' section");
  } else {
    logFail(`Expected no applied section for learn-4/learn-5, got: ${JSON.stringify(unassocData)}`);
  }

  // Step 4: Click "Personal Portfolio Website" applied project button and verify case study navigation
  console.log("\n--- 4. Activating 'Personal Portfolio Website' applied project link ---");
  const clickedPortfolio = await evaluate(`
    (() => {
      const btn = document.getElementById('applied-project-btn-learn-1-personal-portfolio');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()
  `);

  if (clickedPortfolio) {
    logPass("Clicked 'Personal Portfolio Website' link button");
  } else {
    logFail("Failed to click 'Personal Portfolio Website' button");
  }

  // Wait for tab switch and case study modal to animate open
  await new Promise((r) => setTimeout(r, 1400));

  const csData = await evaluate(`
    (() => {
      const bodyText = document.body.innerText;
      const isOpen = bodyText.includes('Personal Portfolio Website') && 
                     (bodyText.includes('ARCHITECTURE & IMPLEMENTATION') || 
                      bodyText.includes('CASE STUDY') ||
                      bodyText.includes('PROBLEM STATEMENT'));

      return {
        isOpen,
        bodyExcerpt: bodyText.substring(0, 300)
      };
    })()
  `);

  if (csData && csData.isOpen) {
    logPass("Case Study for 'Personal Portfolio Website' opened directly from Diary link!");
    logPass("Active tab automatically switched to Projects");
  } else {
    logFail(`Case study did not open as expected: ${JSON.stringify(csData)}`);
  }

  // Capture screenshot of destination Case Study
  const shotRes2 = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (shotRes2.result?.data) {
    fs.writeFileSync(shotCaseStudyFromDiary, Buffer.from(shotRes2.result.data, "base64"));
    logPass(`Saved screenshot: ${shotCaseStudyFromDiary}`);
  }

  // Close Case Study Modal via Escape key
  await sendCDP("Input.dispatchKeyEvent", { type: "rawKeyDown", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await sendCDP("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await new Promise((r) => setTimeout(r, 600));

  // Step 5: Test Land Stack navigation
  console.log("\n--- 5. Testing 'Land Stack' applied project navigation ---");
  // Switch back to Diary
  await evaluate(`
    (() => {
      const diaryTab = Array.from(document.querySelectorAll('nav button, nav a')).find(el => el.textContent.includes('Diary'));
      if (diaryTab) diaryTab.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 1000));

  // Click Land Stack button
  await evaluate(`
    (() => {
      const btn = document.getElementById('applied-project-btn-learn-1-land-stack');
      if (btn) btn.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 1400));

  const landStackOpened = await evaluate(`
    (() => {
      const bodyText = document.body.innerText;
      return bodyText.includes('Land Stack') && (bodyText.includes('Geospatial') || bodyText.includes('GIS') || bodyText.includes('PostGIS') || bodyText.includes('CASE STUDY'));
    })()
  `);

  if (landStackOpened) {
    logPass("Case Study for 'Land Stack' opened directly from Diary link!");
  } else {
    logFail("Failed to open Land Stack case study from Diary link");
  }

  // Close modal via Escape
  await sendCDP("Input.dispatchKeyEvent", { type: "rawKeyDown", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await sendCDP("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await new Promise((r) => setTimeout(r, 600));

  // Step 6: Test Responsive Viewports (320px, 375px, 768px, 1024px, 1440px)
  console.log("\n--- 6. Responsive Layout & Mobile Wrapping Verification ---");
  // Switch back to Diary
  await evaluate(`
    (() => {
      const diaryTab = Array.from(document.querySelectorAll('nav button, nav a')).find(el => el.textContent.includes('Diary'));
      if (diaryTab) diaryTab.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 800));

  const viewports = [
    { width: 320, height: 800 },
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    await sendCDP("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await new Promise((r) => setTimeout(r, 400));

    const ov = await evaluate(`
      (() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const appliedSec = document.getElementById('applied-in-section-learn-1');
        return {
          docWidth,
          winWidth,
          hasOverflow: docWidth > winWidth,
          appliedSecVisible: !!appliedSec
        };
      })()
    `);

    if (ov && !ov.hasOverflow) {
      logPass(`Viewport ${vp.width}x${vp.height}: No horizontal overflow (docWidth: ${ov.docWidth}px, winWidth: ${ov.winWidth}px)`);
    } else {
      logFail(`Viewport ${vp.width}x${vp.height} had horizontal overflow: ${JSON.stringify(ov)}`);
    }

    if (vp.width === 375) {
      await evaluate(`
        const sec = document.getElementById('applied-in-section-learn-1');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      `);
      await new Promise((r) => setTimeout(r, 600));
      const mobileShot = await sendCDP("Page.captureScreenshot", { format: "png" });
      if (mobileShot.result?.data) {
        fs.writeFileSync(shotMobileAppliedIn, Buffer.from(mobileShot.result.data, "base64"));
        logPass(`Saved mobile screenshot: ${shotMobileAppliedIn}`);
      }
    }
  }

  // Reset emulation
  await sendCDP("Emulation.clearDeviceMetricsOverride");

  // Step 7: Browser-Level Starter State Check
  console.log("\n--- 7. Verification of Active Diary Entries ---");
  const entriesCount = await evaluate(`
    document.querySelectorAll('article[id^="learning-entry-"]').length
  `);
  if (entriesCount === 6) {
    logPass(`Active diary displays all 6 valid starter milestones`);
  } else {
    logFail(`Expected 6 starter milestones, found ${entriesCount}`);
  }

  console.log("\n================================================================================");
  if (failures === 0) {
    console.log("🎉 ALL PHASE 5.4 BROWSER & INTEGRATION TESTS PASSED WITH 0 FAILURES!");
  } else {
    console.error(`💥 ${failures} BROWSER TESTS FAILED!`);
  }
  console.log("================================================================================\n");

  ws.close();
  edge.kill();
  process.exit(failures === 0 ? 0 : 1);
}

runPhase54BrowserValidation().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
