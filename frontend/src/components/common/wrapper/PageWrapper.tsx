import { FC } from "react";
import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import PageTransition from "../effect/PageTransition";
interface IPageWrapperProps {
  children: any;
  className?: string;
}
const PageWrapper: FC<IPageWrapperProps> = ({ children, className }) => {
  return (
    <section className={cn(useFontShifter(), className, "w-full")}>
      <PageTransition variant="fade">{children}</PageTransition>
    </section>
  );
};

export default PageWrapper;
