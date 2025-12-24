import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import CounterTodayOfflineSales from "./CounterTodayOfflineSales";
import CounterTodaysOfflineCancel from "./CounterTodaysOfflineCancel";

interface ISaleListProps {}

const OfflineSalesTab: FC<ISaleListProps> = () => {
  const { translate } = useCustomTranslator();
  return (
    <PageWrapper>
      <Tabs defaultValue="todays offline sale">
        <TabsList className="mt-6">
          <TabsTrigger value="todays offline sale">
            {translate("আজকের অফলাইন বিক্রয়", "Todays Offline Sale")}
          </TabsTrigger>
          <TabsTrigger value="Todays offline Cancel">
            {translate("আজকের অফলাইন বাতিল", "Todays Offline Cancel")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="todays offline sale">
          <CounterTodayOfflineSales />
        </TabsContent>
        <TabsContent value="Todays offline Cancel">
          <CounterTodaysOfflineCancel />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default OfflineSalesTab;
