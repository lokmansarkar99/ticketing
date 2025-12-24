import { ReactNode, FC } from "react";
import { cn } from "@/lib/utils";
import { Heading } from "../typography/Heading";
import SectionWrapper from "./SectionWrapper";
import { Paragraph } from "../typography/Paragraph";
interface IFormWrapperProps {
  children: ReactNode;
  className?: string;
  heading: string;
  subHeading?: string;
  isInModal?: boolean;
}
const FormWrapper: FC<IFormWrapperProps> = ({
  children,
  className,
  heading,
  subHeading,
}) => {
  return (
    <SectionWrapper className="w-full my-0 max-w-full overflow-y-auto">
      <Heading position="start" size="h4">
        {heading}
      </Heading>
      {subHeading && <Paragraph size="sm">{subHeading}</Paragraph>}

      <div className={cn("w-full my-4", className)}>{children}</div>
    </SectionWrapper>
  );
};

export default FormWrapper;