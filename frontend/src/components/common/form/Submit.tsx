import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getPropertyValues } from "@/utils/helpers/getPropertyValues";
import { fallback } from "@/utils/constants/common/fallback";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { Loader } from "../Loader";
import formatter from "@/utils/helpers/formatter";
import PageTransition from "../effect/PageTransition";

interface ISubmitErrorWrapperProps {
  errors: any;
  loading: boolean;
  className?: string;
  submitTitle?: string;
  icon?: ReactNode;
  errorTitle: string;
  direction?: "horizontal" | "vertical";
}

const Submit: FC<ISubmitErrorWrapperProps> = ({
  errors: error,
  loading,
  className,
  submitTitle,
  errorTitle,
  direction = "horizontal",
  icon
}) => {
  const { translate } = useCustomTranslator();
  
  const getErrorMessage = () => {
    if (!error) return null;

    // Handle API validation error structure
    if (error?.data?.errorMessage?.body?.length > 0) {
      const firstError = error.data.errorMessage.body[0];
      if (firstError.message) {
        return firstError.message;
      }
    }

    // Handle simple error message
    if (error?.data?.message) {
      const msg = error.data.message.toLowerCase();
      if (msg === "not found") {
        return translate(fallback.error.bn, fallback.error.en);
      }
      if (msg === "validation failed") {
        return translate("যাচাইকরণ ব্যর্থ হয়েছে।", "Validation failed");
      }
      return formatter({
        type: "sentences",
        sentences: error.data.message,
      }) || translate(fallback.error.bn, fallback.error.en);
    }

    // Fallback to checking for message property at root
    const messages = getPropertyValues<string>(error, "message");
    if (messages.length > 0) {
      return messages[0] || translate(fallback.error.bn, fallback.error.en);
    }

    return translate(fallback.error.bn, fallback.error.en);
  };

  return (
    <div
      className={cn(
        "flex justify-between items-center mt-6 w-full",
        className,
        direction === "vertical" && "flex-col"
      )}
    >
      <div
        className={cn(
          "flex justify-start w-full md:max-w-[300px]",
          direction === "vertical" && "justify-center"
        )}
      >
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription className="text-white">
              {getErrorMessage()}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex justify-end w-1/2">
        <PageTransition>
          <Button
            className="duration-1000 transition-all bg-secondary hover:bg-secondary-500"
            disabled={loading}
            type="submit"
          >
            {loading && <Loader />}
            {submitTitle}
            {icon}
          </Button>
        </PageTransition>
      </div>
    </div>
  );
};

export default Submit;