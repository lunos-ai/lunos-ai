import { useState, useEffect } from "react";
import { Trash2, Save } from "lucide-react";

export function SettingsPanel({ user }) {
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [preferences, setPreferences] = useState({
    subjects: [],
    planType: "orbit",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/preferences");
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences || { subjects: [], planType: "orbit" });
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveMessage("");

    // Validate password if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      setSaveMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setSaveMessage("Account updated successfully!");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        throw new Error("Failed to update account");
      }
    } catch (error) {
      console.error("Update error:", error);
      setSaveMessage("Failed to update account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white font-jetbrains-mono">
            Settings
          </h1>
          <p className="text-gray-400 mt-2 font-jetbrains-mono">
            Manage your account and preferences
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 font-jetbrains-mono">
            Account Information
          </h2>

          <form onSubmit={handleAccountUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-jetbrains-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-jetbrains-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-jetbrains-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  disabled={!formData.password}
                  className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] disabled:opacity-50 font-jetbrains-mono"
                />
              </div>
            </div>

            {saveMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  saveMessage.includes("successfully")
                    ? "bg-green-500/10 border border-green-500/50 text-green-400"
                    : "bg-red-500/10 border border-red-500/50 text-red-400"
                }`}
              >
                {saveMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-jetbrains-mono"
            >
              <Save size={16} />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </form>
        </div>

        {/* Study Preferences */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 font-jetbrains-mono">
            Study Preferences
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selected Subjects
              </label>
              <div className="flex flex-wrap gap-2">
                {preferences.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black rounded-full text-sm font-jetbrains-mono"
                  >
                    {subject.subject} • {subject.examBoard.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Plan
              </label>
              <div className="px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white font-jetbrains-mono">
                    {preferences.planType === "orbit"
                      ? "Orbit (Free)"
                      : preferences.planType === "nova_monthly"
                        ? "Nova (Monthly)"
                        : "Nova (Yearly)"}
                  </span>
                  <span className="text-sm text-gray-400 font-jetbrains-mono">
                    {preferences.planType === "orbit"
                      ? "3 messages/day"
                      : "Unlimited"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/onboarding")}
              className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 text-gray-300 rounded-lg hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-jetbrains-mono"
            >
              Update Preferences
            </button>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 font-jetbrains-mono">
            Subscription
          </h2>

          <div className="p-4 bg-[#2A2A2A] border border-gray-700 rounded-lg">
            <p className="text-sm text-gray-400 font-jetbrains-mono">
              Subscription management will be available soon. You can change
              your plan in the preferences for now.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#1A1A1A] border border-red-500/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-6 font-jetbrains-mono">
            Danger Zone
          </h2>

          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-jetbrains-mono">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-jetbrains-mono"
            >
              <Trash2 size={16} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
