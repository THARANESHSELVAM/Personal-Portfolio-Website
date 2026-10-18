import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SkillsMatrix } from "@/components/SkillsMatrix";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ResumeHub } from "@/components/ResumeHub";
import { GoalRoadmap } from "@/components/GoalRoadmap";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SkillsMatrix />
        <ProjectGrid />
        <ResumeHub />
        <GoalRoadmap />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
