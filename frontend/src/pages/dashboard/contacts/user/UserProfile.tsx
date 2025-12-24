import PageTransition from "@/components/common/effect/PageTransition";
import { Heading } from "@/components/common/typography/Heading";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSingleUserQuery } from "@/store/api/contact/userApi";
import { fallback } from "@/utils/constants/common/fallback";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { skipToken } from "@reduxjs/toolkit/query"; // Import skipToken
import { FC } from "react";
import { useSelector } from "react-redux";
import UpdatePassword from "./UpdatePassword";
import UpdateProfile from "./UpdateProfile";

interface IUserProfileProps {}

const UserProfile: FC<IUserProfileProps> = () => {
  const { translate } = useCustomTranslator();
  const user = useSelector((state: any) => state.user);

  const { data: userData, isLoading: userLoading } = useGetSingleUserQuery(
    user?.id ?? skipToken
  );

  return (
    <PageWrapper>
      <SectionWrapper className="flex gap-6 lg:flex-row flex-col items-start w-full my-8">
        <div className="flex flex-col items-center lg:w-3/12 md:w-1/2 w-full px-4 py-6 rounded-md bg-muted/30">
          {userLoading || !user ? (
            <Skeleton className="size-24 rounded-full" />
          ) : (
            <img
              className="size-24 rounded-full"
              src={userData?.data?.avatar || fallback.photo}
              alt={user?.role?.toLowerCase()}
            />
          )}

          {userLoading ? (
            <Skeleton className="w-10/12" typography="h3" />
          ) : (
            <Heading className="w-full text-center" size="h3">
              {formatter({
                type: "words",
                words: userData?.data?.userName,
              })}
            </Heading>
          )}

          {userLoading ? (
            <Skeleton
              className="lg:w-3/12 md:w-1/2 w-full"
              shape="pill"
              button="xs"
            />
          ) : (
            <Badge shape="pill" size="sm">
              {formatter({
                type: "words",
                words: userData?.data?.role.name,
              })}
            </Badge>
          )}
        </div>
        <div className="lg:w-9/12 w-full bg-muted/30 rounded-md">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">
                {translate("প্রোফাইল", "Profile")}
              </TabsTrigger>
              <TabsTrigger value="password">
                {translate("পাসওয়ার্ড", "Password")}
              </TabsTrigger>
            </TabsList>
            <TabsContent className="p-6" value="profile">
              <PageTransition>
                <UpdateProfile
                  userLoading={userLoading}
                  userData={userData?.data}
                />
              </PageTransition>
            </TabsContent>
            <TabsContent className="p-6" value="password">
              <PageTransition>
                <UpdatePassword />
              </PageTransition>
            </TabsContent>
          </Tabs>
        </div>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default UserProfile;
