import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { FC, ReactNode } from "react";
interface ISectionWrapperProps {
  children: ReactNode;
  className?: string;
}
const SectionWrapper: FC<ISectionWrapperProps> = ({ children, className }) => {
  return (
    <section
      className={cn(
        "max-w-[1300px] mx-auto flex flex-col items-center my-[150px]",
        className,
        useFontShifter()
      )}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
