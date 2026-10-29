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

async function main() {
  console.log("================================================================================");
  console.log("VERIFYING PUBLIC HOMEPAGE (/) AND WORKSPACE ROUTE (/workspace)");
  console.log("================================================================================\n");

  const server = spawn("npx", ["next", "start", "-p", "3000"], {
    shell: true,
    stdio: "pipe",
    env: { ...process.env, PORT: "3000", NODE_ENV: "production" }
  });

  server.stdout.on("data", (d) => process.stdout.write(`[Server] ${d}`));
  server.stderr.on("data", (d) => process.stderr.write(`[Server ERR] ${d}`));

  try {
    const ready = await waitForServer("http://localhost:3000/");
    if (!ready) {
      throw new Error("Server failed to start within timeout");
    }
    console.log("✅ Production server is running on http://localhost:3000\n");

    // 1. Check Root Homepage (/)
    console.log("--- 1. Testing Public Landing Page (/) ---");
    const rootRes = await probeUrl("http://localhost:3000/");
    const rootHtml = rootRes.body;

    const assertions = [
      { name: "HTTP 200 OK", test: rootRes.statusCode === 200 },
      { name: "Name 'THARANESH SELVAM' is present", test: rootHtml.includes("THARANESH SELVAM") },
      { name: "Headline 'Software Developer | M.Tech CSE' is present", test: rootHtml.includes("Software Developer | M.Tech CSE") },
      { name: "Intro value proposition is present", test: rootHtml.includes("I build interactive web applications and explore software engineering") },
      { name: "Action CTA 'Explore My Projects' is present", test: rootHtml.includes("Explore My Projects") },
      { name: "Action CTA 'View My Resume' is present", test: rootHtml.includes("View My Resume") },
      { name: "Action CTA 'GitHub Profile' is present", test: rootHtml.includes("GitHub Profile") },
      { name: "Featured Work section is present", test: rootHtml.includes("Featured Work") },
      { name: "Project 'Personal Portfolio Website' is present", test: rootHtml.includes("Personal Portfolio Website") },
      { name: "Project 'Land Stack' is present", test: rootHtml.includes("Land Stack") },
      { name: "Project 'AI & Machine Learning Studies' is present", test: rootHtml.includes("AI &amp; Machine Learning Studies") || rootHtml.includes("AI & Machine Learning Studies") },
      { name: "Technical Skills Matrix is present", test: rootHtml.includes("Technical Skills Matrix") },
      { name: "Engineering Journey section is present", test: rootHtml.includes("Engineering Journey") },
      { name: "Dynamic ATS Résumé section is present", test: rootHtml.includes("Dynamic ATS Résumé") },
      { name: "Verified GitHub 'github.com/THARANESHSELVAM' is present", test: rootHtml.includes("github.com/THARANESHSELVAM") },
      { name: "Institution 'Sri Krishna College of Engineering and Technology' is present", test: rootHtml.includes("Sri Krishna College of Engineering and Technology") },
      { name: "Degree duration '2025–2030' is present", test: rootHtml.includes("2025–2030") },
      { name: "Pending email 'tharanesh.selvam@gmail.com' is NOT on public homepage", test: !rootHtml.includes("tharanesh.selvam@gmail.com") },
      { name: "Pending LinkedIn 'linkedin.com/in/tharanesh-selvam' is NOT on public homepage", test: !rootHtml.includes("linkedin.com/in/tharanesh-selvam") },
      { name: "Link to '/workspace' is present", test: rootHtml.includes("/workspace") },
      { name: "NO PIN gate or SecurityGate on public homepage", test: !rootHtml.includes("Security Passcode") && !rootHtml.includes("Passcode Verification Failed") }
    ];

    let passedAllRoot = true;
    for (const a of assertions) {
      if (a.test) {
        console.log(`✅ [PASS] ${a.name}`);
      } else {
        console.error(`❌ [FAIL] ${a.name}`);
        passedAllRoot = false;
      }
    }

    // 2. Check Workspace Route (/workspace)
    console.log("\n--- 2. Testing Interactive Workspace Route (/workspace) ---");
    const wsRes = await probeUrl("http://localhost:3000/workspace");
    const wsHtml = wsRes.body;

    const wsAssertions = [
      { name: "HTTP 200 OK on /workspace", test: wsRes.statusCode === 200 },
      { name: "SecurityGate renders on unauthenticated /workspace", test: wsHtml.includes("Interactive Engineering Workspace") || wsHtml.includes("Welcome Back") || wsHtml.includes("Create New Profile") },
      { name: "Client-side demo notice is displayed", test: wsHtml.includes("Client-Side Demo Workspace Notice") },
      { name: "Notice states NOT server-enforced authentication", test: wsHtml.includes("not server-enforced authentication") },
      { name: "Notice warns not to enter confidential data", test: wsHtml.includes("do not enter confidential passwords") },
      { name: "Return link to public portfolio '← Back to Public Portfolio' is present", test: wsHtml.includes("Back to Public Portfolio") }
    ];

    let passedAllWs = true;
    for (const a of wsAssertions) {
      if (a.test) {
        console.log(`✅ [PASS] ${a.name}`);
      } else {
        console.error(`❌ [FAIL] ${a.name}`);
        passedAllWs = false;
      }
    }

    // 3. Check robots.txt and sitemap.xml
    console.log("\n--- 3. Testing Robots.txt and Sitemap.xml ---");
    const robotsRes = await probeUrl("http://localhost:3000/robots.txt");
    console.log(`✅ robots.txt status: ${robotsRes.statusCode}`);
    console.log(`   robots.txt preview:\n${robotsRes.body.trim().split("\n").map(l => "   " + l).join("\n")}`);

    const sitemapRes = await probeUrl("http://localhost:3000/sitemap.xml");
    console.log(`✅ sitemap.xml status: ${sitemapRes.statusCode}`);
    console.log(`   sitemap.xml preview:\n${sitemapRes.body.trim().split("\n").map(l => "   " + l).join("\n")}`);
    const sitemapHasRoot = sitemapRes.body.includes("<loc>") && !sitemapRes.body.includes("/workspace");
    console.log(`${sitemapHasRoot ? "✅ [PASS]" : "❌ [FAIL]"} sitemap.xml indexes root URL and omits /workspace`);

    console.log("\n================================================================================");
    if (passedAllRoot && passedAllWs) {
      console.log("🎉 ALL PUBLIC HOMEPAGE AND WORKSPACE CHECKS PASSED!");
    } else {
      console.log("⚠️ SOME CHECKS FAILED - REVIEW OUTPUT ABOVE");
    }
    console.log("================================================================================\n");

  } finally {
    console.log("Shutting down local Next.js server...");
    if (server.pid) {
      try {
        spawn("taskkill", ["/pid", server.pid.toString(), "/T", "/F"]);
      } catch {}
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

