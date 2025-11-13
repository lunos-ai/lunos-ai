import { MessageSquare, Settings, X, LogOut } from "lucide-react";

export function Sidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  user,
}) {
  const menuItems = [
    { id: "chat", label: "Ask Lunos", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSignOut = () => {
    window.location.href = "/account/logout";
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white font-jetbrains-mono">
              Lunos AI
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white font-jetbrains-mono">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400 font-jetbrains-mono">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors font-jetbrains-mono ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black"
                      : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Sign Out */}
          <div className="p-6 border-t border-gray-800">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors font-jetbrains-mono"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
