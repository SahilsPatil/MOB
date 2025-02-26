import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Settings {
  notifications: boolean;
  emailAlerts: boolean;
  darkMode: boolean;
  language: string;
}

function Settings() {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'en',
  });

  const handleSave = async () => {
    try {
      // TODO: Implement save settings API call
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Settings
      </h2>
      <p className="mt-2 text-sm text-gray-500 mb-6">
        Manage your application preferences
      </p>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Notifications
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                {/* <div className=" flex items-center"> */}

                <label
                  htmlFor="notifications"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Enable push notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="emailAlerts"
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailAlerts: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="emailAlerts"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Enable email alerts
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Appearance
            </h3>
            <div className="mt-4">
              <div className="flex items-center">
                <input
                  id="darkMode"
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) =>
                    setSettings({ ...settings, darkMode: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="darkMode"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Dark mode
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Language
            </h3>
            <div className="mt-4">
              <select
                id="language"
                value={settings.language}
                onChange={(e) =>
                  setSettings({ ...settings, language: e.target.value })
                }
                className="mt-1 shadow-sm ring-1 ring-inset ring-gray-300 p-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
    </div >
  );
}

export default Settings;