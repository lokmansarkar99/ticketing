import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { useTheme } from "@/utils/hooks/useThemeContext";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { translate } = useCustomTranslator();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className=" rotate-0 size-[21px] scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-[21px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn(useFontShifter())}>
        <DropdownMenuItem
          className={cn(
            theme === "light" && "bg-accent text-accent-foreground"
          )}
          onClick={() => setTheme("light")}
        >
          {translate("লাইট", "Light")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(theme === "dark" && "bg-accent text-accent-foreground")}
          onClick={() => setTheme("dark")}
        >
          {translate("ডার্ক", "Dark")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            theme === "system" && "bg-accent text-accent-foreground"
          )}
          onClick={() => setTheme("system")}
        >
          {translate("সিস্টেম", "System")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
