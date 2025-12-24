import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Tabs, TabsContent, 
  // TabsList, 
  // TabsTrigger 
} from "@/components/ui/tabs";
// import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
// import RolePermissionList from "./RolePermissionList";
import UserRoleList from "./UserRoleList";

interface IRoleProps {}

const Role: FC<IRoleProps> = () => {
  // const { translate } = useCustomTranslator();
  return (
    <PageWrapper>
      <Tabs defaultValue="user role list">
        {/* <TabsList className="mt-6">
          <TabsTrigger value="user role list">
            {translate("ব্যবহারকারী ভূমিকা ধরন", "user role list")}
          </TabsTrigger>
          <TabsTrigger value="User Role Permission List">
            {translate(
              "ব্যবহারকারী ভূমিকা অনুমতি তালিকা",
              "User Role Permission List"
            )}
          </TabsTrigger>
        </TabsList> */}
        <TabsContent value="user role list">
          <UserRoleList />
        </TabsContent>
        {/* <TabsContent value="User Role Permission List">
          <RolePermissionList />
        </TabsContent> */}
      </Tabs>
    </PageWrapper>
  );
};

export default Role;
