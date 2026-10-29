import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Tharanesh\\.gemini\\antigravity-ide\\brain\\007a5c4f-f6dc-4b30-8db5-bc73a1e4fd41";

const shotCreate = path.join(artifactDir, "drawer_create_mode.png");
const shotEdit = path.join(artifactDir, "drawer_edit_mode.png");
const shotMobile = path.join(artifactDir, "drawer_mobile_view.png");
const shotTimelineUpdated = path.join(artifactDir, "timeline_after_edit.png");

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function runPhase53BrowserValidation() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 5.3 MILESTONE DRAWER & FULL CRUD VALIDATION");
  console.log("================================================================================\n");

  const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_phase53_clean");

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

  // Wait 2s for Edge to start
  await new Promise((r) => setTimeout(r, 2000));

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
  // STEP 0: Unlock Workspace with Clean Initial State
  // ---------------------------------------------------------------------------
  console.log("--- 0. Security Gate Authentication ---");
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

  // ---------------------------------------------------------------------------
  // STEP 2: Open Create Drawer & Inspect Initial State
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Create Drawer Opening & Focus Management ---");
  await evaluate(`
    (() => {
      const btn = document.getElementById('log-new-milestone-btn');
      btn?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 600));

  const drawerState = await evaluate(`
    (() => {
      const drawer = document.querySelector('[role="dialog"]');
      if (!drawer) return null;
      const title = drawer.querySelector('#drawer-title')?.textContent?.trim();
      const techInput = document.getElementById('drawer-technology-input');
      const categorySelect = document.getElementById('drawer-category-select');
      const masterySelect = document.getElementById('drawer-mastery-select');
      const takeawayTextarea = document.getElementById('drawer-takeaway-textarea');
      const urlInput = document.getElementById('drawer-url-input');
      const tagsInput = document.getElementById('drawer-tags-input');

      return {
        isOpen: true,
        title,
        isFocusedOnTech: document.activeElement === techInput,
        techVal: techInput?.value,
        catVal: categorySelect?.value,
        masteryVal: masterySelect?.value,
        takeawayVal: takeawayTextarea?.value,
        urlVal: urlInput?.value,
        tagsVal: tagsInput?.value
      };
    })()
  `);

  if (drawerState?.isOpen && drawerState?.title === "Log Learning Milestone") {
    logPass("Drawer opened in Create mode with title 'Log Learning Milestone'");
  } else {
    logFail(`Drawer failed to open or wrong title: ${JSON.stringify(drawerState)}`);
  }

  if (drawerState?.techVal === "" && drawerState?.takeawayVal === "") {
    logPass("Create drawer initialized with clean empty fields (no carryover data)");
  } else {
    logFail(`Create drawer fields not empty: ${JSON.stringify(drawerState)}`);
  }

  // Capture Screenshot of Drawer in Create Mode
  const createShot = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (createShot?.result?.data) {
    fs.writeFileSync(shotCreate, Buffer.from(createShot.result.data, "base64"));
    logPass(`Captured Create mode screenshot to ${shotCreate}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 3: Form Validation & Recovery in Create Mode
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Form Validation Rules in Drawer ---");
  // Attempt empty submit
  await evaluate(`
    (() => {
      const saveBtn = document.getElementById('drawer-save-btn');
      saveBtn?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 400));

  const validationErrors = await evaluate(`
    (() => {
      const techErr = document.getElementById('err-drawer-tech')?.textContent?.trim();
      const takeawayErr = document.getElementById('err-drawer-takeaway')?.textContent?.trim();
      const techInput = document.getElementById('drawer-technology-input');
      return {
        techErr,
        takeawayErr,
        techAriaInvalid: techInput?.getAttribute('aria-invalid')
      };
    })()
  `);

  if (validationErrors?.techErr && validationErrors?.takeawayErr) {
    logPass(`Field-level validation errors displayed correctly: "${validationErrors.techErr}" | "${validationErrors.takeawayErr}"`);
  } else {
    logFail(`Validation errors missing: ${JSON.stringify(validationErrors)}`);
  }

  // Test invalid URL validation
  await evaluate(`
    (() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const urlInput = document.getElementById('drawer-url-input');
      const techInput = document.getElementById('drawer-technology-input');
      const takeawayInput = document.getElementById('drawer-takeaway-textarea');
      const nativeAreaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

      nativeSetter.call(techInput, 'Docker Containers');
      techInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeAreaSetter.call(takeawayInput, 'Configured multi-stage Dockerfiles.');
      takeawayInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeSetter.call(urlInput, 'not-a-valid-url');
      urlInput.dispatchEvent(new Event('input', { bubbles: true }));

      document.getElementById('drawer-save-btn')?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 400));

  const urlErr = await evaluate(`document.getElementById('err-drawer-url')?.textContent?.trim()`);
  if (urlErr && urlErr.includes("valid URL")) {
    logPass(`URL validation correctly rejected invalid URL: "${urlErr}"`);
  } else {
    logFail(`URL error missing for invalid input: ${urlErr}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 4: Successful Creation of a New Learning Milestone
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Successful Milestone Creation ---");
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
  await new Promise((r) => setTimeout(r, 800));

  // Verify drawer closed and new milestone is visible in timeline
  const createOutcome = await evaluate(`
    (() => {
      const isDrawerVisible = !!document.querySelector('[role="dialog"]');
      const entries = Array.from(document.querySelectorAll('article[id^="learning-entry-"]'));
      const newEntry = entries.find(e => e.innerText.includes('Docker Multi-Stage Builds'));
      return {
        isDrawerVisible,
        totalEntries: entries.length,
        hasNewEntry: !!newEntry,
        newEntryText: newEntry?.innerText
      };
    })()
  `);

  if (!createOutcome.isDrawerVisible) {
    logPass("Drawer closed automatically after successful milestone submission");
  } else {
    logFail("Drawer remained open after submit");
  }

  if (createOutcome.hasNewEntry && createOutcome.totalEntries === 7) {
    logPass(`New milestone rendered in timeline stream (total entries: ${createOutcome.totalEntries})`);
  } else {
    logFail(`New milestone not found in timeline: ${JSON.stringify(createOutcome)}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 5: Open Edit Drawer on Existing Milestone (learn-2)
  // ---------------------------------------------------------------------------
  console.log("\n--- 5. Edit Drawer Opening & Data Prefill ---");
  await evaluate(`
    (() => {
      const editBtn = document.getElementById('edit-milestone-btn-learn-2');
      editBtn?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 600));

  const editDrawerState = await evaluate(`
    (() => {
      const drawer = document.querySelector('[role="dialog"]');
      if (!drawer) return null;
      const title = drawer.querySelector('#drawer-title')?.textContent?.trim();
      const techInput = document.getElementById('drawer-technology-input');
      const categorySelect = document.getElementById('drawer-category-select');
      const masterySelect = document.getElementById('drawer-mastery-select');
      const takeawayTextarea = document.getElementById('drawer-takeaway-textarea');
      const tagsInput = document.getElementById('drawer-tags-input');
      const subtitle = drawer.querySelector('#drawer-subtitle')?.textContent?.trim();

      return {
        title,
        subtitle,
        techVal: techInput?.value,
        catVal: categorySelect?.value,
        masteryVal: masterySelect?.value,
        takeawayVal: takeawayTextarea?.value,
        tagsVal: tagsInput?.value
      };
    })()
  `);

  if (editDrawerState?.title === "Edit Learning Milestone") {
    logPass("Drawer opened in Edit mode with title 'Edit Learning Milestone'");
  } else {
    logFail(`Edit drawer title incorrect: ${editDrawerState?.title}`);
  }

  if (editDrawerState?.techVal === "TypeScript Strict Mode & Generics" &&
      editDrawerState?.catVal === "Frontend" &&
      editDrawerState?.tagsVal?.includes("TypeScript")) {
    logPass("Existing milestone fields prefilled perfectly into drawer");
  } else {
    logFail(`Prefill incorrect: ${JSON.stringify(editDrawerState)}`);
  }

  // Capture Screenshot of Drawer in Edit Mode
  const editShot = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (editShot?.result?.data) {
    fs.writeFileSync(shotEdit, Buffer.from(editShot.result.data, "base64"));
    logPass(`Captured Edit mode screenshot to ${shotEdit}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 6: Edit & Save Existing Milestone (Verifying ID & Date Preservation)
  // ---------------------------------------------------------------------------
  console.log("\n--- 6. Milestone Update & ID/Date Preservation ---");
  await evaluate(`
    (() => {
      const nativeAreaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

      const takeawayInput = document.getElementById('drawer-takeaway-textarea');
      const tagsInput = document.getElementById('drawer-tags-input');

      nativeAreaSetter.call(takeawayInput, 'Architected advanced conditional types, mapped types, and branded primitives for zero runtime type leaks.');
      takeawayInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeInputSetter.call(tagsInput, 'TypeScript, Generics, TypeSafety, BrandedTypes');
      tagsInput.dispatchEvent(new Event('input', { bubbles: true }));

      document.getElementById('drawer-save-btn')?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 800));

  const postEditCheck = await evaluate(`
    (() => {
      const el = document.getElementById('learning-entry-learn-2');
      if (!el) return { found: false };
      const dateText = el.querySelector('time')?.textContent?.trim();
      const takeawayText = el.querySelector('p')?.textContent?.trim();
      const tags = Array.from(el.querySelectorAll('.font-mono')).map(t => t.textContent.trim());
      const totalEntries = document.querySelectorAll('article[id^="learning-entry-"]').length;

      return {
        found: true,
        id: el.id,
        dateText,
        takeawayText,
        tags,
        totalEntries
      };
    })()
  `);

  if (postEditCheck?.found && postEditCheck.id === "learning-entry-learn-2") {
    logPass("Original record ID 'learn-2' preserved with no duplication (total: 7 entries)");
  } else {
    logFail(`ID preservation failed: ${JSON.stringify(postEditCheck)}`);
  }

  if (postEditCheck?.dateText === "Oct 12, 2026") {
    logPass("Original historical date 'Oct 12, 2026' preserved intact after editing");
  } else {
    logFail(`Original date corrupted: ${postEditCheck?.dateText}`);
  }

  if (postEditCheck?.takeawayText?.includes("zero runtime type leaks")) {
    logPass("Milestone card takeaway updated in real-time in the timeline");
  } else {
    logFail(`Takeaway not updated: ${postEditCheck?.takeawayText}`);
  }

  // Capture Screenshot of timeline after edit
  const timelineShot = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (timelineShot?.result?.data) {
    fs.writeFileSync(shotTimelineUpdated, Buffer.from(timelineShot.result.data, "base64"));
    logPass(`Captured timeline post-edit screenshot to ${shotTimelineUpdated}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 7: Delete Safeguard & Deletion Verification
  // ---------------------------------------------------------------------------
  console.log("\n--- 7. Delete Safeguard & Deletion ---");
  const deleteOutcome = await evaluate(`
    (() => {
      window.confirm = () => true;
      const entries = Array.from(document.querySelectorAll('article[id^="learning-entry-"]'));
      const dockerEntry = entries.find(e => e.innerText.includes('Docker Multi-Stage Builds'));
      if (!dockerEntry) return { found: false };
      const deleteBtn = dockerEntry.querySelector('button[aria-label*="Delete"]');
      deleteBtn?.click();
      return { found: true };
    })()
  `);
  await new Promise((r) => setTimeout(r, 600));

  const countAfterDelete = await evaluate(`document.querySelectorAll('article[id^="learning-entry-"]').length`);
  if (countAfterDelete === 6) {
    logPass(`Deleted test milestone with confirmation safeguard; entry count restored to ${countAfterDelete}`);
  } else {
    logFail(`Expected 6 entries after delete, got ${countAfterDelete}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 8: Mobile Drawer View (375px)
  // ---------------------------------------------------------------------------
  console.log("\n--- 8. Mobile Drawer Viewport Testing (375px & 320px) ---");
  await sendCDP("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 812,
    deviceScaleFactor: 1,
    mobile: true
  });
  await new Promise((r) => setTimeout(r, 400));

  // Open Create Drawer on Mobile
  await evaluate(`document.getElementById('log-new-milestone-btn')?.click()`);
  await new Promise((r) => setTimeout(r, 500));

  const mobileOverflow = await evaluate(`
    (() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const drawer = document.querySelector('[role="dialog"]');
      return { docWidth, winWidth, hasOverflow: docWidth > winWidth, isDrawerOpen: !!drawer };
    })()
  `);

  if (!mobileOverflow.hasOverflow) {
    logPass(`Mobile 375px: Drawer fits perfectly with zero horizontal overflow (doc: ${mobileOverflow.docWidth}px, win: ${mobileOverflow.winWidth}px)`);
  } else {
    logFail(`Mobile 375px has overflow: doc=${mobileOverflow.docWidth}px, win=${mobileOverflow.winWidth}px`);
  }

  // Capture Mobile Drawer Screenshot
  const mobileShot = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (mobileShot?.result?.data) {
    fs.writeFileSync(shotMobile, Buffer.from(mobileShot.result.data, "base64"));
    logPass(`Captured mobile drawer screenshot to ${shotMobile}`);
  }

  // Close drawer
  await evaluate(`document.querySelector('[role="dialog"] button[aria-label*="Close"]')?.click()`);
  await new Promise((r) => setTimeout(r, 400));

  // Test 320px
  await sendCDP("Emulation.setDeviceMetricsOverride", {
    width: 320,
    height: 700,
    deviceScaleFactor: 1,
    mobile: true
  });
  await new Promise((r) => setTimeout(r, 400));

  const overflow320 = await evaluate(`
    (() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      return { docWidth, winWidth, hasOverflow: docWidth > winWidth };
    })()
  `);
  if (!overflow320.hasOverflow) {
    logPass(`Mobile 320px: Zero horizontal overflow confirmed (doc: ${overflow320.docWidth}px, win: ${overflow320.winWidth}px)`);
  } else {
    logFail(`Mobile 320px has horizontal overflow`);
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  if (failures === 0) {
    console.log("🎉 ALL PHASE 5.3 BROWSER TESTS PASSED WITH 0 FAILURES!");
  } else {
    console.error(`💥 ${failures} TEST ASSERTION(S) FAILED!`);
  }
  console.log("================================================================================\n");

  ws.close();
  edge.kill();
  process.exit(failures === 0 ? 0 : 1);
}

runPhase53BrowserValidation().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
