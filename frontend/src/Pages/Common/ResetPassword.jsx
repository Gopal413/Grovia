
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import {
  validatePassword,
  validateConfirmPassword,
  PasswordField,
} from "../utils/Validation";
import AuthCard from "./AuthCard";
import { useNavigate, useParams } from "react-router-dom";
import MainAuthCard from "./MainAuthCard";
import axios from "axios";
import api from "../../api/axiosConfig";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const userId = useParams().id

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation Checks using your centralized utility functions
  const passwordError = formData.password ? validatePassword(formData.password) : "";
  const confirmPasswordError = formData.confirmPassword 
    ? validateConfirmPassword(formData.confirmPassword, formData.password) 
    : "";

  // Evaluates to true only if both fields are filled AND contain zero validation errors
  const isFormValid =
    formData.password &&
    formData.confirmPassword &&
    !passwordError &&
    !confirmPasswordError;

  const handleSubmit = async(event) => {
    event.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setSnackbar({ open: true, message: "Passwords do not match. Please try again.", severity: "error" });
    }

    setLoading(true);
    try {
      let password = formData.password;
      let response = await api.post(`/resetPass/resetpassword`,{password},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("forgetToken")}`,
        },
      });

      if (response.status != 200) {
        return setSnackbar({ open: true, message: response.data.message || "Failed to reset password. Please try again.", severity: "error" });
      }
      setSnackbar({ open: true, message: "Password updated successfully! Redirecting to login...", severity: "success" });

      // Clear form fields
      setFormData({ password: "", confirmPassword: "" });

      // Automatically route them back to login page upon success
      setTimeout(() => navigate("/login"), 1500);
    } catch(err) {
      console.log(err.response?.data?.message);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to reset password. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 45%), #090D1A',
      }}
    >
      <MainAuthCard 
        leftContent={
          <Box 
            sx={{
              width: "100%",
              height: "100%", 
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 2,
              color: 'white'
            }}
          >
            <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '-1.5px', background: 'linear-gradient(135deg, #A78BFA 0%, #6366F1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Grovia
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500, letterSpacing: '0.5px' }}>
              E-Commerce Web Application
            </Typography>
            
            <Box sx={{ width: '60px', height: '4px', bgcolor: '#6366F1', borderRadius: '2px', my: 1 }} />

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left', width: '100%' }}>
              <Typography variant="h2" sx={{ color: 'rgba(255, 255, 255, 0.08)', fontFamily: 'serif', lineHeight: 0.1, mt: 1, fontSize: '4rem' }}>“</Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.6 }}>
                We prioritize your security to ensure a safe shopping experience. Choose a strong password to protect your account and transaction history.
              </Typography>
              <Typography variant="body2" sx={{ color: '#A78BFA', fontWeight: 700, mt: 1, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>
                — Grovia Security
              </Typography>
            </Box>
          </Box>
        } 
        rightContent={
          <AuthCard 
            title="Reset Password" 
            sx={{
              width: '100%',
              boxShadow: 'none',
              bgcolor: 'transparent'
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              
              <PasswordField
                fullWidth
                label="New Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete="new-password"
                margin="normal"
                slotProps={{
                  input: {
                    sx: { borderRadius: '12px' }
                  }
                }}
              />

              <PasswordField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                autoComplete="new-password"
                margin="normal"
                slotProps={{
                  input: {
                    sx: { borderRadius: '12px' }
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isFormValid || loading}
                sx={{ 
                  mt: 4, 
                  py: 1.4, 
                  fontWeight: 700, 
                  borderRadius: '12px', 
                  textTransform: 'none', 
                  bgcolor: '#6366F1', 
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    bgcolor: '#4F46E5',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Password"}
              </Button>
            </Box>
            
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                mt: 4,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Remember your credentials?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6366F1",
                  fontWeight: "bold",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Typography>
            </Box>
          </AuthCard>
        } 
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%", borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ResetPassword;
