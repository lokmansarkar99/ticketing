import { Suspense, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster as SoonerToaster } from "sonner";
import { Toaster } from "./components/ui/toaster";
import i18n from "./i18n";
import { cn } from "./lib/utils";
import routers from "./routers/routers";
import { appConfiguration } from "./utils/constants/common/appConfiguration";
import { loadUserFromToken } from "./utils/helpers/loadUserFromToken";
import { useFontShifter } from "./utils/hooks/useFontShifter";

function App() {
  const dispatch = useDispatch();

  //const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      await loadUserFromToken(dispatch); // Ensure the load completes before setting state
    };
    fetchUser();
  }, [dispatch]);

  return (
    <Suspense fallback="Loading.........................">
      <HelmetProvider>
        <Helmet
          htmlAttributes={{
            lang: i18n.language,
          }}
        >
          <title>{appConfiguration.appName}</title>
          <link
            rel="shortcut icon"
            href={appConfiguration.favicon}
            type="image/x-icon"
          ></link>
         <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
        </Helmet>
        <RouterProvider router={routers} />
        <Toaster />
        <SoonerToaster
          className={cn(useFontShifter())}
          position="bottom-center"
          richColors
        />
      </HelmetProvider>
    </Suspense>
  );
}

export default App;
