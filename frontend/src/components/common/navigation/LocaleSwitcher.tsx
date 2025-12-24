import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18n from "@/i18n";
import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";

const LocaleSwitcher = () => {
  const { locale } = useLocaleContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="uppercase">
          {locale}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn(useFontShifter())}>
        <DropdownMenuItem
          className={cn(
            locale === "bn" && "bg-accent text-accent-foreground font-lato",
            "cursor-pointer font-anek"
          )}
          onClick={() => i18n.changeLanguage("bn")}
        >
          বাংলা
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            locale === "en" && "bg-accent text-accent-foreground font-open_sans",
            "cursor-pointer"
          )}
          onClick={() => i18n.changeLanguage("en")}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
