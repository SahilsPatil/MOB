import React, { useEffect, useState } from 'react';
import { UserPlus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { sampleUsers } from '../data/sampleData';
import { useTranslation } from 'react-i18next';
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  policeStation: string;
  role: 'admin' | 'police';
  photo: string;
}

function UserManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    policeStation: '',
    password: '',
    role: 'police' as 'admin' | 'police',
    photo: null as File | null
  });
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    axios.get(BACKEND_URL+`/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching divisions:", error));

    axios.get(BACKEND_URL+`/api/villages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setVillages(response.data))
      .catch(error => console.error("Error fetching crime types:", error));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, photo: null });
    setPreviewImage(null);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     // For demo purposes, simulate API call
  //     if (editingUser) {
  //       // Update existing user
  //       const updatedUser = {
  //         ...editingUser,
  //         firstName: formData.firstName,
  //         lastName: formData.lastName,
  //         email: formData.email,
  //         phone: formData.phone,
  //         policeStation: formData.policeStation,
  //         role: formData.role,
  //         photo: previewImage || editingUser.photo
  //       };

  //       setUsers(users.map(user => user._id === editingUser._id ? updatedUser : user));
  //       toast.success(t('userManagement.updateSuccess'));
  //     } else {
  //       // Add new user
  //       const newUser = {
  //         firstName: formData.firstName,
  //         lastName: formData.lastName,
  //         email: formData.email,
  //         phone: formData.phone,
  //         policeStation: formData.policeStation,
  //         role: formData.role,
  //         photo: previewImage || 'https://picsum.photos/200/200?random=new'
  //       };

  //       setUsers([...users, newUser]);
  //       toast.success(t('userManagement.addSuccess'));
  //     }

  //     resetForm();
  //   } catch (error) {
  //     toast.error(editingUser ? t('userManagement.updateFailed') : t('userManagement.addFailed'));
  //   }
  // };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('policeStation', formData.policeStation);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('password', formData.password);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      if (editingUser) {
        // Update existing user
        // const response = await fetch(BACKEND_URL+`/api/users/${editingUser._id}`, {
        //   method: 'PUT',
        //   body: formDataToSend,
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        // });
        const response = await axios.put(
          BACKEND_URL+`/api/users/${editingUser._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        
        if (response.status !== 200) throw new Error('Update failed');

        const updatedUser = await response.data;
        setUsers(users.map(user => user._id === editingUser._id ? updatedUser : user));
        toast.success(t('userManagement.updateSuccess'));
      } else {
        // Add new user
        // const response = await fetch('http://localhost:5000/api/users', {
        //   method: 'POST',
        //   body: formDataToSend,
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        // });
        const response = await axios.post(
          BACKEND_URL+"/api/users",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status !== 201) throw new Error('Addition failed');

        const newUser = await response.data;
        setUsers([...users, newUser]);
        toast.success(t('userManagement.addSuccess'));
      }

      resetForm();
    } catch (error) {
      console.log(error);
      
      toast.error(editingUser ? t('userManagement.updateFailed') : t('userManagement.addFailed'));
    }
  };

  const resetForm = () => {
    setIsAddingUser(false);
    setEditingUser(null);
    setPreviewImage(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      policeStation: '',
      password: '',
      role: 'police',
      photo: null
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      policeStation: user.policeStation,
      password: '',
      role: user.role,
      photo: null
    });
    setPreviewImage(user.photo);
    setIsAddingUser(true);
  };

  // const handleDelete = async (userId: string) => {
  //   try {
  //     // For demo purposes, simulate API call
  //     setUsers(users.filter((user) => user._id !== userId));
  //     toast.success(t('userManagement.deleteSuccess'));
  //   } catch (error) {
  //     toast.error(t('userManagement.deleteFailed'));
  //   }
  // };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(BACKEND_URL+`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!response.ok) throw new Error('Delete failed');
      
      setUsers(users.filter((user) => user._id !== userId));
      toast.success(t('userManagement.deleteSuccess'));
    } catch (error) {
      toast.error(t('userManagement.deleteFailed'));
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {t('userManagement.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {t('userManagement.subtitle')}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setIsAddingUser(true);
              setEditingUser(null);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                policeStation: '',
                password: '',
                role: 'police',
                photo: null
              });
              setPreviewImage(null);
            }}
            className="flex items-center rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            {t('userManagement.addUser')}
          </button>
        </div>
      </div>

      {isAddingUser && (
        <div className="mt-8 max-w-xl bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {editingUser ? t('userManagement.editUser') : t('userManagement.addNewUser')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('userManagement.firstName')}</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('userManagement.lastName')}</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('userManagement.email')}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('userManagement.phone')}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('userManagement.policeStation')}</label>
              <select
                value={formData.policeStation}
                onChange={(e) => setFormData({ ...formData, policeStation: e.target.value })}
                className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                required
              >
                <option value="">{t('userManagement.selectPoliceStation')}</option>
                {villages.map((village) => (
                  <option key={village._id} value={village._id}>
                    {village.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('userManagement.password')}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                required={!editingUser}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('userManagement.role')}</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'police' })}
                className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value="police">{t('auth.police')}</option>
                <option value="admin">{t('auth.admin')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('userManagement.photo')}</label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2  file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {previewImage && (
                  <div className="relative">
                    <img src={previewImage} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
              >
                {t('userManagement.cancel')}
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                {editingUser ? t('userManagement.updateUser') : t('userManagement.addUser')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">{t('userManagement.photo')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('userManagement.name')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('userManagement.email')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('userManagement.phone')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('userManagement.policeStation')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('userManagement.role')}</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="py-4 pl-4 pr-3">
                      <img src={BACKEND_URL+""+user.photo} alt={user.firstName} className="h-10 w-10 rounded-full object-cover" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {`${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.phone}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {villages.find(v => v._id === user.policeStation)?.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.role}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4 bg-blue-100 p-1.5 rounded-md"
                        title="Edit user"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 p-1.5 rounded-md"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;