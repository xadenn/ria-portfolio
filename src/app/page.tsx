import LoadingScreen from "./components/LoadingScreen";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import WorkSection from "./components/WorkSection";
import AboutSection from "./components/AboutSection";
import JourneySection from "./components/JourneySection";
import ToolsSection from "./components/ToolsSection";
import AchievementsSection from "./components/AchievementsSection";
import ServicesSection from "./components/ServicesSection";
import CurvedReelSection from "./components/CurvedReelSection";
import ContactTransitionSection from "./components/ContactTransitionSection";
import ContactSection from "./components/ContactSection";
import JourneyModal from "./components/JourneyModal";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import { ToastProvider } from "./components/Toast";

export default function Home() {
  return (
    <ToastProvider>
      <SmoothScrollProvider>
        <LoadingScreen />
        <Navigation />
        <JourneyModal />

        <main id="main" className="overflow-x-clip w-full max-w-full bg-[#0C0C0C]">
          <HeroSection />

          <WorkSection />
          <AboutSection />
          <JourneySection />
          <ToolsSection />
          <AchievementsSection />
          <ServicesSection />
          <CurvedReelSection />
          <ContactTransitionSection />
          <ContactSection />
        </main>
      </SmoothScrollProvider>
    </ToastProvider>
  );
}
