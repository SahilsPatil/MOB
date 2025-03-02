import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from "axios";
import { useTranslation } from 'react-i18next';

const API_URL = "http://localhost:5000/api";

interface Division {
  _id: string;
  name: string;
}

interface Village {
  _id: string;
  name: string;
  divisionId: string;
}

interface CrimeType {
  _id: string;
  name: string;
}

interface SubCrimeType {
  _id: string;
  name: string;
  crimeTypeId: string;
}

function MasterData() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('divisions');
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [crimeTypes, setCrimeTypes] = useState<CrimeType[]>([]);
  const [subCrimeTypes, setSubCrimeTypes] = useState<SubCrimeType[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedCrimeType, setSelectedCrimeType] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    divisionId: '',
    crimeTypeId: ''
  });

  const fetchData = async () => {
    try {
      let response;
      switch (activeTab) {
        case "divisions":
          response = await axios.get(`${API_URL}/divisions`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setDivisions(response.data);
          break;
        case "policeStation":
          response = await axios.get(`${API_URL}/villages`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setVillages(response.data);
          break;
        case "crimeTypes":
          response = await axios.get(`${API_URL}/crime-types`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setCrimeTypes(response.data);
          break;
        case "subCrimeTypes":
          response = await axios.get(`${API_URL}/sub-crime-types`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setSubCrimeTypes(response.data);
          break;
      }
    } catch (error) {
      toast.error(t('masterData.operationFailed'));
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("editingItem", editingItem);
      console.log("formData", formData);
      let res = null;

      if (isAdding) {
        switch (activeTab) {
          case 'divisions':
            res = await axios.post(`http://localhost:5000/api/divisions/`,
              { name: formData.name },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            break;
          case 'policeStation':
            res = await axios.post(`http://localhost:5000/api/villages/`,
              { name: formData.name, divisionId: selectedDivision },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            break;
          case 'crimeTypes':
            res = await axios.post(`http://localhost:5000/api/crime-types/`,
              { name: formData.name },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            break;
          case 'subCrimeTypes':
            res = await axios.post(`http://localhost:5000/api/sub-crime-types/`,
              { name: formData.name, crimeTypeId: selectedCrimeType },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            break;
        }
      } else if (editingItem) {
        switch (activeTab) {
          case 'divisions':
            res = await axios.put(`http://localhost:5000/api/divisions/${editingItem._id}`,
              { name: formData.name },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            break;
          case 'policeStation':
            res = await axios.put(`http://localhost:5000/api/villages/${editingItem._id}`,
              { name: formData.name, divisionId: selectedDivision },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            break;
          case 'crimeTypes':
            res = await axios.put(`http://localhost:5000/api/crime-types/${editingItem._id}`,
              { name: formData.name },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            break;
          case 'subCrimeTypes':
            res = await axios.put(`http://localhost:5000/api/sub-crime-types/${editingItem._id}`,
              { name: formData.name, crimeTypeId: selectedCrimeType },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            break;
        }
      }

      console.log("res", res?.data);

      if (!res || !res.data) {
        throw new Error("No data received");
      }

      // Fetch updated list from API after adding/updating
      switch (activeTab) {
        case 'divisions':
          const updatedDivisions = await axios.get(`http://localhost:5000/api/divisions/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setDivisions(updatedDivisions.data);
          break;

        case 'policeStation':
          const updatedVillages = await axios.get(`http://localhost:5000/api/villages/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setVillages(updatedVillages.data);
          break;

        case 'crimeTypes':
          const updatedCrimeTypes = await axios.get(`http://localhost:5000/api/crime-types/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setCrimeTypes(updatedCrimeTypes.data);
          break;

        case 'subCrimeTypes':
          const updatedSubCrimeTypes = await axios.get(`http://localhost:5000/api/sub-crime-types/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setSubCrimeTypes(updatedSubCrimeTypes.data);
          break;
      }

      toast.success(isAdding ? t('masterData.addSuccess') : t('masterData.updateSuccess'));
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(t('masterData.operationFailed'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      let res = null;

      switch (activeTab) {
        case 'divisions':
          res = await axios.delete(`http://localhost:5000/api/divisions/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          break;
        case 'policeStation':
          res = await axios.delete(`http://localhost:5000/api/villages/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          break;
        case 'crimeTypes':
          res = await axios.delete(`http://localhost:5000/api/crime-types/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          break;
        case 'subCrimeTypes':
          res = await axios.delete(`http://localhost:5000/api/sub-crime-types/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          break;
      }

      if (!res || res.status !== 200) {
        throw new Error("Failed to delete item");
      }

      // Fetch updated list from API after deletion
      switch (activeTab) {
        case 'divisions':
          const updatedDivisions = await axios.get(`http://localhost:5000/api/divisions/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setDivisions(updatedDivisions.data);
          break;

        case 'policeStation':
          const updatedVillages = await axios.get(`http://localhost:5000/api/villages/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setVillages(updatedVillages.data);
          break;

        case 'crimeTypes':
          const updatedCrimeTypes = await axios.get(`http://localhost:5000/api/crime-types/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setCrimeTypes(updatedCrimeTypes.data);
          break;

        case 'subCrimeTypes':
          const updatedSubCrimeTypes = await axios.get(`http://localhost:5000/api/sub-crime-types/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setSubCrimeTypes(updatedSubCrimeTypes.data);
          break;
      }

      toast.success(t('masterData.deleteSuccess'));
    } catch (error) {
      console.error(error);
      toast.error(t('masterData.deleteFailed'));
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingItem(null);
    setFormData({ name: '', divisionId: '', crimeTypeId: '' });
    setSelectedDivision('');
    setSelectedCrimeType('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900">{t('masterData.title')}</h2>
        <p className="mt-2 text-sm text-gray-500">{t('masterData.subtitle')}</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['divisions', 'policeStation', 'crimeTypes', 'subCrimeTypes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              {tab === 'divisions' ? t('masterData.divisions') :
                tab === 'policeStation' ? t('masterData.policeStation') :
                  tab === 'crimeTypes' ? t('masterData.crimeTypes') :
                    t('masterData.subCrimeTypes')}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t('masterData.addNew')}
        </button>
      </div>

      {(isAdding || editingItem) && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('masterData.name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              required
            />
          </div>

          {activeTab === 'policeStation' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('masterData.division')}</label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                required
              >
                <option value="">{t('masterData.selectDivision')}</option>
                {divisions.map((division) => (
                  <option key={division._id} value={division._id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'subCrimeTypes' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('masterData.crimeType')}</label>
              <select
                value={selectedCrimeType}
                onChange={(e) => setSelectedCrimeType(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                required
              >
                <option value="">{t('masterData.selectCrimeType')}</option>
                {crimeTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 bg-white shadow-sm hover:bg-gray-50"
            >
              {t('masterData.cancel')}
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              {editingItem ? t('masterData.update') : t('masterData.add')}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">{t('masterData.name')}</th>
              {(activeTab === 'policeStation' || activeTab === 'subCrimeTypes') && (
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  {activeTab === 'policeStation' ? t('masterData.division') : t('masterData.crimeType')}
                </th>
              )}
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {activeTab === 'divisions' &&
              divisions.map((item) => (
                <tr key={item._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setFormData({ ...formData, name: item.name });
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4 bg-blue-100 p-1.5 rounded-md"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-1.5 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {activeTab === 'policeStation' &&
              villages.map((item) => (
                <tr key={item._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.divisionId && item.divisionId.name ? item.divisionId.name : "null"}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setFormData({ ...formData, name: item.name });
                        setSelectedDivision(item.divisionId);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4 bg-blue-100 p-1.5 rounded-md"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-1.5 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {activeTab === 'crimeTypes' &&
              crimeTypes.map((item) => (
                <tr key={item._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setFormData({ ...formData, name: item.name });
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4 bg-blue-100 p-1.5 rounded-md"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-1.5 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {activeTab === 'subCrimeTypes' &&
              subCrimeTypes.map((item) => (
                <tr key={item._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.crimeTypeId && item.crimeTypeId.name ? item.crimeTypeId.name : "null"}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setFormData({ ...formData, name: item.name });
                        setSelectedCrimeType(item.crimeTypeId);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4 bg-blue-100 p-1.5 rounded-md"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-1.5 rounded-md"
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
  );
}

export default MasterData;