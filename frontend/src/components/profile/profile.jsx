import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile, clearProfileError } from "../../redux/slices/profileSlice";
import {
  User,
  Edit,
  Check,
  X,
  Camera,
  Mail,
  Calendar,
  Phone,
  BriefcaseBusiness,
  ArrowBigUp,
  Settings,
  Shield,
  Wind,
  Zap,
  Database,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Component for the user profile
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profileData, loading, error } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formValues, setFormValues] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone: ""
  });
  
  // Colors matching the homepage theme
  const colors = {
    primary: "bg-emerald-600",
    primaryHover: "hover:bg-emerald-700",
    secondary: "bg-purple-600",
    secondaryHover: "hover:bg-purple-700",
    accent: "bg-amber-500",
    accentHover: "hover:bg-amber-600",
    dark: "bg-gray-800",
    darkHover: "hover:bg-gray-900",
    light: "bg-gray-50",
    lightHover: "hover:bg-gray-100"
  };

  // Load profile data
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Update form values when profile data changes
  useEffect(() => {
    if (profileData) {
      setFormValues({
        username: profileData.username || user?.username || "",
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        phone: profileData.phone || ""
      });
      setPreviewUrl(profileData.profile_picture?.url || "");
    }
  }, [profileData, user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("username", formValues.username);
      formData.append("first_name", formValues.first_name);
      formData.append("last_name", formValues.last_name);
      formData.append("phone", formValues.phone);
      
      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }

      await dispatch(updateProfile(formData)).unwrap();
      setToast({ visible: true, message: "Profile updated successfully!", type: "success" });
      setEditMode(false);
      setSelectedFile(null);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast({ visible: false, message: "", type: "" });
      }, 3000);
    } catch (err) {
      setToast({ 
        visible: true, 
        message: err.detail || "Failed to update profile", 
        type: "error" 
      });
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast({ visible: false, message: "", type: "" });
      }, 3000);
    }
  };

  // Reset form
  const handleCancel = () => {
    setEditMode(false);
    setFormValues({
      username: profileData?.username || user?.username || "",
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      phone: profileData?.phone || ""
    });
    setSelectedFile(null);
    setPreviewUrl(profileData?.profile_picture || "");
  };

  // Toast notification component
  const Toast = () => (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          <span>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Profile content
  const ProfileContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className={`rounded-full overflow-hidden w-32 h-32 ${colors.primary} border-4 border-white shadow-lg`}>
                <img
                  src={previewUrl || "/api/placeholder/128/128"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              
              {editMode && (
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <div className={`${colors.accent} ${colors.accentHover} rounded-full p-2 shadow-md transition-transform transform hover:scale-110`}>
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            
            {editMode && (
              <p className="text-sm text-gray-500">Click the camera icon to update photo</p>
            )}
          </div>

          {/* Profile Information Section */}
          <div className="flex-1 w-full space-y-6">
            {editMode ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formValues.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Username"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="first_name"
                    value={formValues.first_name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formValues.last_name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Last Name"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Phone Number"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {profileData?.first_name || profileData?.last_name
                      ? `${profileData.first_name} ${profileData.last_name}`
                      : profileData?.username || user?.username}
                  </h2>
                  <div className={`${colors.primary} px-3 py-1 rounded-full flex items-center gap-1 text-white text-sm`}>
                    <Check className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-emerald-500 to-purple-500 my-4"></div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`${colors.light} p-2 rounded-full`}>
                      <User className={`w-5 h-5 text-emerald-600`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium">{profileData?.username || user?.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`${colors.light} p-2 rounded-full`}>
                      <Mail className={`w-5 h-5 text-emerald-600`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                  
                  {profileData?.phone && (
                    <div className="flex items-center gap-3">
                      <div className={`${colors.light} p-2 rounded-full`}>
                        <Phone className={`w-5 h-5 text-emerald-600`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profileData.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className={`${colors.light} p-2 rounded-full`}>
                      <Calendar className={`w-5 h-5 text-emerald-600`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {profileData?.created_at 
                          ? new Date(profileData.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          {editMode ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg ${colors.primary} ${colors.primaryHover} text-white transition-colors`}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Check className="w-5 h-5" />
                )}
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg ${colors.secondary} ${colors.secondaryHover} text-white transition-colors`}
            >
              <Edit className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );

  // Devices content
  const DevicesContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((device) => (
          <div key={device} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-transform hover:transform hover:scale-105">
            <div className={`h-2 ${
              device === 1 ? colors.primary : device === 2 ? colors.secondary : colors.accent
            }`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colors.light}`}>
                  {device === 1 ? (
                    <Wind className="w-6 h-6 text-emerald-600" />
                  ) : device === 2 ? (
                    <Zap className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Database className="w-6 h-6 text-amber-600" />
                  )}
                </div>
                <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Active
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-2">
                {device === 1 ? "Wind Turbine - T1023" : device === 2 ? "Solar Panel - S6581" : "Hydro Generator - H2209"}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium text-gray-800">
                    {device === 1 ? "Nairobi, Kenya" : device === 2 ? "Lagos, Nigeria" : "Cape Town, South Africa"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-medium text-gray-800">
                    {device === 1 ? "2.5 MW" : device === 2 ? "1.8 MW" : "3.2 MW"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span className="font-medium text-gray-800">
                    {device === 1 ? "2 hours ago" : device === 2 ? "5 hours ago" : "Yesterday"}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className={`w-full py-2 rounded-lg ${colors.light} ${colors.lightHover} text-sm font-medium text-gray-700 transition-colors`}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <button className={`flex items-center gap-2 px-5 py-2.5 rounded-lg ${colors.primary} ${colors.primaryHover} text-white transition-colors`}>
          <Award className="w-5 h-5" />
          <span>Register New Device</span>
        </button>
      </div>
    </motion.div>
  );

  // Applications content
  const ApplicationsContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <ArrowBigUp className="w-6 h-6 text-emerald-600" />
          <h3 className="text-xl font-bold">REC Applications</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submit Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: "APP-2580", device: "Wind Turbine - T1023", date: "May 10, 2025", status: "Approved", recs: 45 },
                { id: "APP-2493", device: "Solar Panel - S6581", date: "Apr 25, 2025", status: "Pending", recs: 32 },
                { id: "APP-2371", device: "Hydro Generator - H2209", date: "Apr 15, 2025", status: "Approved", recs: 63 }
              ].map((app, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.device}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.status === "Approved" 
                        ? "bg-green-100 text-green-800" 
                        : app.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{app.recs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button className={`flex items-center gap-2 px-5 py-2.5 rounded-lg ${colors.secondary} ${colors.secondaryHover} text-white transition-colors`}>
            <ArrowBigUp className="w-5 h-5" />
            <span>Create New Application</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-12">
      {/* Background gradient pattern inspired by homepage */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-purple-600/10"></div>
      </div>
      
      {/* Toast notifications */}
      <Toast />
      
      {/* Header with user role indicator */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
          user?.is_superuser ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
        }`}>
          {user?.is_superuser ? (
            <Shield className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {user?.is_superuser ? "Administrator" : "Device Owner"}
          </span>
        </div>
      </div>
      
      {/* Tabs navigation */}
      <div className="relative z-10 flex overflow-x-auto pb-2 mb-6 hide-scrollbar">
        <div className="flex space-x-1 p-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
          {[
            { id: "profile", icon: <User />, label: "Profile" },
            { id: "devices", icon: <Wind />, label: "My Devices" },
            { id: "applications", icon: <ArrowBigUp />, label: "Applications" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? `${colors.primary} text-white`
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="w-5 h-5">{tab.icon}</div>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100">
        {loading && !profileData ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="w-5 h-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error.detail || "Failed to load profile"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "profile" && <ProfileContent />}
            {activeTab === "devices" && <DevicesContent />}
            {activeTab === "applications" && <ApplicationsContent />}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;