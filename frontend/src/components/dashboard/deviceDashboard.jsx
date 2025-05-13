import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { selectDashboardData, selectUserDevices } from "../../redux/selectors";
import {
  fetchDevices,
  fetchUserDevices,
  deleteDevice,
  updateDevice,
  fetchDeviceById
} from "../../redux/slices/deviceSlice";
import {
  Edit,
  AlertCircle,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  SquarePlus,
  X,
  Wind,
  Zap,
  Sun,
  Droplet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fadeIn, staggerChildren } from "./animations";
import DeviceUploadStepper from "./deviceStepper";
import { useMediaQuery, useTheme, styled, FormHelperText, FormControl, InputLabel, Button} from "@mui/material";
import { CloudUpload, Description, CheckCircle } from '@mui/icons-material';
import {
  Modal,
  Box,
  Alert,
  Snackbar,
  Fab,
} from "@mui/material";

// Function to get fuel type icon
const getFuelIcon = (fuelType) => {
  if (!fuelType) return <Wind className="w-5 h-5" />;
  
  const type = fuelType.toLowerCase();
  if (type.includes("wind")) return <Wind className="w-5 h-5" />;
  if (type.includes("solar")) return <Sun className="w-5 h-5" />;
  if (type.includes("hydro")) return <Droplet className="w-5 h-5" />;
  return <Zap className="w-5 h-5" />;
};

const DeviceStatusBadge = ({ status }) => {
  const statusConfig = {
    Approved: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      icon: <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
    },
    Pending: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      icon: <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
    },
    Rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
    },
    Draft: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
    }
  };

  const config = statusConfig[status] || statusConfig.Draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {status || "Draft"}
    </span>
  );
};

const DeviceEditModal = ({ device, open, onClose, onSave }) => {
  const [editedDevice, setEditedDevice] = useState(device);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditedDevice(device);
  }, [device]);

  const validateDevice = (device) => {
    const errors = {};
    if (!device?.device_name) errors.device_name = "Device name is required";
    return errors;
  };

  const handleSubmit = () => {
    const validationErrors = validateDevice(editedDevice);
    if (Object.keys(validationErrors).length === 0) {
      onSave(editedDevice);
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  if (!device) return null;

  return (
    <Modal open={open} onClose={onClose} className="flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl mx-auto w-full transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Device</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Device Name</label>
            <input
              value={editedDevice?.device_name || ""}
              onChange={(e) =>
                setEditedDevice((prev) => ({
                  ...prev,
                  device_name: e.target.value,
                }))
              }
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            {errors.device_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.device_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Fuel Type</label>
            <input
              value={editedDevice?.fuel_type || ""}
              onChange={(e) =>
                setEditedDevice((prev) => ({
                  ...prev,
                  fuel_type: e.target.value,
                }))
              }
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Technology Type</label>
            <input
              value={editedDevice?.technology_type || ""}
              onChange={(e) =>
                setEditedDevice((prev) => ({
                  ...prev,
                  technology_type: e.target.value,
                }))
              }
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Capacity (MW)</label>
            <input
              type="number"
              value={editedDevice?.capacity || ""}
              onChange={(e) =>
                setEditedDevice((prev) => ({
                  ...prev,
                  capacity: e.target.value,
                }))
              }
              className="w-full border dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Device Card Component for mobile view
const DeviceCard = ({ device, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{device.device_name}</h3>
          <DeviceStatusBadge status={device.status || "Draft"} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-full mr-3">
              {getFuelIcon(device.fuel_type)}
            </div>
            <span>{device.fuel_type || "Not specified"}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full mr-3">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span>{Number(device.capacity).toLocaleString()} MW</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full mr-3">
              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span>{device.effective_date || "Not specified"}</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => onEdit(device.id)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" /> Edit
          </button>
          <button
            onClick={() => onDelete(device.id)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.devices);
  const devices = useSelector(selectUserDevices);
  const dashboardData = useSelector(selectDashboardData);
  
  // State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("device_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFuel, setFilterFuel] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(isMobile ? "grid" : "table");

  useEffect(() => {
    if (user) {
      dispatch(fetchUserDevices(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setViewMode(isMobile ? "grid" : "table");
  }, [isMobile]);

  const handleDelete = (deviceId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this device? This action cannot be undone."
      )
    ) {
      dispatch(deleteDevice(deviceId))
        .unwrap()
        .then(() => {
          setSnackbar({
            open: true,
            message: "Device deleted successfully.",
            severity: "success",
          });
        });
    }
  };

  const handleRefresh = () => {
    if (user) {
      dispatch(fetchUserDevices(user.id))
        .unwrap()
        .then(() => {
          setSnackbar({
            open: true,
            message: "Refresh successful.",
            severity: "success",
          });
        });
    }
  };

  const handleEdit = async (deviceId) => {
    try {
      const result = await dispatch(fetchDeviceById(deviceId));
      if (result.payload) {
        setSelectedDevice(result.payload);
        setEditModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching device:", error);
    }
  };

  // Sort and filter logic
  const sortedAndFilteredDevices = [...(devices || [])]
    .filter((device) => {
      const matchesSearch =
        device.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.fuel_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.technology_type?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus
        ? device.status === filterStatus
        : true;
      const matchesFuel = filterFuel ? device.fuel_type === filterFuel : true;

      return matchesSearch && matchesStatus && matchesFuel;
    })
    .sort((a, b) => {
      const fieldA = a[sortField] || "";
      const fieldB = b[sortField] || "";
      
      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const uniqueFuelTypes = [
    ...new Set(devices?.map((device) => device.fuel_type).filter(Boolean) || []),
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const deviceCountByStatus = (devices || []).reduce((acc, device) => {
    const status = device.status || "Draft";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const totalCapacity = (devices || []).reduce((total, device) => {
    return total + Number(device.capacity || 0);
  }, 0);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-200">Loading your devices...</span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 my-4 rounded-lg">
            <div className="flex">
              <div className="flex-1">
                <h3 className="text-red-800 dark:text-red-300 font-medium">Error Loading Devices</h3>
                <p className="text-red-700 dark:text-red-200">{error}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header with Stats */}
        <motion.div 
          variants={fadeIn}
          className="mb-8"
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Device Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your renewable energy devices and monitor their status.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Devices Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Devices</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    {devices?.length || 0}
                  </h3>
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Approved Devices Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved Devices</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    {deviceCountByStatus.Approved || 0}
                  </h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Pending Devices Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Devices</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    {deviceCountByStatus.Pending || 0}
                  </h3>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Total Capacity Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Capacity</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                    {totalCapacity.toLocaleString()} <span className="text-base font-medium">MW</span>
                  </h3>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
        </motion.div>

        {/* Main Content */}
        <motion.div variants={fadeIn}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Header with Add Button */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Devices
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Device
                </motion.button>
              </div>
            </div>

            {/* Filters Section */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Search devices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="md:col-span-3">
                  <select
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                <select
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  value={filterFuel}
                  onChange={(e) => setFilterFuel(e.target.value)}
                >
                  <option value="">All Fuel Types</option>
                  {uniqueFuelTypes.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex">
                <button
                  onClick={handleRefresh}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </button>
              </div>

              {(searchTerm || filterStatus || filterFuel) && (
                <div className="md:col-span-12 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("");
                      setFilterFuel("");
                    }}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4 mr-1" /> Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* View Mode Toggle for mobile/tablet */}
          {isMobile && (
            <div className="flex justify-end p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <button
                  className={`py-2 px-4 text-sm flex items-center ${
                    viewMode === "table"
                      ? "bg-emerald-500 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                  }`}
                  onClick={() => setViewMode("table")}
                >
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 10H21M3 14H21M3 18H21M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  List
                </button>
                <button
                  className={`py-2 px-4 text-sm flex items-center ${
                    viewMode === "grid"
                      ? "bg-emerald-500 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 5H5V10H10V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 5H14V10H19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 14H5V19H10V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 14H14V19H19V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Grid
                </button>
              </div>
            </div>
          )}

          {/* Devices List/Grid Content */}
          {sortedAndFilteredDevices.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h4 className="text-xl font-medium text-gray-600 dark:text-gray-300">No devices found</h4>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-md mx-auto">
                {searchTerm || filterStatus || filterFuel
                  ? "No devices match your search criteria. Try adjusting your filters."
                  : "Start by registering a new device using the 'Add New Device' button."}
              </p>
              {(searchTerm || filterStatus || filterFuel) && (
                <button
                  className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("");
                    setFilterFuel("");
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                // Grid View for Mobile
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {sortedAndFilteredDevices.map((device) => (
                      <DeviceCard
                        key={device.id}
                        device={device}
                        onEdit={() => handleEdit(device.id)}
                        onDelete={() => handleDelete(device.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                // Table View
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/60">
                      <tr>
                        {[
                          { label: "Device Name", field: "device_name" },
                          { label: "Fuel Type", field: "fuel_type" },
                          { label: "Technology", field: "technology_type" },
                          { label: "Capacity (MW)", field: "capacity" },
                          { label: "Status", field: "status" },
                          { label: "Registration Date", field: "effective_date" },
                        ].map((header) => (
                          <th
                            key={header.field}
                            onClick={() => handleSort(header.field)}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/30"
                          >
                            <div className="flex items-center gap-2">
                              {header.label}
                              {sortField === header.field &&
                                (sortDirection === "asc" ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                ))}
                            </div>
                          </th>
                        ))}
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <AnimatePresence>
                        {sortedAndFilteredDevices.map((device) => (
                          <motion.tr
                            key={device.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              {device.device_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center">
                                <div className="mr-2">
                                  {getFuelIcon(device.fuel_type)}
                                </div>
                                {device.fuel_type || "Not specified"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                              {device.technology_type || "Not specified"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                              {Number(device.capacity).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <DeviceStatusBadge status={device.status || "Draft"} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                              {device.effective_date || "Not specified"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEdit(device.id)}
                                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(device.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row justify-between items-center text-gray-600 dark:text-gray-300">
              <p className="text-sm mb-4 sm:mb-0">
                Showing {sortedAndFilteredDevices.length} of{" "}
                {devices?.length || 0} devices
              </p>
              
              {/* Pagination controls can be added here if needed */}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating action button for mobile view */}
      <motion.div
        className="fixed z-50 bottom-6 right-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: '#10b981',
            '&:hover': {
              bgcolor: '#059669',
            },
          }}
        >
          <SquarePlus className="text-white" size={24} />
        </Fab>
      </motion.div>

      {/* Device Upload Stepper Modal */}
      <DeviceUploadStepper
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
      />

      {/* Device Edit Modal */}
      <DeviceEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDevice(null);
        }}
        device={selectedDevice}
        onSave={(updatedDevice) => {
          dispatch(
            updateDevice({
              id: selectedDevice.id,
              data: updatedDevice,
            })
          )
            .unwrap()
            .then(() => {
              setSnackbar({
                open: true,
                message: "Device updated successfully",
                severity: "success",
              });
            })
            .catch((error) => {
              setSnackbar({
                open: true,
                message: `Error: ${error.message || "Failed to update device"}`,
                severity: "error",
              });
            });
        }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          className="!flex !items-center shadow-lg"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </div>
    </motion.div>
  );
};

// Helper function for status colors (needed for the second dashboard version)
const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default UserDashboard;