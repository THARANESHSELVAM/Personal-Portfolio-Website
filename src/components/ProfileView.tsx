"use client";

import { HomeView } from "./HomeView";
import { SkillsView } from "./SkillsView";

interface ProfileViewProps {
  initialSection?: string;
}

/**
 * Backward compatibility wrapper for ProfileView
 * Routes to SkillsView if initialSection === "skills", otherwise HomeView.
 */
export function ProfileView({ initialSection }: ProfileViewProps) {
  if (initialSection === "skills") {
    return <SkillsView />;
  }
  return <HomeView />;
}

export default ProfileView;
