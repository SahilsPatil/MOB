import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  FileText,
  Users,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Database,
  ClipboardList
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store/theme';

function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const navigation = [
    { name: t('sidebar.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('sidebar.searchAccused'), href: '/search', icon: Search },
    { name: t('sidebar.newAccused'), href: '/case-form', icon: FileText, adminOnly: true },
    { name: t('sidebar.masterData'), href: '/master-data', icon: Database, adminOnly: true },
    { name: t('sidebar.userManagement'), href: '/users', icon: Users, adminOnly: true },
    { name: t('sidebar.logs'), href: '/logs', icon: ClipboardList, adminOnly: true },
    { name: t('sidebar.profile'), href: '/profile', icon: UserCircle },
    { name: t('sidebar.settings'), href: '/settings', icon: Settings },
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sidebarContent = (
    <div className={`flex grow flex-col gap-y-5 overflow-y-auto border-r ${isDarkMode ? 'border-gray-700 bg-dark-primary' : 'border-gray-200 bg-white'} px-6 pb-4`}>
      <div className="flex h-16 shrink-0 items-center">
        <img src="https://csn.mahapolice.gov.in/tempu.webp" className="h-8 w-8" alt="" />
        <span className={`ml-4 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('common.appName')}
        </span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        location.pathname === item.href
                          ? isDarkMode 
                            ? 'bg-dark-secondary text-blue-400'
                            : 'bg-gray-50 text-blue-600'
                          : isDarkMode
                            ? 'text-gray-300 hover:text-blue-400 hover:bg-dark-secondary'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <Icon
                        className={cn(
                          location.pathname === item.href
                            ? isDarkMode
                              ? 'text-blue-400'
                              : 'text-blue-600'
                            : isDarkMode
                              ? 'text-gray-400 group-hover:text-blue-400'
                              : 'text-gray-400 group-hover:text-blue-600',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <button
              onClick={() => logout()}
              className={`group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-dark-secondary hover:text-blue-400' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <LogOut
                className={`h-6 w-6 shrink-0 ${
                  isDarkMode 
                    ? 'text-gray-400 group-hover:text-blue-400' 
                    : 'text-gray-400 group-hover:text-blue-600'
                }`}
                aria-hidden="true"
              />
              {t('sidebar.logout')}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-50 lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className={`p-4 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          isMobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-600'} bg-opacity-75`} />
        <div className="fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-white dark:bg-dark-primary">
          {sidebarContent}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {sidebarContent}
      </div>
    </>
  );
}

export default Sidebar;