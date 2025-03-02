import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, FileText, FileSpreadsheet, Download, X, Check, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { sampleCases } from '../data/sampleData';
import axios from "axios";
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

interface Case {
  _id: string;
  division: string;
  village: string;
  crimeType: string;
  subType: string;
  section: string;
  name: string;
  date: string;
  description: string;
  photo: string;
  address: string;
}

function Search() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedCrimeType, setSelectedCrimeType] = useState('');
  const [selectedSubType, setSelectedSubType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [cases, setCases] = useState<Case[]>(sampleCases);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Case | null>(null);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [divisions, setDivisions] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [villages, setVillages] = useState([]);
  const [subCrimeTypes, setSubCrimeTypes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/cases`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setCases(response.data))
      .catch(error => console.error("Error fetching divisions:", error));

    axios.get(`http://localhost:5000/api/divisions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setDivisions(response.data))
      .catch(error => console.error("Error fetching divisions:", error));

    axios.get(`http://localhost:5000/api/crime-types`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setCrimeTypes(response.data))
      .catch(error => console.error("Error fetching crime types:", error));

    axios.get(`http://localhost:5000/api/villages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setVillages(response.data))
      .catch(error => console.error("Error fetching crime types:", error));

    axios.get(`http://localhost:5000/api/sub-crime-types`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setSubCrimeTypes(response.data))
      .catch(error => console.error("Error fetching crime types:", error));
  }, []);

  // Filter villages based on selected division
  const filteredVillages = selectedDivision
    ? villages.filter(v => v.divisionId._id === selectedDivision)
    : [];

  // Filter sub-types based on selected crime type
  const filteredSubTypes = selectedCrimeType
    ? subCrimeTypes.filter(st => st.crimeTypeId._id === selectedCrimeType)
    : [];

  // Filter cases based on search criteria
  const filteredCases = cases.filter(caseItem => {
    const matchesDivision = !selectedDivision || caseItem.division === selectedDivision;
    const matchesVillage = !selectedVillage || caseItem.village === selectedVillage;
    const matchesCrimeType = !selectedCrimeType || caseItem.crimeType === selectedCrimeType;
    const matchesSubType = !selectedSubType || caseItem.subType === selectedSubType;
    const matchesSearch = !searchQuery ||
      caseItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.section.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDivision && matchesVillage && matchesCrimeType && matchesSubType && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhoto(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setNewPhoto(null);
    setPreviewImage(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(12);
    doc.text('Maharashtra Police', 14, 15);
    doc.setFontSize(10);
    doc.text('Local Crime Branch, Chhatrapati Sambhajinagar Rural', 14, 22);
    doc.text('Office of Superintendent of Police, Chhatrapati Sambhajinagar Rural', 14, 28);
    doc.text('T.C.K Center Road, Tilakdi, Pin-7, Chhatrapati Sambhajinagar', 14, 34);
    doc.text('Phone Number: 0240-2380978', 14, 40);

    doc.setFontSize(10);
    doc.text('Ref No: LCB/MOB/2025/', 14, 50);
    doc.text('/02/2025', 160, 50);

    // Addressing
    doc.setFontSize(12);
    doc.text('To,', 14, 60);
    doc.text('Station House Officer,', 14, 65);
    doc.text('Police Station, Kannad City', 14, 70);

    // Case Details
    doc.setFontSize(10);
    doc.text('FIR No & Section:', 14, 80);
    doc.text('38/2025, Section 303(2)B IPC', 50, 80);
    
    doc.text('Crime Type:', 14, 85);
    doc.text('Murder with a sharp weapon in a hotel lobby', 50, 85);

    doc.text('Investigating Officer:', 14, 90);
    doc.text('PON/729 Bag, Main Post, Kannad City', 50, 90);

    // Accused List Table
    const tableColumn = ["Accused Name", "Age", "Address"];
    const tableRows = filteredCases.map(caseItem => [
        caseItem.name,
        caseItem.age,
        caseItem.address
    ]);

    doc.autoTable({
        startY: 100,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        styles: { fontSize: 10 }
    });

    // Investigation Instructions
    let yPos = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text('The above case is under investigation, and the list of suspected accused persons is provided below.', 14, yPos);
    yPos += 5;
    doc.text('Kindly proceed with the necessary investigation and submit a detailed report.', 14, yPos);
    
    // Additional Instructions
    const instructions = [
        "1) Verify the crime details and provide an updated report.",
        "2) Gather and submit information about the deceased person.",
        "3) Visit the crime scene and collect relevant details.",
        "4) Submit forensic evidence related to the crime.",
        "5) Provide a certified copy of the A.O.B. format and photos."
    ];

    instructions.forEach((line, index) => {
        yPos += 7;
        doc.text(line, 14, yPos);
    });

    // Signature Area
    yPos += 15;
    doc.setFontSize(12);
    doc.text('Superintendent of Police,', 140, yPos);
    doc.text('Chhatrapati Sambhajinagar Rural', 140, yPos + 5);

    // Save PDF
    doc.save('police-report.pdf');
  };

  const exportToExcel = () => {
    const data = filteredCases.map(caseItem => ({
      Division: divisions.find(d => d._id === caseItem.division)?.name,
      'Police Station': villages.find(v => v._id === caseItem.village)?.name,
      'Crime Type': crimeTypes.find(ct => ct._id === caseItem.crimeType)?.name,
      'Sub Type': subCrimeTypes.find(st => st._id === caseItem.subType)?.name,
      Name: caseItem.name,
      Address: caseItem.address,
      Section: caseItem.section,
      Date: new Date(caseItem.date).toLocaleDateString(),
      Description: caseItem.description
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Accused');
    XLSX.writeFile(wb, 'police-accused.xlsx');
  };

  const handleEdit = (caseItem: Case) => {
    setEditingId(caseItem._id);
    setEditData({ ...caseItem });
    setPreviewImage("http://localhost:5000" + caseItem.photo);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
    setNewPhoto(null);
    setPreviewImage(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/cases/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      console.log(res.data);
      toast.success(t('search.deleteSuccess'));
      setCases(prevCases => prevCases.filter(caseItem => caseItem._id !== id));
    } catch (error) {
      toast.error(t('search.deleteFailed'));
      console.error('Failed to Delete record:', error);
    }
  };

  const handleUpdateCase = async (id: string) => {
    if (!editData) return;

    try {
      const formDataToSend = new FormData();

      // Append all fields
      formDataToSend.append("name", editData.name);
      formDataToSend.append("division", editData.division);
      formDataToSend.append("village", editData.village);
      formDataToSend.append("crimeType", editData.crimeType);
      formDataToSend.append("subType", editData.subType);
      formDataToSend.append("section", editData.section);
      formDataToSend.append("description", editData.description);
      formDataToSend.append("date", editData.date);
      formDataToSend.append("address", editData.address);

      // Append new photo if changed
      if (newPhoto) {
        formDataToSend.append("photo", newPhoto);
      }

      const response = await axios.put(
        `http://localhost:5000/api/cases/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200) throw new Error("Failed to update case");

      // Update state after successful update
      setCases(prevCases =>
        prevCases.map(caseItem =>
          caseItem._id === id ? { ...editData, photo: previewImage || response.data.photo } : caseItem
        )
      );

      setEditingId(null);
      setEditData(null);
      setNewPhoto(null);
      setPreviewImage(null);
      toast.success(t('search.updateSuccess'));
    } catch (error) {
      toast.error(t('search.updateFailed'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {t('search.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {t('search.subtitle')}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={exportToPDF}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-200"
          >
            <FileText className="h-5 w-5 mr-2" />
            {t('search.exportPDF')}
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 shadow-md transition-all duration-200"
          >
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            {t('search.exportExcel')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        <select
          value={selectedDivision}
          onChange={(e) => {
            setSelectedDivision(e.target.value);
            setSelectedVillage('');
            setCurrentPage(1);
          }}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value="">{t('search.selectDivision')}</option>
          {divisions.map((division) => (
            <option key={division._id} value={division._id}>
              {division.name}
            </option>
          ))}
        </select>

        <select
          value={selectedVillage}
          onChange={(e) => {
            setSelectedVillage(e.target.value);
            setCurrentPage(1);
          }}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          disabled={!selectedDivision}
        >
          <option value="">{t('search.selectPoliceStation')}</option>
          {filteredVillages.map((village) => (
            <option key={village._id} value={village._id}>
              {village.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCrimeType}
          onChange={(e) => {
            setSelectedCrimeType(e.target.value);
            setSelectedSubType('');
            setCurrentPage(1);
          }}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value="">{t('search.selectCrimeType')}</option>
          {crimeTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubType}
          onChange={(e) => {
            setSelectedSubType(e.target.value);
            setCurrentPage(1);
          }}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          disabled={!selectedCrimeType}
        >
          <option value="">{t('search.selectSubType')}</option>
          {filteredSubTypes.map((subType) => (
            <option key={subType._id} value={subType._id}>
              {subType.name}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t('search.searchByName')}
            className="block w-full rounded-md border-0 p-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
          <SearchIcon
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">{t('search.photo')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('search.division')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('search.policeStation')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('search.name')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('search.address')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('search.section')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('search.crimeType')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('search.subType')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('search.description')}</th>
                  {user?.role === 'admin' && (
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('search.actions')}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedCases.map((caseItem) => (
                  <tr key={caseItem._id} className={editingId === caseItem._id ? "bg-blue-50" : ""}>
                    <td className="py-4 pl-4 pr-3">
                      {editingId === caseItem._id ? (
                        <div className="relative">
                          {previewImage && (
                            <div className="relative">
                              <img
                                src={previewImage || `http://localhost:5000${caseItem.photo}`}
                                alt="Case"
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                title="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="block w-24 text-xs text-gray-500 mt-1"
                          />
                        </div>
                      ) : (
                        caseItem.photo && (
                          <img
                            src={"http://localhost:5000" + caseItem.photo}
                            alt="Case"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingId === caseItem._id ? (
                        <select
                          value={editData?.division || ''}
                          onChange={(e) => {
                            if (editData) {
                              setEditData({
                                ...editData,
                                division: e.target.value,
                                village: '' // Reset village when division changes
                              });
                            }
                          }}
                          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs"
                        >
                          {divisions.map((division) => (
                            <option key={division._id} value={division._id}>
                              {division.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        divisions.find(d => d._id === caseItem.division)?.name
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingId === caseItem._id ? (
                        <select
                          value={editData?.village || ''}
                          onChange={(e) => {
                            if (editData) {
                              setEditData({
                                ...editData,
                                village: e.target.value
                              });
                            }
                          }}
                          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs"
                        >
                          {villages
                            .filter(v => v.divisionId._id === editData?.division)
                            .map((village) => (
                              <option key={village._id} value={village._id}>
                                {village.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        villages.find(v => v._id === caseItem.village)?.name
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingId === caseItem._id ? (
                        <input
                          type="text"
                          value={editData?.name || ''}
                          onChange={(e) => {
                            if (editData) {
                              setEditData({
                                ...editData,
                                name: e.target.value
                              });
                            }
                          }}
                          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs"
                        />
                      ) : (
                        caseItem.name
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingId === caseItem._id ? (
                        <input
                          type="text"
                          value={editData?.address || ''}
                          onChange={(e) => {
                            if (editData) {
                              setEditData({
                                ...editData,
                                address: e.target.value
                              });
                            }
                          }}
                          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs"
                        />
                      ) : (
                        caseItem.address
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingId === caseItem._id ? (
                        <input
                          type="text"
                          value={editData?.section || ''}
                          onChange={(e) => {
                            if (editData) {
                              setEditData({
                                ...editData,
                                section: e.target.value
                              });
                            }
                          }}
                          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs"
                        />
                      ) : (
                        caseItem.section
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingId === caseItem._id ? (
                        <select
                          value={editData?.crimeType || ''}
                          onChange={(e) => {
                            if (editData) {
                              setEditData({
                                ...editData,
                                crimeType: e.target.value,
                                subType: '' // Reset subType when crimeType changes
                              });
                            }
                          }}
                          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs"
                        >
                          {crimeTypes.map((type) => (
                            <option key={type._id} value={type._id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        crimeTypes.find(ct => ct._id === caseItem.crimeType)?.name
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingId === caseItem._id ? (
                        <select
                          value={editData?.subType || ''}
                          onChange={(e) => {
                            if (editData) {
                              setEditData({
                                ...editData,
                                subType: e.target.value
                              });
                            }
                          }}
                          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs"
                        >
                          {subCrimeTypes
                            .filter(st => st.crimeTypeId._id === editData?.crimeType)
                            .map((subType) => (
                              <option key={subType._id} value={subType._id}>
                                {subType.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        subCrimeTypes.find(st => st._id === caseItem.subType)?.name
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingId === caseItem._id ? (
                        <input
                          type="text"
                          value={editData?.description || ''}
                          onChange={(e) => {
                            if (editData) {
                              setEditData({
                                ...editData,
                                description: e.target.value
                              });
                            }
                          }}
                          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-xs"
                        />
                      ) : (
                        caseItem.description
                      )}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {editingId === caseItem._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateCase(caseItem._id)}
                              className="flex items-center text-green-600 hover:text-green-900 bg-green-100 p-1 rounded"
                              title="Save changes"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center text-red-600 hover:text-red-900 bg-red-100 p-1 rounded"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(caseItem)}
                              className="flex items-center text-blue-600 hover:text-blue-900 bg-blue-100 p-1 rounded"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(caseItem._id)}
                              className="flex items-center text-red-600 hover:text-red-900 bg-red-100 p-1 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label htmlFor="items-per-page" className="mr-2 text-sm text-gray-700">
            {t('search.itemsPerPage')}
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
          >
            {t('search.previous')}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                ? 'bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
          >
            {t('search.next')}
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Search;