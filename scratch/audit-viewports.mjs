import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_audit_vp_" + Date.now());

const viewports = [
  { name: "Mobile S", width: 320, height: 800 },
  { name: "Mobile M", width: 375, height: 812 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Laptop", width: 1024, height: 768 },
  { name: "Desktop", width: 1440, height: 1000 },
];

async function runViewportAudit() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 6.6 RESPONSIVE VIEWPORT & OVERFLOW AUDIT");
  console.log("================================================================================\n");

  const edge = spawn(edgePath, [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-fre",
    "--remote-debugging-port=9230",
    "--window-size=1280,900",
    "--user-data-dir=" + userDataDir,
    "http://localhost:3000"
  ]);

  edge.stderr.on("data", () => {});
  await new Promise(r => setTimeout(r, 2500));

  let pageWsUrl = "";
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch("http://localhost:9230/json/list");
      const list = await res.json();
      const target = list.find(t => t.url && t.url.includes("localhost:3000") && t.webSocketDebuggerUrl)
        || list.find(t => t.type === "page" && t.webSocketDebuggerUrl);
      if (target && target.webSocketDebuggerUrl) {
        pageWsUrl = target.webSocketDebuggerUrl;
        break;
      }
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (!pageWsUrl) {
    console.error("Could not find WebSocket debugger URL on port 9230");
    edge.kill();
    process.exit(1);
  }

  const ws = new WebSocket(pageWsUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pending = new Map();
  const consoleMessages = [];

  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data);
    if (data.method === "Runtime.consoleAPICalled") {
      consoleMessages.push(data.params);
    }
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data.result);
      pending.delete(data.id);
    }
  };

  function sendCDP(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await sendCDP("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.value;
  }

  await sendCDP("Page.enable");
  await sendCDP("Runtime.enable");

  // Audit 1: Security Gate Viewports
  console.log("--- 1. Security Gate Responsive & Overflow Audit ---");
  for (const vp of viewports) {
    await sendCDP("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768
    });
    await new Promise(r => setTimeout(r, 300));

    const overflow = await evaluate(`
      ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth
      })
    `);

    if (overflow.hasOverflow) {
      console.log(`❌ [FAIL] SecurityGate @ ${vp.width}x${vp.height} (${vp.name}): Overflow detected! scrollWidth=${overflow.scrollWidth}px, innerWidth=${overflow.innerWidth}px`);
    } else {
      console.log(`✅ [PASS] SecurityGate @ ${vp.width}x${vp.height} (${vp.name}): 0px overflow (scrollWidth=${overflow.scrollWidth}px, innerWidth=${overflow.innerWidth}px)`);
    }
  }

  // Unlock Workspace
  console.log("\n--- Unlocking Workspace for Tab Testing ---");
  await evaluate(`
    (function() {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));

  const tabs = [
    { id: "home", label: "Home", hash: "#home" },
    { id: "projects", label: "Projects", hash: "#projects" },
    { id: "skills", label: "Skills", hash: "#skills" },
    { id: "diary", label: "Diary", hash: "#diary" },
    { id: "resume", label: "ATS Resume", hash: "#resume" },
  ];

  console.log("\n--- 2. Tab Views Responsive & Overflow Matrix ---");
  for (const tab of tabs) {
    console.log(`\nAuditing Tab: ${tab.label} (${tab.hash})`);
    // Navigate to tab
    await evaluate(`window.location.hash = '${tab.hash}'`);
    await new Promise(r => setTimeout(r, 800));

    for (const vp of viewports) {
      await sendCDP("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768
      });
      await new Promise(r => setTimeout(r, 300));

      const overflow = await evaluate(`
        ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth
        })
      `);

      if (overflow.hasOverflow) {
        console.log(`❌ [FAIL] ${tab.label} @ ${vp.width}x${vp.height} (${vp.name}): Overflow! scrollWidth=${overflow.scrollWidth}px, innerWidth=${overflow.innerWidth}px`);
      } else {
        console.log(`✅ [PASS] ${tab.label} @ ${vp.width}x${vp.height} (${vp.name}): 0px overflow (scrollWidth=${overflow.scrollWidth}px, innerWidth=${overflow.innerWidth}px)`);
      }
    }
  }

  // Audit 3: Case Study Modal Overflow (Mobile 375 & Desktop 1440)
  console.log("\n--- 3. Project Case Study Modal Responsive & Overflow Audit ---");
  await evaluate(`window.location.hash = '#projects'`);
  await new Promise(r => setTimeout(r, 500));
  // Open Land Stack modal
  await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Case Study') || b.textContent.includes('Land Stack'));
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 800));

  for (const vp of viewports) {
    await sendCDP("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768
    });
    await new Promise(r => setTimeout(r, 300));

    const overflow = await evaluate(`
      ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth
      })
    `);

    if (overflow.hasOverflow) {
      console.log(`❌ [FAIL] CaseStudy Modal @ ${vp.width}x${vp.height} (${vp.name}): Overflow! scrollWidth=${overflow.scrollWidth}px, innerWidth=${overflow.innerWidth}px`);
    } else {
      console.log(`✅ [PASS] CaseStudy Modal @ ${vp.width}x${vp.height} (${vp.name}): 0px overflow (scrollWidth=${overflow.scrollWidth}px, innerWidth=${overflow.innerWidth}px)`);
    }
  }

  // Check console warnings/errors
  console.log("\n--- 4. Browser Console Errors/Warnings Summary ---");
  const errors = consoleMessages.filter(m => m.type === "error");
  const warnings = consoleMessages.filter(m => m.type === "warning");
  console.log(`Console Errors recorded: ${errors.length}`);
  console.log(`Console Warnings recorded: ${warnings.length}`);
  if (errors.length > 0) {
    errors.forEach(e => {
      console.log(`  [Console Error]:`, e.args?.map(a => a.value || a.description).join(" "));
    });
  }

  console.log("\n================================================================================");
  console.log("VIEWPORT AUDIT COMPLETE");
  console.log("================================================================================");

  ws.close();
  edge.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
  process.exit(0);
}

runViewportAudit().catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});
