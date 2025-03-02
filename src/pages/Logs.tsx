// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';
// import { Calendar, Clock, Filter, Download, RefreshCw, Trash2 } from 'lucide-react';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';
// import { useThemeStore } from '../store/theme';

// interface Log {
//   _id: string;
//   userId: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     role: string;
//   };
//   action: string;
//   details: string;
//   ipAddress: string;
//   userAgent: string;
//   timestamp: string;
// }

// interface LogStats {
//   actionCounts: { _id: string; count: number }[];
//   topUserActivity: {
//     userId: string;
//     count: number;
//     user: string;
//     email: string;
//   }[];
//   dailyActivity: { _id: string; count: number }[];
// }

// function Logs() {
//   const { t } = useTranslation();
//   const isDarkMode = useThemeStore((state) => state.isDarkMode);
//   const [logs, setLogs] = useState<Log[]>([]);
//   const [stats, setStats] = useState<LogStats | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [filters, setFilters] = useState({
//     action: '',
//     startDate: '',
//     endDate: '',
//     userId: ''
//   });
//   const [showFilters, setShowFilters] = useState(false);

//   // Action types for filtering
//   const actionTypes = [
//     'login',
//     'logout',
//     'view_case',
//     'add_case',
//     'edit_case',
//     'delete_case',
//     'other'
//   ];

//   useEffect(() => {
//     fetchLogs();
//     fetchStats();
//   }, [currentPage, filters]);

//   const fetchLogs = async () => {
//     try {
//       setIsLoading(true);

//       // Build query parameters
//       const params = new URLSearchParams();
//       params.append('page', currentPage.toString());
//       params.append('limit', '20');

//       if (filters.action) params.append('action', filters.action);
//       if (filters.startDate) params.append('startDate', filters.startDate);
//       if (filters.endDate) params.append('endDate', filters.endDate);
//       if (filters.userId) params.append('userId', filters.userId);

//       const response = await axios.get(`http://localhost:5000/api/logs?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       setLogs(response.data.logs);
//       setTotalPages(response.data.totalPages);
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch logs:', error);
//       toast.error('Failed to load logs');
//       setIsLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/logs/stats', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       setStats(response.data);
//     } catch (error) {
//       console.error('Failed to fetch log statistics:', error);
//     }
//   };

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       action: '',
//       startDate: '',
//       endDate: '',
//       userId: ''
//     });
//     setCurrentPage(1);
//   };

//   const handleDeleteOldLogs = async () => {
//     // Get date 30 days ago
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     if (window.confirm(`Are you sure you want to delete all logs older than ${format(thirtyDaysAgo, 'yyyy-MM-dd')}?`)) {
//       try {
//         await axios.delete('http://localhost:5000/api/logs', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           data: { olderThan: thirtyDaysAgo.toISOString() }
//         });

//         toast.success('Old logs deleted successfully');
//         fetchLogs();
//         fetchStats();
//       } catch (error) {
//         console.error('Failed to delete logs:', error);
//         toast.error('Failed to delete logs');
//       }
//     }
//   };

//   const exportLogs = () => {
//     // Create CSV content
//     let csvContent = "data:text/csv;charset=utf-8,";

//     // Add headers
//     csvContent += "User,Action,Details,IP Address,Timestamp\n";

//     // Add data rows
//     logs.forEach(log => {
//       const userName = `${log.userId.firstName} ${log.userId.lastName}`;
//       const row = [
//         userName,
//         log.action,
//         log.details,
//         log.ipAddress,
//         new Date(log.timestamp).toLocaleString()
//       ].map(value => `"${value}"`).join(",");

//       csvContent += row + "\n";
//     });

//     // Create download link
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `logs_export_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);

//     // Trigger download
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Format action name for display
//   const formatAction = (action: string) => {
//     return action
//       .split('_')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className={`text-2xl font-bold leading-7 ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:truncate sm:text-3xl sm:tracking-tight`}>
//             System Logs
//           </h2>
//           <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//             Track user activity and system events
//           </p>
//         </div>
//         <div className="flex space-x-3">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className={`flex items-center px-3 py-2 rounded-md ${
//               isDarkMode 
//                 ? 'bg-gray-700 text-white hover:bg-gray-600' 
//                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <Filter className="h-4 w-4 mr-2" />
//             Filters
//           </button>
//           <button
//             onClick={exportLogs}
//             className={`flex items-center px-3 py-2 rounded-md ${
//               isDarkMode 
//                 ? 'bg-gray-700 text-white hover:bg-gray-600' 
//                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Export
//           </button>
//           <button
//             onClick={() => {
//               fetchLogs();
//               fetchStats();
//             }}
//             className={`flex items-center px-3 py-2 rounded-md ${
//               isDarkMode 
//                 ? 'bg-gray-700 text-white hover:bg-gray-600' 
//                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Refresh
//           </button>
//           <button
//             onClick={handleDeleteOldLogs}
//             className="flex items-center px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
//           >
//             <Trash2 className="h-4 w-4 mr-2" />
//             Delete Old Logs
//           </button>
//         </div>
//       </div>

//       {showFilters && (
//         <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow mb-6`}>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
//             <div>
//               <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
//                 Action Type
//               </label>
//               <select
//                 name="action"
//                 value={filters.action}
//                 onChange={handleFilterChange}
//                 className={`block w-full rounded-md border-0 p-1.5 ${
//                   isDarkMode 
//                     ? 'bg-gray-700 text-white ring-gray-600' 
//                     : 'text-gray-900 ring-gray-300'
//                 } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
//               >
//                 <option value="">All Actions</option>
//                 {actionTypes.map(action => (
//                   <option key={action} value={action}>
//                     {formatAction(action)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
//                 Start Date
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Calendar className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                 </div>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={filters.startDate}
//                   onChange={handleFilterChange}
//                   className={`block w-full rounded-md border-0 p-1.5 pl-10 ${
//                     isDarkMode 
//                       ? 'bg-gray-700 text-white ring-gray-600' 
//                       : 'text-gray-900 ring-gray-300'
//                   } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
//                 />
//               </div>
//             </div>
//             <div>
//               <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
//                 End Date
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Calendar className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                 </div>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={filters.endDate}
//                   onChange={handleFilterChange}
//                   className={`block w-full rounded-md border-0 p-1.5 pl-10 ${
//                     isDarkMode 
//                       ? 'bg-gray-700 text-white ring-gray-600' 
//                       : 'text-gray-900 ring-gray-300'
//                   } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
//                 />
//               </div>
//             </div>
//             <div className="flex items-end">
//               <button
//                 onClick={resetFilters}
//                 className={`px-3 py-2 rounded-md ${
//                   isDarkMode 
//                     ? 'bg-gray-700 text-white hover:bg-gray-600' 
//                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                 }`}
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stats Cards */}
//       {stats && (
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
//           {/* Total Logs */}
//           <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} overflow-hidden rounded-lg shadow`}>
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
//                   <Clock className="h-6 w-6 text-white" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                       Total Log Entries
//                     </dt>
//                     <dd>
//                       <div className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                         {stats.actionCounts.reduce((sum, item) => sum + item.count, 0)}
//                       </div>
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Most Active User */}
//           <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} overflow-hidden rounded-lg shadow`}>
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
//                   <Calendar className="h-6 w-6 text-white" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                       Most Active User
//                     </dt>
//                     <dd>
//                       <div className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                         {stats.topUserActivity.length > 0 ? stats.topUserActivity[0].user : 'N/A'}
//                       </div>
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Most Common Action */}
//           <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} overflow-hidden rounded-lg shadow`}>
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
//                   <Filter className="h-6 w-6 text-white" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                       Most Common Action
//                     </dt>
//                     <dd>
//                       <div className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                         {stats.actionCounts.length > 0 
//                           ? formatAction(stats.actionCounts.sort((a, b) => b.count - a.count)[0]._id)
//                           : 'N/A'
//                         }
//                       </div>
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Logs Table */}
//       <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow rounded-lg overflow-hidden`}>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
//               <tr>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
//                   User
//                 </th>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
//                   Action
//                 </th>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
//                   Details
//                 </th>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
//                   IP Address
//                 </th>
//                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
//                   Timestamp
//                 </th>
//               </tr>
//             </thead>
//             <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={5} className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                     Loading...
//                   </td>
//                 </tr>
//               ) : logs.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                     No logs found
//                   </td>
//                 </tr>
//               ) : (
//                 logs.map((log) => (
//                   <tr key={log._id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                       <div className="font-medium">{log.userId.firstName} {log.userId.lastName}</div>
//                       <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{log.userId.email}</div>
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         log.action === 'login' ? 'bg-green-100 text-green-800' :
//                         log.action === 'logout' ? 'bg-yellow-100 text-yellow-800' :
//                         log.action.includes('delete') ? 'bg-red-100 text-red-800' :
//                         'bg-blue-100 text-blue-800'
//                       }`}>
//                         {formatAction(log.action)}
//                       </span>
//                     </td>
//                     <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                       {log.details}
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                       {log.ipAddress}
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                       {new Date(log.timestamp).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-between mt-4">
//         <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
//           Page {currentPage} of {totalPages}
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className={`px-3 py-1 rounded-md ${
//               isDarkMode 
//                 ? 'bg-gray-700 text-white disabled:bg-gray-800 disabled:text-gray-500' 
//                 : 'bg-white text-gray-700 border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
//             }`}
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-1 rounded-md ${
//               isDarkMode 
//                 ? 'bg-gray-700 text-white disabled:bg-gray-800 disabled:text-gray-500' 
//                 : 'bg-white text-gray-700 border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Logs;


import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Calendar, Clock, Filter, Download, RefreshCw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useThemeStore } from '../store/theme';

interface Log {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  action: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

interface LogStats {
  actionCounts: { _id: string; count: number }[];
  topUserActivity: {
    userId: string;
    count: number;
    user: string;
    email: string;
  }[];
  dailyActivity: { _id: string; count: number }[];
}

function Logs() {
  const { t } = useTranslation();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    action: '',
    startDate: '',
    endDate: '',
    userId: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Action types for filtering
  const actionTypes = [
    'login',
    'logout',
    'view_case',
    'add_case',
    'edit_case',
    'delete_case',
    'view_profile',
    'update_profile',
    'view_users',
    'add_user',
    'edit_user',
    'delete_user',
    'view_crime_types',
    'add_crime_type',
    'edit_crime_type',
    'delete_crime_type',
    'view_divisions',
    'add_division',
    'edit_division',
    'delete_division',
    'view_villages',
    'view_villages_by_division',
    'add_village',
    'edit_village',
    'delete_village',
    'view_sub_crime_types',
    'view_sub_crime_types_by_crime_type',
    'add_sub_crime_type',
    'edit_sub_crime_type',
    'delete_sub_crime_type',
    'other'
  ];

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [currentPage, filters]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');

      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.userId) params.append('userId', filters.userId);

      const response = await axios.get(`http://localhost:5000/api/logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      toast.error('Failed to load logs');
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/logs/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch log statistics:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      action: '',
      startDate: '',
      endDate: '',
      userId: ''
    });
    setCurrentPage(1);
  };

  const handleDeleteOldLogs = async () => {
    // Get date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (window.confirm(t('logs.deleteConfirm', { date: format(thirtyDaysAgo, 'yyyy-MM-dd') }))) {
      try {
        await axios.delete('http://localhost:5000/api/logs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          data: { olderThan: thirtyDaysAgo.toISOString() }
        });

        toast.success(t('logs.deleteSuccess'));
        fetchLogs();
        fetchStats();
      } catch (error) {
        console.error('Failed to delete logs:', error);
        toast.error(t('logs.deleteFailed'));
      }
    }
  };

  const exportLogs = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    csvContent += "User,Action,Details,IP Address,Timestamp\n";

    // Add data rows
    logs.forEach(log => {
      const userName = `${log.userId.firstName} ${log.userId.lastName}`;
      const row = [
        userName,
        log.action,
        log.details,
        log.ipAddress,
        new Date(log.timestamp).toLocaleString()
      ].map(value => `"${value}"`).join(",");

      csvContent += row + "\n";
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `logs_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);

    // Trigger download
    link.click();
    document.body.removeChild(link);
  };

  // Format action name for display
  const formatAction = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold leading-7 ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:truncate sm:text-3xl sm:tracking-tight`}>
            {t('logs.title')}
          </h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('logs.subtitle')}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 rounded-md ${isDarkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            {t('logs.filters')}
          </button>
          <button
            onClick={exportLogs}
            className={`flex items-center px-3 py-2 rounded-md ${isDarkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('logs.export')}
          </button>
          <button
            onClick={() => {
              fetchLogs();
              fetchStats();
            }}
            className={`flex items-center px-3 py-2 rounded-md ${isDarkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('logs.refresh')}
          </button>
          <button
            onClick={handleDeleteOldLogs}
            className="flex items-center px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('logs.deleteOld')}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow mb-6`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                {t('logs.actionType')}
              </label>
              <select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className={`block w-full rounded-md border-0 p-1.5 ${isDarkMode
                  ? 'bg-gray-700 text-white ring-gray-600'
                  : 'text-gray-900 ring-gray-300'
                  } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
              >
                <option value="">All Actions</option>
                {actionTypes.map(action => (
                  <option key={action} value={action}>
                    {formatAction(action)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                {t('logs.startDate')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className={`block w-full rounded-md border-0 p-1.5 pl-10 ${isDarkMode
                    ? 'bg-gray-700 text-white ring-gray-600'
                    : 'text-gray-900 ring-gray-300'
                    } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                {t('logs.endDate')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className={`block w-full rounded-md border-0 p-1.5 pl-10 ${isDarkMode
                    ? 'bg-gray-700 text-white ring-gray-600'
                    : 'text-gray-900 ring-gray-300'
                    } shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className={`px-3 py-2 rounded-md ${isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {t('logs.resetFilters')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {/* Total Logs */}
          <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} overflow-hidden rounded-lg shadow`}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('logs.totalEntries')}
                    </dt>
                    <dd>
                      <div className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.actionCounts.reduce((sum, item) => sum + item.count, 0)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Most Active User */}
          <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} overflow-hidden rounded-lg shadow`}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('logs.mostActiveUser')}
                    </dt>
                    <dd>
                      <div className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.topUserActivity.length > 0 ? stats.topUserActivity[0].user : 'N/A'}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Most Common Action */}
          <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} overflow-hidden rounded-lg shadow`}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <Filter className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('logs.mostCommonAction')}
                    </dt>
                    <dd>
                      <div className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.actionCounts.length > 0
                          ? formatAction(stats.actionCounts.sort((a, b) => b.count - a.count)[0]._id)
                          : 'N/A'
                        }
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className={`${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} shadow rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {t('logs.user')}
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {t('logs.action')}
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {t('logs.details')}
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {t('logs.ipAddress')}
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {t('logs.timestamp')}
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('common.loading')}
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('logs.noLogs')}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    {/* <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      <div className="font-medium">{log.userId.firstName} {log.userId.lastName}</div>
                    </td> */}
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{log.userId != null ?log.userId.email:"null" }</div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.action === 'login' ? 'bg-green-100 text-green-800' :
                        log.action === 'logout' ? 'bg-yellow-100 text-yellow-800' :
                          log.action.includes('delete') ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {log.details}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {log.ipAddress}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${isDarkMode
              ? 'bg-gray-700 text-white disabled:bg-gray-800 disabled:text-gray-500'
              : 'bg-white text-gray-700 border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
              }`}
          >
            {t('logs.previous')}
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${isDarkMode
              ? 'bg-gray-700 text-white disabled:bg-gray-800 disabled:text-gray-500'
              : 'bg-white text-gray-700 border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
              }`}
          >
            {t('logs.next')}
          </button>
        </div>
      </div>
    </div >
  );
}

export default Logs;