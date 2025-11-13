import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { Sidebar } from "../../components/Dashboard/Sidebar";
import { ChatInterface } from "../../components/Dashboard/ChatInterface";
import { SettingsPanel } from "../../components/Dashboard/SettingsPanel";

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
      return;
    }

    // Check if user has completed onboarding
    if (user && !user.onboarding_completed) {
      window.location.href = "/onboarding";
      return;
    }
  }, [user, userLoading]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-gray-400 font-jetbrains-mono">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="h-screen flex flex-col">
          {/* Mobile header */}
          <div className="lg:hidden bg-white dark:bg-[#262626] border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
              Lunos AI
            </h1>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "chat" && <ChatInterface user={user} />}
            {activeTab === "settings" && <SettingsPanel user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
