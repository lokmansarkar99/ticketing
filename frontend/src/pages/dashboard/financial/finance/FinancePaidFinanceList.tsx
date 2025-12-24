import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import FinanceList from "./FinanceList";
import PaidFinanceList from "./PaidFinanceList";

interface IFinancePaidFinanceListProps {}

const FinancePaidFinanceList: FC<IFinancePaidFinanceListProps> = () => {
  const { translate } = useCustomTranslator();
  return (
    <PageWrapper>
      <Tabs defaultValue="finance">
        <TabsList className="mt-6">
          <TabsTrigger value="finance">
            {translate("ফাইন্যান্স", "Finance")}
          </TabsTrigger>
          <TabsTrigger value="paid_finance">
            {translate("পেইড ফাইন্যান্স", "Paid Finance")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="finance">
          <FinanceList />
        </TabsContent>
        <TabsContent value="paid_finance">
          <PaidFinanceList />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default FinancePaidFinanceList;
