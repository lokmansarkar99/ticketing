import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import PermissionList from "./PermissionList";
import PermissionTypeList from "./PermissionTypeList";

interface IPermissionTypeAndUserPermissionListProps {}

const PermissionTypeAndUserPermissionList: FC<
  IPermissionTypeAndUserPermissionListProps
> = () => {
  const { translate } = useCustomTranslator();
  return (
    <PageWrapper>
      <Tabs defaultValue="permission type">
        <TabsList className="mt-6">
          <TabsTrigger value="permission type">
            {translate("অনুমতি ধরন", "Permission Type")}
          </TabsTrigger>
          <TabsTrigger value="user permission list">
            {translate("ব্যবহারকারী অনুমতি তালিকা", "User Permission List")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="permission type">
          <PermissionTypeList />
        </TabsContent>
        <TabsContent value="user permission list">
          <PermissionList />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default PermissionTypeAndUserPermissionList;
