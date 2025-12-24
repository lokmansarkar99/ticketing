import BottomNav from "@/components/common/navigation/BottomNav";
import PublicNavigation from "@/components/common/navigation/PublicNavigation";
import PublicNavigationTop from "@/components/common/navigation/PublicNavigationTop";
import Footer from "@/components/shared/FooterComponent";
import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { FC } from "react";
import { Outlet } from "react-router-dom";

interface IPublicLayoutProps {}

const PublicLayout: FC<IPublicLayoutProps> = () => {
  return (
    <main className={cn("bg-background text-foreground ", useFontShifter())}>
      <PublicNavigationTop />
      <PublicNavigation />
      <div className="block lg:hidden">
        <BottomNav />
      </div>

      <section className="mt-5 md:mt-10 min-h-screen">
        <Outlet />
      </section>

      <div>
        <Footer />
      </div>
    </main>
  );
};

export default PublicLayout;
