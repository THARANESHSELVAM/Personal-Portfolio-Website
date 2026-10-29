import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Tharanesh\\.gemini\\antigravity-ide\\brain\\007a5c4f-f6dc-4b30-8db5-bc73a1e4fd41";
const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_phase65_" + Date.now());

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function runPhase65Test() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 6.5 BROWSER HISTORY & BACK/FORWARD VERIFICATION");
  console.log("================================================================================\n");

  const edge = spawn(edgePath, [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-fre",
    "--remote-debugging-port=9229",
    "--window-size=1280,900",
    "--user-data-dir=" + userDataDir,
    "http://localhost:3000"
  ]);

  edge.stderr.on("data", () => {});
  await new Promise(r => setTimeout(r, 2500));

  let pageWsUrl = "";
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch("http://localhost:9229/json/list");
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
    console.error("Could not find WebSocket debugger URL on port 9229");
    edge.kill();
    process.exit(1);
  }

  const ws = new WebSocket(pageWsUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const callbacks = new Map();
  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data);
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

  async function getAppState() {
    return await evaluate(`(() => {
      const activeNav = document.querySelector('header nav button[aria-current="page"]');
      return {
        hash: window.location.hash,
        activeNavName: activeNav?.innerText?.trim(),
        hasHome: Boolean(document.getElementById('home')),
        hasDiary: Boolean(document.getElementById('diary')),
        hasProjects: Boolean(document.getElementById('projects')),
        hasSkills: Boolean(document.getElementById('skills')),
        hasResume: Boolean(document.getElementById('resume')),
        isLocked: Boolean(document.querySelector('input[type="password"]')),
        historyLength: window.history.length
      };
    })()`);
  }

  try {
    await sendCDP("Page.enable");
    await sendCDP("Runtime.enable");
    await new Promise(r => setTimeout(r, 1000));

    // --- Scenario D.1: Initial Page Load & Security Gate ---
    console.log("--- Scenario D.1: Initial Page Load & Security Gate ---");
    let state = await getAppState();
    if (state.isLocked) {
      logPass("Security Gate is strictly rendered on initial fresh page load (workspace locked)");
    } else {
      logFail("Security Gate was not rendered on initial fresh load");
    }

    // Authenticate with PIN
    await evaluate(`document.querySelector('button[type="submit"]')?.click()`);
    await new Promise(r => setTimeout(r, 1500));

    state = await getAppState();
    if (state.hasHome && !state.isLocked) {
      logPass("Workspace unlocked into Home view with active nav indicator (#home)");
    } else {
      logFail("Workspace failed to mount initial Home view");
    }

    // --- Scenario A: Tab History Navigation ---
    console.log("\n--- Scenario A: Tab History Navigation (Home -> Projects -> Skills -> Back -> Back -> Forward) ---");
    
    // 1. Deliberate navigation to Projects
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('header nav button'));
      btns.find(b => b.innerText.includes('Projects'))?.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    state = await getAppState();
    if (state.hash === "#projects" && state.hasProjects) {
      logPass("1. Navigated to Projects: URL hash is #projects and ProjectGrid is mounted");
    } else {
      logFail(`Projects navigation failed: hash=${state.hash}, hasProjects=${state.hasProjects}`);
    }

    // 2. Deliberate navigation to Skills
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('header nav button'));
      btns.find(b => b.innerText.includes('Skills'))?.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    state = await getAppState();
    if (state.hash === "#skills" && state.hasSkills) {
      logPass("2. Navigated to Skills: URL hash is #skills and SkillsView is mounted");
    } else {
      logFail(`Skills navigation failed: hash=${state.hash}, hasSkills=${state.hasSkills}`);
    }

    // 3. Press Browser Back once -> should return to Projects
    console.log("   Triggering window.history.back()...");
    await evaluate(`window.history.back()`);
    await new Promise(r => setTimeout(r, 800));

    state = await getAppState();
    if (state.hash === "#projects" && state.hasProjects) {
      logPass("3. Browser Back (1): Returned to Projects (#projects) with ProjectGrid visible");
    } else {
      logFail(`Browser Back to Projects failed: hash=${state.hash}, hasProjects=${state.hasProjects}`);
    }

    // 4. Press Browser Back again -> should return to Home
    console.log("   Triggering window.history.back() again...");
    await evaluate(`window.history.back()`);
    await new Promise(r => setTimeout(r, 800));

    state = await getAppState();
    if ((state.hash === "#home" || state.hash === "") && state.hasHome && !state.isLocked) {
      logPass("4. Browser Back (2): Returned to Home (#home) with HomeView visible without page reload or relock");
    } else {
      logFail(`Browser Back to Home failed: hash=${state.hash}, hasHome=${state.hasHome}, isLocked=${state.isLocked}`);
    }

    // 5. Press Browser Forward once -> should re-advance to Projects
    console.log("   Triggering window.history.forward()...");
    await evaluate(`window.history.forward()`);
    await new Promise(r => setTimeout(r, 800));

    state = await getAppState();
    if (state.hash === "#projects" && state.hasProjects) {
      logPass("5. Browser Forward: Re-advanced forward to Projects (#projects)");
    } else {
      logFail(`Browser Forward to Projects failed: hash=${state.hash}, hasProjects=${state.hasProjects}`);
    }

    // --- Scenario B: Footer Navigation & Back ---
    console.log("\n--- Scenario B: Footer Navigation & Back Synchronization ---");
    await evaluate(`(() => {
      const footerBtns = Array.from(document.querySelectorAll('footer nav button'));
      const diaryBtn = footerBtns.find(b => b.innerText.includes('Diary'));
      if (diaryBtn) {
        diaryBtn.scrollIntoView();
        diaryBtn.click();
      }
    })()`);
    await new Promise(r => setTimeout(r, 700));

    state = await getAppState();
    if (state.hash === "#diary" && state.hasDiary) {
      logPass("Footer click: Navigated to Diary (#diary) with LearningLog mounted");
    } else {
      logFail(`Footer navigation failed: hash=${state.hash}, hasDiary=${state.hasDiary}`);
    }

    console.log("   Triggering window.history.back() from Footer navigation...");
    await evaluate(`window.history.back()`);
    await new Promise(r => setTimeout(r, 800));

    state = await getAppState();
    if (state.hash === "#projects" && state.hasProjects) {
      logPass("Browser Back after Footer click returned to Projects (#projects)");
    } else {
      logFail(`Browser Back after Footer click failed: hash=${state.hash}`);
    }

    // --- Scenario C: Programmatic Deep Links & Evidence Inspector ---
    console.log("\n--- Scenario C: Programmatic Deep Links & Evidence Inspector ---");
    // 1. Navigate to Skills
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('header nav button'));
      btns.find(b => b.innerText.includes('Skills'))?.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // 2. Open Evidence Inspector for React 19
    console.log("   Opening Evidence Inspector for React 19...");
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button[aria-label^="Inspect evidence for"]'));
      const target = btns.find(b => b.getAttribute('aria-label').includes('React 19')) || btns[0];
      target?.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // 3. Click "Inspect case study for Land Stack"
    console.log("   Clicking 'Inspect case study for Land Stack'...");
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button[aria-label^="Inspect case study for"]'));
      const target = btns.find(b => b.getAttribute('aria-label').includes('Land Stack')) || btns[0];
      target?.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    state = await getAppState();
    const caseStudyModalState = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const h2 = dialog?.querySelector('h2');
      const sessionVal = sessionStorage.getItem("portfolio_target_case_study");
      return {
        dialogExists: Boolean(dialog),
        dialogRole: dialog?.getAttribute('role'),
        dialogAriaModal: dialog?.getAttribute('aria-modal'),
        h2Text: h2?.innerText?.trim(),
        sessionVal
      };
    })()`);

    if (
      state.hash === "#projects" && 
      state.hasProjects && 
      caseStudyModalState.dialogExists && 
      caseStudyModalState.h2Text === "Land Stack" &&
      caseStudyModalState.sessionVal === null
    ) {
      logPass(`Evidence Inspector deep link opened Case Study for '${caseStudyModalState.h2Text}' in Projects (#projects) - modalRendered=true`);
    } else {
      logFail(`Evidence Inspector deep link failed: hash=${state.hash}, modal=${JSON.stringify(caseStudyModalState)}`);
    }

    // 4. Close Case Study modal
    await evaluate(`document.querySelector('button[aria-label="Close case study dialog"]')?.click()`);
    await new Promise(r => setTimeout(r, 500));

    // 5. Press Back from Case Study to return to Skills
    await evaluate(`window.history.back()`);
    await new Promise(r => setTimeout(r, 800));
    state = await getAppState();
    if (state.hash === "#skills" && state.hasSkills) {
      logPass("Browser Back from Case Study returned to Skills (#skills)");
    } else {
      logFail(`Browser Back from Case Study failed: hash=${state.hash}, hasSkills=${state.hasSkills}`);
    }

    // 6. Deep-link into learning diary entry from Skills Evidence Inspector
    console.log("   Opening Evidence Inspector to view Learning Diary entry...");
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button[aria-label^="Inspect evidence for"]'));
      const target = btns.find(b => b.getAttribute('aria-label').includes('React 19')) || btns[0];
      target?.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // Click "View Learning Entry" inside Evidence Inspector
    await evaluate(`(() => {
      const diaryBtn = document.querySelector('button[aria-label^="View learning diary entry for"]') ||
        Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('View Learning Entry'));
      diaryBtn?.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    state = await getAppState();
    const sessionDiaryVal = await evaluate(`sessionStorage.getItem("portfolio_target_learning_entry")`);
    if (state.hash === "#diary" && state.hasDiary && sessionDiaryVal === null) {
      logPass("Learning Entry deep link navigated to Diary (#diary) with LearningLog active (session consumed)");
    } else {
      logFail(`Learning entry deep link failed: hash=${state.hash}, session=${sessionDiaryVal}`);
    }

    // 7. Return to Skills via Back
    await evaluate(`window.history.back()`);
    await new Promise(r => setTimeout(r, 800));
    state = await getAppState();
    if (state.hash === "#skills" && state.hasSkills) {
      logPass("Browser Back returned to Skills (#skills)");
    } else {
      logFail(`Browser Back failed: hash=${state.hash}`);
    }

    // 8. Diary-to-Case-Study Navigation ("Applied in" project link)
    console.log("   Testing Diary 'Applied in' -> Case Study navigation...");
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('header nav button'));
      btns.find(b => b.innerText.includes('Diary'))?.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    await evaluate(`document.querySelector('button[id*="applied-project-btn"][id*="land-stack"]')?.click()`);
    await new Promise(r => setTimeout(r, 800));

    state = await getAppState();
    const diaryCaseStudyModal = await evaluate(`(() => {
      const dialog = document.querySelector('[role="dialog"]');
      const h2 = dialog?.querySelector('h2');
      const sessionVal = sessionStorage.getItem("portfolio_target_case_study");
      return {
        dialogExists: Boolean(dialog),
        h2Text: h2?.innerText?.trim(),
        sessionVal
      };
    })()`);

    if (
      state.hash === "#projects" && 
      state.hasProjects && 
      diaryCaseStudyModal.dialogExists && 
      diaryCaseStudyModal.h2Text === "Land Stack" &&
      diaryCaseStudyModal.sessionVal === null
    ) {
      logPass(`Diary 'Applied in' link opened Case Study for '${diaryCaseStudyModal.h2Text}' in Projects (#projects)`);
    } else {
      logFail(`Diary 'Applied in' case study navigation failed: hash=${state.hash}, modal=${JSON.stringify(diaryCaseStudyModal)}`);
    }

    // Close Case Study modal
    await evaluate(`document.querySelector('button[aria-label="Close case study dialog"]')?.click()`);
    await new Promise(r => setTimeout(r, 500));

    // Browser Back returns to Diary
    await evaluate(`window.history.back()`);
    await new Promise(r => setTimeout(r, 800));
    state = await getAppState();
    if (state.hash === "#diary" && state.hasDiary) {
      logPass("Browser Back after Diary 'Applied in' returned to Diary (#diary)");
    } else {
      logFail(`Browser Back after Diary 'Applied in' failed: hash=${state.hash}`);
    }

    // --- Scenario E: Loop and Duplicate-Entry Prevention ---
    console.log("\n--- Scenario E: Loop and Duplicate-Entry Prevention ---");
    const lenBefore = (await getAppState()).historyLength;
    
    // Click Skills 3 times while already on Skills
    for (let i = 0; i < 3; i++) {
      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('header nav button'));
        btns.find(b => b.innerText.includes('Skills'))?.click();
      })()`);
      await new Promise(r => setTimeout(r, 150));
    }

    const lenAfter = (await getAppState()).historyLength;
    if (lenAfter === lenBefore) {
      logPass(`Duplicate Prevention: Repeated clicks on active tab did not inflate history stack (len=${lenBefore})`);
    } else {
      logFail(`Duplicate history entries created: before=${lenBefore}, after=${lenAfter}`);
    }

    // Press Back once -> should immediately leave Skills to previous distinct tab
    await evaluate(`window.history.back()`);
    await new Promise(r => setTimeout(r, 800));
    state = await getAppState();
    if (state.hash !== "#skills") {
      logPass(`Single Back press left Skills immediately to previous tab (${state.hash}) without redundant loop`);
    } else {
      logFail(`Back got stuck on duplicate #skills entry`);
    }

    // --- Scenario D.2: Direct Hash Entry with Authentication Preservation ---
    console.log("\n--- Scenario D.2: Direct Hash Entry ---");
    
    // Direct entry to #diary
    await sendCDP("Page.navigate", { url: "http://localhost:3000/#diary" });
    await sendCDP("Page.reload", { ignoreCache: true });
    await new Promise(r => setTimeout(r, 2000));

    // Fresh navigation must be locked at SecurityGate
    let isLockedDirect = await evaluate(`Boolean(document.querySelector('input[type="password"]'))`);
    if (isLockedDirect) {
      logPass("Direct navigation to #diary starts safely locked at SecurityGate");
    } else {
      logFail("SecurityGate was bypassed during direct hash navigation");
    }

    // Unlock workspace
    await evaluate(`document.querySelector('button[type="submit"]')?.click()`);
    await new Promise(r => setTimeout(r, 1500));

    state = await getAppState();
    if (state.hash === "#diary" && state.hasDiary && !state.isLocked) {
      logPass("After unlock, #diary direct hash was preserved and Diary tab is active");
    } else {
      logFail(`Direct hash unlock failed: hash=${state.hash}, hasDiary=${state.hasDiary}`);
    }

    // Direct entry to #projects
    await sendCDP("Page.navigate", { url: "http://localhost:3000/#projects" });
    await sendCDP("Page.reload", { ignoreCache: true });
    await new Promise(r => setTimeout(r, 2000));
    isLockedDirect = await evaluate(`Boolean(document.querySelector('input[type="password"]'))`);
    if (isLockedDirect) {
      logPass("Direct navigation to #projects starts safely locked at SecurityGate");
    } else {
      logFail("SecurityGate was bypassed during direct #projects navigation");
    }
    await evaluate(`document.querySelector('button[type="submit"]')?.click()`);
    await new Promise(r => setTimeout(r, 1500));
    state = await getAppState();
    if (state.hash === "#projects" && state.hasProjects && !state.isLocked) {
      logPass("After unlock, #projects direct hash was preserved and ProjectGrid is active");
    } else {
      logFail(`Direct #projects unlock failed: hash=${state.hash}, hasProjects=${state.hasProjects}`);
    }

    // Test unknown hash normalization
    console.log("   Testing unknown hash normalization...");
    await sendCDP("Page.navigate", { url: "http://localhost:3000/#unknown-feature-xyz" });
    await sendCDP("Page.reload", { ignoreCache: true });
    await new Promise(r => setTimeout(r, 2000));
    await evaluate(`document.querySelector('button[type="submit"]')?.click()`);
    await new Promise(r => setTimeout(r, 1500));

    state = await getAppState();
    if (state.hash === "#home" || state.hash === "") {
      logPass(`Unknown hash '#unknown-feature-xyz' safely normalized to ${state.hash || '#home'} without crashing`);
    } else {
      logFail(`Unknown hash handling unexpected: ${state.hash}`);
    }

    // Take screenshot of final synchronized state
    const shot = await sendCDP("Page.captureScreenshot", { format: "png" });
    const shotPath = path.join(artifactDir, "phase65_navigation_verified.png");
    fs.writeFileSync(shotPath, Buffer.from(shot.data, "base64"));
    logPass(`Saved visual confirmation screenshot: ${shotPath}`);

    console.log("\n================================================================================");
    if (failures === 0) {
      console.log("🎉 ALL PHASE 6.5 BROWSER HISTORY & NAVIGATION TESTS PASSED WITH 0 FAILURES!");
    } else {
      console.error(`💥 PHASE 6.5 FAILED WITH ${failures} FAILURE(S)!`);
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

runPhase65Test();
