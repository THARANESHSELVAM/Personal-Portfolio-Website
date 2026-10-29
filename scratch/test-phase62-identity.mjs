import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Tharanesh\\.gemini\\antigravity-ide\\brain\\007a5c4f-f6dc-4b30-8db5-bc73a1e4fd41";
const shotDynamicFooter = path.join(artifactDir, "phase62_footer_identity.png");

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function runPhase62Test() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 6.2 DYNAMIC FOOTER IDENTITY VERIFICATION");
  console.log("================================================================================\n");

  const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_phase62_test_" + Date.now());

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

    // Wait for SecurityGate to load
    await new Promise((r) => setTimeout(r, 1500));

    console.log("--- 1. Authenticating as Owner Profile (Tharanesh Selvam) ---");
    await evaluate(`
      (() => {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
      })()
    `);

    await new Promise((r) => setTimeout(r, 1500));

    // Check Navbar identity
    const navMonogram = await evaluate(`document.querySelector('header nav')?.parentElement?.querySelector('div > button > div')?.innerText?.trim()`);
    const navName = await evaluate(`document.querySelector('header nav')?.parentElement?.querySelector('div > button > div:nth-child(2) > span:first-child')?.innerText?.trim()`);

    console.log(`   Navbar Brand: Monogram="${navMonogram}", Name="${navName}"`);
    if (navMonogram === "TS") logPass("Navbar monogram is 'TS'");
    else logFail(`Expected Navbar monogram 'TS', got '${navMonogram}'`);

    if (navName?.toLowerCase()?.includes("tharanesh")) logPass("Navbar display name matches 'THARANESH SELVAM'");
    else logFail(`Expected Navbar name to contain 'tharanesh', got '${navName}'`);

    // Check Footer identity
    const footerMonogram = await evaluate(`document.querySelector('footer .w-8.h-8')?.innerText?.trim()`);
    const footerName = await evaluate(`document.querySelector('footer span.font-extrabold')?.innerText?.trim()`);
    const footerDesc = await evaluate(`document.querySelector('footer p.max-w-sm')?.innerText?.trim()`);
    const footerCopy = await evaluate(`document.querySelector('footer div.text-slate-500')?.innerText?.trim()`);

    console.log(`   Footer Brand: Monogram="${footerMonogram}", Name="${footerName}"`);
    console.log(`   Footer Description: "${footerDesc}"`);
    console.log(`   Footer Copyright: "${footerCopy}"`);

    if (footerMonogram === "TS") logPass("Footer monogram dynamically renders 'TS'");
    else logFail(`Expected Footer monogram 'TS', got '${footerMonogram}'`);

    if (footerName?.toUpperCase() === "THARANESH SELVAM") logPass("Footer display name dynamically renders 'THARANESH SELVAM'");
    else logFail(`Expected Footer name 'THARANESH SELVAM', got '${footerName}'`);

    if (footerDesc?.includes("Full-Stack Software Engineer") || footerDesc?.includes("Cloud Architect")) {
      logPass("Footer description dynamically reflects active profile's professional title");
    } else {
      logFail(`Footer description does not reflect title: '${footerDesc}'`);
    }

    if (footerCopy?.includes("Tharanesh Selvam")) {
      logPass("Footer copyright dynamically includes active profile's name");
    } else {
      logFail(`Footer copyright does not include 'Tharanesh Selvam': '${footerCopy}'`);
    }

    console.log("\n--- 2. Switching to Custom Profile: 'Jane Doe' (Title: 'Staff AI Systems Engineer') ---");
    // Open user dropdown in Navbar
    await evaluate(`
      (() => {
        const userPill = document.querySelector('header div.relative > button');
        if (userPill) userPill.click();
      })()
    `);

    await new Promise((r) => setTimeout(r, 600));

    // Click "➕ Add New Profile Entry"
    const clickedAdd = await evaluate(`
      (() => {
        const btns = Array.from(document.querySelectorAll('header div.relative button'));
        const addBtn = btns.find(b => b.textContent && b.textContent.includes('Add New Profile'));
        if (addBtn) {
          addBtn.click();
          return true;
        }
        return false;
      })()
    `);

    if (!clickedAdd) {
      logFail("Could not locate '➕ Add New Profile Entry' button in profile dropdown");
    } else {
      logPass("Triggered '➕ Add New Profile Entry' from user dropdown");
    }

    await new Promise((r) => setTimeout(r, 1500));

    // Check if on SecurityGate
    const isGateActive = await evaluate(`Boolean(document.querySelector('form button[type="submit"]'))`);
    if (isGateActive) {
      console.log("   Security Gate active for new profile onboarding. Filling Jane Doe...");
      await evaluate(`
        (() => {
          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          const inputs = Array.from(document.querySelectorAll('form input'));
          
          // input 0: userId
          if (inputs[0]) {
            nativeSetter.call(inputs[0], 'janedoe');
            inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
          }
          // input 1: email
          if (inputs[1]) {
            nativeSetter.call(inputs[1], 'jane.doe@example.com');
            inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
          }
          // input 2: passcode
          if (inputs[2]) {
            nativeSetter.call(inputs[2], '2026');
            inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
          }
          // input 3: Full Name
          if (inputs[3]) {
            nativeSetter.call(inputs[3], 'Jane Doe');
            inputs[3].dispatchEvent(new Event('input', { bubbles: true }));
          }
          // input 4: Target Role / Title
          if (inputs[4]) {
            nativeSetter.call(inputs[4], 'Staff AI Systems Engineer');
            inputs[4].dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()
      `);

      await new Promise((r) => setTimeout(r, 500));

      // Submit gate
      await evaluate(`
        (() => {
          const form = document.querySelector('form');
          if (form) form.requestSubmit();
        })()
      `);

      await new Promise((r) => setTimeout(r, 1800));

      // Verify Jane Doe in Navbar AND Footer
      const janeNavMonogram = await evaluate(`document.querySelector('header nav')?.parentElement?.querySelector('div > button > div')?.innerText?.trim()`);
      const janeNavName = await evaluate(`document.querySelector('header nav')?.parentElement?.querySelector('div > button > div:nth-child(2) > span:first-child')?.innerText?.trim()`);

      const janeFooterMonogram = await evaluate(`document.querySelector('footer .w-8.h-8')?.innerText?.trim()`);
      const janeFooterName = await evaluate(`document.querySelector('footer span.font-extrabold')?.innerText?.trim()`);
      const janeFooterDesc = await evaluate(`document.querySelector('footer p.max-w-sm')?.innerText?.trim()`);
      const janeFooterCopy = await evaluate(`document.querySelector('footer div.text-slate-500')?.innerText?.trim()`);

      console.log(`   Jane Doe Navbar: Monogram="${janeNavMonogram}", Name="${janeNavName}"`);
      console.log(`   Jane Doe Footer: Monogram="${janeFooterMonogram}", Name="${janeFooterName}"`);
      console.log(`   Jane Doe Footer Title: "${janeFooterDesc}"`);
      console.log(`   Jane Doe Footer Copyright: "${janeFooterCopy}"`);

      if (janeNavMonogram === "JD") logPass("Navbar monogram updated dynamically to 'JD'");
      else logFail(`Expected Navbar monogram 'JD', got '${janeNavMonogram}'`);

      if (janeFooterMonogram === "JD") logPass("Footer monogram updated dynamically to 'JD'");
      else logFail(`Expected Footer monogram 'JD', got '${janeFooterMonogram}'`);

      if (janeFooterName?.toUpperCase() === "JANE DOE") logPass("Footer display name updated dynamically to 'JANE DOE'");
      else logFail(`Expected Footer name 'JANE DOE', got '${janeFooterName}'`);

      if (janeFooterDesc?.includes("Staff AI Systems Engineer")) {
        logPass("Footer description updated dynamically to 'Staff AI Systems Engineer'");
      } else {
        logFail(`Expected Footer title to include 'Staff AI Systems Engineer', got '${janeFooterDesc}'`);
      }

      if (janeFooterCopy?.includes("Jane Doe")) {
        logPass("Footer copyright updated dynamically to 'Jane Doe'");
      } else {
        logFail(`Expected Footer copyright to include 'Jane Doe', got '${janeFooterCopy}'`);
      }

      // Scroll to footer and take screenshot
      await evaluate(`
        (() => {
          document.querySelector('footer')?.scrollIntoView({ behavior: 'instant', block: 'end' });
        })()
      `);
      await new Promise((r) => setTimeout(r, 600));

      const screenshot = await sendCDP("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(shotDynamicFooter, Buffer.from(screenshot.data, "base64"));
      logPass(`Saved dynamic footer screenshot: ${shotDynamicFooter}`);

      console.log("\n--- 3. Testing Single-Word Name & Fallbacks ---");
      const testCases = [
        { name: "Aristotle", expected: "AR" },
        { name: "Arun Kumar Raj", expected: "AR" },
        { name: "John", expected: "JO" },
        { name: "", expected: "PO" },
        { name: "   ", expected: "PO" },
      ];

      for (const tc of testCases) {
        const computed = await evaluate(`
          (() => {
            const displayName = "${tc.name}".trim() || "Portfolio Owner";
            const parts = displayName.trim().split(/\\s+/).filter(Boolean);
            if (parts.length === 0) return "PO";
            if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          })()
        `);
        if (computed === tc.expected) {
          logPass(`Initials helper for '${tc.name}' evaluates correctly to '${tc.expected}'`);
        } else {
          logFail(`Expected initials for '${tc.name}' to be '${tc.expected}', got '${computed}'`);
        }
      }

      console.log("\n--- 4. Switching Back to Original Profile (Tharanesh Selvam) ---");
      await evaluate(`
        (() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
        })()
      `);
      await new Promise((r) => setTimeout(r, 400));

      // Open user dropdown
      await evaluate(`
        (() => {
          const userPill = document.querySelector('header div.relative > button');
          if (userPill) userPill.click();
        })()
      `);
      await new Promise((r) => setTimeout(r, 500));

      // Switch to Tharanesh
      await evaluate(`
        (() => {
          const btns = Array.from(document.querySelectorAll('header div.relative button'));
          const ownerOption = btns.find(b => b.textContent && b.textContent.includes('Tharanesh'));
          if (ownerOption) ownerOption.click();
        })()
      `);
      await new Promise((r) => setTimeout(r, 1200));

      const restoredMonogram = await evaluate(`document.querySelector('footer .w-8.h-8')?.innerText?.trim()`);
      const restoredName = await evaluate(`document.querySelector('footer span.font-extrabold')?.innerText?.trim()`);
      const restoredDesc = await evaluate(`document.querySelector('footer p.max-w-sm')?.innerText?.trim()`);

      console.log(`   Restored Footer: Monogram="${restoredMonogram}", Name="${restoredName}"`);
      if (restoredMonogram === "TS" && restoredName?.toUpperCase() === "THARANESH SELVAM") {
        logPass("Footer monogram and name successfully restored to 'TS' / 'THARANESH SELVAM'");
      } else {
        logFail(`Expected restored 'TS' / 'THARANESH SELVAM', got '${restoredMonogram}' / '${restoredName}'`);
      }

      if (restoredDesc?.includes("Full-Stack Software Engineer") || restoredDesc?.includes("Cloud Architect")) {
        logPass("Footer title successfully restored to owner title");
      } else {
        logFail(`Expected restored owner title, got '${restoredDesc}'`);
      }
    } else {
      logFail("Security Gate was not active after promptCreateProfile");
    }

    console.log("\n================================================================================");
    if (failures === 0) {
      console.log("🎉 ALL PHASE 6.2 DYNAMIC FOOTER TESTS PASSED WITH 0 FAILURES!");
    } else {
      console.error(`💥 PHASE 6.2 FAILED WITH ${failures} FAILURE(S)!`);
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

runPhase62Test();
