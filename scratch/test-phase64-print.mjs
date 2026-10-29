import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Tharanesh\\.gemini\\antigravity-ide\\brain\\007a5c4f-f6dc-4b30-8db5-bc73a1e4fd41";

const pdfDarkPath = path.join(artifactDir, "phase64_resume_darkmode.pdf");
const pdfLightPath = path.join(artifactDir, "phase64_resume_lightmode.pdf");
const shotPrintDark = path.join(artifactDir, "phase64_resume_print_darkmode.png");
const shotPrintLight = path.join(artifactDir, "phase64_resume_print_lightmode.png");

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function runPhase64Test() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 6.4 ATS RESUME PRINT & PDF VERIFICATION");
  console.log("================================================================================\n");

  const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_phase64_test_" + Date.now());

  const edge = spawn(edgePath, [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-fre",
    "--remote-debugging-port=9222",
    "--window-size=1200,1000",
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
    await sendCDP("Page.reload", { ignoreCache: true });
    await new Promise((r) => setTimeout(r, 2000));

    // Authenticate with Security Gate
    await new Promise((r) => setTimeout(r, 1500));
    await evaluate(`
      (() => {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    // Navigate to ATS Resume tab
    console.log("--- 1. Navigating to ATS Resume Hub ---");
    await evaluate(`
      (() => {
        const navButtons = Array.from(document.querySelectorAll('header nav button'));
        const resumeBtn = navButtons.find(b => b.textContent && b.textContent.includes('ATS Resume'));
        if (resumeBtn) resumeBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1000));

    const isResumeMounted = await evaluate(`Boolean(document.getElementById('resume-document-container'))`);
    if (isResumeMounted) {
      logPass("ATS Resume Hub mounted successfully with #resume-document-container");
    } else {
      logFail("Could not locate #resume-document-container in the DOM");
    }

    // Ensure we are in DARK mode first
    console.log("\n--- 2. Verifying Dark Theme Print Styling & PDF Generation ---");
    await evaluate(`
      (() => {
        document.documentElement.classList.add('dark');
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));

    // Emulate print media in CDP
    await sendCDP("Emulation.setEmulatedMedia", { media: "print" });
    await new Promise((r) => setTimeout(r, 400));

    // Inspect print-computed styles
    const printStylesDark = await evaluate(`
      (() => {
        const doc = document.getElementById('resume-document-container');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const noPrintControls = document.querySelector('.no-print');
        const nameH1 = doc?.querySelector('h1');
        const sectionH2 = doc?.querySelector('h2');
        const bodyStyle = window.getComputedStyle(document.body);
        const docStyle = doc ? window.getComputedStyle(doc) : null;
        const nameStyle = nameH1 ? window.getComputedStyle(nameH1) : null;
        const h2Style = sectionH2 ? window.getComputedStyle(sectionH2) : null;
        const headerStyle = header ? window.getComputedStyle(header) : null;
        const footerStyle = footer ? window.getComputedStyle(footer) : null;
        const noPrintStyle = noPrintControls ? window.getComputedStyle(noPrintControls) : null;

        return {
          bodyBg: bodyStyle.backgroundColor,
          docBg: docStyle?.backgroundColor,
          docColor: docStyle?.color,
          nameColor: nameStyle?.color,
          h2Color: h2Style?.color,
          h2BreakAfter: h2Style?.breakAfter || h2Style?.pageBreakAfter,
          headerDisplay: headerStyle?.display,
          footerDisplay: footerStyle?.display,
          noPrintDisplay: noPrintStyle?.display
        };
      })()
    `);

    console.log("   Dark Theme Print Computed Styles:", printStylesDark);

    if (printStylesDark.headerDisplay === "none") logPass("Site header/navbar hidden in print (display: none)");
    else logFail(`Header visible in print: ${printStylesDark.headerDisplay}`);

    if (printStylesDark.footerDisplay === "none") logPass("Site footer hidden in print (display: none)");
    else logFail(`Footer visible in print: ${printStylesDark.footerDisplay}`);

    if (printStylesDark.noPrintDisplay === "none") logPass("Action bar & section controls hidden in print (display: none)");
    else logFail(`Controls visible in print: ${printStylesDark.noPrintDisplay}`);

    if (printStylesDark.docBg === "rgb(255, 255, 255)") {
      logPass("Resume container background forced to pure white (#ffffff) even in dark mode");
    } else {
      logFail(`Resume container background not white in dark mode: ${printStylesDark.docBg}`);
    }

    if (printStylesDark.nameColor === "rgb(0, 0, 0)") {
      logPass("Candidate name heading forced to deep black (#000000)");
    } else {
      logFail(`Candidate name color: ${printStylesDark.nameColor}`);
    }

    if (printStylesDark.h2Color === "rgb(15, 23, 42)") {
      logPass("Section headings forced to high-contrast dark slate (#0f172a)");
    } else {
      logFail(`Section heading color: ${printStylesDark.h2Color}`);
    }

    // Verify contact links have clean handles without https://
    const contactLinks = await evaluate(`
      (() => {
        const doc = document.getElementById('resume-document-container');
        const links = Array.from(doc?.querySelectorAll('a') || []);
        return links.map(a => ({
          href: a.href,
          text: a.innerText.trim()
        }));
      })()
    `);
    console.log("   Contact Links in Print:", contactLinks);

    const ghLink = contactLinks.find(l => l.href.includes("github.com"));
    if (ghLink && ghLink.text.includes("github.com") && !ghLink.text.startsWith("https://")) {
      logPass(`Printable GitHub handle clean & readable: "${ghLink.text}"`);
    } else {
      logFail(`GitHub link format in print: "${ghLink?.text}"`);
    }

    // Take screenshot of print emulation in dark mode
    const shotDarkData = await sendCDP("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(shotPrintDark, Buffer.from(shotDarkData.data, "base64"));
    logPass(`Saved dark mode print visual preview: ${shotPrintDark}`);

    // Generate real PDF via Page.printToPDF
    const pdfDark = await sendCDP("Page.printToPDF", {
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.4,
      marginBottom: 0.4,
      marginLeft: 0.5,
      marginRight: 0.5,
      printBackground: true,
      preferCSSPageSize: true
    });

    const pdfDarkBuffer = Buffer.from(pdfDark.data, "base64");
    fs.writeFileSync(pdfDarkPath, pdfDarkBuffer);
    logPass(`Generated real PDF artifact in dark mode (${pdfDarkBuffer.length} bytes): ${pdfDarkPath}`);

    // Check PDF header signature (%PDF-1.4 or higher)
    if (pdfDarkBuffer.toString("ascii", 0, 5) === "%PDF-") {
      logPass("PDF artifact verified with valid '%PDF-' file signature");
    } else {
      logFail("Generated file is not a valid PDF document");
    }

    console.log("\n--- 3. Verifying Light Theme Print Styling & PDF Generation ---");
    // Switch to Light Mode
    await evaluate(`
      (() => {
        document.documentElement.classList.remove('dark');
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));

    const printStylesLight = await evaluate(`
      (() => {
        const doc = document.getElementById('resume-document-container');
        const docStyle = doc ? window.getComputedStyle(doc) : null;
        const nameH1 = doc?.querySelector('h1');
        const nameStyle = nameH1 ? window.getComputedStyle(nameH1) : null;
        return {
          docBg: docStyle?.backgroundColor,
          nameColor: nameStyle?.color
        };
      })()
    `);

    console.log("   Light Theme Print Computed Styles:", printStylesLight);
    if (printStylesLight.docBg === "rgb(255, 255, 255)") {
      logPass("Resume container background is pure white (#ffffff) in light mode");
    } else {
      logFail(`Resume container background not white in light mode: ${printStylesLight.docBg}`);
    }

    const shotLightData = await sendCDP("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(shotPrintLight, Buffer.from(shotLightData.data, "base64"));
    logPass(`Saved light mode print visual preview: ${shotPrintLight}`);

    const pdfLight = await sendCDP("Page.printToPDF", {
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.4,
      marginBottom: 0.4,
      marginLeft: 0.5,
      marginRight: 0.5,
      printBackground: true,
      preferCSSPageSize: true
    });

    const pdfLightBuffer = Buffer.from(pdfLight.data, "base64");
    fs.writeFileSync(pdfLightPath, pdfLightBuffer);
    logPass(`Generated real PDF artifact in light mode (${pdfLightBuffer.length} bytes): ${pdfLightPath}`);

    // Reset emulated media
    await sendCDP("Emulation.setEmulatedMedia", { media: "" });

    console.log("\n--- 4. Timeline View Print Fallback & Duplicate Content Integrity ---");
    // Switch to Visual Timeline view
    await evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const timelineBtn = buttons.find(b => b.textContent && b.textContent.includes('Visual Engineering Timeline'));
        if (timelineBtn) timelineBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 600));

    // When in timeline view on screen, verify #resume-document-container is hidden on screen
    const isDocHiddenOnScreen = await evaluate(`
      (() => {
        const doc = document.getElementById('resume-document-container');
        return doc ? window.getComputedStyle(doc).display : null;
      })()
    `);

    if (isDocHiddenOnScreen === "none") {
      logPass("In timeline mode, #resume-document-container is hidden on screen (display: none)");
    } else {
      logFail(`Document should be hidden on screen in timeline mode, got: ${isDocHiddenOnScreen}`);
    }

    // Now emulate print media while in timeline view
    await sendCDP("Emulation.setEmulatedMedia", { media: "print" });
    await new Promise((r) => setTimeout(r, 400));

    const isDocVisibleInPrintFromTimeline = await evaluate(`
      (() => {
        const doc = document.getElementById('resume-document-container');
        return doc ? window.getComputedStyle(doc).display : null;
      })()
    `);

    if (isDocVisibleInPrintFromTimeline === "block") {
      logPass("In timeline mode, printing automatically displays the clean ATS Document (display: block)");
    } else {
      logFail(`Document should be block in print, got: ${isDocVisibleInPrintFromTimeline}`);
    }

    // Verify timeline container is completely hidden in print
    const timelinePrintDisplay = await evaluate(`
      (() => {
        const timeline = document.getElementById('resume-timeline-container');
        if (!timeline) return 'not found';
        const style = window.getComputedStyle(timeline);
        const rect = timeline.getBoundingClientRect();
        return {
          display: style.display,
          rectHeight: rect.height
        };
      })()
    `);

    if (timelinePrintDisplay.display === "none" || timelinePrintDisplay.rectHeight === 0) {
      logPass("Visual timeline container is strictly hidden in print (display: none, height: 0)");
    } else {
      logFail(`Visual timeline container must not print: display=${timelinePrintDisplay.display}, height=${timelinePrintDisplay.rectHeight}`);
    }

    // Check rendered headings in print across entire page
    const renderedHeadings = await evaluate(`
      (() => {
        const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3'))
          .map(h => ({
            tag: h.tagName,
            text: h.innerText.trim(),
            rectHeight: h.getBoundingClientRect().height
          }))
          .filter(h => h.rectHeight > 0);
        return allHeadings;
      })()
    `);

    // Verify occurrence counts
    const countProjectSection = renderedHeadings.filter(h => h.text.includes("SELECTED ENGINEERING PROJECTS")).length;
    const countLandStack = renderedHeadings.filter(h => h.text.includes("Land Stack")).length;
    const countAIML = renderedHeadings.filter(h => h.text.includes("AI/ML Projects")).length;
    const countPortfolio = renderedHeadings.filter(h => h.text.includes("Personal Portfolio Website")).length;
    const countMilestones = renderedHeadings.filter(h => h.text.includes("VERIFIED LEARNING DIARY MILESTONES")).length;
    const countEducation = renderedHeadings.filter(h => h.text.includes("EDUCATION & CREDENTIALS")).length;
    const countCertifications = renderedHeadings.filter(h => h.text.includes("TECHNICAL CERTIFICATIONS")).length;
    const countHeroHeader = renderedHeadings.filter(h => h.text.includes("Dynamically Synchronized ATS Resume")).length;

    console.log("   Rendered Print Headings Check:", {
      countProjectSection,
      countLandStack,
      countAIML,
      countPortfolio,
      countMilestones,
      countEducation,
      countCertifications,
      countHeroHeader
    });

    if (countProjectSection === 1) logPass("Selected Engineering Projects heading occurs exactly once");
    else logFail(`Selected Engineering Projects heading count: ${countProjectSection} (expected 1)`);

    if (countPortfolio === 1) logPass("'Personal Portfolio Website' occurs exactly once");
    else logFail(`'Personal Portfolio Website' count: ${countPortfolio} (expected 1)`);

    if (countLandStack === 1) logPass("'Land Stack' occurs exactly once (zero duplicate copies)");
    else logFail(`'Land Stack' count: ${countLandStack} (expected 1)`);

    if (countAIML === 1) logPass("'AI/ML Projects' occurs exactly once (zero duplicate copies)");
    else logFail(`'AI/ML Projects' count: ${countAIML} (expected 1)`);

    if (countMilestones === 1) logPass("Verified Learning Diary Milestones heading occurs exactly once (zero duplicate copies)");
    else logFail(`Verified Learning Diary Milestones count: ${countMilestones} (expected 1)`);

    if (countEducation === 1) logPass("Education & Credentials heading occurs exactly once");
    else logFail(`Education & Credentials count: ${countEducation} (expected 1)`);

    if (countCertifications === 1) logPass("Technical Certifications heading occurs exactly once");
    else logFail(`Technical Certifications count: ${countCertifications} (expected 1)`);

    if (countHeroHeader === 0) logPass("Section hero title 'Dynamically Synchronized ATS Resume' is hidden in print");
    else logFail(`Section hero title count in print: ${countHeroHeader} (expected 0)`);

    // Reset emulated media
    await sendCDP("Emulation.setEmulatedMedia", { media: "" });

    // Restore ATS view & dark mode
    await evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const atsBtn = buttons.find(b => b.textContent && b.textContent.includes('Clean ATS Document View'));
        if (atsBtn) atsBtn.click();
        document.documentElement.classList.add('dark');
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    // Capture final verified dark mode PDF and visual preview
    await sendCDP("Emulation.setEmulatedMedia", { media: "print" });
    const finalShot = await sendCDP("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    fs.writeFileSync(shotPrintDark, Buffer.from(finalShot.data, "base64"));
    logPass(`Saved full verified dark mode print visual preview: ${shotPrintDark}`);

    const finalPdf = await sendCDP("Page.printToPDF", {
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.4,
      marginBottom: 0.4,
      marginLeft: 0.5,
      marginRight: 0.5,
      printBackground: true,
      preferCSSPageSize: true
    });
    fs.writeFileSync(pdfDarkPath, Buffer.from(finalPdf.data, "base64"));
    logPass(`Saved clean deduplicated PDF artifact: ${pdfDarkPath}`);

    await sendCDP("Emulation.setEmulatedMedia", { media: "" });

    console.log("\n================================================================================");
    if (failures === 0) {
      console.log("🎉 ALL PHASE 6.4 RESUME PRINT & PDF TESTS PASSED WITH 0 FAILURES!");
    } else {
      console.error(`💥 PHASE 6.4 FAILED WITH ${failures} FAILURE(S)!`);
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

runPhase64Test();
