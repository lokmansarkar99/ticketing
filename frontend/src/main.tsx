import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LocaleProvider } from "./context/LocaleContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { Provider } from "react-redux";
import { appConfiguration } from "./utils/constants/common/appConfiguration.ts";
import { store } from "./store/store.ts";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocaleProvider>
      <ThemeProvider
        defaultTheme="light"
        storageKey={`${appConfiguration.appCode}theme`}
      >
        <Provider store={store}>
          <AppProvider>
            <App />
          </AppProvider>
        </Provider>
      </ThemeProvider>
    </LocaleProvider>
  </React.StrictMode>
);
