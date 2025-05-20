import React, { useState, useEffect } from "react";
import { deviceAPI } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { Description } from "@mui/icons-material";
import { createDevice } from "../../redux/slices/deviceSlice";
import {
  CloudUpload,
  X,
  ArrowLeft,
  ArrowRight,
  FileCheck,
  Info,
  MapPin,
  Building,
  Zap,
  FileText,
  Leaf,
  BatteryCharging,
  Globe,
  Cpu,
  Sun,
  Hash,
  Map,
  UploadCloud,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  Button,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
  Divider,
  Alert,
  useMediaQuery,
  styled,
  Snackbar,
  FormHelperText,
  Typography,
} from "@mui/material";

const countries = [
  "Uganda",
  "Zambia",
  "Malawi",
  "Namibia",
  "Lesotho",
  "Eswatini",
  "Angola",
  "DRC",
];

const fuelTypes = ["Solar", "Wind", "Hydro", "Biomass", "Diesel", "Hybrid"];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const StepCard = ({ children, icon, title, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl shadow-sm p-6 mb-6 border border-${color}-100`}
  >
    <div className="flex items-center mb-6 space-x-3">
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const EcoButton = ({ children, onClick, variant = "primary", ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`rounded-xl px-6 py-3 font-medium transition-all flex items-center ${
      variant === "primary"
        ? "bg-emerald-600 text-white hover:bg-emerald-700"
        : "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
    } ${props.className || ""}`}
    {...props}
  >
    {children}
  </motion.button>
);

const EDocumentUpload = ({
  id,
  label,
  shortLabel,
  description,
  accept = ".pdf,.doc,.docx,image/*",
  onUpload,
  file,
  onRemove,
  required = false,
  error = null,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`border-2 border-dashed ${
        error
          ? "border-red-200 bg-red-50"
          : file
          ? "border-emerald-200 bg-emerald-50"
          : "border-emerald-100"
      } rounded-xl p-4 mb-4 transition-colors`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <UploadCloud
            className={`${error ? "text-red-500" : "text-emerald-600"} mt-1`}
          />
          <div>
            <p
              className={`font-medium ${
                error ? "text-red-600" : "text-gray-900"
              }`}
            >
              {label} {required && <span className="text-red-500">*</span>}
            </p>
            <p className="text-sm text-gray-500 mb-1">{description}</p>
            <p className="text-xs text-gray-400">
              Accepted formats: {accept.replaceAll(".", " ")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          {file && (
            <div className="flex items-center space-x-2 max-w-xs">
              <FileText className="text-emerald-600 flex-shrink-0" size={16} />
              <p className="text-gray-600 text-sm truncate">{file.name}</p>
              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500 flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <label
            className={`cursor-pointer px-3 py-1.5 ${
              file
                ? "bg-white text-gray-700 border border-gray-300"
                : "bg-emerald-600 text-white border border-emerald-600"
            } hover:bg-opacity-90 rounded-md text-sm transition-colors flex-shrink-0`}
          >
            {file ? "Replace" : "Upload"}
            <input
              id={id}
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
            />
          </label>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </motion.div>
  );
};

const FileUploadCard = ({
  label,
  accept,
  onUpload,
  file,
  onRemove,
  required,
  error,
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`border-2 border-dashed ${
      error ? "border-red-200 bg-red-50" : "border-emerald-100"
    } rounded-xl p-4 mb-4 transition-colors`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <UploadCloud
          className={`${error ? "text-red-500" : "text-emerald-600"}`}
        />
        <div>
          <p
            className={`font-medium ${
              error ? "text-red-600" : "text-gray-900"
            }`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </p>
          <p className="text-sm text-gray-500">
            {accept.replaceAll(".", " • ")}
          </p>
        </div>
      </div>

      {file ? (
        <div className="flex items-center space-x-2">
          <CheckCircle className="text-emerald-600" />
          <p className="text-gray-600 text-sm">{file.name}</p>
          <IconButton onClick={onRemove} size="small">
            <X className="text-gray-400 hover:text-red-500" size={16} />
          </IconButton>
        </div>
      ) : (
        <input
          type="file"
          hidden
          accept={accept}
          onChange={(e) => onUpload(e.target.files[0])}
          id={label}
        />
      )}
    </div>
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  </motion.div>
);

const dialogAnimation = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { type: "spring", duration: 0.5 },
};

const DeviceUploadStepper = ({ open, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useSelector((state) => state.auth.user);
  const [activeStep, setActiveStep] = useState(0);
  const [docFile, setDocFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [technologyOptions, setTechnologyOptions] = useState([]);

  const initialFormState = {
    device_name: "",
    issuer_organisation: "",
    default_account_code: user?.id || "",
    country: "",

    fuel_type: "",
    technology_type: "",
    capacity: "",
    commissioning_date: "",
    effective_date: "",

    address: "",
    latitude: "",
    longitude: "",
    postcode: "",

    number_of_generating_units: 1,
    meter_ids: "",
    network_owner: "",
    connection_voltage: "",
    grid_connection_details: "",
    volume_evidence_type: "Metering",
    volume_evidence_other: "",
    carbon_offset_registration: "",
    labelling_scheme: "",
    public_funding: "None",
    funding_end_date: "",
    onsite_consumer: "No",
    onsite_consumer_details: "",
    auxiliary_energy: "No",
    auxiliary_energy_details: "",
    electricity_import_details: "",

    documents: {
      sf02: null,
      sf02c: null,
      metering: null,
      diagram: null,
      photos: null,
    },
    additional_notes: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const requiredDocuments = ["specsDoc", "certifications"];
  const DOCUMENT_TYPES = [
    {
      id: "sf02",
      label: "Form SF-02 - Registration",
      shortLabel: "SF-02 Form",
      required: true,
      accept: ".pdf",
      description: "Official registration form",
    },
    {
      id: "sf02c",
      label: "SF-02C Owner's Declaration",
      shortLabel: "SF-02C Form",
      required: true,
      accept: ".pdf,.doc,.docx",
      description: "Declaration of ownership",
    },
    {
      id: "metering",
      label: "Metering Evidence",
      shortLabel: "Metering",
      required: true,
      accept: ".pdf,.xls,.xlsx",
      description: "Electricity metering confirmation",
    },
    {
      id: "diagram",
      label: "Single Line Diagram",
      shortLabel: "Diagram",
      required: true,
      accept: ".pdf,.dwg,.dxf",
      description: "Electrical system diagram",
    },
    {
      id: "photos",
      label: "Project Photos",
      shortLabel: "Photos",
      required: true,
      accept: "image/*",
      description: "Photos of installation",
    },
  ];
  const fuelTechnologyMap = {
    Solar: ["TC110", "TC120", "TC130", "TC140"],
    Wind: ["TC210", "TC220"],
    Hydro: ["TC310", "TC320", "TC330"],
    Biomas: ["TC410", "TC411", "TC421", "TC422", "TC423", "TC424"],
    Geothermal: ["TC510", "TC520", "TC530"],
  };

  const steps = [
    {
      id: 0,
      title: "Basic Info",
      icon: <Leaf size={24} />,
      color: "emerald",
      fields: ["device_name", "issuer_organisation", "country"],
    },
    {
      id: 1,
      title: "Tech Specs",
      icon: <Cpu size={24} />,
      color: "amber",
      fields: [
        "fuel_type",
        "technology_type",
        "capacity",
        "commissioning_date",
        "effective_date",
      ],
    },
    {
      id: 2,
      title: "Location",
      icon: <Globe size={24} />,
      color: "blue",
      fields: ["address", "latitude", "longitude", "postcode"],
    },
    {
      id: 3,
      title: "Grid Data",
      icon: <BatteryCharging size={24} />,
      color: "blue",
      fields: [
        "meter_ids",
        "network_owner",
        "connection_voltage",
        "grid_connection_details",
        "volume_evidence_type",
        "volume_evidence_other",
      ],
    },
    {
      id: 4,
      title: "Business Details",
      icon: <Building size={24} />,
      fields: [
        "onsite_consumer",
        "onsite_consumer_details",
        "auxiliary_energy",
        "auxiliary_energy_details",
        "electricity_import_details",
        "carbon_offset_registration",
        "labelling_scheme",
        "public_funding",
        "funding_end_date",
      ],
    },
    {
      id: 5,
      title: "Documents",
      icon: <FileText size={24} />,
      fields: ["sf02", "sf02c", "metering", "diagram", "photos"],
    },
  ];

  const ONSITE_CONSUMER_CHOICES = [
    ["Yes", "Yes"],
    ["No", "No"],
  ];

  const StepIndicator = React.memo(({ index, active, step }) => (
    <motion.div
      className={`flex items-center px-4 py-2 rounded-full cursor-pointer ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-emerald-50 text-gray-600 hover:bg-emerald-100"
      }`}
      onClick={() => setActiveStep(index)}
    >
      <span className="mr-2">{step.icon}</span>
      {step.title}
      {active && (
        <span className="ml-2 bg-emerald-700 px-2 py-1 rounded-full text-xs">
          {index + 1}
        </span>
      )}
    </motion.div>
  ));

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "deviceName":
        if (!value.trim()) error = "Device name is required";
        break;
      case "capacity":
        if (!value || isNaN(value) || parseFloat(value) <= 0)
          error = "Valid capacity in MW is required";
        break;
      case "technologyType":
        if (!value) error = "Technology type is required";
        break;
      case "commissioningDate":
        if (!value) error = "Commissioning date is required";
        break;
      case "latitude":
        if (isNaN(value) || value < -90 || value > 90)
          error = "Valid latitude (-90 to 90) required";
        break;
      case "longitude":
        if (isNaN(value) || value < -180 || value > 180)
          error = "Valid longitude (-180 to 180) required";
        break;
      case "meterIds":
        if (!value.trim()) error = "At least one meter ID is required";
        break;
      case "specsDoc":
      case "certifications":
        if (!formData[name] && requiredDocuments.includes(name))
          error = "This document is required";
        break;
    }
    return error;
  };

  const validateStep = (stepIndex) => {
    const stepErrors = {};
    steps[stepIndex].fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) stepErrors[field] = error;
    });
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate all fields first
    let newErrors = {};
    let hasErrors = false;

    if (activeStep === 3) {
      if (!formData.meter_ids) {
        newErrors.meter_ids = "Meter IDs are required";
        hasErrors = true;
      }
      if (!formData.volume_evidence_type) {
        newErrors.volume_evidence_type = "Evidence type is required";
        hasErrors = true;
      }
      if (
        formData.volume_evidence_type === "Other" &&
        !formData.volume_evidence_other
      ) {
        newErrors.volume_evidence_other = "Please specify evidence type";
        hasErrors = true;
      }
    }

    if (activeStep === 4) {
      if (!formData.onsite_consumer) {
        newErrors.onsite_consumer = "On-site consumer selection required";
        hasErrors = true;
      }
      if (
        formData.onsite_consumer === "Yes" &&
        !formData.onsite_consumer_details
      ) {
        newErrors.onsite_consumer_details = "Consumer details required";
        hasErrors = true;
      }
      if (!formData.auxiliary_energy) {
        newErrors.auxiliary_energy = "Auxiliary energy selection required";
        hasErrors = true;
      }
      if (
        formData.auxiliary_energy === "Yes" &&
        !formData.auxiliary_energy_details
      ) {
        newErrors.auxiliary_energy_details = "Auxiliary details required";
        hasErrors = true;
      }
    }

    if (activeStep === 5) {
      if (!formData.public_funding) {
        newErrors.public_funding = "Public funding selection required";
        hasErrors = true;
      }
      if (formData.public_funding !== "None" && !formData.funding_end_date) {
        newErrors.funding_end_date = "Funding end date required";
        hasErrors = true;
      }
    }

    // Basic required field validation
    const requiredFields = [
      "device_name",
      "issuer_organisation",
      "fuel_type",
      "technology_type",
      "capacity",
      "commissioning_date",
      "effective_date",
      "address",
      "country",
      "latitude",
      "longitude",
      "postcode",
      "number_of_generating_units",
      "meter_ids",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
        hasErrors = true;
      }
    });

    const getStepFields = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return ["device_name", "issuer_organisation", "default_account_code"];
        case 1:
          return [
            "fuel_type",
            "technology_type",
            "capacity",
            "commissioning_date",
            "effective_date",
          ];
        case 2:
          return ["address", "country", "latitude", "longitude", "postcode"];
        case 3:
          return [
            "meter_ids",
            "network_owner",
            "connection_voltage",
            "grid_connection_details",
            "volume_evidence_type",
            "volume_evidence_other",

            ...(formData.volume_evidence_type === "Other"
              ? ["volume_evidence_other"]
              : []),
          ];
        case 4: // Business Details
          return [
            "onsite_consumer",
            "auxiliary_energy",
            ...(formData.onsite_consumer === "Yes"
              ? ["onsite_consumer_details"]
              : []),
            ...(formData.auxiliary_energy === "Yes"
              ? ["auxiliary_energy_details"]
              : []),
            "electricity_import_details",
            "carbon_offset_registration",
            "labelling_scheme",
            "public_funding",
            ...(formData.public_funding !== "No" ? ["funding_end_date"] : []),
          ];
        case 5:
          return ["documents", "additional_notes"];
        default:
          return [];
      }
    };

    // Special validations
    if (formData.latitude && !validateLatitude(formData.latitude)) {
      newErrors.latitude = "Must be between -90 and 90";
      hasErrors = true;
    }

    if (formData.longitude && !validateLongitude(formData.longitude)) {
      newErrors.longitude = "Must be between -180 and 180";
      hasErrors = true;
    }

    // Conditional validations
    if (formData.public_funding !== "None" && !formData.funding_end_date) {
      newErrors.funding_end_date = "Required when public funding is specified";
      hasErrors = true;
    }

    if (
      formData.onsite_consumer === "Yes" &&
      !formData.onsite_consumer_details
    ) {
      newErrors.onsite_consumer_details =
        "Required when on-site consumer is present";
      hasErrors = true;
    }

    if (
      formData.auxiliary_energy === "Yes" &&
      !formData.auxiliary_energy_details
    ) {
      newErrors.auxiliary_energy_details =
        "Required when auxiliary energy is present";
      hasErrors = true;
    }

    if (
      formData.volume_evidence_type === "Other" &&
      !formData.volume_evidence_other
    ) {
      newErrors.volume_evidence_other = "Please specify other evidence type";
      hasErrors = true;
    }

    // Document validation
    const requiredDocuments = DOCUMENT_TYPES.filter((doc) => doc.required).map(
      (doc) => doc.id
    );
    const missingDocuments = requiredDocuments.filter(
      (doc) => !formData.documents[doc]
    );

    if (missingDocuments.length > 0) {
      const missingLabels = missingDocuments.map(
        (doc) => DOCUMENT_TYPES.find((d) => d.id === doc).shortLabel
      );

      newErrors.documents = `Missing: ${missingLabels.join(", ")}`;
      hasErrors = true;

      enqueueSnackbar(
        `Missing required documents: ${missingLabels.join(", ")}`,
        { variant: "error" }
      );

      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));

      setActiveStep(3); // Jump to documents step
      return;
    }

    if (hasErrors) {
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));

      // Find the first step with errors
      for (let i = 0; i < steps.length; i++) {
        const stepFields = getStepFields(i);
        const hasStepError = stepFields.some((field) => newErrors[field]);
        if (hasStepError) {
          setActiveStep(i);
          enqueueSnackbar("Please correct the errors before submitting", {
            variant: "error",
          });
          return;
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append regular fields
      const fields = [
        "device_name",
        "issuer_organisation",
        "default_account_code",
        "fuel_type",
        "technology_type",
        "capacity",
        "commissioning_date",
        "effective_date",
        "address",
        "country",
        "postcode",
        "additional_notes",
        "number_of_generating_units",
        "meter_ids",
        "network_owner",
        "connection_voltage",
        "grid_connection_details",
        "volume_evidence_type",
        "volume_evidence_other",
        "carbon_offset_registration",
        "labelling_scheme",
        "public_funding",
        "onsite_consumer",
        "onsite_consumer_details",
        "auxiliary_energy",
        "auxiliary_energy_details",
        "electricity_import_details",
      ];

      fields.forEach((field) => {
        formDataToSend.append(field, formData[field]);
      });

      // Append numbers with proper formatting
      formDataToSend.append(
        "latitude",
        parseFloat(formData.latitude).toFixed(6)
      );
      formDataToSend.append(
        "longitude",
        parseFloat(formData.longitude).toFixed(6)
      );

      const fileFields = {
        sf02: "production_facility_registration",
        sf02c: "declaration_of_ownership",
        metering: "metering_evidence",
        diagram: "single_line_diagram",
        photos: "project_photos",
      };

      Object.entries(formData.documents).forEach(([docType, file]) => {
        if (file && fileFields[docType]) {
          formDataToSend.append(fileFields[docType], file);
        }
      });

      // Create device
      dispatch(createDevice(formDataToSend))
        .unwrap()
        .then(() => {
          setSnackbar({
            open: true,
            message: "Device Upload Successful.",
            severity: "success",
          });
        })
        .catch((error) => {
          console.error("Submission error:", error);
          enqueueSnackbar(error.message || "Submission failed", {
            variant: "error",
          });
        });

      setIsSubmitting(false);

      // Submit device
      //await deviceAPI.submit(response.data.id);

      // Handle success
      setSnackbar({
        open: true,
        message: "Device Upload Successful.",
        severity: "success",
      });
      onClose();
    } catch (error) {
      console.error("Submission error:", error);

      // Handle validation errors
      if (error.response?.data) {
        // Handle field-specific errors
        const apiErrors = error.response.data;
        const fieldErrors = {};

        // Map API errors to form fields
        Object.keys(apiErrors).forEach((key) => {
          fieldErrors[key] = apiErrors[key].join(", ");
        });

        // Update form errors state
        setErrors((prev) => ({
          ...prev,
          ...fieldErrors,
        }));

        // Show first error in snackbar
        const firstError = Object.values(apiErrors)[0]?.[0];
        if (firstError) {
          enqueueSnackbar(firstError, { variant: "error" });
        }

        // Jump to first error step
        const errorStep = steps.findIndex((step) =>
          Object.keys(apiErrors).some((field) =>
            getStepFields(step.id).includes(field)
          )
        );
        if (errorStep >= 0) setActiveStep(errorStep);
      } else {
        enqueueSnackbar("Submission failed. Please try again.", {
          variant: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (formData.fuel_type) {
      deviceAPI
        .getTechnologyOptions(formData.fuel_type)
        .then((response) => {
          setTechnologyOptions(response.data.options);
        })
        .catch((error) => {
          console.error("Error fetching technology options:", error);
          enqueueSnackbar("Failed to fetch technology options", {
            variant: "error",
          });
        });
    }
  }, [formData.fuel_type, enqueueSnackbar]);

  const useStepValidation = (activeStep, formData, steps) => {
    return React.useMemo(() => {
      const stepErrors = {};
      steps[activeStep].fields.forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) stepErrors[field] = error;
      });
      return Object.keys(stepErrors).length === 0;
    }, [activeStep, formData, steps]);
  };

  const isStepValid = useStepValidation(activeStep, formData, steps);

  const handleFileRemove = (docId) => {
    setFormData((prev) => {
      const newDocs = { ...prev.documents };
      delete newDocs[docId];
      return {
        ...prev,
        documents: newDocs,
      };
    });
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const validateLatitude = (value) => {
    if (value === "") return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= -90 && num <= 90;
  };

  const validateLongitude = (value) => {
    if (value === "") return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  };

  const handleFileUpload = (docId, file) => {
    if (file?.size > 10 * 1024 * 1024) {
      enqueueSnackbar("File size exceeds 10MB limit", { variant: "error" });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: file,
      },
    }));
    if (errors[docId]) setErrors((prev) => ({ ...prev, [docId]: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (name) => (event) => {
    setFormData({
      ...formData,
      [name]: event.target.files[0],
    });
  };

  const handleChange = (name) => (event) => {
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <StepCard
            icon={steps[0].icon}
            title="Project Overview"
            color={steps[0].color}
          >
            <div className="grid gap-4">
              <TextField
                fullWidth
                label="Device Name"
                name="device_name"
                value={formData.device_name}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                error={!!errors.device_name}
                helperText={errors.device_name}
                sx={{ mb: 1 }}
              />
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.country}>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={formData.country}
                    onChange={handleChange("country")}
                    label="Country"
                  >
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.country && (
                    <FormHelperText>{errors.country}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <TextField
                label="Organisation"
                name="issuer_organisation"
                value={formData.issuer_organisation}
                onChange={handleInputChange}
                error={!!errors.issuer_organisation}
                helperText={errors.issuer_organisation}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Sun className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </StepCard>
        );

      case 1:
        return (
          <StepCard
            icon={steps[1].icon}
            title="Technical Specifications"
            color={steps[1].color}
          >
            <div className="grid gap-4">
              <FormControl
                fullWidth
                size={isMobile ? "small" : "medium"}
                error={!!errors.fuel_type}
              >
                <InputLabel>Fuel Type</InputLabel>
                <Select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  required
                  MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                >
                  {Object.keys(fuelTechnologyMap).map((fuel) => (
                    <MenuItem key={fuel} value={fuel}>
                      {fuel}
                    </MenuItem>
                  ))}
                </Select>
                {errors.fuel_type && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5 }}
                  >
                    {errors.fuel_type}
                  </Typography>
                )}
              </FormControl>
              <FormControl
                fullWidth
                disabled={!formData.fuel_type}
                size={isMobile ? "small" : "medium"}
                error={!!errors.technology_type}
              >
                <InputLabel>Technology Type</InputLabel>
                <Select
                  name="technology_type"
                  value={formData.technology_type}
                  onChange={handleInputChange}
                  required
                >
                  {technologyOptions.map((tech) => (
                    <MenuItem key={tech.value} value={tech.value}>
                      {tech.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.technology_type && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5 }}
                  >
                    {errors.technology_type}
                  </Typography>
                )}
              </FormControl>

              <TextField
                label="Capacity (MW)"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                error={!!errors.capacity}
                helperText={errors.capacity}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">MW</InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Commissioning Date"
                name="commissioning_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.commissioning_date}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                error={!!errors.commissioning_date}
                helperText={errors.commissioning_date}
              />

              <TextField
                fullWidth
                label="Effective Date"
                name="effective_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.effective_date}
                onChange={handleInputChange}
                required
                size={isMobile ? "small" : "medium"}
                error={!!errors.effective_date}
                helperText={errors.effective_date}
              />
            </div>
          </StepCard>
        );

      case 2:
        return (
          <StepCard
            icon={steps[2].icon}
            title="Location Details"
            color={steps[2].color}
          >
            <div className="grid gap-4">
              <TextField
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  error={!!errors.latitude}
                  helperText={errors.latitude || "Between -90 and 90"}
                />
                <TextField
                  label="Longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  error={!!errors.longitude}
                  helperText={errors.longitude || "Between -180 and 180"}
                />
              </div>
              <TextField
                label="Postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
              />
            </div>
          </StepCard>
        );

      case 3:
        return (
          <StepCard
            icon={steps[3].icon}
            title="Grid Connection"
            color={steps[3].color}
          >
            <div className="grid gap-4">
              <TextField
                fullWidth
                label="Meter/Measurement IDs"
                name="meter_ids"
                value={formData.meter_ids}
                onChange={handleInputChange}
                required
                multiline
                rows={2}
                helperText="Comma-separated list of meter IDs"
                error={!!errors.meter_ids}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Connection Voltage"
                  name="connection_voltage"
                  value={formData.connection_voltage}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Network Owner"
                  name="network_owner"
                  value={formData.network_owner}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Grid Connection Details"
                  name="grid_connection_details"
                  value={formData.grid_connection_details}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </StepCard>
        );

      case 4:
        return (
          <StepCard
            icon={steps[3].icon}
            title="Grid Connection"
            color={steps[3].color}
          >
            <div className="grid gap-4">
              <FormControl fullWidth>
                <InputLabel>On-site Consumer</InputLabel>
                <Select
                  name="onsite_consumer"
                  value={formData.onsite_consumer}
                  onChange={handleInputChange}
                  required
                >
                  {ONSITE_CONSUMER_CHOICES.map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Connection Voltage"
                  name="connection_voltage"
                  value={formData.connection_voltage}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Network Owner"
                  name="network_owner"
                  value={formData.network_owner}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Grid Connection Details"
                  name="grid_connection_details"
                  value={formData.grid_connection_details}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </StepCard>
        );

      case 5:
        return (
          <>
            <StepCard
              icon={steps[4].icon}
              title="Supporting Documents"
              color={steps[4].color}
            >
              <div className="space-y-4">
                {errors.documents && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-red-600 text-sm">{errors.documents}</p>
                  </div>
                )}

                {DOCUMENT_TYPES.map((doc) => (
                  <EDocumentUpload
                    key={doc.id}
                    id={doc.id}
                    label={isMobile ? doc.shortLabel : doc.label}
                    shortLabel={doc.shortLabel}
                    description={doc.description}
                    accept={doc.accept}
                    required={doc.required}
                    file={formData.documents[doc.id]}
                    onUpload={(file) => handleFileUpload(doc.id, file)}
                    onRemove={() => handleFileRemove(doc.id)}
                    error={
                      errors.documents &&
                      errors.documents.includes(doc.shortLabel)
                        ? `Please upload ${doc.shortLabel} document`
                        : null
                    }
                  />
                ))}

                <div className="mt-6">
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    name="additional_notes"
                    value={formData.additional_notes}
                    onChange={handleInputChange}
                    multiline
                    rows={isMobile ? 3 : 4}
                    size={isMobile ? "small" : "medium"}
                    placeholder="Add any relevant information about the device or documentation"
                  />
                </div>
              </div>
            </StepCard>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        fullScreen={isMobile}
        PaperComponent={motion.div}
        PaperProps={dialogAnimation}
      >
        <div className="h-screen flex flex-col bg-gradient-to-b from-emerald-100 to-white rounded-sm">
          <div className="p-6 border-b border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Zap className="text-emerald-600 h-8 w-8" />
                <h1 className="text-2xl font-bold text-gray-900 ">
                  New Renewable Asset Registration
                </h1>
              </div>
              <IconButton
                onClick={onClose}
                className="text-gray-500 hover:bg-emerald-50"
              >
                <X />
              </IconButton>
            </div>

            <div className="hidden md:flex space-x-2">
              {steps.map((step, index) => (
                <StepIndicator
                  key={index}
                  index={index}
                  active={activeStep === index}
                  step={step}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-emerald-100 bg-white">
            <div className="flex justify-between items-center">
              <EcoButton
                variant="secondary"
                onClick={activeStep > 0 ? handleBack : onClose}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2" />
                {activeStep === 0 ? "Cancel" : "Back"}
              </EcoButton>

              <div className="flex items-center space-x-3">
                {activeStep < steps.length - 1 ? (
                  <EcoButton
                    onClick={handleNext}
                    endIcon={<ArrowRight />}
                    disabled={!isStepValid}
                  >
                    Continue
                  </EcoButton>
                ) : (
                  <EcoButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-amber-500 hover:bg-amber-600 rounded-sm p-2"
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} className="text-white" />
                    ) : (
                      <>
                        Submit Asset
                        <FileCheck className="ml-2" />
                      </>
                    )}
                  </EcoButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          className="!items-center"
          iconMapping={{
            error: <AlertCircle className="w-5 h-5" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeviceUploadStepper;
