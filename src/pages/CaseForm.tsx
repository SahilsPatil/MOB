import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from "axios";
import { useTranslation } from 'react-i18next';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface CaseFormData {
  division: string;
  village: string;
  crimeType: string;
  subType: string;
  name: string;
  section: string;
  description: string;
  date: string;
  photo: File | null;
  address: string;
}

function CaseForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CaseFormData>({
    division: '',
    village: '',
    crimeType: '',
    subType: '',
    name: '',
    section: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    photo: null,
    address: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [divisions, setDivisions] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [villages, setVillages] = useState([]);
  const [subCrimeTypes, setSubCrimeTypes] = useState([]);

  useEffect(() => {
    axios.get(BACKEND_URL+`/api/divisions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setDivisions(response.data))
      .catch(error => console.error("Error fetching divisions:", error));

    axios.get(BACKEND_URL+`/api/crime-types`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setCrimeTypes(response.data))
      .catch(error => console.error("Error fetching crime types:", error));

    axios.get(BACKEND_URL+`/api/villages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setVillages(response.data))
      .catch(error => console.error("Error fetching villages:", error));

    axios.get(BACKEND_URL+`/api/sub-crime-types`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setSubCrimeTypes(response.data))
      .catch(error => console.error("Error fetching sub crime types:", error));
  }, []);

  // Filter villages based on selected division
  const filteredVillages = formData.division
    ? villages.filter(v => v.divisionId._id === formData.division)
    : [];

  // Filter sub-types based on selected crime type
  const filteredSubTypes = formData.crimeType
    ? subCrimeTypes.filter(st => st.crimeTypeId._id === formData.crimeType)
    : [];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("division", formData.division);
      formDataToSend.append("village", formData.village);
      formDataToSend.append("crimeType", formData.crimeType);
      formDataToSend.append("subType", formData.subType);
      formDataToSend.append("section", formData.section);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("address", formData.address);

      // Append photo (only if selected)
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const response = await axios.post(
        BACKEND_URL+"/api/cases",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 201) throw new Error("Failed to add case");

      toast.success(t('caseForm.addSuccess'));
      navigate("/search");
    } catch (error) {
      toast.error(t('caseForm.addFailed'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {t('caseForm.title')}
      </h2>
      <p className="mt-2 text-sm text-gray-500 mb-6">
        {t('caseForm.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Division Select */}
          <div>
            <label htmlFor="division" className="block text-sm font-medium text-gray-700">
              {t('caseForm.division')}
            </label>
            <select
              id="division"
              value={formData.division}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  division: e.target.value,
                  village: ''
                });
              }}
              className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              required
            >
              <option value="">{t('caseForm.selectDivision')}</option>
              {divisions.map((division) => (
                <option key={division._id} value={division._id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>

          {/* Village Select */}
          <div>
            <label htmlFor="village" className="block text-sm font-medium text-gray-700">
              {t('caseForm.policeStation')}
            </label>
            <select
              id="village"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              disabled={!formData.division}
              required
            >
              <option value="">{t('caseForm.selectPoliceStation')}</option>
              {filteredVillages.map((village) => (
                <option key={village._id} value={village._id}>
                  {village.name}
                </option>
              ))}
            </select>
          </div>

          {/* Crime Type Select */}
          <div>
            <label htmlFor="crimeType" className="block text-sm font-medium text-gray-700">
              {t('caseForm.crimeType')}
            </label>
            <select
              id="crimeType"
              value={formData.crimeType}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  crimeType: e.target.value,
                  subType: ''
                });
              }}
              className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              required
            >
              <option value="">{t('caseForm.selectCrimeType')}</option>
              {crimeTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Crime Type Select */}
          <div>
            <label htmlFor="subType" className="block text-sm font-medium text-gray-700">
              {t('caseForm.subCrimeType')}
            </label>
            <select
              id="subType"
              value={formData.subType}
              onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
              className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              disabled={!formData.crimeType}
            >
              <option value="">{t('caseForm.selectSubType')}</option>
              {filteredSubTypes.map((subType) => (
                <option key={subType._id} value={subType._id}>
                  {subType.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            {t('caseForm.accusedName')}
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            {t('caseForm.address')}
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus: ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            required
          />
        </div>

        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700">
            {t('caseForm.ipcSection')}
          </label>
          <input
            type="text"
            id="section"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            required
          />
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
            {t('caseForm.photo')}
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
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

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            {t('caseForm.description')}
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('caseForm.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CaseForm;