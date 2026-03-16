import { CodeEditor } from "@/components/code-editor";
import { HeroSection } from "@/components/home/hero-section";
import { ActionsBar } from "@/components/home/actions-bar";
import { FooterStats } from "@/components/home/footer-stats";
import { LeaderboardPreview } from "@/components/home/leaderboard-preview";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-14rem)] w-full flex-col items-center px-10 pt-20">
      <div className="flex flex-col items-center gap-8">
        <HeroSection />
      <CodeEditor  showLanguageSelector editable />
        <ActionsBar />
        <div className="h-15 w-full" />
        <LeaderboardPreview />
        <div className="h-15 w-full" />
      </div>
      <FooterStats />
    </main>
  );
}
