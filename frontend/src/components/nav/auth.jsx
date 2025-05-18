import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Dialog,
  TextField,
  Divider,
  Button,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import { AtSign, X, Lock, User, AlertCircle, Flag } from "lucide-react";
import {
  login,
  register,
  requestPasswordReset,
} from "../../redux/slices/authSlice";
import { Logo } from "./nav";
import CountrySelector from "./country";

const countryData = {
  Uganda: { flag: "🇺🇬", brand: "UG-REC" },
  Zambia: { flag: "🇿🇲", brand: "ZAM-REC" },
  Malawi: { flag: "🇲🇼", brand: "MALAWI-REC" },
  Namibia: { flag: "🇳🇦", brand: "NAM-REC" },
  Lesotho: { flag: "🇱🇸", brand: "LESOTHO-RECs" },
  //"Eswatini": { flag: "🇸🇿", brand: "Eswarec" },
  Angola: { flag: "🇦🇴", brand: "ANGOLA-REC" },
  DRC: { flag: "🇨🇩", brand: "CONGO-REC" },
};

export const AuthModals = ({ openType, onClose }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [view, setView] = useState(openType);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    country: "",
  });

  useEffect(() => {
    setView(openType);
  }, [openType]);

  useEffect(() => {
    if (openType) {
      setFormData({ email: "", password: "", username: "", country: "" });
      setSelectedCountry(null);
    }
  }, [openType]);

  useEffect(() => {
    if (selectedCountry) {
      setFormData((prev) => ({ ...prev, country: selectedCountry }));
    }
  }, [selectedCountry]);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  const handleSubmit = () => {
    if (view === "login") {
      dispatch(
        login({
          username: formData.username,
          password: formData.password,
        })
      )
        .unwrap()
        .then(() => {
          setSnackbar({
            open: true,
            message: "Logged in successfully!",
            severity: "success",
          });
          onClose();
        })
        .catch(console.error);
    } else {
      if (!selectedCountry && view === "register") {
        setSnackbar({
          open: true,
          message: "Please select a country to register",
          severity: "error",
        });
        return;
      }

      dispatch(register(formData))
        .unwrap()
        .then((response) => {
          setSnackbar({
            open: true,
            message: "Registration successful! Please login",
            severity: "success",
          });
          onClose("login");
        })
        .catch(console.error);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      setSnackbar({
        open: true,
        message: "Please enter your email",
        severity: "error",
      });
      return;
    }
    dispatch(requestPasswordReset(formData.email))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "Password reset instructions sent to your email",
          severity: "success",
        });
        onClose();
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Error sending reset instructions",
          severity: "error",
        });
      });
  };

  const getError = () => {
    if (!error) return null;
    if (typeof error === "object") {
      return error.detail || Object.values(error)[0]?.[0];
    }
    return error.toString();
  };

  const renderRegistrationForm = () => (
    <>
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        InputProps={{
          startAdornment: <AtSign className="text-gray-400 mr-2" size={18} />,
        }}
      />
      <Divider className="!my-4"></Divider>

      <TextField
        fullWidth
        label="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        InputProps={{
          startAdornment: <User className="text-gray-400 mr-2" size={18} />,
        }}
      />
      <Divider className="!my-4"></Divider>

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        InputProps={{
          startAdornment: <Lock className="text-gray-400 mr-2" size={18} />,
        }}
      />
      <Divider className="!my-4"></Divider>

      {selectedCountry && (
        <div className="flex items-center p-3 bg-gray-50 rounded mb-4">
          <span className="text-2xl mr-3">
            {countryData[selectedCountry].flag}
          </span>
          <div>
            <p className="text-sm font-medium">{selectedCountry}</p>
            <p className="text-xs text-gray-500">
              Registering with {countryData[selectedCountry].brand}
            </p>
          </div>
        </div>
      )}
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        InputProps={{
          startAdornment: <AtSign className="text-gray-400 mr-2" size={18} />,
        }}
      />
      <Divider className="!my-4" />

      <Button
        fullWidth
        variant="contained"
        onClick={handleForgotPassword}
        disabled={status === "loading"}
        className="!bg-emerald-600 hover:!bg-emerald-700"
      >
        {status === "loading" ? "Sending..." : "Send Reset Instructions"}
      </Button>

      <Divider className="!my-6">or</Divider>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => setView("login")}
        className="!border-emerald-600 !text-emerald-700"
      >
        Back to Login
      </Button>
    </>
  );

  const renderLoginForm = () => (
    <>
      <TextField
        fullWidth
        label="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        InputProps={{
          startAdornment: <User className="text-gray-400 mr-2" size={18} />,
        }}
      />
      <Divider className="!my-4"></Divider>

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        InputProps={{
          startAdornment: <Lock className="text-gray-400 mr-2" size={18} />,
        }}
      />
      <div className="text-right mb-4">
        <button
          onClick={() => setView("forgot")}
          className="text-sm text-emerald-600 hover:underline"
        >
          Forgot Password?
        </button>
      </div>
    </>
  );

  return (
    <>
      <Dialog open={!!openType} onClose={onClose} maxWidth="xs" fullWidth>
        <motion.div
          className="p-6 space-y-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <div className="relative">
            <IconButton
              onClick={() => onClose()}
              className="!absolute !top-4 !right-4 !text-gray-400 hover:!bg-gray-100"
              size="small"
            >
              <X className="h-5 w-5" />
            </IconButton>

            <div className="text-center pt-4">
              <div className="mx-auto w-26 h-16 mb-4 flex items-center justify-center">
                {selectedCountry ? (
                  <div className="relative">
                    <Logo />
                    <span className="absolute -right-3 -bottom-3 text-2xl">
                      {countryData[selectedCountry].flag}
                    </span>
                  </div>
                ) : (
                  <Logo />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {view === "login" ? "Welcome Back!" : "Join Africa RECs"}
              </h2>
              <p className="text-gray-600">
                {view === "login"
                  ? "Sign in to continue to your account"
                  : selectedCountry
                  ? `Create your free ${countryData[selectedCountry].brand} trading account`
                  : "Create your free REC trading account"}
              </p>
            </div>
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 p-3 rounded-lg text-red-700 text-sm"
            >
              {getError()}
            </motion.div>
          )}

          <div className="space-y-4">
            {view === "forgot"
              ? renderForgotPasswordForm()
              : view === "register"
              ? renderRegistrationForm()
              : renderLoginForm()}
          </div>

          {view === "register" && !selectedCountry ? (
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelectCountry={handleSelectCountry}
            />
          ) : (
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !py-3 !text-base !font-semibold"
            >
              {status === "loading"
                ? "Processing..."
                : view === "login"
                ? "Sign In"
                : `Create ${
                    selectedCountry ? countryData[selectedCountry].brand : ""
                  } Account`}
            </Button>
          )}

          <Divider className="!my-6">or</Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              setSelectedCountry(null);
              onClose(view === "login" ? "register" : "login");
            }}
            className="!border-emerald-600 !text-emerald-700 hover:!bg-emerald-50 !rounded-lg"
          >
            {view === "login"
              ? "Create New Account"
              : "Already have an account? Sign In"}
          </Button>
        </motion.div>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          className="!items-center"
          iconMapping={{ error: <AlertCircle className="w-5 h-5" /> }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
