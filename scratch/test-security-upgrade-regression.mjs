import http from "http";
import { spawn } from "child_process";

async function probeUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on("error", reject);
  });
}

async function probeBinary(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve({ statusCode: res.statusCode, headers: res.headers, buffer });
      });
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

async function runRegression() {
  console.log("================================================================================");
  console.log("NEXT.JS 16.4.6 SECURITY UPGRADE — COMPREHENSIVE REGRESSION SUITE");
  console.log("================================================================================\n");

  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    shell: true,
    stdio: "pipe",
    env: { ...process.env, PORT: "3000", NODE_ENV: "production" }
  });

  server.stdout.on("data", (d) => process.stdout.write(`[Server] ${d}`));
  server.stderr.on("data", (d) => process.stderr.write(`[Server ERR] ${d}`));

  let failures = 0;
  function assert(name, condition, extra = "") {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
    } else {
      console.error(`❌ [FAIL] ${name}${extra ? " - " + extra : ""}`);
      failures++;
    }
  }

  try {
    const ready = await waitForServer("http://localhost:3000/");
    if (!ready) throw new Error("Local Next.js 16.4.6 server failed to start within timeout");
    console.log("✅ Next.js 16.4.6 production server ready on http://localhost:3000\n");

    // --- 1. Public Homepage & Navigation ---
    console.log("--- 1. Testing Public Homepage & Navigation Structure ---");
    const rootRes = await probeUrl("http://localhost:3000/");
    const html = rootRes.body;

    assert("HTTP 200 OK on Root (/)", rootRes.statusCode === 200);
    assert("Header navigation: #home anchor", html.includes('href="#home"'));
    assert("Header navigation: #about anchor", html.includes('href="#about"'));
    assert("Header navigation: #projects anchor", html.includes('href="#projects"'));
    assert("Header navigation: #skills anchor", html.includes('href="#skills"'));
    assert("Header navigation: #experience anchor", html.includes('href="#experience"'));
    assert("Header navigation: #resume anchor", html.includes('href="#resume"'));
    assert("Header navigation: #contact anchor", html.includes('href="#contact"'));
    assert("Monogram 'TS' brand indicator present", html.includes("TS"));

    // --- 2. Identity & Academic Integrity ---
    console.log("\n--- 2. Testing Identity, Value Prop & Academic Background ---");
    assert("Candidate name 'THARANESH SELVAM' is present", html.includes("THARANESH SELVAM"));
    assert("Title 'Software Developer | M.Tech CSE' is present", html.includes("Software Developer | M.Tech CSE"));
    assert("Value proposition is present", html.includes("I build interactive web applications and explore software engineering"));
    assert("Institution 'Sri Krishna College of Engineering and Technology' is present", html.includes("Sri Krishna College of Engineering and Technology"));
    assert("Degree duration '2025–2030' is present", html.includes("2025–2030"));
    assert("Pursuing status is present", html.includes("Pursuing"));
    assert("NO separate Bachelor degree on homepage", !html.includes("Bachelor of Engineering") && !html.includes("Bachelor of Technology"));
    assert("NO stale 2020-2024 date range", !html.includes("2020 - 2024") && !html.includes("2020–2024"));
    assert("NO stale 2024-2026 date range", !html.includes("2024 - 2026") && !html.includes("2024–2026"));
    assert("NO PIN gate on public homepage", !html.includes("Enter Access PIN") && !html.includes("Security Passcode"));

    // --- 3. Projects & Case Studies ---
    console.log("\n--- 3. Testing Project Classification & Case Studies ---");
    assert("Project 1: 'Personal Portfolio Website' present", html.includes("Personal Portfolio Website"));
    assert("Project 1: classified as 'Live Application'", html.includes("Live Application"));
    assert("Project 2: 'Land Stack' present", html.includes("Land Stack"));
    assert("Project 2: classified as 'Early-Stage Concept'", html.includes("Early-Stage Concept"));
    assert("Project 3: 'AI & Machine Learning Studies' present", html.includes("AI &amp; Machine Learning Studies") || html.includes("AI & Machine Learning Studies"));
    assert("Project 3: classified as 'Learning Focus'", html.includes("Learning Focus"));
    assert("Case study triggers present", html.includes("View Full Case Study") || html.includes("Case Study"));

    // --- 4. Technical Skills & Experience ---
    console.log("\n--- 4. Testing Skills Matrix & Experience ---");
    assert("Technical Skills Matrix is present", html.includes("Technical Skills Matrix"));
    assert("Programming Languages category present", html.includes("Programming Languages"));
    assert("Frontend Development category present", html.includes("Frontend Development"));
    assert("Backend Development category present", html.includes("Backend Development"));
    assert("Database Management category present", html.includes("Database Management"));
    assert("Development Tools category present", html.includes("Development Tools"));
    assert("Engineering Journey section is present", html.includes("Engineering Journey"));
    assert("Verified Certifications displayed", html.includes("Verified Technical Certifications") || html.includes("Certifications"));

    // --- 5. Résumé Print & PDF Export ---
    console.log("\n--- 5. Testing Résumé Print & Export Infrastructure ---");
    assert("Dynamic ATS Résumé section is present", html.includes("Dynamic ATS Résumé"));
    assert("Document container '#resume-document-container' is present", html.includes('id="resume-document-container"'));
    assert("Print/Save as PDF action present", html.includes("Print / Save as PDF"));
    assert("Download Plain-Text action present", html.includes("Download Plain-Text (.txt)"));
    assert("Copy Résumé Text action present", html.includes("Copy Résumé Text"));

    // --- 6. Contact & Public Profiles ---
    console.log("\n--- 6. Testing Verified Contact Channels ---");
    assert("Verified GitHub link 'github.com/THARANESHSELVAM' is present", html.includes("github.com/THARANESHSELVAM"));
    assert("Location Tamil Nadu / Coimbatore is present", html.includes("Tamil Nadu") && html.includes("Coimbatore"));
    assert("Pending email is NOT exposed on public homepage", !html.includes("tharanesh.selvam@gmail.com"));
    assert("Pending LinkedIn is NOT exposed on public homepage", !html.includes("linkedin.com/in/tharanesh-selvam"));

    // --- 7. Interactive Workspace Isolation ---
    console.log("\n--- 7. Testing Interactive Workspace Route (/workspace) ---");
    const wsRes = await probeUrl("http://localhost:3000/workspace");
    const wsHtml = wsRes.body;
    assert("HTTP 200 OK on /workspace", wsRes.statusCode === 200);
    assert("SecurityGate renders on unauthenticated /workspace", wsHtml.includes("Interactive Engineering Workspace") || wsHtml.includes("Welcome Back") || wsHtml.includes("Create New Profile"));
    assert("Client-side demo notice displayed on /workspace", wsHtml.includes("Client-Side Demo Workspace Notice"));
    assert("Notice warns against confidential credentials", wsHtml.includes("do not enter confidential passwords"));
    assert("Back to Public Portfolio link is present", wsHtml.includes("Back to Public Portfolio"));

    // --- 8. SEO Metadata, Robots & Sitemap ---
    console.log("\n--- 8. Testing SEO Metadata, Robots & Sitemap ---");
    const robotsRes = await probeUrl("http://localhost:3000/robots.txt");
    assert("robots.txt HTTP 200 OK", robotsRes.statusCode === 200);
    assert("robots.txt allows all crawlers", robotsRes.body.includes("Allow: /"));
    assert("robots.txt declares sitemap", robotsRes.body.includes("sitemap.xml"));

    const sitemapRes = await probeUrl("http://localhost:3000/sitemap.xml");
    assert("sitemap.xml HTTP 200 OK", sitemapRes.statusCode === 200);
    assert("sitemap.xml indexes root URL", sitemapRes.body.includes("https://personal-portfolio-website-nine-lac.vercel.app/"));
    assert("sitemap.xml excludes /workspace", !sitemapRes.body.includes("/workspace"));

    const ogRes = await probeBinary("http://localhost:3000/opengraph-image");
    assert("opengraph-image HTTP 200 OK", ogRes.statusCode === 200);
    assert("opengraph-image content-type is image/png", (ogRes.headers["content-type"] || "").includes("image/png"));
    const ogHeader = ogRes.buffer.subarray(0, 8).toString("hex");
    assert("opengraph-image has valid PNG magic bytes (89504e470d0a1a0a)", ogHeader === "89504e470d0a1a0a");

    const twRes = await probeBinary("http://localhost:3000/twitter-image");
    assert("twitter-image HTTP 200 OK", twRes.statusCode === 200);
    assert("twitter-image content-type is image/png", (twRes.headers["content-type"] || "").includes("image/png"));
    const twHeader = twRes.buffer.subarray(0, 8).toString("hex");
    assert("twitter-image has valid PNG magic bytes (89504e470d0a1a0a)", twHeader === "89504e470d0a1a0a");

    console.log("\n================================================================================");
    if (failures === 0) {
      console.log("🎉 ALL NEXT.JS 16.4.6 REGRESSION ASSERTIONS PASSED WITH 0 FAILURES!");
    } else {
      console.error(`💥 ${failures} REGRESSION ASSERTIONS FAILED!`);
    }
    console.log("================================================================================\n");

  } finally {
    try {
      server.kill();
    } catch {}
    process.exit(failures > 0 ? 1 : 0);
  }
}

runRegression().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
