import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuthStore } from '../store/auth';

function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch items-center justify-end">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="flex items-center gap-2">
              <User className="h-8 w-8 rounded-full bg-gray-100 p-1" />
              <div className="text-sm font-semibold">{user?.username}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;