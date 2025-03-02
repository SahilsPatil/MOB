import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store/theme';

interface Settings {
  notifications: boolean;
  emailAlerts: boolean;
  darkMode: boolean;
  language: string;
}

function Settings() {
  const { t, i18n } = useTranslation();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    emailAlerts: true,
    darkMode: isDarkMode,
    language: i18n.language || 'en',
  });

  useEffect(() => {
    // Update language setting when i18n language changes
    setSettings(prev => ({
      ...prev,
      language: i18n.language,
      darkMode: isDarkMode
    }));
  }, [i18n.language, isDarkMode]);

  const handleSave = async () => {
    try {
      // Change language if it's different from current
      if (settings.language !== i18n.language) {
        i18n.changeLanguage(settings.language);
        localStorage.setItem('i18nextLng', settings.language);
      }
      
      // Toggle dark mode if it's different from current
      if (settings.darkMode !== isDarkMode) {
        toggleDarkMode();
      }
      
      // TODO: Implement save other settings API call
      toast.success(t('settings.saveSuccess'));
    } catch (error) {
      toast.error(t('settings.saveFailed'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className={`text-2xl font-bold leading-7 ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:truncate sm:text-3xl sm:tracking-tight`}>
        {t('settings.title')}
      </h2>
      <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
        {t('settings.subtitle')}
      </p>

      <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow rounded-lg`}>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium leading-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('settings.notifications')}
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="notifications"
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: e.target.checked,
                      })
                    }
                    className={`h-4 w-4 rounded border-gray-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''} text-blue-600 focus:ring-blue-500`}
                  />
                  <label
                    htmlFor="notifications"
                    className={`ml-3 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('settings.enablePush')}
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
                    className={`h-4 w-4 rounded border-gray-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''} text-blue-600 focus:ring-blue-500`}
                  />
                  <label
                    htmlFor="emailAlerts"
                    className={`ml-3 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('settings.enableEmail')}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium leading-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('settings.appearance')}
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
                    className={`h-4 w-4 rounded border-gray-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''} text-blue-600 focus:ring-blue-500`}
                  />
                  <label
                    htmlFor="darkMode"
                    className={`ml-3 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('settings.darkMode')}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-medium leading-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('settings.language')}
              </h3>
              <div className="mt-4">
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className={`mt-1 block w-full rounded-md border-0 p-1.5 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white ring-gray-600' 
                      : 'text-gray-900 ring-gray-300'
                  } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                >
                  <option value="en">{t('language.english')}</option>
                  <option value="mr">{t('language.marathi')}</option>
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
              {t('settings.saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;