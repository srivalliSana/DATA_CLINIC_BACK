import React, { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  PencilIcon,
  Cog6ToothIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import EditProfileOverlay from "../components/auth/EditProfileOverlay.jsx";
import ChangePasswordOverlay from "../components/auth/ChangePasswordOverlay.jsx";
import AccountSettingsOverlay from "../components/auth/AccountSettingsOverlay.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-tr from-[#E8F5E9] to-[#C8E6C9] dark:from-[#121212] dark:to-[#1E1E1E] transition-colors">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "url(https://www.transparenttextures.com/patterns/cubes.png)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Profile Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-[#2563EB] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <UserIcon className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-neutral-800 dark:text-white">
            My Profile
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
              Account Information
            </h2>
            <button
              onClick={() => setEditProfileOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                <UserIcon className="w-4 h-4" />
                Full Name
              </label>
              <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <p className="text-neutral-800 dark:text-white font-medium">{user.name}</p>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                <EnvelopeIcon className="w-4 h-4" />
                Email Address
              </label>
              <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <p className="text-neutral-800 dark:text-white font-medium">{user.email}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                <CalendarIcon className="w-4 h-4" />
                Member Since
              </label>
              <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <p className="text-neutral-800 dark:text-white font-medium">
                  {user.createdAt ? formatDate(user.createdAt) : "Recently joined"}
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                Account Status
              </label>
              <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-neutral-800 dark:text-white font-medium">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setChangePasswordOpen(true)}
              className="p-4 text-left border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <LockClosedIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <div>
                  <h3 className="font-semibold text-neutral-800 dark:text-white mb-1">
                    Change Password
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Update your account password
                  </p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-4 text-left border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <Cog6ToothIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <div>
                  <h3 className="font-semibold text-neutral-800 dark:text-white mb-1">
                    Account Settings
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Manage your preferences
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Overlays */}
      <EditProfileOverlay
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        currentUser={user}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />
      <ChangePasswordOverlay
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      <AccountSettingsOverlay
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
