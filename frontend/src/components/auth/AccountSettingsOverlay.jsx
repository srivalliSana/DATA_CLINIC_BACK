import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AccountSettingsOverlay({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    dataPrivacy: false,
  });

  const handleToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleSave = () => {
    // In a real app, save to backend
    alert("Settings saved! (This is a placeholder)");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
            Account Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800 dark:text-white">
                Email Notifications
              </h3>
              <p className="text-sm text-neutral-500">
                Receive updates about your account
              </p>
            </div>
            <button
              onClick={() => handleToggle("emailNotifications")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? "bg-[#2563EB]" : "bg-neutral-300 dark:bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-800 dark:text-white">
                Data Privacy
              </h3>
              <p className="text-sm text-neutral-500">
                Enhanced privacy for your data
              </p>
            </div>
            <button
              onClick={() => handleToggle("dataPrivacy")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dataPrivacy ? "bg-[#2563EB]" : "bg-neutral-300 dark:bg-neutral-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dataPrivacy ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <strong>Note:</strong> This is a placeholder for account settings.
            Additional preferences can be added here in the future.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
