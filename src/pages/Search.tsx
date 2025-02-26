import React, { useEffect, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import axios from "axios";
import toast from 'react-hot-toast';


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
  'All',
  'Mobile Theft',
  'Bike Theft',
  'Home Theft',
  'Vehicle Theft',
  'Robbery',
];

interface Case {
  id: string;
  village: string;
  theftType: string;
  section: string;
  name: string;
  date: string;
  description: string;
}

function Search() {
  const user = useAuthStore((state) => state.user);
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedtheftType, setSelectedtheftType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Case | null>(null);
  const [cases, setCases] = useState<Case[] | null>([]);

  console.log("cases:", cases)

  // Mock data - replace with actual API call

  // const fetchRecords = async (village = "", theftType = "", name = "") => {
  //   try {
  //     const res = await axios.get(`http://localhost:5000/api/cases?village=${village}&theftType=${theftType}&name=${name}`, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  //     });
  //     console.log(res);

  //     setCases(res.data);
  //   } catch (error) {
  //     console.error('Failed to fetch records:', error);
  //   }
  // };
  useEffect(() => {
    fetchRecords();
  }, [selectedVillage, selectedtheftType, searchQuery]); 

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cases`, {
        params: {
          village: selectedVillage !== 'All' ? selectedVillage : '',
          theftType: selectedtheftType !== 'All' ? selectedtheftType : '',
          name: searchQuery || ''
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setCases(res.data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  };



  const handleEdit = (caseItem: Case) => {
    setEditingId(caseItem._id);
    setEditData(caseItem);

  };

  const handleUpdate = async () => {
    if (!editData) return;
    console.log(editData);

    try {
      const res = await axios.put(`http://localhost:5000/api/cases/${editData._id}`, editData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(res.data);

      // Assuming res.data contains only the updated case, update the state properly
      setCases(prevCases => prevCases.map(caseItem =>
        caseItem._id === editData._id ? res.data : caseItem
      ));

    } catch (error) {
      console.error('Failed to update record:', error);
    }

    setEditingId(null);
    setEditData(null);
  };


  const handleDelete = async (id: string) => {
    // TODO: Implement API call to delete case
    try {
      const res = await axios.delete(`http://localhost:5000/api/cases/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      console.log(res.data);
      // toast.(error.response.data.message || 'Login Failed');
      toast.success('Record Deleted');

      // Assuming res.data contains only the updated case, update the state properly
      setCases(prevCases => prevCases.map(caseItem =>
        caseItem._id === id ? res.data : caseItem
      ));
    } catch (error) {
      toast.error(error.response.data.message || 'Deletion Failed');
      console.error('Failed to Delete record:', error);
    }
    console.log('Deleting case:', id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Search Cases
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Search and filter through registered cases
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <select
          value={selectedVillage}
          onChange={(e) => { setSelectedVillage(e.target.value); fetchRecords() }}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value="" hidden selected>Select Village</option>
          {villages.map((village) => (
            <option key={village} value={village}>
              {village}
            </option>
          ))}
        </select>

        <select
          value={selectedtheftType}
          onChange={(e) => { setSelectedtheftType(e.target.value); fetchRecords() }}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value="" hidden selected>Select Theft</option>
          {theftTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); fetchRecords() }}
            placeholder="Search by name..."
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
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Village
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Crime Type
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Section
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    {user?.role === 'admin' && (
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cases.map((caseItem) => (
                    <tr key={caseItem._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {editingId === caseItem._id ? (
                          <input
                            type="text"
                            value={editData?.village}
                            onChange={(e) =>
                              setEditData({
                                ...editData!,
                                village: e.target.value,
                              })
                            }
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        ) : (
                          caseItem.village
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {editingId === caseItem._id ? (
                          <input
                            type="text"
                            value={editData?.theftType}
                            onChange={(e) =>
                              setEditData({
                                ...editData!,
                                theftType: e.target.value,
                              })
                            }
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        ) : (
                          caseItem.theftType
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {editingId === caseItem._id ? (
                          <input
                            type="text"
                            value={editData?.section}
                            onChange={(e) =>
                              setEditData({
                                ...editData!,
                                section: e.target.value,
                              })
                            }
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        ) : (
                          caseItem.section
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {editingId === caseItem._id ? (
                          <input
                            type="text"
                            value={editData?.name}
                            onChange={(e) =>
                              setEditData({
                                ...editData!,
                                name: e.target.value,
                              })
                            }
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        ) : (
                          caseItem.name
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {editingId === caseItem._id ? (
                          <input
                            type="date"
                            value={editData?.date}
                            onChange={(e) =>
                              setEditData({
                                ...editData!,
                                date: e.target.value,
                              })
                            }
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        ) : (
                          caseItem.date
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {editingId === caseItem._id ? (
                          <input
                            type="text"
                            value={editData?.description}
                            onChange={(e) =>
                              setEditData({
                                ...editData!,
                                description: e.target.value,
                              })
                            }
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        ) : (
                          caseItem.description
                        )}
                      </td>
                      {user?.role === 'admin' && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {editingId === caseItem._id ? (
                            <button
                              onClick={handleUpdate}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Update
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(caseItem)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(caseItem._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label htmlFor="items-per-page" className="mr-2 text-sm text-gray-700">
            Items per page:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
          <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            Previous
          </button>
          <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            1
          </button>
          <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Search;