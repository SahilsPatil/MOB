import React, { useEffect, useState } from 'react';
import { BarChart3, AlertTriangle } from 'lucide-react';
import axios from "axios";
import { useTranslation } from 'react-i18next';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const { t } = useTranslation();
  // Ensure realstats is an object with default empty arrays
  const [realstats, setrealstats] = useState({ casesByVillage: [], casesByTheftType: [] });
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(BACKEND_URL+`/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setrealstats(res.data || { casesByVillage: [], casesByTheftType: [] });
      } catch (error) {
        console.error('Failed to fetch records:', error);
      }
    };

    fetchStates();
  }, []);

  let stats = [
    {
      name: t('dashboard.totalAccused'),
      value: realstats.totalCases || 1000,
      change: '',
      icon: AlertTriangle,
    },
    {
      name: t('dashboard.policeStations'),
      value: realstats.totalPoliceStation || 23,
      change: '',
      icon: AlertTriangle,
    },
    {
      name: t('dashboard.divisions'),
      value: realstats.totalDivisions || 16,
      change: '',
      icon: BarChart3,
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {t('dashboard.title')}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-blue-500 p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Cases by Village Table */}
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {t('dashboard.accusedByPoliceStation')}
            </h3>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                          {t('dashboard.policeStation')}
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          {t('dashboard.count')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {realstats?.casesByVillage?.length > 0 ? (
                        realstats.casesByVillage.map((user) => (
                          <tr key={user._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                              {villages.find(d => d._id === user._id)?.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.count}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center py-4 text-gray-500">
                            {t('dashboard.noData')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cases by TheftType Table */}
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {t('dashboard.accusedByCrimeType')}
            </h3>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                          {t('dashboard.crimeType')}
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          {t('dashboard.count')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {realstats?.casesByTheftType?.length > 0 ? (
                        realstats.casesByTheftType.map((user) => (
                          <tr key={user._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                              {crimeTypes.find(d => d._id === user._id)?.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.count}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center py-4 text-gray-500">
                            {t('dashboard.noData')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;