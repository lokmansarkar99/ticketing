import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { counterNavigationLinks } from "@/utils/constants/common/counter/counterNavigationLinks";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { ChevronDown, ChevronRight, Package2, PanelLeft } from "lucide-react";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ISubAdminDashboardSidebarSmallDevicesProps {}

const SubAdminDashboardSidebarSmallDevices: FC<
  ISubAdminDashboardSidebarSmallDevicesProps
> = () => {
  const { locale } = useLocaleContext();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login", { replace: true });
    setIsSidebarOpen(false);
    window.location.reload();
  };

  const toggleMenu = (key: string) => {
    setActiveMenu(activeMenu === key ? null : key);
  };

  const handleNavigation = (path: string) => {
    setIsSidebarOpen(false); // Close sidebar
    navigate(path); // Navigate to route
  };

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden mr-4">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="flex flex-col gap-4 text-lg font-medium">
          {/* Brand Logo */}
          <Link
            to="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>

          {/* Navigation Links */}
          {counterNavigationLinks.length > 0 &&
            counterNavigationLinks.map((singleLink, linkIndex) => (
              <div key={linkIndex} className="flex flex-col">
                {/* Main Navigation */}
                <Button
                  variant="outline"
                  size="default"
                  className="justify-between items-center"
                  onClick={() => toggleMenu(singleLink.key)}
                >
                  <span>
                    {locale === "bn"
                      ? singleLink?.label?.bn
                      : singleLink?.label?.en}
                  </span>
                  {activeMenu === singleLink.key ? (
                    <ChevronDown className="h-5 w-5 transition-transform" />
                  ) : (
                    <ChevronRight className="h-5 w-5 transition-transform" />
                  )}
                </Button>

                {/* Sub-Navigation */}
                {activeMenu === singleLink.key && singleLink.subLinks && (
                  <div className="pl-4 mt-2 flex flex-col gap-2">
                    {singleLink.subLinks.map((subLink, subIndex) => (
                      <button
                        key={subIndex}
                        className="text-base text-muted-foreground hover:text-primary px-2 py-1 border rounded-md text-left"
                        onClick={() => handleNavigation(subLink.href || "#")}
                      >
                        {locale === "bn"
                          ? subLink?.label?.bn
                          : subLink?.label?.en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

          {/* Logout Button */}
          <Button
            variant="destructive"
            size="default"
            className="mt-auto justify-start"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SubAdminDashboardSidebarSmallDevices;
