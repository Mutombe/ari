import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { confirmPasswordReset } from "../../redux/slices/authSlice";
import { motion } from "framer-motion";
import { Alert, Button, TextField, Snackbar } from "@mui/material";
import { Lock, CheckCircle, XCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid reset link");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    dispatch(confirmPasswordReset({ token, password }))
      .unwrap()
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((err) => {
        setError(err.detail || "Failed to reset password");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        
        {success ? (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <p className="mb-4">Password reset successfully! Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ startAdornment: <Lock className="text-gray-400 mr-2" size={18} /> }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{ startAdornment: <Lock className="text-gray-400 mr-2" size={18} /> }}
            />
            
            {error && (
              <Alert severity="error" icon={<XCircle className="h-5 w-5" />}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={status === "loading"}
              className="!bg-emerald-600 hover:!bg-emerald-700"
            >
              {status === "loading" ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;