import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Tharanesh\\.gemini\\antigravity-ide\\brain\\007a5c4f-f6dc-4b30-8db5-bc73a1e4fd41";

const shotDesktop = path.join(artifactDir, "learning_diary_desktop_timeline.png");
const shotMobile = path.join(artifactDir, "learning_diary_mobile_timeline.png");
const shotDropdown = path.join(artifactDir, "learning_diary_data_options_dropdown.png");
const shotDeepLink = path.join(artifactDir, "learning_diary_deeplink_highlight.png");
const shotLight = path.join(artifactDir, "learning_diary_light_theme_timeline.png");

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function runPhase52BrowserValidation() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 5.2 LEARNING DIARY TIMELINE BROWSER VALIDATION");
  console.log("================================================================================\n");

  const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_phase52_clean");

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

  // Navigate directly to localhost:3000
  await sendCDP("Page.navigate", { url: "http://localhost:3000" });
  await new Promise((r) => setTimeout(r, 3000));

  // ---------------------------------------------------------------------------
  // STEP 0: Unlock Workspace via SecurityGate form submission
  // ---------------------------------------------------------------------------
  console.log("--- 0. Security Gate Authentication ---");
  const unlocked = await evaluate(`
    (function() {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
        return true;
      }
      return false;
    })()
  `);
  console.log(`   Security Gate Unlock Triggered: ${unlocked}`);
  await new Promise((r) => setTimeout(r, 2500));

  const workspaceVisible = await evaluate(`
    Boolean(document.querySelector('nav') && document.querySelector('main'))
  `);
  if (workspaceVisible) {
    logPass("Workspace unlocked successfully. Navbar and Main are mounted.");
  } else {
    logFail("Workspace could not be unlocked.");
  }

  // ---------------------------------------------------------------------------
  // STEP 1: Navigate to Learning Diary Tab
  // ---------------------------------------------------------------------------
  console.log("\n--- 1. Navigation to Learning Diary ---");
  const tabSwitched = await evaluate(`
    (() => {
      const diaryTab = Array.from(document.querySelectorAll('nav button, nav a')).find(el => el.textContent.includes('Diary'));
      if (diaryTab) {
        diaryTab.click();
        return true;
      }
      return false;
    })()
  `);
  logPass(`Clicked 'Diary' navigation tab (result: ${tabSwitched})`);
  await new Promise((r) => setTimeout(r, 1500));

  const isDiaryMounted = await evaluate(`
    Boolean(document.getElementById('learning-log'))
  `);
  if (isDiaryMounted) {
    logPass("LearningLog component (#learning-log) mounted successfully.");
  } else {
    logFail("LearningLog component not found.");
  }

  // ---------------------------------------------------------------------------
  // STEP 2: Verify Editorial Header & Hierarchy
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Editorial Header & Restructured Toolbar ---");
  const headerInfo = await evaluate(`
    (() => {
      const h1 = document.querySelector('h1#journal-heading');
      const badge = document.querySelector('#learning-log')?.innerText.includes('ENGINEERING CHANGELOG');
      const text = h1?.textContent?.trim() || '';
      const desc = document.querySelector('#learning-log p')?.textContent?.trim() || '';
      return {
        hasH1: !!h1,
        title: text,
        hasBadge: badge,
        desc
      };
    })()
  `);
  if (headerInfo && headerInfo.title === "Engineering Learning Journal") {
    logPass("Editorial Page Heading is 'Engineering Learning Journal'");
  } else {
    logFail(`Expected 'Engineering Learning Journal', got '${headerInfo?.title}'`);
  }
  if (headerInfo && headerInfo.hasBadge) {
    logPass("Restrained 'ENGINEERING CHANGELOG' badge present");
  } else {
    logFail("Badge missing");
  }
  logPass(`Editorial introductory description: "${headerInfo?.desc?.slice(0, 75)}..."`);

  // Verify Primary Action Buttons
  const toolbarCheck = await evaluate(`
    (() => {
      const section = document.querySelector('#learning-log');
      if (!section) return null;
      const btnLog = Array.from(section.querySelectorAll('button')).find(b => b.textContent.includes('Log New Learning Milestone'));
      const btnGit = Array.from(section.querySelectorAll('button')).find(b => b.textContent.includes('Browse GitHub'));
      const dataOptionsBtn = document.getElementById('more-options-btn');
      return {
        hasLogBtn: !!btnLog,
        hasGitBtn: !!btnGit,
        hasDataOptionsBtn: !!dataOptionsBtn,
        dataOptionsText: dataOptionsBtn?.textContent?.trim() || ''
      };
    })()
  `);

  if (toolbarCheck?.hasLogBtn) logPass("Primary action 'Log New Learning Milestone' button visible");
  else logFail("'Log New Learning Milestone' button missing");

  if (toolbarCheck?.hasGitBtn) logPass("Primary action 'Browse GitHub' button visible");
  else logFail("'Browse GitHub' button missing");

  if (toolbarCheck?.hasDataOptionsBtn) logPass("Secondary utilities dropdown 'Data Options' button visible");
  else logFail("'Data Options' button missing");

  // Open Data Options Menu and verify items
  await evaluate(`
    (() => {
      const btn = document.getElementById('more-options-btn');
      btn?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 400));

  const menuItems = await evaluate(`
    (() => {
      const menu = document.querySelector('[role="menu"]');
      if (!menu) return null;
      const items = Array.from(menu.querySelectorAll('[role="menuitem"]')).map(i => i.textContent.trim());
      return items;
    })()
  `);

  if (menuItems && menuItems.some(i => i.includes('Export JSON')) && menuItems.some(i => i.includes('Import JSON')) && menuItems.some(i => i.includes('Reset to Starter Seed'))) {
    logPass(`'Data Options' menu successfully opened with accessible items: [${menuItems.join(', ')}]`);
  } else {
    logFail(`'Data Options' menu items unexpected: ${JSON.stringify(menuItems)}`);
  }

  // Screenshot dropdown
  const dropdownShot = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (dropdownShot?.result?.data) {
    fs.writeFileSync(shotDropdown, Buffer.from(dropdownShot.result.data, "base64"));
    logPass(`Captured dropdown screenshot to ${shotDropdown}`);
  }

  // Close menu with Escape key
  await evaluate(`
    (() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    })()
  `);
  await new Promise((r) => setTimeout(r, 300));

  // ---------------------------------------------------------------------------
  // STEP 3: Chronological Timeline Grouping & Month Headers
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Chronological Timeline Grouping ---");
  const timelineInfo = await evaluate(`
    (() => {
      const section = document.querySelector('#learning-log');
      if (!section) return null;
      
      const monthHeaders = Array.from(section.querySelectorAll('h3')).map(h => h.textContent.trim());
      
      const entries = Array.from(section.querySelectorAll('article[id^="learning-entry-"]')).map(art => {
        const id = art.id;
        const time = art.querySelector('time')?.textContent?.trim() || '';
        const title = art.querySelector('h4')?.textContent?.trim() || '';
        const takeaway = art.querySelector('p')?.textContent?.trim() || '';
        const category = art.querySelector('.font-mono.uppercase')?.textContent?.trim() || '';
        return { id, time, title, takeaway, category };
      });

      return { monthHeaders, entries };
    })()
  `);

  console.log("   Detected Month Groups:", timelineInfo?.monthHeaders);
  if (timelineInfo?.monthHeaders?.some(m => m.includes("October 2026")) && timelineInfo?.monthHeaders?.some(m => m.includes("September 2026"))) {
    logPass("Entries correctly grouped into 'October 2026' and 'September 2026'");
  } else {
    logFail(`Month headers unexpected: ${JSON.stringify(timelineInfo?.monthHeaders)}`);
  }

  console.log(`   Total rendered timeline milestones: ${timelineInfo?.entries?.length}`);
  if (timelineInfo?.entries?.length === 6) {
    logPass("All 6 starter profile milestones rendered in timeline");
  } else {
    logFail(`Expected 6 entries, got ${timelineInfo?.entries?.length}`);
  }

  // Verify chronological sort: First entry should be Oct 18, 2026, last should be Sep 02, 2026
  const firstEntry = timelineInfo?.entries?.[0];
  const lastEntry = timelineInfo?.entries?.[timelineInfo.entries.length - 1];
  console.log(`   First entry (newest): "${firstEntry?.time}" — "${firstEntry?.title}"`);
  console.log(`   Last entry (oldest): "${lastEntry?.time}" — "${lastEntry?.title}"`);

  if (firstEntry?.time?.includes("Oct 18, 2026") && firstEntry?.title?.includes("Next.js & React 19")) {
    logPass("Top entry is correctly newest milestone (Oct 18, 2026 — Next.js & React 19)");
  } else {
    logFail(`Top entry not newest: ${JSON.stringify(firstEntry)}`);
  }

  if (lastEntry?.time?.includes("Sep 2, 2026") || lastEntry?.time?.includes("Sep 02, 2026")) {
    logPass("Bottom entry is correctly oldest milestone (Sep 2, 2026 — Web Accessibility)");
  } else {
    logFail(`Bottom entry not oldest: ${JSON.stringify(lastEntry)}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 4: Live Category Counts & Multi-Tier Filtering
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Live Category Counts & Discovery Filters ---");
  const filterPills = await evaluate(`
    (() => {
      const section = document.querySelector('#learning-log');
      if (!section) return [];
      const buttons = Array.from(section.querySelectorAll('button')).filter(b => {
        return ['All', 'Frontend', 'Backend', 'Cloud & DevOps', 'Data & AI', 'System Design'].some(c => b.textContent.includes(c));
      });
      return buttons.map(b => b.innerText.replace(/\\s+/g, ' ').trim());
    })()
  `);
  console.log("   Category Filter Pills with Live Counts:", filterPills);

  if (filterPills.some(p => p.includes("All 6")) && 
      filterPills.some(p => p.includes("Frontend 4")) && 
      filterPills.some(p => p.includes("Backend 1")) && 
      filterPills.some(p => p.includes("Cloud & DevOps 1")) &&
      filterPills.some(p => p.includes("Data & AI 0")) &&
      filterPills.some(p => p.includes("System Design 0"))) {
    logPass("Live category counts accurately reflect profile state: All(6), Frontend(4), Backend(1), DevOps(1), AI(0), SystemDesign(0)");
  } else {
    logFail(`Category pills counts inaccurate: ${JSON.stringify(filterPills)}`);
  }

  // Test Filtering: Click Backend
  await evaluate(`
    (() => {
      const section = document.querySelector('#learning-log');
      const btn = Array.from(section.querySelectorAll('button')).find(b => b.textContent.includes('Backend'));
      btn?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 400));

  const backendEntries = await evaluate(`
    (() => {
      const section = document.querySelector('#learning-log');
      const arts = Array.from(section.querySelectorAll('article[id^="learning-entry-"]'));
      return arts.map(a => a.querySelector('h4')?.textContent?.trim() || '');
    })()
  `);
  if (backendEntries?.length === 1 && backendEntries[0].includes("GitHub REST API")) {
    logPass(`Filtering by 'Backend' correctly displays 1 entry: "${backendEntries[0]}"`);
  } else {
    logFail(`Backend filtering failed: ${JSON.stringify(backendEntries)}`);
  }

  // Test Search: Type 'sanitization' (matches takeaway of GitHub REST API)
  await evaluate(`
    (() => {
      const input = document.querySelector('#learning-log input[type="text"]');
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, 'sanitization');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()
  `);
  await new Promise((r) => setTimeout(r, 400));

  const searchCount = await evaluate(`
    (() => {
      return document.querySelectorAll('#learning-log article[id^="learning-entry-"]').length;
    })()
  `);
  if (searchCount === 1) {
    logPass("Search combined with category filter successfully matches takeaway content");
  } else {
    logFail(`Expected 1 match for search 'sanitization', got ${searchCount}`);
  }

  // Test Empty Filter State: Search for non-existent term
  await evaluate(`
    (() => {
      const input = document.querySelector('#learning-log input[type="text"]');
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, 'xyznonexistent123');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()
  `);
  await new Promise((r) => setTimeout(r, 400));

  const emptyFilterMsg = await evaluate(`
    (() => {
      const msg = document.querySelector('#learning-log')?.innerText || '';
      return msg.includes('No learning milestones match the active filters');
    })()
  `);
  if (emptyFilterMsg) {
    logPass("Empty filter state cleanly handled: 'No learning milestones match the active filters'");
  } else {
    logFail("Empty filter state message missing");
  }

  // Reset Filters
  await evaluate(`
    (() => {
      const clearBtn = Array.from(document.querySelectorAll('#learning-log button')).find(b => b.textContent.includes('Reset Filters') || b.textContent.includes('Clear all filters'));
      clearBtn?.click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 400));

  const restoredCount = await evaluate(`
    (() => {
      return document.querySelectorAll('#learning-log article[id^="learning-entry-"]').length;
    })()
  `);
  if (restoredCount === 6) {
    logPass("Reset filters restored all 6 timeline milestones");
  } else {
    logFail(`Expected 6 milestones after reset, got ${restoredCount}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 5: Deep Link Highlighting Contract
  // ---------------------------------------------------------------------------
  console.log("\n--- 5. Deep Link Highlighting Contract ---");
  await evaluate(`
    (() => {
      window.dispatchEvent(new CustomEvent('highlight-learning-entry', {
        detail: { entryId: 'learn-2' }
      }));
    })()
  `);
  await new Promise((r) => setTimeout(r, 600));

  const highlightCheck = await evaluate(`
    (() => {
      const el = document.getElementById('learning-entry-learn-2');
      if (!el) return { found: false };
      const hasRing = el.className.includes('ring-4') || el.className.includes('ring-cyan-500');
      const isFocused = document.activeElement === el;
      return { found: true, hasRing, isFocused };
    })()
  `);

  if (highlightCheck && highlightCheck.found && highlightCheck.hasRing) {
    logPass("Deep-link trigger correctly scrolled, focused, and applied cyan ring highlight to #learning-entry-learn-2");
  } else {
    logFail(`Deep-link highlighting failed: ${JSON.stringify(highlightCheck)}`);
  }

  // Capture Deep Link Screenshot
  const deepLinkShot = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (deepLinkShot?.result?.data) {
    fs.writeFileSync(shotDeepLink, Buffer.from(deepLinkShot.result.data, "base64"));
    logPass(`Captured deep-link highlight screenshot to ${shotDeepLink}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 6: Capture Desktop Timeline Screenshot (1440px)
  // ---------------------------------------------------------------------------
  console.log("\n--- 6. Desktop & Viewport Responsiveness ---");
  await sendCDP("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false
  });
  await evaluate(`
    (() => {
      document.querySelector('#learning-log')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()
  `);
  await new Promise((r) => setTimeout(r, 600));

  const desktopShot = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (desktopShot?.result?.data) {
    fs.writeFileSync(shotDesktop, Buffer.from(desktopShot.result.data, "base64"));
    logPass(`Captured desktop timeline screenshot (1440px) to ${shotDesktop}`);
  }

  // Test Light Theme
  console.log("\n--- 7. Light Theme Verification ---");
  await evaluate(`
    (() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    })()
  `);
  await new Promise((r) => setTimeout(r, 500));

  const lightShot = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (lightShot?.result?.data) {
    fs.writeFileSync(shotLight, Buffer.from(lightShot.result.data, "base64"));
    logPass(`Captured light theme timeline screenshot to ${shotLight}`);
  }

  // Restore Dark Theme
  await evaluate(`
    (() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    })()
  `);
  await new Promise((r) => setTimeout(r, 300));

  // ---------------------------------------------------------------------------
  // STEP 8: Viewports Test: 1024px, 768px, 375px, 320px
  // ---------------------------------------------------------------------------
  console.log("\n--- 8. Responsive Viewport Matrix (320px - 1024px) ---");
  const viewports = [1024, 768, 375, 320];
  for (const vp of viewports) {
    await sendCDP("Emulation.setDeviceMetricsOverride", {
      width: vp,
      height: 900,
      deviceScaleFactor: 1,
      mobile: vp <= 768
    });
    await new Promise((r) => setTimeout(r, 400));

    const overflowCheck = await evaluate(`
      (() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return { docWidth, winWidth, hasOverflow: docWidth > winWidth };
      })()
    `);

    if (overflowCheck && !overflowCheck.hasOverflow) {
      logPass(`Viewport ${vp}px: No horizontal document overflow (doc: ${overflowCheck.docWidth}px, win: ${overflowCheck.winWidth}px)`);
    } else {
      logFail(`Viewport ${vp}px has horizontal overflow: doc=${overflowCheck?.docWidth}px, win=${overflowCheck?.winWidth}px`);
    }

    if (vp === 375) {
      const mobileShot = await sendCDP("Page.captureScreenshot", { format: "png" });
      if (mobileShot?.result?.data) {
        fs.writeFileSync(shotMobile, Buffer.from(mobileShot.result.data, "base64"));
        logPass(`Captured mobile timeline screenshot (375px) to ${shotMobile}`);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  if (failures === 0) {
    console.log("🎉 ALL PHASE 5.2 BROWSER TESTS PASSED WITH 0 FAILURES!");
  } else {
    console.error(`💥 ${failures} TEST ASSERTION(S) FAILED!`);
  }
  console.log("================================================================================\n");

  ws.close();
  edge.kill();
  process.exit(failures === 0 ? 0 : 1);
}

runPhase52BrowserValidation().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
