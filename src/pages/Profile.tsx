import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useThemeStore } from '../store/theme';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  policeStation: string;
  role: string;
  photo?: string;
}

function Profile() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    policeStation: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    axios.get(BACKEND_URL+`/api/villages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setVillages(response.data))
      .catch(error => console.error("Error fetching crime types:", error));
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(BACKEND_URL+'/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        setUserProfile(response.data);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          policeStation: response.data.policeStation || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Failed to load profile data');
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast.error(t('profile.passwordMismatch'));
        return;
      }

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        ...(formData.currentPassword && formData.newPassword ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        } : {})
      };

      const response = await axios.put(BACKEND_URL+'/api/users/profile',updateData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setUserProfile(response.data);
      toast.success(t('profile.updateSuccess'));
      setIsEditing(false);
      
      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(t('profile.updateFailed'));
    }
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-64 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className={`text-2xl font-bold leading-7 ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:truncate sm:text-3xl sm:tracking-tight`}>
        {t('profile.title')}
      </h2>
      <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
        {t('profile.subtitle')}
      </p>

      <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow rounded-lg`}>
        <div className="px-4 py-5 sm:p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('profile.firstName')}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className={`mt-1 block w-full rounded-md border-0 p-1.5 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white ring-gray-600' 
                        : 'text-gray-900 ring-gray-300'
                    } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('profile.lastName')}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className={`mt-1 block w-full rounded-md border-0 p-1.5 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white ring-gray-600' 
                        : 'text-gray-900 ring-gray-300'
                    } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('profile.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  disabled
                  className={`mt-1 block w-full rounded-md border-0 p-1.5 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-400 ring-gray-700' 
                      : 'bg-gray-100 text-gray-500 ring-gray-300'
                  } shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6`}
                />
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('profile.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`mt-1 block w-full rounded-md border-0 p-1.5 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white ring-gray-600' 
                      : 'text-gray-900 ring-gray-300'
                  } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                />
              </div>

              <div>
                <label
                  htmlFor="policeStation"
                  className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('profile.policeStation')}
                </label>
                <input
                  type="text"
                  id="policeStation"
                  value={villages.find(v => v._id === formData.policeStation)?.name}
                  disabled
                  className={`mt-1 block w-full rounded-md border-0 p-1.5 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-400 ring-gray-700' 
                      : 'bg-gray-100 text-gray-500 ring-gray-300'
                  } shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6`}
                />
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Police station can only be changed by an admin
                </p>
              </div>

              <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Change Password
                </h3>

                <div>
                  <label
                    htmlFor="currentPassword"
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('profile.currentPassword')}
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, currentPassword: e.target.value })
                    }
                    className={`mt-1 block w-full rounded-md border-0 p-1.5 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white ring-gray-600' 
                        : 'text-gray-900 ring-gray-300'
                    } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-4`}
                  >
                    {t('profile.newPassword')}
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    className={`mt-1 block w-full rounded-md border-0 p-1.5 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white ring-gray-600' 
                        : 'text-gray-900 ring-gray-300'
                    } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-4`}
                  >
                    {t('profile.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className={`mt-1 block w-full rounded-md border-0 p-1.5 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white ring-gray-600' 
                        : 'text-gray-900 ring-gray-300'
                    } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={`rounded-md border ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  } px-3 py-2 text-sm font-semibold shadow-sm`}
                >
                  {t('profile.cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  {t('profile.saveChanges')}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium leading-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('profile.accountInfo')}
                </h3>
                {userProfile && (
                  <dl className="mt-4 space-y-4">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.firstName')} {t('profile.lastName')}</dt>
                      <dd className={`mt-1 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:col-span-2 sm:mt-0`}>
                        {userProfile.firstName} {userProfile.lastName}
                      </dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.email')}</dt>
                      <dd className={`mt-1 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:col-span-2 sm:mt-0`}>
                        {userProfile.email}
                      </dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.phone')}</dt>
                      <dd className={`mt-1 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:col-span-2 sm:mt-0`}>
                        {userProfile.phone}
                      </dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.policeStation')}</dt>
                      <dd className={`mt-1 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:col-span-2 sm:mt-0`}>
                        {/* {userProfile.policeStation} */}
                        {villages.find(v => v._id === userProfile.policeStation)?.name}
                      </dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('profile.role')}</dt>
                      <dd className={`mt-1 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:col-span-2 sm:mt-0`}>
                        {userProfile.role === 'admin' ? 'Administrator' : 'Police Officer'}
                      </dd>
                    </div>
                  </dl>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  {t('profile.editProfile')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
