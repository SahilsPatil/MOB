import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from "axios";

const villages = [
  'All',
  'Kannad',
  'Khultabad',
  'Gangapur',
  'Paithan',
  'Karamad',
  'Phulambari',
];

const theftTypes = [
  'Mobile Theft',
  'Bike Theft',
  'Home Theft',
  'Vehicle Theft',
  'Robbery',
];

interface CaseFormData {
  village: string;
  theftType: string;
  name: string;
  section: string;
  description: string;
  date: string;
}

function CaseForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CaseFormData>({
    village: villages[0],
    theftType: theftTypes[0],
    name: '',
    section: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Form data:', formData);
      // TODO: Implement API call to save case
      const res = await axios.post(`http://localhost:5000/api/cases/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(res.data);
      toast.success('Case added successfully');
      navigate('/search');
    } catch (error) {
      toast.error('Failed to add case');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        New Case Entry
      </h2>
      <p className="mt-2 text-sm text-gray-500 mb-6">
        Add a new case to the system
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="village"
              className="block text-sm font-medium text-gray-700"
            >
              Village
            </label>
            <select
              id="village"
              value={formData.village}
              onChange={(e) =>
                setFormData({ ...formData, village: e.target.value })
              }
              className="mt-1 p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {villages.map((village) => (
                <option key={village} value={village}>
                  {village}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="theftType"
              className="block text-sm font-medium text-gray-700"
            >
              Crime Type
            </label>
            <select
              id="theftType"
              value={formData.theftType}
              onChange={(e) =>
                setFormData({ ...formData, theftType: e.target.value })
              }
              className="mt-1 shadow-sm ring-1 ring-inset ring-gray-300 p-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {theftTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Complainant Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 shadow-sm ring-1 ring-inset ring-gray-300 p-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="section"
            className="block text-sm font-medium text-gray-700"
          >
            IPC Section
          </label>
          <input
            type="text"
            id="section"
            value={formData.section}
            onChange={(e) =>
              setFormData({ ...formData, section: e.target.value })
            }
            className="mt-1 shadow-sm ring-1 ring-inset ring-gray-300 p-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Incident
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 shadow-sm ring-1 ring-inset ring-gray-300 p-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block  text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1 shadow-sm ring-1 ring-inset ring-gray-300 p-1.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Case
          </button>
        </div>
      </form>
    </div>
  );
}

export default CaseForm;