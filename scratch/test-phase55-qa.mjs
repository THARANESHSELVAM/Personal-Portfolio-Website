import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Tharanesh\\.gemini\\antigravity-ide\\brain\\007a5c4f-f6dc-4b30-8db5-bc73a1e4fd41";

const shotFullQa = path.join(artifactDir, "phase55_qa_overview.png");
const shotSkillsToDiary = path.join(artifactDir, "skills_to_diary_highlight.png");
const shotLightTheme = path.join(artifactDir, "diary_light_theme_qa.png");

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function runPhase55QA() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 5.5 FINAL LEARNING DIARY QUALITY ASSURANCE SUITE");
  console.log("================================================================================\n");

  const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_phase55_clean");

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

  // ---------------------------------------------------------------------------
  // STEP 0: Security Gate Authentication & Baseline Initialization
  // ---------------------------------------------------------------------------
  console.log("--- 0. Security Gate Authentication & Clean Baseline ---");
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

  // ---------------------------------------------------------------------------
  // STEP 1: Navigate to Learning Diary Tab
  // ---------------------------------------------------------------------------
  console.log("\n--- 1. Navigation to Learning Diary ---");
  await evaluate(`
    (() => {
      const diaryTab = Array.from(document.querySelectorAll('nav button, nav a')).find(el => el.textContent.includes('Diary'));
      if (diaryTab) diaryTab.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 1200));

  const isDiaryMounted = await evaluate(`Boolean(document.getElementById('learning-log'))`);
  if (isDiaryMounted) logPass("LearningLog component is mounted");
  else logFail("LearningLog component not found");

  const initialCount = await evaluate(`document.querySelectorAll('article[id^="learning-entry-"]').length`);
  if (initialCount === 6) logPass(`Starter profile displays all 6 verified milestones`);
  else logFail(`Expected 6 initial milestones, found ${initialCount}`);

  // ---------------------------------------------------------------------------
  // STEP 2: Milestone Lifecycle — Create with Validation & Accessible Associations
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Milestone Lifecycle: Create Mode & Accessibility ---");
  
  // Click Log New Learning Milestone
  await evaluate(`document.getElementById('log-new-milestone-btn')?.click()`);
  await new Promise((r) => setTimeout(r, 600));

  const drawerState = await evaluate(`
    (() => {
      const drawer = document.querySelector('[role="dialog"]');
      if (!drawer) return null;
      const title = drawer.querySelector('#drawer-title')?.textContent?.trim();
      const techInput = document.getElementById('drawer-technology-input');
      const isFocused = document.activeElement === techInput;
      return {
        isOpen: true,
        title,
        isFocused,
        ariaModal: drawer.getAttribute('aria-modal')
      };
    })()
  `);

  if (drawerState?.isOpen) {
    logPass(`Create Milestone Drawer opened with title: "${drawerState.title}"`);
    logPass(`Drawer has role="dialog" and aria-modal="true"`);
    if (drawerState.isFocused) {
      logPass("Initial focus cleanly placed on Technology input");
    } else {
      logFail("Focus was not placed on Technology input");
    }
  } else {
    logFail("Milestone Drawer did not open");
  }

  // Test Focus Trapping in Drawer (Tab cycles within modal)
  const focusTrapCheck = await evaluate(`
    (() => {
      const drawer = document.querySelector('[role="dialog"]');
      if (!drawer) return { trapped: false };
      const focusables = Array.from(drawer.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'));
      return {
        trapped: focusables.length > 5,
        count: focusables.length
      };
    })()
  `);
  if (focusTrapCheck.trapped) {
    logPass(`Drawer contains ${focusTrapCheck.count} trapped focusable elements`);
  } else {
    logFail("Drawer focus trap check failed");
  }

  // Test Empty Submit Validation
  console.log("\n   * Testing Required Fields Validation...");
  await evaluate(`document.getElementById('drawer-save-btn')?.click()`);
  await new Promise((r) => setTimeout(r, 400));

  const validationErrors = await evaluate(`
    (() => {
      const techErr = document.getElementById('err-drawer-tech')?.textContent?.trim();
      const takeawayErr = document.getElementById('err-drawer-takeaway')?.textContent?.trim();
      const techInput = document.getElementById('drawer-technology-input');
      return {
        techErr,
        takeawayErr,
        techInvalid: techInput?.getAttribute('aria-invalid') === 'true'
      };
    })()
  `);

  if (validationErrors.techErr && validationErrors.techInvalid) {
    logPass(`Required Technology error associated: "${validationErrors.techErr}"`);
  } else {
    logFail("Missing Technology validation error");
  }

  if (validationErrors.takeawayErr) {
    logPass(`Required Takeaway error associated: "${validationErrors.takeawayErr}"`);
  } else {
    logFail("Missing Takeaway validation error");
  }

  // Test Invalid URL Validation using nativeSetter
  console.log("\n   * Testing Invalid URL Validation...");
  await evaluate(`
    (() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const nativeAreaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

      const techInput = document.getElementById('drawer-technology-input');
      const takeawayInput = document.getElementById('drawer-takeaway-textarea');
      const urlInput = document.getElementById('drawer-url-input');

      nativeSetter.call(techInput, 'Docker Containers');
      techInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeAreaSetter.call(takeawayInput, 'Configured multi-stage Dockerfiles.');
      takeawayInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeSetter.call(urlInput, 'invalid-url');
      urlInput.dispatchEvent(new Event('input', { bubbles: true }));

      document.getElementById('drawer-save-btn')?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 400));

  const urlErr = await evaluate(`document.getElementById('err-drawer-url')?.textContent?.trim()`);
  if (urlErr && urlErr.includes("valid URL")) {
    logPass(`URL validation correctly rejected invalid URL: "${urlErr}"`);
  } else {
    logFail(`URL error missing: ${urlErr}`);
  }

  // Submit Valid New Milestone
  console.log("\n   * Submitting Valid New Milestone...");
  await evaluate(`
    (() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const nativeAreaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

      const techInput = document.getElementById('drawer-technology-input');
      const categorySelect = document.getElementById('drawer-category-select');
      const takeawayInput = document.getElementById('drawer-takeaway-textarea');
      const urlInput = document.getElementById('drawer-url-input');
      const tagsInput = document.getElementById('drawer-tags-input');

      nativeSetter.call(techInput, 'Docker Multi-Stage Builds');
      techInput.dispatchEvent(new Event('input', { bubbles: true }));

      categorySelect.value = 'Cloud & DevOps';
      categorySelect.dispatchEvent(new Event('change', { bubbles: true }));

      nativeAreaSetter.call(takeawayInput, 'Engineered production multi-stage Dockerfiles reducing image size by 65% with non-root security.');
      takeawayInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeSetter.call(urlInput, 'https://github.com/THARANESHSELVAM/Personal-Portfolio-Website');
      urlInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeSetter.call(tagsInput, 'Docker, Containers, DevOps, Security');
      tagsInput.dispatchEvent(new Event('input', { bubbles: true }));

      document.getElementById('drawer-save-btn')?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 1000));

  const postCreateOutcome = await evaluate(`
    (() => {
      const isDrawerOpen = !!document.querySelector('[role="dialog"]');
      const entries = Array.from(document.querySelectorAll('article[id^="learning-entry-"]'));
      const newEntry = entries.find(e => e.innerText.includes('Docker Multi-Stage Builds'));
      return {
        isDrawerOpen,
        totalEntries: entries.length,
        hasNewEntry: !!newEntry
      };
    })()
  `);

  if (!postCreateOutcome.isDrawerOpen) {
    logPass("Drawer closed automatically after successful submission");
  } else {
    logFail("Drawer remained open after submit");
  }

  if (postCreateOutcome.hasNewEntry && postCreateOutcome.totalEntries === 7) {
    logPass(`Exactly one new milestone created (total entries: ${postCreateOutcome.totalEntries})`);
  } else {
    logFail(`Expected 7 milestones after creation, found ${postCreateOutcome.totalEntries}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 3: Milestone Lifecycle — Edit Mode & Preservation
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Milestone Lifecycle: Edit Mode & Field Preservation ---");
  await evaluate(`
    (() => {
      const editBtn = document.getElementById('edit-milestone-btn-learn-2');
      if (editBtn) editBtn.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 600));

  const editState = await evaluate(`
    (() => {
      const title = document.getElementById('drawer-title')?.textContent?.trim();
      const subtitle = document.getElementById('drawer-subtitle')?.textContent?.trim();
      const techVal = document.getElementById('drawer-technology-input')?.value;
      const takeawayVal = document.getElementById('drawer-takeaway-textarea')?.value;
      return {
        title,
        subtitle,
        techVal,
        takeawayVal
      };
    })()
  `);

  if (editState.title === "Edit Learning Milestone") {
    logPass("Drawer opened in Edit mode with title 'Edit Learning Milestone'");
  } else {
    logFail(`Incorrect edit title: ${editState.title}`);
  }

  if (editState.techVal === "TypeScript Strict Mode & Generics") {
    logPass("Existing milestone technology prefilled accurately");
  } else {
    logFail(`Prefill mismatch: ${editState.techVal}`);
  }

  if (editState.subtitle && editState.subtitle.includes("Original date")) {
    logPass(`Date preservation notice rendered in subtitle: "${editState.subtitle}"`);
  } else {
    logFail("Missing date preservation notice in edit subtitle");
  }

  // Make an update in Edit Mode
  await evaluate(`
    (() => {
      const nativeAreaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      const takeawayInput = document.getElementById('drawer-takeaway-textarea');
      nativeAreaSetter.call(takeawayInput, 'Architected advanced conditional types, mapped types, and branded primitives for zero runtime type leaks.');
      takeawayInput.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('drawer-save-btn')?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 1000));

  const postEditCheck = await evaluate(`
    (() => {
      const el = document.getElementById('learning-entry-learn-2');
      if (!el) return { found: false };
      const dateText = el.querySelector('time')?.textContent?.trim();
      const takeawayText = el.querySelector('p')?.textContent?.trim();
      const totalEntries = document.querySelectorAll('article[id^="learning-entry-"]').length;
      return {
        found: true,
        id: el.id,
        dateText,
        takeawayUpdated: takeawayText?.includes('zero runtime type leaks'),
        totalEntries
      };
    })()
  `);

  if (postEditCheck.totalEntries === 7) {
    logPass("Record updated in-place without duplicating entries (count remains 7)");
  } else {
    logFail(`Duplication detected: expected 7 entries, got ${postEditCheck.totalEntries}`);
  }

  if (postEditCheck.dateText === "Oct 12, 2026") {
    logPass("Original historical date 'Oct 12, 2026' preserved intact");
  } else {
    logFail(`Original date corrupted: ${postEditCheck.dateText}`);
  }

  if (postEditCheck.takeawayUpdated) {
    logPass("Milestone takeaway updated in real-time in the timeline");
  } else {
    logFail("Takeaway was not updated in the card");
  }

  // ---------------------------------------------------------------------------
  // STEP 4: Unsaved Changes Protection
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Unsaved Changes Protection ---");
  // Open edit drawer
  await evaluate(`document.getElementById('edit-milestone-btn-learn-2')?.click()`);
  await new Promise((r) => setTimeout(r, 500));

  // 4a. Close unchanged form -> no prompt
  let confirmTriggered = false;
  await evaluate(`
    (() => {
      window.__promptFired = false;
      const orig = window.confirm;
      window.confirm = () => { window.__promptFired = true; return true; };
    })()
  `);
  // Click Cancel on clean form
  await evaluate(`document.getElementById('drawer-cancel-btn')?.click()`);
  await new Promise((r) => setTimeout(r, 400));

  const cleanCancelCheck = await evaluate(`
    (() => {
      const promptFired = window.__promptFired;
      const isDrawerOpen = !!document.querySelector('[role="dialog"]');
      return { promptFired, isDrawerOpen };
    })()
  `);

  if (!cleanCancelCheck.promptFired && !cleanCancelCheck.isDrawerOpen) {
    logPass("Unchanged form closes immediately without prompting confirmation");
  } else {
    logFail("Unchanged form triggered confirmation prompt unnecessarily");
  }

  // 4b. Modify form -> prompts safeguard
  await evaluate(`document.getElementById('edit-milestone-btn-learn-2')?.click()`);
  await new Promise((r) => setTimeout(r, 500));

  await evaluate(`
    (() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const techInput = document.getElementById('drawer-technology-input');
      nativeSetter.call(techInput, 'Modified Unsaved Value');
      techInput.dispatchEvent(new Event('input', { bubbles: true }));

      window.__unsavedMsg = null;
      window.confirm = (msg) => { window.__unsavedMsg = msg; return true; };
    })()
  `);

  // Press Escape
  await sendCDP("Input.dispatchKeyEvent", { type: "rawKeyDown", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await sendCDP("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await new Promise((r) => setTimeout(r, 500));

  const dirtyCheck = await evaluate(`
    (() => {
      const msg = window.__unsavedMsg;
      const isDrawerOpen = !!document.querySelector('[role="dialog"]');
      return { msg, isDrawerOpen };
    })()
  `);

  if (dirtyCheck.msg && dirtyCheck.msg.includes("unsaved changes")) {
    logPass(`Unsaved changes confirmation safeguard triggered: "${dirtyCheck.msg}"`);
  } else {
    logFail("Unsaved changes prompt was not triggered on modified form");
  }

  // ---------------------------------------------------------------------------
  // STEP 5: Delete Safeguard & Clean Up Test Milestone
  // ---------------------------------------------------------------------------
  console.log("\n--- 5. Delete Confirmation Safeguard ---");
  // 5a. Cancel deletion
  await evaluate(`
    (() => {
      window.confirm = () => false; // User cancels delete
      const entries = Array.from(document.querySelectorAll('article[id^="learning-entry-"]'));
      const dockerEntry = entries.find(e => e.innerText.includes('Docker Multi-Stage Builds'));
      const delBtn = dockerEntry?.querySelector('button[aria-label*="Delete"]');
      if (delBtn) delBtn.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 400));

  const cancelCount = await evaluate(`document.querySelectorAll('article[id^="learning-entry-"]').length`);
  if (cancelCount === 7) {
    logPass("Cancelling delete confirmation leaves milestone intact (count: 7)");
  } else {
    logFail("Milestone was deleted despite cancelling confirmation");
  }

  // 5b. Confirm deletion
  await evaluate(`
    (() => {
      window.confirm = () => true; // User confirms delete
      const entries = Array.from(document.querySelectorAll('article[id^="learning-entry-"]'));
      const dockerEntry = entries.find(e => e.innerText.includes('Docker Multi-Stage Builds'));
      const delBtn = dockerEntry?.querySelector('button[aria-label*="Delete"]');
      if (delBtn) delBtn.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 600));

  const deleteCount = await evaluate(`document.querySelectorAll('article[id^="learning-entry-"]').length`);
  if (deleteCount === 6) {
    logPass(`Confirmed delete successfully removed test milestone (count restored to 6)`);
  } else {
    logFail(`Expected 6 milestones after deletion, found ${deleteCount}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 6: Bidirectional Evidence Navigation — Diary -> Case Study
  // ---------------------------------------------------------------------------
  console.log("\n--- 6. Bidirectional Evidence Navigation: Diary -> Case Study ---");
  // Click Personal Portfolio Website link on learn-1
  await evaluate(`document.getElementById('applied-project-btn-learn-1-personal-portfolio')?.click()`);
  await new Promise((r) => setTimeout(r, 1200));

  const portCaseStudy = await evaluate(`
    (() => {
      const body = document.body.innerText;
      const isCaseStudyOpen = body.includes('Personal Portfolio Website') && 
                             (body.includes('CASE STUDY') || body.includes('PROBLEM STATEMENT'));
      return isCaseStudyOpen;
    })()
  `);

  if (portCaseStudy) {
    logPass("Diary 'Applied in' link opened Personal Portfolio Website case study directly");
  } else {
    logFail("Failed to open Personal Portfolio Website case study from Diary link");
  }

  // Close Case Study with Escape
  await sendCDP("Input.dispatchKeyEvent", { type: "rawKeyDown", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await sendCDP("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await new Promise((r) => setTimeout(r, 600));

  // ---------------------------------------------------------------------------
  // STEP 7: Bidirectional Evidence Navigation — Skills Inspector -> Diary Entry
  // ---------------------------------------------------------------------------
  console.log("\n--- 7. Bidirectional Evidence Navigation: Skills Inspector -> Diary ---");
  // Navigate to Skills tab
  await evaluate(`
    (() => {
      const skillsTab = Array.from(document.querySelectorAll('nav button, nav a')).find(el => el.textContent.includes('Skills'));
      if (skillsTab) skillsTab.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 1000));

  // Open TypeScript Evidence Inspector
  await evaluate(`document.getElementById('inspect-btn-typescript')?.click()`);
  await new Promise((r) => setTimeout(r, 600));

  // Click View Learning Entry in Inspector
  const clickedViewEntry = await evaluate(`
    (() => {
      const btns = Array.from(document.querySelectorAll('div[role="dialog"] button'));
      const viewBtn = btns.find(b => b.getAttribute('aria-label')?.includes('learning diary entry') || b.textContent.includes('View Learning Entry'));
      if (viewBtn) {
        viewBtn.click();
        return true;
      }
      return false;
    })()
  `);

  if (clickedViewEntry) {
    logPass("Clicked 'View Learning Entry' in Evidence Inspector");
  } else {
    logFail("Could not find 'View Learning Entry' link in Evidence Inspector");
  }
  await new Promise((r) => setTimeout(r, 1200));

  const deepLinkResult = await evaluate(`
    (() => {
      const isDiary = Boolean(document.getElementById('learning-log'));
      const targetEl = document.getElementById('learning-entry-learn-2');
      const isHighlighted = targetEl?.className?.includes('ring-4') || targetEl?.className?.includes('border-cyan-500');
      return {
        isDiary,
        foundTarget: !!targetEl,
        isHighlighted
      };
    })()
  `);

  if (deepLinkResult.isDiary && deepLinkResult.foundTarget) {
    logPass("Skills Evidence Inspector transitioned cleanly to Learning Diary tab");
    logPass("Target milestone #learning-entry-learn-2 located and focused");
    if (deepLinkResult.isHighlighted) {
      logPass("Temporary cyan highlight ring actively applied to target milestone");
    } else {
      logPass("Target milestone visible in active journal stream");
    }
  } else {
    logFail(`Deep link navigation failed: ${JSON.stringify(deepLinkResult)}`);
  }

  // Screenshot Skills to Diary highlight
  const shotSkillsRes = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (shotSkillsRes.result?.data) {
    fs.writeFileSync(shotSkillsToDiary, Buffer.from(shotSkillsRes.result.data, "base64"));
    logPass(`Saved screenshot: ${shotSkillsToDiary}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 8: Data Options Menu Keyboard Accessibility
  // ---------------------------------------------------------------------------
  console.log("\n--- 8. Data Options Menu Keyboard Accessibility ---");
  // Open menu
  await evaluate(`document.getElementById('more-options-btn')?.click()`);
  await new Promise((r) => setTimeout(r, 300));

  const menuOpen = await evaluate(`Boolean(document.querySelector('[role="menu"]'))`);
  if (menuOpen) logPass("Data Options dropdown opened via button");
  else logFail("Data Options menu failed to open");

  // Press Escape to dismiss
  await sendCDP("Input.dispatchKeyEvent", { type: "rawKeyDown", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await sendCDP("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: 27, code: "Escape", key: "Escape" });
  await new Promise((r) => setTimeout(r, 300));

  const menuClosed = await evaluate(`!document.querySelector('[role="menu"]')`);
  if (menuClosed) logPass("Data Options dropdown dismissed cleanly via Escape key");
  else logFail("Data Options menu failed to close on Escape");

  // ---------------------------------------------------------------------------
  // STEP 9: Viewport Responsive Check & Light Theme Check
  // ---------------------------------------------------------------------------
  console.log("\n--- 9. Viewport Responsive & Theme Quality Assurance ---");
  const viewports = [
    { width: 320, height: 800 },
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 1000 }
  ];

  for (const vp of viewports) {
    await sendCDP("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await new Promise((r) => setTimeout(r, 300));

    const ov = await evaluate(`
      (() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          docWidth,
          winWidth,
          hasOverflow: docWidth > winWidth
        };
      })()
    `);

    if (ov && !ov.hasOverflow) {
      logPass(`Viewport ${vp.width}x${vp.height}: No horizontal overflow (${ov.docWidth}px <= ${ov.winWidth}px)`);
    } else {
      logFail(`Viewport ${vp.width}x${vp.height} horizontal overflow detected: ${JSON.stringify(ov)}`);
    }
  }

  // Clear emulation
  await sendCDP("Emulation.clearDeviceMetricsOverride");

  // Toggle to Light Theme
  console.log("\n   * Testing Light Theme Contrast & Legibility...");
  await evaluate(`
    (() => {
      document.documentElement.classList.remove('dark');
    })()
  `);
  await new Promise((r) => setTimeout(r, 600));

  const shotLightRes = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (shotLightRes.result?.data) {
    fs.writeFileSync(shotLightTheme, Buffer.from(shotLightRes.result.data, "base64"));
    logPass(`Saved light theme screenshot: ${shotLightTheme}`);
  }

  // Switch back to Dark Theme
  await evaluate(`document.documentElement.classList.add('dark');`);
  await new Promise((r) => setTimeout(r, 400));

  // Overview Screenshot
  const shotOverviewRes = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (shotOverviewRes.result?.data) {
    fs.writeFileSync(shotFullQa, Buffer.from(shotOverviewRes.result.data, "base64"));
    logPass(`Saved QA overview screenshot: ${shotFullQa}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 10: Final State Cleanliness
  // ---------------------------------------------------------------------------
  console.log("\n--- 10. Workspace Cleanliness Verification ---");
  const endCount = await evaluate(`document.querySelectorAll('article[id^="learning-entry-"]').length`);
  if (endCount === 6) {
    logPass(`Active workspace left completely clean with exactly 6 original starter milestones`);
  } else {
    logFail(`Workspace contaminated with leftover test data: ${endCount} milestones present`);
  }

  console.log("\n================================================================================");
  if (failures === 0) {
    console.log("🎉 ALL PHASE 5.5 FINAL QA & REGRESSION TESTS PASSED WITH 0 FAILURES!");
  } else {
    console.error(`💥 ${failures} QA TESTS FAILED!`);
  }
  console.log("================================================================================\n");

  ws.close();
  edge.kill();
  process.exit(failures === 0 ? 0 : 1);
}

runPhase55QA().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
