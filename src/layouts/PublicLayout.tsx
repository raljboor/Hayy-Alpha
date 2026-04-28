import { Outlet } from "react-router-dom";
import { PublicHeader } from "@/components/hayy/PublicHeader";
import { Footer } from "@/components/hayy/Footer";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
