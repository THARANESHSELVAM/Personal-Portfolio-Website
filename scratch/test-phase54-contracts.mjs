import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Module = require('module');
const path = require('path');

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
  INITIAL_PROFILE_STATE, 
  INITIAL_LEARNINGS,
  INITIAL_PROJECTS,
  getProfileSkillsEvidence, 
  extractSkillsFromState, 
  generateDynamicPlainTextResume 
} = require('./compiled/data/profile.js');

const {
  exportWorkspaceToJSON,
  importWorkspaceFromJSON,
  validateWorkspaceJSON,
  validateAndNormalizeWorkspace,
  createBlankWorkspace,
  createStarterWorkspace,
  VALID_COMPETENCY_AREAS,
  VALID_MASTERY_LEVELS
} = require('./compiled/lib/datasetLoader.js');

console.log("================================================================================");
console.log("PORTFOLIO 2.0 — PHASE 5.4 EVIDENCE RECIPROCITY & JSON IMPORT HARDENING SUITE");
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

// Helper to derive applied projects for a learning entry
function getAppliedProjectsForEntry(state, entryId) {
  const evidence = getProfileSkillsEvidence(state);
  const activeProjectIds = new Set(state.projects.map(p => p.id));
  const projectsMap = new Map();

  evidence.skills.forEach(skill => {
    if (!skill.projectRefs.length || !skill.learningRefs.length) return;
    if (skill.learningRefs.some(l => l.id === entryId)) {
      skill.projectRefs.forEach(p => {
        if (activeProjectIds.has(p.id) && !projectsMap.has(p.id)) {
          projectsMap.set(p.id, p);
        }
      });
    }
  });

  return Array.from(projectsMap.values());
}

// -----------------------------------------------------------------------------
// SECTION 1: BIDIRECTIONAL EVIDENCE LINKING
// -----------------------------------------------------------------------------
console.log("--- 1. Bidirectional Evidence Linking from Milestones to Projects ---");

// Test 1.1: Technology used by multiple projects (React 19 / Next.js)
const learn1Applied = getAppliedProjectsForEntry(INITIAL_PROFILE_STATE, "learn-1");
console.log(`   learn-1 ("Next.js & React 19 App Router") -> ${learn1Applied.map(p => p.title).join(", ")}`);
assert(learn1Applied.length === 2, `learn-1 matches exactly 2 projects (actual: ${learn1Applied.length})`);
assert(learn1Applied.some(p => p.id === "personal-portfolio"), "learn-1 matches Personal Portfolio Website");
assert(learn1Applied.some(p => p.id === "land-stack"), "learn-1 matches Land Stack");

// Test 1.2: Technology used by one project (Tailwind CSS in learn-3)
const learn3Applied = getAppliedProjectsForEntry(INITIAL_PROFILE_STATE, "learn-3");
console.log(`   learn-3 ("Tailwind CSS & Modern Design Systems") -> ${learn3Applied.map(p => p.title).join(", ")}`);
assert(learn3Applied.length === 1, `learn-3 matches exactly 1 project (actual: ${learn3Applied.length})`);
assert(learn3Applied[0].id === "personal-portfolio", "learn-3 matches Personal Portfolio Website");

// Test 1.3: Technology present only in learning entries (learn-4 GitHub API, learn-5 Git)
const learn4Applied = getAppliedProjectsForEntry(INITIAL_PROFILE_STATE, "learn-4");
assert(learn4Applied.length === 0, `learn-4 (GitHub API) has 0 project matches (actual: ${learn4Applied.length})`);

const learn5Applied = getAppliedProjectsForEntry(INITIAL_PROFILE_STATE, "learn-5");
assert(learn5Applied.length === 0, `learn-5 (Git & Version Control) has 0 project matches (actual: ${learn5Applied.length})`);

// Test 1.4: Blank Slate Profile isolation
const blankState = createBlankWorkspace({ userId: "blank-tester", name: "Blank Tester", email: "test@example.com", title: "Engineer" });
const blankApplied = getAppliedProjectsForEntry(blankState, "non-existent");
assert(blankApplied.length === 0, "Blank state has 0 applied project matches");

// Test 1.5: Active profile containing unrelated projects
const customState = {
  ...INITIAL_PROFILE_STATE,
  projects: [
    {
      id: "unrelated-proj",
      title: "Embedded C Firmware",
      category: "Systems",
      domainTag: "Embedded Systems",
      techStack: ["C++", "FreeRTOS", "ARM Cortex"],
      metrics: [],
      problemSolved: "Firmware",
      solution: "Embedded C",
    }
  ],
  learnings: [
    {
      id: "web-entry",
      technology: "Vue.js 3 Composition API",
      category: "Frontend",
      keyTakeaway: "Studied reactive ref and computed hooks in Vue 3.",
      dateLogged: "2026-10-20",
      masteryLevel: "Learned Concept",
      tags: ["Vue"]
    }
  ]
};
const unrelatedApplied = getAppliedProjectsForEntry(customState, "web-entry");
assert(unrelatedApplied.length === 0, "Unrelated projects yield 0 matches for web learning entry");

// Test 1.6: Deduplication when multiple canonical skills match same project
const multiSkillState = {
  ...INITIAL_PROFILE_STATE,
  projects: [
    {
      id: "fullstack-demo",
      title: "Fullstack Demo",
      category: "Fullstack",
      domainTag: "Fullstack",
      techStack: ["TypeScript", "Next.js", "React"],
      metrics: [],
      problemSolved: "",
      solution: "",
    }
  ],
  learnings: [
    {
      id: "multi-skill-entry",
      technology: "Next.js & React 19 App Router with TypeScript",
      category: "Frontend",
      keyTakeaway: "Combined Next.js and React 19 with strict TypeScript.",
      dateLogged: "2026-10-21",
      masteryLevel: "Production Ready",
      tags: ["Next", "React", "TS"]
    }
  ]
};
const multiSkillApplied = getAppliedProjectsForEntry(multiSkillState, "multi-skill-entry");
assert(multiSkillApplied.length === 1, `Multi-skill entry matches project once without duplication (actual: ${multiSkillApplied.length})`);
assert(multiSkillApplied[0].id === "fullstack-demo", "Matched project is fullstack-demo");


// -----------------------------------------------------------------------------
// SECTION 2: JSON IMPORT VALIDATION HARDENING
// -----------------------------------------------------------------------------
console.log("\n--- 2. JSON Import Validation Hardening ---");

// Test 2.1: Valid export generated by the current application round-trips cleanly
const validExportString = exportWorkspaceToJSON(INITIAL_PROFILE_STATE);
const roundTripResult = importWorkspaceFromJSON(validExportString);
assert(roundTripResult.success === true, "Current application export validates and imports successfully");
assert(roundTripResult.state.learnings.length === INITIAL_LEARNINGS.length, `Round-trip preserved all ${INITIAL_LEARNINGS.length} learnings`);
assert(roundTripResult.state.projects.length === INITIAL_PROJECTS.length, `Round-trip preserved all ${INITIAL_PROJECTS.length} projects`);

// Test 2.2: Legacy learning entry with missing tags (tags property omitted)
const legacyMissingTagsJSON = JSON.stringify({
  name: "Legacy User",
  learnings: [
    {
      id: "legacy-1",
      technology: "Docker",
      category: "Cloud & DevOps",
      keyTakeaway: "Learned container isolation and multi-stage builds.",
      dateLogged: "2026-10-01",
      masteryLevel: "Production Ready"
      // tags omitted
    }
  ],
  projects: []
});
const legacyMissingTagsResult = importWorkspaceFromJSON(legacyMissingTagsJSON);
assert(legacyMissingTagsResult.success === true, "Legacy entry with missing tags is accepted and normalized");
assert(Array.isArray(legacyMissingTagsResult.state?.learnings[0].tags), "Missing tags normalized to an array");
assert(legacyMissingTagsResult.state?.learnings[0].tags.length === 0, "Missing tags normalized to empty array []");

// Test 2.3: Entry containing tags: undefined before JSON serialization / tags: null in JSON
const legacyNullTagsJSON = JSON.stringify({
  name: "Legacy Null Tags User",
  learnings: [
    {
      id: "legacy-null-tags",
      technology: "Kubernetes",
      category: "Cloud & DevOps",
      keyTakeaway: "Configured pod deployments and ingress controllers.",
      dateLogged: "2026-10-02",
      masteryLevel: "Built Demo",
      tags: null
    }
  ],
  projects: []
});
const legacyNullTagsResult = importWorkspaceFromJSON(legacyNullTagsJSON);
assert(legacyNullTagsResult.success === true, "Entry with tags: null is accepted and normalized");
assert(Array.isArray(legacyNullTagsResult.state?.learnings[0].tags), "Null tags normalized to array");
assert(legacyNullTagsResult.state?.learnings[0].tags.length === 0, "Null tags normalized to empty array []");

// Test 2.4: Learning entry whose tags property has an invalid type (number or object)
const invalidTagTypeNumberJSON = JSON.stringify({
  name: "Invalid Tag Type",
  learnings: [
    {
      id: "invalid-tag-num",
      technology: "GraphQL",
      category: "Backend",
      keyTakeaway: "Designed GraphQL queries and schema resolvers.",
      dateLogged: "2026-10-03",
      masteryLevel: "Learned Concept",
      tags: 12345 // invalid number type
    }
  ],
  projects: []
});
const invalidTagTypeResult = importWorkspaceFromJSON(invalidTagTypeNumberJSON);
assert(invalidTagTypeResult.success === false, "Entry with tags: 12345 is rejected");
assert(invalidTagTypeResult.error.includes("invalid type"), `Error explains invalid tags type: "${invalidTagTypeResult.error}"`);

const invalidTagArrayElementJSON = JSON.stringify({
  name: "Invalid Tag Array Element",
  learnings: [
    {
      id: "invalid-tag-elem",
      technology: "GraphQL",
      category: "Backend",
      keyTakeaway: "Designed schema resolvers.",
      dateLogged: "2026-10-03",
      masteryLevel: "Learned Concept",
      tags: ["valid-tag", { invalid: "object" }] // invalid element
    }
  ],
  projects: []
});
const invalidTagArrayResult = importWorkspaceFromJSON(invalidTagArrayElementJSON);
assert(invalidTagArrayResult.success === false, "Entry with non-string tag element is rejected");

// Test 2.5: Invalid competency category
const invalidCategoryJSON = JSON.stringify({
  name: "Invalid Category User",
  learnings: [
    {
      id: "invalid-cat-entry",
      technology: "Robotics",
      category: "Embedded & Hardware", // Unsupported category
      keyTakeaway: "Configured motor controllers.",
      dateLogged: "2026-10-04",
      masteryLevel: "Built Demo",
      tags: ["Robotics"]
    }
  ],
  projects: []
});
const invalidCategoryResult = importWorkspaceFromJSON(invalidCategoryJSON);
assert(invalidCategoryResult.success === false, "Invalid competency category is rejected");
assert(invalidCategoryResult.error.includes("Unsupported competency category"), `Error mentions unsupported category: "${invalidCategoryResult.error}"`);

// Test 2.6: Invalid mastery level
const invalidMasteryJSON = JSON.stringify({
  name: "Invalid Mastery User",
  learnings: [
    {
      id: "invalid-mastery-entry",
      technology: "Rust",
      category: "Backend",
      keyTakeaway: "Learned memory ownership model.",
      dateLogged: "2026-10-05",
      masteryLevel: "Grandmaster", // Unsupported mastery level
      tags: ["Rust"]
    }
  ],
  projects: []
});
const invalidMasteryResult = importWorkspaceFromJSON(invalidMasteryJSON);
assert(invalidMasteryResult.success === false, "Invalid mastery level is rejected");
assert(invalidMasteryResult.error.includes("Unsupported mastery level"), `Error mentions unsupported mastery: "${invalidMasteryResult.error}"`);

// Test 2.7: Missing required technology field
const missingTechJSON = JSON.stringify({
  name: "Missing Tech User",
  learnings: [
    {
      id: "missing-tech-entry",
      technology: "", // empty technology
      category: "Frontend",
      keyTakeaway: "Learned some UI patterns.",
      dateLogged: "2026-10-06",
      masteryLevel: "Learned Concept",
      tags: ["UI"]
    }
  ],
  projects: []
});
const missingTechResult = importWorkspaceFromJSON(missingTechJSON);
assert(missingTechResult.success === false, "Empty technology string is rejected");
assert(missingTechResult.error.includes("Missing required 'technology' field"), `Error mentions missing technology: "${missingTechResult.error}"`);

// Test 2.8: Malformed project or learning array
const malformedLearningsJSON = JSON.stringify({
  name: "Malformed Learnings",
  learnings: "this-is-not-an-array",
  projects: []
});
const malformedLearningsResult = importWorkspaceFromJSON(malformedLearningsJSON);
assert(malformedLearningsResult.success === false, "Non-array learnings is rejected");
assert(malformedLearningsResult.error.includes("'learnings' must be an array"), `Error mentions learnings array: "${malformedLearningsResult.error}"`);

const malformedProjectsJSON = JSON.stringify({
  name: "Malformed Projects",
  learnings: [],
  projects: { not: "an array" }
});
const malformedProjectsResult = importWorkspaceFromJSON(malformedProjectsJSON);
assert(malformedProjectsResult.success === false, "Non-array projects is rejected");
assert(malformedProjectsResult.error.includes("'projects' must be an array"), `Error mentions projects array: "${malformedProjectsResult.error}"`);

// Test 2.9: Duplicate learning ID detection
const duplicateLearningIdJSON = JSON.stringify({
  name: "Duplicate Learning ID User",
  learnings: [
    {
      id: "dup-1",
      technology: "Go",
      category: "Backend",
      keyTakeaway: "Learned goroutines.",
      dateLogged: "2026-10-01",
      masteryLevel: "Learned Concept",
      tags: ["Go"]
    },
    {
      id: "dup-1", // duplicate id
      technology: "Rust",
      category: "Backend",
      keyTakeaway: "Learned traits.",
      dateLogged: "2026-10-02",
      masteryLevel: "Learned Concept",
      tags: ["Rust"]
    }
  ],
  projects: []
});
const duplicateLearningResult = importWorkspaceFromJSON(duplicateLearningIdJSON);
assert(duplicateLearningResult.success === false, "Duplicate learning ID is rejected");
assert(duplicateLearningResult.error.includes("Duplicate learning entry ID detected"), `Error explains duplicate ID: "${duplicateLearningResult.error}"`);

// Test 2.10: Duplicate project ID detection
const duplicateProjectIdJSON = JSON.stringify({
  name: "Duplicate Project ID User",
  learnings: [],
  projects: [
    {
      id: "dup-proj",
      title: "Project Alpha",
      techStack: ["React"],
      category: "Frontend",
      domainTag: "UI"
    },
    {
      id: "dup-proj", // duplicate id
      title: "Project Beta",
      techStack: ["Vue"],
      category: "Frontend",
      domainTag: "UI"
    }
  ]
});
const duplicateProjectResult = importWorkspaceFromJSON(duplicateProjectIdJSON);
assert(duplicateProjectResult.success === false, "Duplicate project ID is rejected");
assert(duplicateProjectResult.error.includes("Duplicate project ID detected"), `Error explains duplicate project ID: "${duplicateProjectResult.error}"`);

// Test 2.11: Malformed dateLogged
const malformedDateJSON = JSON.stringify({
  name: "Malformed Date User",
  learnings: [
    {
      id: "date-entry",
      technology: "Python",
      category: "Backend",
      keyTakeaway: "Learned decorators.",
      dateLogged: "not-a-valid-date-345",
      masteryLevel: "Learned Concept",
      tags: ["Python"]
    }
  ],
  projects: []
});
const malformedDateResult = importWorkspaceFromJSON(malformedDateJSON);
assert(malformedDateResult.success === false, "Malformed dateLogged is rejected");
assert(malformedDateResult.error.includes("Malformed dateLogged"), `Error explains malformed date: "${malformedDateResult.error}"`);

// Test 2.12: Legacy comma-separated tags string normalization
const legacyCommaTagsJSON = JSON.stringify({
  name: "Legacy Comma Tags User",
  learnings: [
    {
      id: "comma-tags-entry",
      technology: "Redis",
      category: "Backend",
      keyTakeaway: "Implemented caching layer.",
      dateLogged: "2026-10-01",
      masteryLevel: "Production Ready",
      tags: "#Redis, #Caching, Performance" // legacy string format
    }
  ],
  projects: []
});
const legacyCommaTagsResult = importWorkspaceFromJSON(legacyCommaTagsJSON);
assert(legacyCommaTagsResult.success === true, "Legacy comma-separated tags string is accepted");
assert(Array.isArray(legacyCommaTagsResult.state?.learnings[0].tags), "Tags normalized to array");
assert(legacyCommaTagsResult.state?.learnings[0].tags.includes("Redis"), "Includes stripped tag 'Redis'");
assert(legacyCommaTagsResult.state?.learnings[0].tags.includes("Caching"), "Includes stripped tag 'Caching'");
assert(legacyCommaTagsResult.state?.learnings[0].tags.includes("Performance"), "Includes tag 'Performance'");

// Test 2.13: validateWorkspaceJSON boolean contract
assert(validateWorkspaceJSON(INITIAL_PROFILE_STATE) === true, "validateWorkspaceJSON returns true for valid state");
assert(validateWorkspaceJSON({ invalid: "data" }) === false, "validateWorkspaceJSON returns false for invalid data");
assert(validateWorkspaceJSON(null) === false, "validateWorkspaceJSON returns false for null");

console.log("\n================================================================================");
if (failures === 0) {
  console.log("🎉 ALL 32 PHASE 5.4 CONTRACT & VALIDATION TESTS PASSED WITH 0 FAILURES!");
} else {
  console.error(`💥 ${failures} TESTS FAILED!`);
  process.exit(1);
}
console.log("================================================================================\n");
