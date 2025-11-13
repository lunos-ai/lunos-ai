import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
            Lunos AI
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-jetbrains-mono">
            Thanks for using Lunos AI
          </p>
        </div>

        <div className="bg-white dark:bg-[#262626] rounded-xl shadow-xl dark:shadow-none dark:ring-1 dark:ring-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center font-jetbrains-mono">
            Sign Out
          </h2>

          <div className="text-center space-y-6">
            <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
              Are you sure you want to sign out?
            </p>

            <button
              onClick={handleSignOut}
              className="w-full bg-[#F59E0B] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:ring-offset-2 transition-colors"
            >
              Sign Out
            </button>

            <a
              href="/dashboard"
              className="block w-full text-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
