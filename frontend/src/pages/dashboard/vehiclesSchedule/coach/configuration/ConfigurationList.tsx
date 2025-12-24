
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";
import { LuClipboardCopy, LuClipboardPaste } from "react-icons/lu";
import CoachConfigurationList from "./CoachConfigurationList";
import UpdateCoachConfigurationList from "./UpdateCoachConfigurationList";

interface IConfigurationListProps {}

const ConfigurationList: FC<IConfigurationListProps> = () => {
  return (
    <section className="mt-2">
      <Tabs defaultValue="config_list" className="my-2">
        <TabsList className="border">
          <TabsTrigger value="config_list" className="font-bold">
            <LuClipboardCopy className="button-icon-size mr-1" />Coach Config List
          </TabsTrigger>
          <TabsTrigger value="update_config_list" className="font-bold">
            {" "}
            <LuClipboardPaste className="button-icon-size mr-1" />Board
          </TabsTrigger>
        </TabsList>
        {/* CONFIG LIST CONTAINER  */}
        <TabsContent className="" value="config_list">
          <CoachConfigurationList />
        </TabsContent>
        {/* UPATE CONFIG LIST CONTAINER */}
        <TabsContent className="" value="update_config_list">
          <UpdateCoachConfigurationList />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ConfigurationList;
