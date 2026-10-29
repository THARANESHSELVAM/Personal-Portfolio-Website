import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const artifactDir = "C:\\Users\\Tharanesh\\.gemini\\antigravity-ide\\brain\\ce9c757a-3ae3-404b-b3ea-f71c5bcbdb9f";
const shotOgPath = path.join(artifactDir, "phase68_opengraph_preview.png");

let failures = 0;
function logPass(msg) {
  console.log(`✅ [PASS] ${msg}`);
}
function logFail(msg) {
  console.error(`❌ [FAIL] ${msg}`);
  failures++;
}

async function runPhase68Test() {
  console.log("================================================================================");
  console.log("PORTFOLIO 2.0 — PHASE 6.8 SEO, ROBOTS, SITEMAP & SOCIAL SHARING VERIFICATION");
  console.log("================================================================================\n");

  // 1. Direct HTTP Verification of Metadata Routes
  console.log("--- 1. HTTP Endpoint Verification: robots.txt ---");
  try {
    const robotsRes = await fetch("http://localhost:3000/robots.txt");
    const robotsText = await robotsRes.text();
    const contentType = robotsRes.headers.get("content-type") || "";

    if (robotsRes.status === 200) {
      logPass(`robots.txt resolved with HTTP 200 OK (${contentType})`);
    } else {
      logFail(`robots.txt returned HTTP ${robotsRes.status}`);
    }

    if (robotsText.includes("User-Agent: *") || robotsText.includes("User-agent: *")) {
      logPass("robots.txt contains 'User-Agent: *'");
    } else {
      logFail("robots.txt missing User-Agent declaration");
    }

    if (robotsText.includes("Allow: /")) {
      logPass("robots.txt contains 'Allow: /'");
    } else {
      logFail("robots.txt missing Allow: / directive");
    }

    if (robotsText.includes("Sitemap:") && robotsText.includes("/sitemap.xml")) {
      logPass(`robots.txt accurately references canonical sitemap.xml (${robotsText.trim().split("\n").find(l => l.startsWith("Sitemap:"))})`);
    } else {
      logFail(`robots.txt missing or invalid sitemap directive: ${robotsText}`);
    }
  } catch (err) {
    logFail(`Failed to test robots.txt: ${err.message}`);
  }

  console.log("\n--- 2. HTTP Endpoint Verification: sitemap.xml ---");
  try {
    const sitemapRes = await fetch("http://localhost:3000/sitemap.xml");
    const sitemapText = await sitemapRes.text();
    const contentType = sitemapRes.headers.get("content-type") || "";

    if (sitemapRes.status === 200) {
      logPass(`sitemap.xml resolved with HTTP 200 OK (${contentType})`);
    } else {
      logFail(`sitemap.xml returned HTTP ${sitemapRes.status}`);
    }

    if (sitemapText.includes("<urlset") && sitemapText.includes("http://www.sitemaps.org/schemas/sitemap/0.9")) {
      logPass("sitemap.xml has valid sitemaps.org XML schema declaration");
    } else {
      logFail("sitemap.xml missing sitemaps schema definition");
    }

    const locMatch = sitemapText.match(/<loc>(https?:\/\/[^<]+)<\/loc>/);
    if (locMatch && (locMatch[1].endsWith("/") || !locMatch[1].includes("/#"))) {
      logPass(`sitemap.xml contains genuine public root entry '<loc>${locMatch[1]}</loc>'`);
    } else {
      logFail(`sitemap.xml missing root loc: ${sitemapText}`);
    }

    if (sitemapText.includes("<changefreq>weekly</changefreq>")) {
      logPass("sitemap.xml includes change frequency directive 'weekly'");
    } else {
      logFail("sitemap.xml missing changefreq");
    }

    if (sitemapText.includes("<priority>1</priority>")) {
      logPass("sitemap.xml includes root priority '1'");
    } else {
      logFail("sitemap.xml missing priority");
    }

    // Ensure no fake subpaths are in sitemap
    if (!sitemapText.includes("/projects") && !sitemapText.includes("/diary")) {
      logPass("sitemap.xml strictly avoids publishing fake subpaths for client-only hash tabs");
    } else {
      logFail("sitemap.xml contains unsupported subpaths");
    }
  } catch (err) {
    logFail(`Failed to test sitemap.xml: ${err.message}`);
  }

  console.log("\n--- 3. HTTP Endpoint Verification: opengraph-image & twitter-image ---");
  try {
    const ogRes = await fetch("http://localhost:3000/opengraph-image");
    const ogBuffer = await ogRes.arrayBuffer();
    const ogContentType = ogRes.headers.get("content-type") || "";
    const ogHeader = Buffer.from(ogBuffer.slice(0, 8)).toString("hex");

    if (ogRes.status === 200 && ogContentType.includes("image/png")) {
      logPass(`opengraph-image resolved with HTTP 200 OK (${ogContentType}, ${ogBuffer.byteLength} bytes)`);
    } else {
      logFail(`opengraph-image returned HTTP ${ogRes.status} (${ogContentType})`);
    }

    // Check PNG signature: 89504e470d0a1a0a
    if (ogHeader === "89504e470d0a1a0a") {
      logPass("opengraph-image has valid binary PNG file signature");
    } else {
      logFail(`opengraph-image invalid signature: ${ogHeader}`);
    }

    const twRes = await fetch("http://localhost:3000/twitter-image");
    const twBuffer = await twRes.arrayBuffer();
    const twContentType = twRes.headers.get("content-type") || "";
    const twHeader = Buffer.from(twBuffer.slice(0, 8)).toString("hex");

    if (twRes.status === 200 && twContentType.includes("image/png") && twHeader === "89504e470d0a1a0a") {
      logPass(`twitter-image resolved with HTTP 200 OK valid PNG (${twBuffer.byteLength} bytes)`);
    } else {
      logFail(`twitter-image failed verification`);
    }
  } catch (err) {
    logFail(`Failed to test social images: ${err.message}`);
  }

  // 4. Browser CDP Inspection for Rendered Metadata Tags
  console.log("\n--- 4. Browser CDP Head Metadata Tag Inspection ---");
  const userDataDir = path.join(process.env.TEMP || "C:\\Temp", "edge_phase68_test_" + Date.now());

  const edge = spawn(edgePath, [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-fre",
    "--remote-debugging-port=9222",
    "--window-size=1200,630",
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
        || list.find(t => t.type === "page" && t.webSocketDebuggerUrl);
      if (target) {
        pageWsUrl = target.webSocketDebuggerUrl;
        break;
      }
    } catch {}
    await new Promise(r => setTimeout(r, 400));
  }

  if (!pageWsUrl) {
    console.error("Could not find WebSocket debugger URL on port 9222");
    edge.kill();
    process.exit(1);
  }

  const ws = new WebSocket(pageWsUrl);
  await new Promise((r) => (ws.onopen = r));

  let msgId = 1;
  const callbacks = new Map();
  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data);
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

  await sendCDP("Page.navigate", { url: "http://localhost:3000" });
  await new Promise((r) => setTimeout(r, 2000));

  const metaAudit = await evaluate(`
    (() => {
      const getMeta = (prop, isName = false) => {
        const el = isName
          ? document.querySelector('meta[name="' + prop + '"]')
          : document.querySelector('meta[property="' + prop + '"]') || document.querySelector('meta[name="' + prop + '"]');
        return el?.getAttribute('content') || null;
      };

      const canonicalEl = document.querySelector('link[rel="canonical"]');

      return {
        title: document.title,
        description: getMeta('description', true),
        applicationName: getMeta('application-name', true),
        canonical: canonicalEl?.getAttribute('href') || null,
        ogTitle: getMeta('og:title'),
        ogDesc: getMeta('og:description'),
        ogUrl: getMeta('og:url'),
        ogSiteName: getMeta('og:site_name'),
        ogImage: getMeta('og:image'),
        ogImageWidth: getMeta('og:image:width'),
        ogImageHeight: getMeta('og:image:height'),
        twitterCard: getMeta('twitter:card', true),
        twitterTitle: getMeta('twitter:title', true),
        twitterImage: getMeta('twitter:image', true),
        isLockedAtSecurityGate: Boolean(document.querySelector('input[type="password"]'))
      };
    })()
  `);

  if (metaAudit.title && metaAudit.title.includes("Tharanesh Selvam")) {
    logPass(`Document title verified: "${metaAudit.title}"`);
  } else {
    logFail(`Unexpected document title: "${metaAudit.title}"`);
  }

  if (metaAudit.description && metaAudit.description.includes("Tharanesh Selvam")) {
    logPass(`Search description verified: "${metaAudit.description.substring(0, 60)}..."`);
  } else {
    logFail(`Missing or invalid description: "${metaAudit.description}"`);
  }

  if (metaAudit.canonical && (metaAudit.canonical.startsWith("http://localhost:3000") || metaAudit.canonical.startsWith("https://personal-portfolio-website-nine-lac.vercel.app") || metaAudit.canonical.includes("tharaneshselvam"))) {
    logPass(`Canonical link verified: "${metaAudit.canonical}"`);
  } else {
    logFail(`Unexpected canonical link: "${metaAudit.canonical}"`);
  }

  if (metaAudit.ogTitle && metaAudit.ogTitle.includes("Tharanesh Selvam")) {
    logPass(`OpenGraph title verified: "${metaAudit.ogTitle}"`);
  } else {
    logFail(`Unexpected OpenGraph title: "${metaAudit.ogTitle}"`);
  }

  if (metaAudit.ogImage && metaAudit.ogImage.includes("/opengraph-image")) {
    logPass(`OpenGraph image URL verified: "${metaAudit.ogImage}"`);
  } else {
    logFail(`Missing or invalid og:image: "${metaAudit.ogImage}"`);
  }

  if (metaAudit.ogImageWidth === "1200" && metaAudit.ogImageHeight === "630") {
    logPass("OpenGraph image dimensions verified as 1200 x 630");
  } else {
    logFail(`Unexpected og:image dimensions: ${metaAudit.ogImageWidth} x ${metaAudit.ogImageHeight}`);
  }

  if (metaAudit.twitterCard === "summary_large_image") {
    logPass("Twitter card type verified: 'summary_large_image'");
  } else {
    logFail(`Unexpected twitter card type: "${metaAudit.twitterCard}"`);
  }

  if (metaAudit.twitterImage && metaAudit.twitterImage.includes("/twitter-image")) {
    logPass(`Twitter preview image URL verified: "${metaAudit.twitterImage}"`);
  } else {
    logFail(`Missing twitter:image: "${metaAudit.twitterImage}"`);
  }

  if (metaAudit.isLockedAtSecurityGate) {
    logPass("Initial fresh load strictly renders SecurityGate (workspace locked)");
  } else {
    logFail("SecurityGate was not rendered on initial fresh load");
  }

  // 5. Visual Capture of the Generated OpenGraph Social Card
  console.log("\n--- 5. Visual Capture of Generated Social Card ---");
  await sendCDP("Emulation.setDeviceMetricsOverride", {
    width: 1200,
    height: 630,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await sendCDP("Page.navigate", { url: "http://localhost:3000/opengraph-image" });
  await new Promise((r) => setTimeout(r, 1500));

  const screenshot = await sendCDP("Page.captureScreenshot", { format: "png" });
  if (screenshot?.result?.data) {
    fs.writeFileSync(shotOgPath, Buffer.from(screenshot.result.data, "base64"));
    logPass(`Saved visual preview of rendered 1200x630 social card: ${shotOgPath}`);
  } else {
    logFail("Failed to capture screenshot of /opengraph-image");
  }

  ws.close();
  edge.kill();

  console.log("\n================================================================================");
  if (failures === 0) {
    console.log("🎉 ALL PHASE 6.8 SEO, ROBOTS, SITEMAP & SOCIAL SHARING TESTS PASSED!");
  } else {
    console.error(`💥 ${failures} TESTS FAILED!`);
    process.exit(1);
  }
  console.log("================================================================================\n");
}

runPhase68Test().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
