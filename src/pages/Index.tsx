import { PublicHeader } from "@/components/hayy/PublicHeader";
import { Hero } from "@/components/hayy/Hero";
import { ProblemSolution } from "@/components/hayy/ProblemSolution";
import { HowItWorks } from "@/components/hayy/HowItWorks";
import { UpcomingRooms } from "@/components/hayy/UpcomingRooms";
import { ForHosts } from "@/components/hayy/ForHosts";
import { ForRecruiters } from "@/components/hayy/ForRecruiters";
import { JoinSection } from "@/components/hayy/JoinSection";
import { Footer } from "@/components/hayy/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <UpcomingRooms />
        <ForHosts />
        <ForRecruiters />
        <JoinSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
