import { FC, ReactNode } from "react";
import { Paragraph } from "./Paragraph";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { fallback } from "@/utils/constants/common/fallback";
import { cn } from "@/lib/utils";
import formatter from "@/utils/helpers/formatter";
import { Label } from "./Label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LuArrowUpRight } from "react-icons/lu";

interface ILabelDescriptionProps {
  info?: {
    component: ReactNode;
    size: "sm" | "md" | "lg" | "xl";
  };
  heading: string;
  paragraph: string;
  className?: string;
}

const LabelDescription: FC<ILabelDescriptionProps> = ({
  heading,
  paragraph,
  className,
  info,
}) => {
  const { translate } = useCustomTranslator();
  return (
    <>
      {/* <div
      className={cn(
        className,
        "space-y-2 border-t border-border/50 relative my-3"
      )}
    >
      <Label
        size="sm"
        className="bg-background absolute left-0 -top-[17.5px] border border-border/50  px-2 rounded-md leading-8"
      >
        {formatter({ type: "words", words: heading }) ||
          translate(fallback.notFound.bn, fallback.notFound.en)}
      </Label>
      {info?.component && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-background absolute right-0 -top-[25.5px] border border-border/50 size-[34px] rounded-md leading-8"
              size="icon"
            >
              <LuArrowUpRight />
            </Button>
          </DialogTrigger>
          <DialogContent size={info?.size}>
            <DialogTitle className="sr-only">empty</DialogTitle>
            {info?.component}
          </DialogContent>
        </Dialog>
      )}
      <Paragraph className="pt-4" size="sm">
        {paragraph || translate(fallback.notFound.bn, fallback.notFound.en)}
      </Paragraph>
    </div> */}

      <div
        className={cn(
          className,
          "relative my-1 rounded-lg border border-border/50 bg-background/60 px-2 py-2 flex flex-col gap-2"
        )}
      >
        {/* Top row: Heading + Info Button */}
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground/90">
            {formatter({ type: "words", words: heading }) ||
              translate(fallback.notFound.bn, fallback.notFound.en)}
          </Label>

          {info?.component && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-md border border-border/40 hover:bg-accent/70 transition"
                >
                  <LuArrowUpRight className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent size={info?.size} className="rounded-xl shadow-xl">
                <DialogTitle className="sr-only">Details</DialogTitle>
                {info?.component}
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Paragraph */}
        <Paragraph className="text-xs text-muted-foreground leading-relaxed">
          {paragraph || translate(fallback.notFound.bn, fallback.notFound.en)}
        </Paragraph>
      </div>


    </>
  );
};

export default LabelDescription;
