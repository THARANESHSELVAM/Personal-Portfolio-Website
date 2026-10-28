# Personal Engineering Portfolio — Tharanesh Selvam

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://personal-portfolio-website-nine-lac.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An interactive personal engineering portfolio built with Next.js, React, TypeScript, and Tailwind CSS, featuring project case studies, skills evidence, a learning journal, and a dynamic résumé.

---

## Live Demo

Explore the live portfolio deployment on Vercel:
🔗 **[https://personal-portfolio-website-nine-lac.vercel.app/](https://personal-portfolio-website-nine-lac.vercel.app/)**

---

## Project Overview

This repository houses the personal software engineering portfolio of **Tharanesh Selvam**, a Software Developer and Integrated M.Tech Computer Science and Engineering scholar at Sri Krishna College of Engineering and Technology (2025–2030). The platform is designed to provide technical recruiters and engineering hiring managers with immediate, transparent insight into practical engineering capabilities, architecture decisions, and verified proof-of-work.

Unlike static one-page templates, this portfolio features:
1. **Recruiter-First Public Landing Page (`/`)**: Displays candidate identity, strongest projects, verified technical skills, engineering journey milestones, dynamic ATS résumé, and direct contact details immediately—without any PIN, login, or workspace onboarding gate.
2. **Deep-Dive Case Studies**: Architectural breakdowns with problem statements, implementation details, benchmarks, and trade-offs.
3. **Dynamic ATS Résumé Engine**: Live plain-text resume generation directly compiled from verified projects and learning milestones.
4. **Interactive Demo Workspace (`/workspace`)**: A dedicated client-side demo environment where visitors can test multi-profile creation, milestone logging, and GitHub REST API synchronization.

---

## Technology Stack

The project relies strictly on the modern, production-grade dependencies defined in `package.json`:

- **Framework**: [Next.js 16.4.2](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering)
- **UI & Runtime**: [React 19.3.0](https://react.dev/) & [React-DOM 19.3.0](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict Type Checking)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`tailwindcss`, `@tailwindcss/turbopack`)
- **Icons**: [Lucide React](https://lucide.dev/) (`lucide-react`)
- **Animations & Effects**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) (Dark/Light mode support with CSS variables)
- **Linting & Code Quality**: [ESLint 9](https://eslint.org/) with `eslint-config-next`

---

## Key Features

### 1. Recruiter-Ready Public Homepage (`/`)
- **Immediate Candidate Visibility**: Name (**Tharanesh Selvam**), title (**Software Developer | M.Tech CSE**), academic badge (**Integrated M.Tech CSE (2025–2030) • Sri Krishna College of Engineering and Technology**), and core value proposition.
- **Direct Action CTAs**: "Explore My Projects", "View My Resume", and direct external link to verified GitHub profile.
- **Verified Contact Coordinates**: Verified GitHub profile ([github.com/THARANESHSELVAM](https://github.com/THARANESHSELVAM)), academic institution (Sri Krishna College of Engineering and Technology), and location (`India / Open to Remote & Relocation`). Direct email and LinkedIn available upon request.

### 2. Strongest Projects Showcase
- **Personal Portfolio Website**: Full-stack Next.js 16 App Router application with atomic local state persistence, accessible design tokens, dynamic ATS plain-text resume generation, and GitHub REST API integration.
- **Land Stack**: GIS-based digital platform for land records governance and parcel title verification in India, utilizing React, Node.js, and PostgreSQL with PostGIS spatial indexing.
- **AI/ML Projects**: Machine learning models and automated data science pipelines implementing regression, classification, cross-validation metrics, and exploratory data analysis (EDA).
- **Interactive Case Study Modals**: In-depth technical articles for each project covering problem analysis, technical challenges, benchmarks, and key learnings.

### 3. Technical Skills Competency Matrix
- Cleanly grouped across 5 engineering domains:
  - **Frontend Engineering**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, JavaScript (ES6+), HTML5 & CSS3, Web Accessibility (WCAG).
  - **Backend & APIs**: Node.js, Express, PostgreSQL, REST APIs, GitHub REST API.
  - **Cloud & DevOps**: Git & GitHub, Branching Strategies, Docker, Vercel Edge.
  - **Data Science & AI**: Python, Pandas, Scikit-learn, NumPy, Automated EDA.
  - **System Design & Geospatial**: GIS / PostGIS, Spatial Database Indexing, Cadastral Governance.

### 4. Engineering Journey & Learning Diary
- Chronological timeline of verified learning milestones from the codebase, demonstrating continuous skill acquisition across React 19 transitions, TypeScript generics, accessible design systems, and Git version control.

### 5. Dynamic ATS Résumé Hub
- Applicant Tracking System compatible résumé dynamically formatted from verified candidate state.
- Supports **1-Click Plain-Text Download (`.txt`)**, **Print to PDF (`window.print()`)**, and **Copy to Clipboard**.

### 6. Interactive Demo Workspace (`/workspace`)
- Preserved client-side demo environment for experimenting with multi-profile switching, custom milestone entries, and GitHub repository importing.

---

## Architecture & Data Flow

```text
src/
├── app/
│   ├── layout.tsx            # Root layout with ThemeProvider, ProfileProvider, metadata
│   ├── page.tsx              # Recruiter-friendly public landing page (Route: /)
│   ├── workspace/
│   │   └── page.tsx          # Interactive demo workspace & profile sandbox (Route: /workspace)
│   ├── robots.ts             # Crawl directives pointing to canonical sitemap
│   ├── sitemap.ts            # Canonical XML sitemap indexing root /
│   ├── opengraph-image.tsx   # Dynamic edge OpenGraph preview generation
│   └── globals.css           # Design tokens, cyber-cyan palettes, glassmorphism utilities
├── components/
│   ├── PublicPortfolio.tsx   # Public recruiter-ready landing page component
│   ├── CaseStudyModal.tsx    # Comprehensive technical case study reader
│   ├── SecurityGate.tsx      # Client-side demo workspace access & profile switcher
│   ├── Navbar.tsx            # Responsive navigation with workspace return links
│   ├── Hero.tsx              # Workstation hero & interactive engineering tabs
│   ├── ProjectGrid.tsx       # Filterable project showcase & GitHub repo importer
│   ├── SkillsView.tsx        # Evidence inspector & skills competency matrix
│   ├── LearningLog.tsx       # Chronological engineering diary logger
│   ├── ResumeHub.tsx         # ATS document preview & print generator
│   └── ThemeToggle.tsx       # System / Dark / Light theme switcher
├── context/
│   └── ProfileContext.tsx    # Local-first reactive state engine & localStorage sync
├── data/
│   └── profile.ts            # Curated initial state, verified projects, and skills evidence helper
└── lib/
    ├── authConfig.ts         # Multi-profile registry & demo credentials
    ├── datasetLoader.ts      # Schema validator & JSON import/export handler
    ├── github.ts             # Client-side GitHub REST API importer
    └── siteConfig.ts         # Centralized base URL resolution & SEO constants
```

---

## Security Note

The client-side passcode gate at `/workspace` is a **demonstration presentation mechanism** designed to showcase local multi-profile switching and browser storage isolation (`localStorage`). It is **not server-enforced authentication** and does not protect confidential or private backend data.

Visitors and peer developers should **not enter sensitive passwords, private credentials, or confidential business information** into this client-side demo sandbox.

---

## Getting Started

### Prerequisites
- Node.js 18.18 or higher (Node.js 20+ recommended)
- npm (or yarn / pnpm / bun)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/THARANESHSELVAM/Personal-Portfolio-Website.git
cd Personal-Portfolio-Website
npm install
```

### Running Locally
Start the development server with Turbopack:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
- Visit [http://localhost:3000/](http://localhost:3000/) for the recruiter-ready public portfolio.
- Visit [http://localhost:3000/workspace](http://localhost:3000/workspace) for the interactive demo workspace.

---

## Testing & Quality Verification

The repository includes both TypeScript type-checking, ESLint validation, static production build generation, and automated contract tests:

### Executed & Passing Checks

1. **TypeScript Compilation**:
   ```bash
   npx tsc --noEmit
   ```
   *Result: Passed with 0 errors.*

2. **Linting Check**:
   ```bash
   npx eslint src
   ```
   *Result: Passed with 0 errors.*

3. **Production Static Build**:
   ```bash
   npm run build
   ```
   *Result: Passed with 0 errors. Prerendered static pages for `/`, `/workspace`, `/robots.txt`, `/sitemap.xml`, and OpenGraph images.*

4. **Evidence Reciprocity & JSON Import Hardening Tests**:
   ```bash
   node scratch/test-phase54-contracts.mjs
   ```
   *Result: 32/32 tests passed (validating bidirectional evidence links, JSON export/import schema hardening, and error handling).*

5. **Canonical Skills & Project Reference Integrity Tests**:
   ```bash
   node scratch/test-step45-contracts.mjs
   ```
   *Result: All contract and evidence references validated with 0 failures.*

### Additional Available Test Scripts (in `scratch/`)
The `scratch/` directory contains supplementary browser automation and verification scripts (e.g., `test-phase65-navigation.mjs`, `test-phase68-seo.mjs`, `test-phase64-print.mjs`, and `audit-viewports.mjs`) used during earlier development phases.

---

## Future Improvements

- **Backend Authentication**: Transition demo workspace from client-side localStorage to OAuth/NextAuth with secure server sessions.
- **Persistent Cloud Database**: Connect the engineering diary to a hosted PostgreSQL/Supabase database for cross-device synchronized logs.
- **Automated CI/CD Workflows**: Add GitHub Actions pipelines for automated linting, type-checking, and regression testing on pull requests.

---

## Author & Contact

**Tharanesh Selvam**<br />
Software Developer | Integrated M.Tech in Computer Science and Engineering<br />
Sri Krishna College of Engineering and Technology (2025–2030)

- **GitHub**: [https://github.com/THARANESHSELVAM](https://github.com/THARANESHSELVAM)
- **Location**: India (Open to Remote & Relocation)
- **Direct Email & LinkedIn**: Available upon request
