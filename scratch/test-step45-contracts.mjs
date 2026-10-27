import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { 
  INITIAL_PROFILE_STATE, 
  getProfileSkillsEvidence, 
  extractSkillsFromState, 
  generateDynamicPlainTextResume 
} = require('./compiled/profile.js');

console.log("================================================================================");
console.log("PORTFOLIO 2.0 — STEP 4.5 CONTRACT & EVIDENCE INTEGRITY SUITE");
console.log("================================================================================\n");

let failures = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    failures++;
  } else {
    console.log(`✅ [PASS] ${message}`);
  }
}

// -----------------------------------------------------------------------------
// 1. STARTER PROFILE VALIDATION
// -----------------------------------------------------------------------------
console.log("--- 1. Starter Profile Verification ---");
const starterState = INITIAL_PROFILE_STATE;
const starterEvidence = getProfileSkillsEvidence(starterState);

console.log(`   Starter Profile Name: "${starterState.name}"`);
console.log(`   Total Unique Canonical Skills: ${starterEvidence.totalCount}`);
console.log(`   Dual-Evidenced Skills (Projects & Diary): ${starterEvidence.bothCount}`);
console.log(`   Project-Backed Skills: ${starterEvidence.projectBackedCount}`);
console.log(`   Diary-Documented Skills: ${starterEvidence.learningDocumentedCount}`);

assert(starterEvidence.totalCount >= 10, "Total canonical skills is at least 10");
assert(starterEvidence.bothCount >= 3, "Dual-evidenced skills is at least 3");

// Verify React 19 skill details
const reactSkill = starterEvidence.skills.find(s => s.id === 'react');
assert(!!reactSkill, "Skill 'react' exists in normalized evidence");
if (reactSkill) {
  assert(reactSkill.displayName === "React 19", `React displayName is 'React 19' (actual: '${reactSkill.displayName}')`);
  assert(reactSkill.versionLabel === "19", `React versionLabel is '19' (actual: '${reactSkill.versionLabel}')`);
  assert(reactSkill.evidenceType === "project-and-learning", "React evidenceType is 'project-and-learning'");
  assert(reactSkill.projectRefs.length >= 2, `React has multiple project references (actual: ${reactSkill.projectRefs.length})`);
  
  const landStackRef = reactSkill.projectRefs.find(p => p.id === 'land-stack');
  const portfolioRef = reactSkill.projectRefs.find(p => p.id === 'personal-portfolio');
  assert(!!landStackRef, "React references Land Stack project");
  assert(!!portfolioRef, "React references Personal Portfolio Website project");
  
  const reactLearningRef = reactSkill.learningRefs.find(l => l.id === 'learn-1');
  assert(!!reactLearningRef, "React references learning entry 'learn-1'");
}

// Verify TypeScript skill details
const tsSkill = starterEvidence.skills.find(s => s.id === 'typescript');
assert(!!tsSkill, "Skill 'typescript' exists");
if (tsSkill) {
  assert(tsSkill.learningRefs.some(l => l.id === 'learn-2'), "TypeScript references learning entry 'learn-2'");
}

// Verify Git & GitHub skill details
const gitSkill = starterEvidence.skills.find(s => s.id === 'git-github');
assert(!!gitSkill, "Skill 'git-github' exists");
if (gitSkill) {
  assert(gitSkill.learningRefs.some(l => l.id === 'learn-5'), "Git & GitHub references learning entry 'learn-5'");
}

// -----------------------------------------------------------------------------
// 2. PROJECT REFERENCE INTEGRITY
// -----------------------------------------------------------------------------
console.log("\n--- 2. Project Reference Integrity ---");
let totalProjectRefsChecked = 0;
starterEvidence.skills.forEach(skill => {
  skill.projectRefs.forEach(ref => {
    totalProjectRefsChecked++;
    const fullProj = starterState.projects.find(p => p.id === ref.id);
    assert(!!fullProj, `Skill '${skill.displayName}' project ref '${ref.id}' exists in state.projects`);
    if (fullProj) {
      assert(!!fullProj.title, `Project '${ref.id}' has a title: '${fullProj.title}'`);
      assert(!!fullProj.caseStudy, `Project '${ref.id}' has a complete caseStudy definition`);
      assert(!!fullProj.caseStudy?.problemStatement, `Project '${ref.id}' has problemStatement in caseStudy`);
      assert(!!fullProj.caseStudy?.expertSolution, `Project '${ref.id}' has expertSolution in caseStudy`);
    }
  });
});
console.log(`   Checked ${totalProjectRefsChecked} project references.`);

// -----------------------------------------------------------------------------
// 3. LEARNING REFERENCE INTEGRITY
// -----------------------------------------------------------------------------
console.log("\n--- 3. Learning Diary Reference Integrity ---");
let totalLearningRefsChecked = 0;
starterEvidence.skills.forEach(skill => {
  skill.learningRefs.forEach(ref => {
    totalLearningRefsChecked++;
    const fullEntry = starterState.learnings.find(l => l.id === ref.id);
    assert(!!fullEntry, `Skill '${skill.displayName}' learning ref '${ref.id}' exists in state.learnings`);
    if (fullEntry) {
      assert(!!fullEntry.keyTakeaway, `Learning '${ref.id}' has a non-empty keyTakeaway`);
      assert(ref.keyTakeaway === fullEntry.keyTakeaway, `Learning ref '${ref.id}' takeaway matches source`);
      assert(!!fullEntry.dateLogged, `Learning '${ref.id}' has dateLogged: '${fullEntry.dateLogged}'`);
    }
  });
});
console.log(`   Checked ${totalLearningRefsChecked} learning diary references.`);

// -----------------------------------------------------------------------------
// 4. BLANK SLATE PROFILE ISOLATION
// -----------------------------------------------------------------------------
console.log("\n--- 4. Blank Slate Profile Isolation ---");
const blankState = {
  ...starterState,
  isBlankSlate: true,
  name: "Blank Candidate",
  title: "Software Engineer",
  learnings: [],
  projects: []
};

const blankEvidence = getProfileSkillsEvidence(blankState);
assert(blankEvidence.totalCount === 0, `Blank slate totalCount is 0 (actual: ${blankEvidence.totalCount})`);
assert(blankEvidence.projectBackedCount === 0, `Blank slate projectBackedCount is 0 (actual: ${blankEvidence.projectBackedCount})`);
assert(blankEvidence.learningDocumentedCount === 0, `Blank slate learningDocumentedCount is 0 (actual: ${blankEvidence.learningDocumentedCount})`);
assert(blankEvidence.bothCount === 0, `Blank slate bothCount is 0 (actual: ${blankEvidence.bothCount})`);

const blankExtracted = extractSkillsFromState(blankState);
const domains = ["Frontend", "Backend", "Cloud & DevOps", "Data & AI", "System Design"];
domains.forEach(d => {
  assert(Array.isArray(blankExtracted[d]) && blankExtracted[d].length === 0, `Blank slate domain '${d}' is empty`);
});

const blankResume = generateDynamicPlainTextResume(blankState);
assert(blankResume.toUpperCase().includes("BLANK CANDIDATE"), "Blank resume compiles with candidate name");
assert(!blankResume.includes("React 19"), "Blank resume does NOT leak React 19 from starter");
assert(!blankResume.includes("Land Stack"), "Blank resume does NOT leak Land Stack from starter");

// -----------------------------------------------------------------------------
// 5. ATS RESUME SKILL EXTRACTION COMPATIBILITY
// -----------------------------------------------------------------------------
console.log("\n--- 5. ATS Resume Extraction Compatibility ---");
const starterExtracted = extractSkillsFromState(starterState);
domains.forEach(d => {
  assert(Array.isArray(starterExtracted[d]), `extractSkillsFromState returns array for domain '${d}'`);
});
assert(starterExtracted.Frontend.includes("React 19"), "extractSkillsFromState Frontend includes 'React 19'");
assert(starterExtracted.Frontend.includes("TypeScript"), "extractSkillsFromState Frontend includes 'TypeScript'");
assert(starterExtracted.Backend.includes("Node.js"), "extractSkillsFromState Backend includes 'Node.js'");
assert(starterExtracted["Data & AI"].includes("Python"), "extractSkillsFromState Data & AI includes 'Python'");

const resumeText = generateDynamicPlainTextResume(starterState);
assert(resumeText.includes("React 19"), "Resume text includes 'React 19'");
assert(resumeText.toUpperCase().includes("LAND STACK"), "Resume text includes 'LAND STACK'");
assert(resumeText.toUpperCase().includes("PERSONAL PORTFOLIO WEBSITE"), "Resume text includes 'PERSONAL PORTFOLIO WEBSITE'");

// -----------------------------------------------------------------------------
// 6. SYSTEM DESIGN HONEST EMPTY STATE CHECK
// -----------------------------------------------------------------------------
console.log("\n--- 6. System Design Domain Verification ---");
assert(starterEvidence.byCategory["System Design"].length === 0, 
  `System Design has 0 skills in starter state to verify honest empty state (actual: ${starterEvidence.byCategory["System Design"].length})`
);

// -----------------------------------------------------------------------------
// FINAL SUMMARY
// -----------------------------------------------------------------------------
console.log("\n================================================================================");
if (failures === 0) {
  console.log("🎉 ALL STEP 4.5 CONTRACT & INTEGRATION TESTS PASSED WITH 0 FAILURES!");
} else {
  console.error(`💥 ${failures} TEST ASSERTION(S) FAILED!`);
  process.exit(1);
}
console.log("================================================================================\n");
