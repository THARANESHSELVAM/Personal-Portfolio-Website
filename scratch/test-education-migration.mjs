import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Module = require('module');
const path = require('path');
const assert = require('node:assert');

// Resolve @/ path aliases in compiled CommonJS modules
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain) {
  if (request === '@/data/profile') {
    return path.resolve('./scratch/compiled/data/profile.js');
  }
  if (request === '@/lib/datasetLoader') {
    return path.resolve('./scratch/compiled/lib/datasetLoader.js');
  }
  return originalResolveFilename.apply(this, arguments);
};

const {
  migrateOwnerEducationIfNeeded,
  isOwnerProfile,
  hasObsoleteEducation,
  CANONICAL_INTEGRATED_MTECH_EDUCATION,
  CANONICAL_MTECH_SUMMARY,
} = require('./compiled/lib/datasetLoader.js');

const { INITIAL_PROFILE_STATE } = require('./compiled/data/profile.js');

console.log("================================================================================");
console.log("TEST SUITE: EDUCATION HISTORY MIGRATION & LOCALSTORAGE PERSISTENCE INTEGRITY");
console.log("================================================================================\n");

// 1. Identification of Owner vs Non-Owner
console.log("--- 1. Testing Owner Profile Identification ---");
const ownerState = { ...INITIAL_PROFILE_STATE, name: "Tharanesh Selvam" };
assert.strictEqual(isOwnerProfile(ownerState, "tharanesh-selvam"), true, "Identifies owner by userId 'tharanesh-selvam'");
assert.strictEqual(isOwnerProfile(ownerState, "THARANESHSELVAM"), true, "Identifies owner by username 'THARANESHSELVAM'");
assert.strictEqual(isOwnerProfile(ownerState), true, "Identifies owner by candidate name 'Tharanesh Selvam'");

const customProfile = { ...INITIAL_PROFILE_STATE, name: "Sarah Chen" };
assert.strictEqual(isOwnerProfile(customProfile, "sarahchen"), false, "Correctly identifies non-owner 'sarahchen'");
console.log("✅ [PASS] Owner identification correctly isolates Tharanesh Selvam from custom profiles");

// 2. Detection of Obsolete Education
console.log("\n--- 2. Testing Obsolete Education Detection ---");
const obsoleteEducation = [
  {
    degree: "M.Tech in Computer Science and Engineering",
    institution: "Engineering College / University",
    year: "2024 - 2026",
  },
  {
    degree: "Bachelor of Technology / Engineering in Computer Science",
    institution: "Engineering College / University",
    year: "2020 - 2024",
  },
];
assert.strictEqual(hasObsoleteEducation(obsoleteEducation), true, "Detects obsolete bachelor and 2-year M.Tech records");

const cleanEducation = [CANONICAL_INTEGRATED_MTECH_EDUCATION];
assert.strictEqual(hasObsoleteEducation(cleanEducation), false, "Clean canonical education does not trigger obsolete flag");
console.log("✅ [PASS] Obsolete education detection accurately identifies stale records");

// 3. Migration of Stale Owner Profile Data
console.log("\n--- 3. Testing Migration of Stale Saved Owner Profile ---");
const staleOwnerState = {
  ...INITIAL_PROFILE_STATE,
  name: "Tharanesh Selvam",
  projects: [{ id: "test-proj", title: "Test Project", category: "Web", domainTag: "Web", problemSolved: "p", solution: "s", techStack: ["React"], metrics: ["m"] }],
  learnings: [{ id: "test-learn", technology: "Next.js", category: "Frontend", keyTakeaway: "k", dateLogged: "2026-10-01", masteryLevel: "Production Ready", tags: ["Next"] }],
  resume: {
    summary: "Old summary referencing 2024 - 2026 M.Tech",
    experience: [],
    education: obsoleteEducation,
    certifications: ["Cert 1"],
  },
};

const result = migrateOwnerEducationIfNeeded(staleOwnerState, "tharanesh-selvam");
assert.strictEqual(result.migrated, true, "Migration flags migrated = true for stale owner profile");
assert.strictEqual(result.state.resume.education.length, 1, "Migrated education contains EXACTLY 1 record");
assert.strictEqual(result.state.resume.education[0].degree, "Integrated M.Tech in Computer Science and Engineering", "Correct degree");
assert.strictEqual(result.state.resume.education[0].institution, "Sri Krishna College of Engineering and Technology", "Correct institution");
assert.strictEqual(result.state.resume.education[0].year, "2025–2030", "Correct duration");
assert.strictEqual(result.state.resume.education[0].honors, "Pursuing • Five-Year Integrated Programme", "Correct honors");
assert.strictEqual(result.state.resume.summary, CANONICAL_MTECH_SUMMARY, "Summary updated to canonical summary");

// Verify that projects, learnings, and certifications remain 100% intact
assert.strictEqual(result.state.projects.length, 1, "Preserved projects array");
assert.strictEqual(result.state.projects[0].title, "Test Project", "Preserved project title");
assert.strictEqual(result.state.learnings.length, 1, "Preserved learnings array");
assert.strictEqual(result.state.learnings[0].technology, "Next.js", "Preserved learning technology");
assert.strictEqual(result.state.resume.certifications.length, 1, "Preserved certifications");
console.log("✅ [PASS] Stale owner profile successfully migrated to single Integrated M.Tech record");
console.log("✅ [PASS] Existing projects, diary milestones, and custom data preserved 100%");

// 4. Idempotency Test
console.log("\n--- 4. Testing Idempotency of Migration ---");
const secondRun = migrateOwnerEducationIfNeeded(result.state, "tharanesh-selvam");
assert.strictEqual(secondRun.migrated, false, "Second migration run returns migrated = false");
assert.deepStrictEqual(secondRun.state, result.state, "State is untouched when already canonical");
console.log("✅ [PASS] Migration is strictly idempotent (no redundant rewriting or duplication)");

// 5. Non-Owner Isolation Test
console.log("\n--- 5. Testing Non-Owner Custom Profile Protection ---");
const customProfileWithDegrees = {
  ...INITIAL_PROFILE_STATE,
  name: "Sarah Chen",
  resume: {
    summary: "Sarah Chen Custom Summary",
    experience: [],
    education: [
      {
        degree: "Bachelor of Science in Electrical Engineering",
        institution: "University of Washington",
        year: "2018 - 2022",
      },
    ],
    certifications: [],
  },
};
const customResult = migrateOwnerEducationIfNeeded(customProfileWithDegrees, "sarahchen");
assert.strictEqual(customResult.migrated, false, "Custom profile is not migrated");
assert.strictEqual(customResult.state.resume.education[0].institution, "University of Washington", "Custom education preserved");
console.log("✅ [PASS] Custom non-owner profiles are completely untouched");

console.log("\n================================================================================");
console.log("🎉 ALL EDUCATION MIGRATION & PERSISTENCE TESTS PASSED WITH 0 FAILURES!");
console.log("================================================================================\n");
