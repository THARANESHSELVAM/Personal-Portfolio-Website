import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LearningLog } from "@/components/LearningLog";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ResumeHub } from "@/components/ResumeHub";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LearningLog />
        <ProjectGrid />
        <ResumeHub />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
