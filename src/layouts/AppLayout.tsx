import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/hayy/AppSidebar";

export const AppLayout = () => {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar mobileOpen={sidebarOpen} onMobileOpenChange={setSidebarOpen} />
      </div>

      {/* Main content — on mobile pages fill full height and manage their own chrome */}
      <main className="flex-1 min-w-0 overflow-hidden">
        {/* Mobile: bare full-height container — AppScreen/DrillScreen handle headers + tab bar */}
        <div className="lg:hidden h-full">
          <Outlet />
        </div>

        {/* Desktop: standard padded scroll area */}
        <div className="hidden lg:block h-full overflow-auto">
          <div className="w-full max-w-6xl mx-auto px-8 py-12">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
