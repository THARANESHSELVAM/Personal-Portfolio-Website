// scratch/verify-master-audit-live.mjs
import https from 'node:https';

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AntigravityMasterAudit/1.0',
        ...(options.headers || {})
      }
    };
    const req = https.request(parsed, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('--- STARTING LIVE AUDIT PROBES ---');

  // 1. Root page
  console.log('\n[1] Checking Root Homepage: https://personal-portfolio-website-nine-lac.vercel.app/');
  const rootRes = await fetchUrl('https://personal-portfolio-website-nine-lac.vercel.app/');
  console.log('Status:', rootRes.statusCode);
  const rootBody = rootRes.body;
  console.log('HTML Length:', rootBody.length);
  console.log('Contains "Tharanesh Selvam":', rootBody.includes('Tharanesh Selvam'));
  console.log('Contains "Integrated M.Tech":', rootBody.includes('Integrated M.Tech'));
  console.log('Contains "Sri Krishna College of Engineering and Technology":', rootBody.includes('Sri Krishna College of Engineering and Technology'));
  console.log('Contains "2025":', rootBody.includes('2025'));
  console.log('Contains "2030":', rootBody.includes('2030'));
  console.log('Contains "Pursuing":', rootBody.includes('Pursuing'));
  console.log('Contains "Bachelor":', rootBody.includes('Bachelor'));
  console.log('Contains "B.Tech":', rootBody.includes('B.Tech'));
  console.log('Contains "B.E":', rootBody.includes('B.E'));
  console.log('Contains "2020 - 2024":', rootBody.includes('2020 - 2024') || rootBody.includes('2020&ndash;2024') || rootBody.includes('2020–2024'));
  console.log('Contains "2024 - 2026":', rootBody.includes('2024 - 2026') || rootBody.includes('2024&ndash;2026') || rootBody.includes('2024–2026'));
  console.log('Contains "Owner Access Required" on root:', rootBody.includes('Owner Access Required'));
  console.log('Contains "Enter Access PIN" on root:', rootBody.includes('Enter Access PIN'));

  // 2. Workspace page
  console.log('\n[2] Checking Workspace: https://personal-portfolio-website-nine-lac.vercel.app/workspace');
  const wsRes = await fetchUrl('https://personal-portfolio-website-nine-lac.vercel.app/workspace');
  console.log('Status:', wsRes.statusCode);
  const wsBody = wsRes.body;
  console.log('Contains demo notice / client-side disclaimer:', 
    wsBody.includes('client-side demonstration gate') || 
    wsBody.includes('not server-enforced authentication') ||
    wsBody.includes('client-side demonstration')
  );
  console.log('Contains back link to public portfolio (/):',
    wsBody.includes('href="/"') ||
    wsBody.includes('Return to Public Portfolio') ||
    wsBody.includes('Back to Portfolio')
  );

  // 3. Robots.txt
  console.log('\n[3] Checking robots.txt: https://personal-portfolio-website-nine-lac.vercel.app/robots.txt');
  const robotsRes = await fetchUrl('https://personal-portfolio-website-nine-lac.vercel.app/robots.txt');
  console.log('Status:', robotsRes.statusCode);
  console.log('Content:\n' + robotsRes.body.trim());

  // 4. Sitemap.xml
  console.log('\n[4] Checking sitemap.xml: https://personal-portfolio-website-nine-lac.vercel.app/sitemap.xml');
  const sitemapRes = await fetchUrl('https://personal-portfolio-website-nine-lac.vercel.app/sitemap.xml');
  console.log('Status:', sitemapRes.statusCode);
  console.log('Content:\n' + sitemapRes.body.trim());
  console.log('Indexes root (/):', sitemapRes.body.includes('<loc>https://personal-portfolio-website-nine-lac.vercel.app/</loc>'));
  console.log('Excludes /workspace:', !sitemapRes.body.includes('/workspace'));

  // 5. OpenGraph & Twitter Images
  console.log('\n[5] Checking OpenGraph & Twitter images');
  const ogRes = await fetchUrl('https://personal-portfolio-website-nine-lac.vercel.app/opengraph-image', { method: 'HEAD' });
  console.log('OG Image status:', ogRes.statusCode, 'content-type:', ogRes.headers['content-type']);
  const twRes = await fetchUrl('https://personal-portfolio-website-nine-lac.vercel.app/twitter-image', { method: 'HEAD' });
  console.log('Twitter Image status:', twRes.statusCode, 'content-type:', twRes.headers['content-type']);

  // 6. GitHub User Profile
  console.log('\n[6] Checking GitHub User: THARANESHSELVAM');
  const ghUserRes = await fetchUrl('https://api.github.com/users/THARANESHSELVAM');
  console.log('Status:', ghUserRes.statusCode);
  if (ghUserRes.statusCode === 200) {
    const u = JSON.parse(ghUserRes.body);
    console.log('Login:', u.login);
    console.log('Name:', u.name);
    console.log('Bio:', u.bio);
    console.log('Blog/Website:', u.blog);
    console.log('Company:', u.company);
    console.log('Location:', u.location);
    console.log('Public Repos:', u.public_repos);
  }

  // 7. GitHub Repository: Personal-Portfolio-Website
  console.log('\n[7] Checking GitHub Repo: THARANESHSELVAM/Personal-Portfolio-Website');
  const ghRepoRes = await fetchUrl('https://api.github.com/repos/THARANESHSELVAM/Personal-Portfolio-Website');
  console.log('Status:', ghRepoRes.statusCode);
  if (ghRepoRes.statusCode === 200) {
    const r = JSON.parse(ghRepoRes.body);
    console.log('Name:', r.name);
    console.log('Description:', r.description);
    console.log('Homepage:', r.homepage);
    console.log('Topics:', r.topics);
    console.log('Default Branch:', r.default_branch);
  }

  // 8. GitHub Repository: THARANESHSELVAM/THARANESHSELVAM (Profile README)
  console.log('\n[8] Checking GitHub Repo: THARANESHSELVAM/THARANESHSELVAM (Profile README Repo)');
  const ghReadmeRepoRes = await fetchUrl('https://api.github.com/repos/THARANESHSELVAM/THARANESHSELVAM');
  console.log('Status:', ghReadmeRepoRes.statusCode);
  if (ghReadmeRepoRes.statusCode === 404) {
    console.log('Profile README repository does not exist on GitHub yet (Expected - pending manual creation).');
  } else if (ghReadmeRepoRes.statusCode === 200) {
    console.log('Profile README repository EXISTS on GitHub.');
  }

  console.log('\n--- LIVE AUDIT PROBES COMPLETE ---');
}

run().catch(console.error);

