import http from "http";
import { spawn } from "child_process";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function probeUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on("error", reject);
  });
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await probeUrl(url);
      if (res.statusCode === 200) return true;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  return false;
}

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function main() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — LIVE BROWSER EDUCATION REHYDRATION & PERSISTENCE TEST");
  console.log("================================================================================\n");

  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    shell: true,
    stdio: "pipe",
    env: { ...process.env, PORT: "3000", NODE_ENV: "production" }
  });

  server.stdout.on("data", (d) => process.stdout.write(`[Server] ${d}`));
  server.stderr.on("data", (d) => process.stderr.write(`[Server ERR] ${d}`));

  const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_edu_test_" + Date.now());
  let edge = null;
  let ws = null;

  try {
    const ready = await waitForServer("http://localhost:3000/");
    if (!ready) throw new Error("Server failed to start within timeout");
    console.log("✅ Production server is running on http://localhost:3000\n");

    // Start headless Edge
    edge = spawn(edgePath, [
      "--headless=new",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-fre",
      "--remote-debugging-port=9222",
      "--window-size=1440,1000",
      "--user-data-dir=" + userDataDir,
      "http://localhost:3000/workspace"
    ]);

    await new Promise((r) => setTimeout(r, 2500));

    let pageWsUrl = "";
    for (let i = 0; i < 15; i++) {
      try {
        const res = await fetch("http://localhost:9222/json/list");
        const list = await res.json();
        const target = list.find((t) => t.url && t.url.includes("localhost:3000") && t.webSocketDebuggerUrl) ||
          list.find((t) => t.type === "page" && t.webSocketDebuggerUrl) ||
          list[0];
        if (target && target.webSocketDebuggerUrl) {
          pageWsUrl = target.webSocketDebuggerUrl;
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    if (!pageWsUrl) throw new Error("Could not find WebSocket debugger URL on port 9222");

    ws = new WebSocket(pageWsUrl);
    await new Promise((resolve) => (ws.onopen = resolve));

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
        awaitPromise: true,
      });
      return res?.result?.result?.value;
    }

    await sendCDP("Page.enable");
    await sendCDP("Runtime.enable");

    // 1. Inject STALE education state into localStorage
    console.log("--- 1. Injecting Stale Legacy Profile Into localStorage ---");
    const staleState = {
      userId: "tharaneshselvam",
      name: "Tharanesh Selvam",
      tagline: "Software Engineer",
      bio: "Software developer exploring scalable systems.",
      resume: {
        summary: "Full-Stack Software Engineer pursuing M.Tech (2024-2026).",
        education: [
          {
            degree: "M.Tech in Computer Science and Engineering",
            institution: "Sri Krishna College of Engineering and Technology",
            year: "2024 - 2026",
            honors: "Pursuing",
          },
          {
            degree: "Bachelor of Technology in Computer Science",
            institution: "Sri Krishna College of Engineering and Technology",
            year: "2020 - 2024",
            honors: "First Class with Distinction",
          },
        ],
      },
      projects: [],
      learnings: [],
    };

    await evaluate(`
      (() => {
        localStorage.clear();
        localStorage.setItem("myresume_workspace_tharaneshselvam", JSON.stringify(${JSON.stringify(staleState)}));
        localStorage.setItem("myresume_active_user", "tharaneshselvam");
      })()
    `);
    logPass("Stale profile with 2020-2024 Bachelor degree injected into localStorage");

    // 2. Reload page to trigger migration on hydration
    console.log("\n--- 2. Hydrating Workspace and Triggering In-Browser Migration ---");
    await sendCDP("Page.navigate", { url: "http://localhost:3000/workspace" });
    await new Promise((r) => setTimeout(r, 3000));

    // Unlock security gate if prompted
    await evaluate(`
      (() => {
        const emailInput = document.querySelector('input[type="email"]');
        if (emailInput) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(emailInput, 'tharaneshselvam@gmail.com');
          emailInput.dispatchEvent(new Event('input', { bubbles: true }));
          emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const form = document.querySelector('form');
        if (form) form.requestSubmit();
      })()
    `);
    await new Promise((r) => setTimeout(r, 2500));

    // 3. Inspect localStorage after migration
    console.log("\n--- 3. Verifying LocalStorage In-Place Migration ---");
    const migratedStored = await evaluate(`
      (() => {
        const raw = localStorage.getItem("myresume_workspace_tharaneshselvam");
        return raw ? JSON.parse(raw) : null;
      })()
    `);

    if (migratedStored && migratedStored.resume && migratedStored.resume.education) {
      const edus = migratedStored.resume.education;
      if (edus.length === 1) {
        logPass("LocalStorage education list contains exactly 1 entry");
      } else {
        logFail(`Expected 1 education entry in localStorage, found ${edus.length}`);
      }

      const primary = edus[0];
      if (primary.degree === "Integrated M.Tech in Computer Science and Engineering") {
        logPass("Degree is 'Integrated M.Tech in Computer Science and Engineering'");
      } else {
        logFail(`Unexpected degree: ${primary.degree}`);
      }

      if (primary.year === "2025–2030") {
        logPass("Year range is '2025–2030'");
      } else {
        logFail(`Unexpected year: ${primary.year}`);
      }

      const hasBachelorInStore = JSON.stringify(migratedStored).toLowerCase().includes("bachelor");
      if (!hasBachelorInStore) {
        logPass("No mention of 'Bachelor' anywhere in stored JSON");
      } else {
        logFail("Found 'Bachelor' in stored JSON");
      }
    } else {
      logFail("Stored profile was not found or has invalid structure");
    }

    // 4. Verify rendered UI in the browser
    console.log("\n--- 4. Verifying Rendered UI on /workspace#skills ---");
    // Click on Skills tab
    await evaluate(`
      (() => {
        const tabs = Array.from(document.querySelectorAll('nav button, nav a'));
        const skillsTab = tabs.find(t => t.textContent.includes('Skills') || t.textContent.includes('Focus'));
        if (skillsTab) skillsTab.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const pageText = await evaluate(`document.body.innerText`);

    if (pageText.includes("Integrated M.Tech in Computer Science and Engineering")) {
      logPass("Rendered UI displays 'Integrated M.Tech in Computer Science and Engineering'");
    } else {
      logFail("Rendered UI is missing 'Integrated M.Tech in Computer Science and Engineering'");
    }

    if (pageText.includes("Sri Krishna College of Engineering and Technology")) {
      logPass("Rendered UI displays 'Sri Krishna College of Engineering and Technology'");
    } else {
      logFail("Rendered UI is missing 'Sri Krishna College of Engineering and Technology'");
    }

    if (pageText.includes("2025–2030")) {
      logPass("Rendered UI displays '2025–2030'");
    } else {
      logFail("Rendered UI is missing '2025–2030'");
    }

    if (pageText.toLowerCase().includes("bachelor") || pageText.includes("B.Tech") || pageText.includes("2020 - 2024")) {
      logFail("Rendered UI incorrectly displays obsolete Bachelor degree!");
    } else {
      logPass("Rendered UI contains NO reference to Bachelor degree, B.Tech, or 2020-2024");
    }

    // 5. Test "Edit Bio / Education" Modal and Re-saving
    console.log("\n--- 5. Testing 'Edit Bio / Education' Modal & Re-saving ---");
    // Open modal
    const modalOpened = await evaluate(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Edit Bio') || b.textContent.includes('Edit Profile'));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      })()
    `);

    if (modalOpened) {
      logPass("Opened 'Edit Bio / Education' modal");
      await new Promise((r) => setTimeout(r, 1000));

      const modalDegreeVal = await evaluate(`
        (() => {
          const input = document.querySelector('input[name="degree"], input[placeholder*="Degree"]');
          return input ? input.value : "";
        })()
      `);

      if (modalDegreeVal.includes("Integrated M.Tech")) {
        logPass(`Modal degree input pre-filled with: '${modalDegreeVal}'`);
      } else {
        logFail(`Unexpected modal degree input value: '${modalDegreeVal}'`);
      }

      // Save modal
      await evaluate(`
        (() => {
          const saveBtn = Array.from(document.querySelectorAll('button[type="submit"], button')).find(b => b.textContent.includes('Save') && !b.textContent.includes('Cancel'));
          if (saveBtn) saveBtn.click();
        })()
      `);
      await new Promise((r) => setTimeout(r, 1500));
      logPass("Submitted profile edit form");

      // Check page text after save
      const postSaveText = await evaluate(`document.body.innerText`);
      if (postSaveText.toLowerCase().includes("bachelor") || postSaveText.includes("2020 - 2024")) {
        logFail("Obsolete Bachelor degree reappeared after saving profile!");
      } else {
        logPass("Profile saved successfully without restoring Bachelor degree");
      }

      // Reload page and verify persistence
      console.log("\n--- 6. Verifying Persistence After Full Page Reload ---");
      await sendCDP("Page.reload");
      await new Promise((r) => setTimeout(r, 2500));

      const postReloadText = await evaluate(`document.body.innerText`);
      if (postReloadText.toLowerCase().includes("bachelor") || postReloadText.includes("2020 - 2024")) {
        logFail("Obsolete Bachelor degree reappeared after page reload!");
      } else {
        logPass("Page reload confirmed: Bachelor degree remains completely eliminated");
      }
    } else {
      logFail("Could not locate 'Edit Bio / Education' button");
    }

    console.log("\n================================================================================");
    if (failures === 0) {
      console.log("🎉 ALL LIVE BROWSER EDUCATION TESTS PASSED WITH 0 FAILURES!");
    } else {
      console.log(`⚠️ ${failures} TEST CHECKS FAILED!`);
    }
    console.log("================================================================================\n");

  } finally {
    if (ws) {
      try { ws.close(); } catch {}
    }
    if (edge && edge.pid) {
      try { spawn("taskkill", ["/pid", edge.pid.toString(), "/T", "/F"]); } catch {}
    }
    if (server && server.pid) {
      try { spawn("taskkill", ["/pid", server.pid.toString(), "/T", "/F"]); } catch {}
    }
  }

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
