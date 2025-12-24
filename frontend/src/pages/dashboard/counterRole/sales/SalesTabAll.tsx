import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import CounterTodaysCancel from "./CounterTodaysCancel";
import CounterTodaysSale from "./CounterTodaysSale";

interface ISaleListProps {}

const SalesTabAll: FC<ISaleListProps> = () => {
  const { translate } = useCustomTranslator();
  return (
    <PageWrapper>
      <Tabs defaultValue="todays sale">
        <TabsList className="mt-6">
          <TabsTrigger value="todays sale">
            {translate("আজকের বিক্রয়", "Todays Sale")}
          </TabsTrigger>
          <TabsTrigger value="Todays Cancel">
            {translate("আজকের বাতিল", "Todays Cancel")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="todays sale">
          <CounterTodaysSale />
        </TabsContent>
        <TabsContent value="Todays Cancel">
          <CounterTodaysCancel />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default SalesTabAll;
