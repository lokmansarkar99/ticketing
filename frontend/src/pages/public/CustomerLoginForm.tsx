import { useState } from "react";
import CustomerAuthForm from "./CustomerAuthForm";

const CustomerLoginForm = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginMethod, setLoginMethod] = useState<"phone" | "password">("phone");

  return (
    <div className="mt-20">
      <div className="border border-gray-200 shadow-md rounded-md  bg-white dark:bg-background max-w-4xl mx-auto">
        <div className="mt-2">
          {/* Tab Header */}
          <div className="flex bg-white dark:bg-gray-900 w-5/6 lg:w-2/6 mx-auto mb-2 border-[#c004d4] border">
            <button
              className={`flex-1 py-2 text-center font-medium transition-colors  ${
                activeTab === "login"
                  ? "bg-[#c004d4] text-white"
                  : "text-gray-600"
              }`}
              onClick={() => {
                setActiveTab("login");
                setLoginMethod("phone");
              }}
            >
              SignIn
            </button>
            <button
              className={`flex-1 py-2 text-center font-medium transition-colors  ${
                activeTab === "register"
                  ? "bg-[#c004d4] text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("register")}
            >
              SignUp
            </button>
          </div>
        </div>
        <div className="lg:mt-5">
          <CustomerAuthForm
            activeTab={activeTab}
            loginMethod={loginMethod}
            setActiveTab={setActiveTab}
            setLoginMethod={setLoginMethod}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginForm;
