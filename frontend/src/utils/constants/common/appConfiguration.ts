interface IConfigurationProps {
  appName: string;
  appCode: string;
  baseUrl: string;
  databaseResetAPI: string;
  favicon: string;
  logo: string;
  progressMessage: string;
  version: string;
}

const version = "V1.0.0";

//////////// BETA VERSION ////////////

export const appConfiguration: IConfigurationProps = {
  appName: "Iconic Express",
  appCode: "__t_beta__",
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  // baseUrl:"https://iconify-backend.vercel.app/api/v1/",
  databaseResetAPI:
    "https://pos-software-with-my-sql-kry-test.vercel.app/api/v1/admin/db-reset-tebd2024",
  favicon: "/iconic.png",
  logo: "/longeng.png",
  version,
  progressMessage:
    "Thank you for your interest! 🚀 We're currently working on implementing this feature. Stay tuned, as we'll be activating it very soon!",
};
