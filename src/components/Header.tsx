import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import LanguageSwitcher from './LanguageSwitcher';
import { useThemeStore } from '../store/theme';

function Header() {
  const user = useAuthStore((state) => state.user);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <header className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b ${isDarkMode ? 'border-gray-700 bg-dark-primary' : 'border-gray-200 bg-white'} px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8`}>
      <div className="flex flex-1 gap-x-4 self-stretch items-center justify-end">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Styled Language Switcher */}
          <LanguageSwitcher />
          
          {/* Notifications */}
          <button
            type="button"
            className={`-m-2.5 p-2.5 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`}
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Divider */}
          <div
            className={`hidden lg:block lg:h-6 lg:w-px ${isDarkMode ? 'lg:bg-gray-700' : 'lg:bg-gray-200'}`}
            aria-hidden="true"
          />

          {/* User Profile */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="flex items-center gap-2">
              <User className={`h-8 w-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1`} />
              <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.username}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;