import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../store/theme";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Language Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg ${
          isDarkMode 
            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } px-3 py-2 text-sm font-medium transition`}
      >
        🌐 {i18n.language === "en" ? t("language.english") : t("language.marathi")}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute left-0 mt-2 w-32 ${
          isDarkMode 
            ? 'bg-dark-secondary shadow-lg border border-gray-700' 
            : 'bg-white shadow-lg border border-gray-200'
        } rounded-lg z-50`}>
          <button
            onClick={() => changeLanguage("en")}
            className={`block w-full px-4 py-2 text-left text-sm ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-200' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {t("language.english")}
          </button>
          <button
            onClick={() => changeLanguage("mr")}
            className={`block w-full px-4 py-2 text-left text-sm ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-200' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {t("language.marathi")}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;