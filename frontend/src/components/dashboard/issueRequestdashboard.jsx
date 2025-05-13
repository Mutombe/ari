import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  BarChart, 
  AlertCircle,
  X, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Calendar,
  Zap,
  RefreshCw,
  FileText,
  Info,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  selectUserIssueRequests,
  selectAllIssueRequestsForAdmin,
  selectCurrentUser,
  selectUserDevices,
  selectAllDevicesForAdmin,
  selectDashboardData,
  selectRecentSubmissions,
} from "../../redux/selectors";
import {
  fetchRequests,
  fetchUserRequests,
  saveRequest,
  deleteIssueRequest,
} from "../../redux/slices/issueSlice";
import { fetchDevices } from "../../redux/slices/deviceSlice";
import { Modal, Box, Backdrop, Snackbar, Alert } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";

const IssueRequestDashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.isAdmin;
  
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Redux selectors
  const { requests } = useSelector(state => state.issueRequests);
  const devices = useSelector(isAdmin ? selectAllDevicesForAdmin : selectUserDevices);
  const dashboardStats = useSelector(selectDashboardData);
  const recentSubmissions = useSelector((state) => selectRecentSubmissions(state, 7));

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUserRequests(currentUser.id));
    }
  }, [dispatch, currentUser]);

  const handleCreate = () => {
    setCurrentRequest({
      device: "",
      start_date: "",
      end_date: "",
      production_amount: "",
      period_of_production: "",
      recipient_account: "",
      status: "draft",
      notes: "",
      upload_file: null,
    });
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    const formErrors = validateRequestForm(currentRequest);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    // Create FormData for file upload
    const formData = new FormData();
    for (const key in currentRequest) {
      if (key === 'upload_file') {
        if (currentRequest[key]) {
          formData.append(key, currentRequest[key]);
        }
      } else {
        formData.append(key, currentRequest[key]);
      }
    }
  
    dispatch(saveRequest(formData))
      .unwrap()
      .then(() => {
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: currentRequest?.id ? "Request updated successfully" : "New request created successfully",
          severity: "success",
        });
      })
      .catch((error) => {
        setErrors(error.errors || {});
      });
  };

  const handleDelete = () => {
    dispatch(deleteIssueRequest(currentRequest.id))
      .unwrap()
      .then(() => {
        setDeleteDialog(false);
        setSnackbar({
          open: true,
          message: "Request deleted successfully",
          severity: "success",
        });
      });
  };

  const validateRequestForm = (data) => {
    const newErrors = {};
    if (!data.device) newErrors.device = "Device is required";
    if (!data.start_date) newErrors.start_date = "Start date is required";
    if (!data.end_date) newErrors.end_date = "End date is required";
    if (!data.production_amount || parseFloat(data.production_amount) <= 0) {
      newErrors.production_amount = "Valid production amount required";
    }
    return newErrors;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRefresh = () => {
    dispatch(fetchRequests());
  };

  // Filter and sort requests
  const filteredAndSortedRequests = [...(requests || [])]
    .filter((request) => {
      const matchesSearch = 
        request.id?.toString().includes(searchTerm) ||
        request.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.production_amount?.toString().includes(searchTerm);
      
      const matchesStatus = filterStatus ? request.status === filterStatus : true;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let fieldA, fieldB;
      
      if (sortField === "device") {
        fieldA = a.device_name?.toLowerCase() || "";
        fieldB = b.device_name?.toLowerCase() || "";
      } else if (sortField === "production_amount") {
        fieldA = parseFloat(a.production_amount) || 0;
        fieldB = parseFloat(b.production_amount) || 0;
      } else if (sortField === "start_date" || sortField === "end_date") {
        fieldA = new Date(a[sortField] || 0).getTime();
        fieldB = new Date(b[sortField] || 0).getTime();
      } else {
        fieldA = a[sortField];
        fieldB = b[sortField];
      }
      
      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const paginatedRequests = filteredAndSortedRequests.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  const statusConfig = {
    draft: { 
      color: "bg-gray-100 text-gray-700 border-gray-200", 
      icon: <Clock className="w-4 h-4 mr-1" /> 
    },
    submitted: { 
      color: "bg-blue-100 text-blue-700 border-blue-200", 
      icon: <Info className="w-4 h-4 mr-1" /> 
    },
    approved: { 
      color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
      icon: <CheckCircle className="w-4 h-4 mr-1" /> 
    },
    rejected: { 
      color: "bg-red-100 text-red-700 border-red-200", 
      icon: <XCircle className="w-4 h-4 mr-1" /> 
    }
  };

  const stats = [
    { 
      title: "Total Devices", 
      value: dashboardStats.totalDevices || 0, 
      icon: <BarChart className="w-6 h-6 text-emerald-700" />,
      color: "bg-emerald-50",
      borderColor: "border-emerald-100",
      hoverColor: "hover:bg-emerald-100",
    },
    { 
      title: "Active Requests", 
      value: dashboardStats.pendingRequests || 0, 
      icon: <FileText className="w-6 h-6 text-purple-700" />,
      color: "bg-purple-50",
      borderColor: "border-purple-100",
      hoverColor: "hover:bg-purple-100",
    },
    { 
      title: "Total Production", 
      value: `${(dashboardStats.totalProduction || 0).toFixed(2)} MW`, 
      icon: <Zap className="w-6 h-6 text-amber-700" />,
      color: "bg-amber-50",
      borderColor: "border-amber-100",
      hoverColor: "hover:bg-amber-100",
    },
    { 
      title: "Recent Submissions", 
      value: recentSubmissions.length, 
      icon: <Calendar className="w-6 h-6 text-blue-700" />,
      color: "bg-blue-50",
      borderColor: "border-blue-100",
      hoverColor: "hover:bg-blue-100",
    }
  ];

  if (requests.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading your request data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 opacity-10"></div>
            </div>
            
            <div className="relative z-10 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Issue Request Management
                </h2>
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  <span>New Request</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`${stat.color} ${stat.borderColor} border rounded-xl p-4 transition-all duration-300 hover:shadow-md ${stat.hoverColor}`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{stat.title}</p>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-700 dark:text-gray-200"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-4">
                <select
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <button
                  onClick={handleRefresh}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th 
                    onClick={() => handleSort("id")}
                    className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-center gap-2">
                      ID
                      {sortField === "id" && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("device")}
                    className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-center gap-2">
                      Device
                      {sortField === "device" && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("status")}
                    className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortField === "status" && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("start_date")}
                    className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-center gap-2">
                      Dates
                      {sortField === "start_date" && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("production_amount")}
                    className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-center gap-2">
                      Production
                      {sortField === "production_amount" && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedRequests.map((request) => (
                  <tr 
                    key={request.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{request.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {request?.device_name || "Unknown Device"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[request.status]?.color || statusConfig.draft.color}`}>
                        {statusConfig[request.status]?.icon || statusConfig.draft.icon}
                        {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || "Draft"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {request.start_date && request.end_date ? (
                        <>
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </>
                      ) : (
                        "Not specified"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {request.production_amount} MW
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setCurrentRequest(request);
                            setOpenDialog(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-full transition-colors duration-200"
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentRequest(request);
                            setDeleteDialog(true);
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors duration-200"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                No requests found
              </h4>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-md mx-auto">
                {searchTerm || filterStatus
                  ? "No requests match your search criteria. Try adjusting your filters."
                  : "Start by creating a new request using the button above."}
              </p>
              {(searchTerm || filterStatus) && (
                <button
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-300"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("");
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {paginatedRequests.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredAndSortedRequests.length)} of{' '}
                <span className="font-medium">{filteredAndSortedRequests.length}</span> results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * rowsPerPage >= filteredAndSortedRequests.length}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {openDialog && (
        <Modal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '95%' : 'auto',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow: 24,
          }}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {currentRequest?.id ? 'Edit Request' : 'Create New Request'}
                </h2>
                <button
                  onClick={() => setOpenDialog(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  {Object.values(errors).map((error, index) => (
                    <p key={index} className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 inline" /> {error}
                    </p>
                  ))}
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Device Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Device
                  </label>
                  <select
                    value={currentRequest?.device || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      device: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  >
                    <option value="">Select a device</option>
                    {devices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.device_name} ({device.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={currentRequest?.start_date || ""}
                      onChange={(e) => setCurrentRequest(prev => ({
                        ...prev,
                        start_date: e.target.value
                      }))}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={currentRequest?.end_date || ""}
                      onChange={(e) => setCurrentRequest(prev => ({
                        ...prev,
                        end_date: e.target.value
                      }))}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                    />
                  </div>
                </div>

                {/* Production Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Production Amount (MW)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    min="0.000001"
                    value={currentRequest?.production_amount || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      production_amount: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period of Production
                  </label>
                  <input
                    type="text"
                    value={currentRequest?.period_of_production || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      period_of_production: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  />
                </div>

                {/* Recipient Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient Account
                  </label>
                  <input
                    type="text"
                    value={currentRequest?.recipient_account || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      recipient_account: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  />
                </div>

                {/* Status Selection (for editing) */}
                {currentRequest?.id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={currentRequest?.status || "draft"}
                      onChange={(e) => setCurrentRequest(prev => ({
                        ...prev,
                        status: e.target.value
                      }))}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                    >
                      {["draft", "submitted", "approved", "rejected"].map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={currentRequest?.notes || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                  />
                </div>

                {/* File Upload Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload Supporting Document
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      onChange={(e) => setCurrentRequest(prev => ({
                        ...prev,
                        upload_file: e.target.files[0]
                      }))}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-900/30 dark:file:text-emerald-400 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-800/40"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                    />
                    {currentRequest?.upload_file && (
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {currentRequest.upload_file.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Supported formats: PDF, DOC, XLS, JPG, PNG (Max 25MB)
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                >
                  {currentRequest?.id ? 'Update Request' : 'Create Request'}
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      )}
   
      {deleteDialog && (
        <Modal
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: '500px',
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow: 24,
          }}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete this request? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
                <button
                  onClick={() => setDeleteDialog(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          className="!items-center"
          iconMapping={{
            success: <CheckCircle className="w-5 h-5" />,
            error: <AlertCircle className="w-5 h-5" />,
            info: <Info className="w-5 h-5" />,
            warning: <AlertCircle className="w-5 h-5" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default IssueRequestDashboard;