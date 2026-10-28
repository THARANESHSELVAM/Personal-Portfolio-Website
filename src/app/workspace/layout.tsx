import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo Workspace | Tharanesh Selvam",
  description: "Interactive demo engineering workspace, milestone diary logger, and dynamic profile sandbox.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
