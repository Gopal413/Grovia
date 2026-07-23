import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { validateOtp } from "../utils/Validation";
import AuthCard from "./AuthCard";
import { useNavigate, useParams } from "react-router-dom";
import MainAuthCard from "./MainAuthCard";
import axios from "axios";
import api from "../../api/axiosConfig";
function ForgotVerifyOtp() {
  const [otp, setotp] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const userId = useParams().id;

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setotp(value);
  };


   const otpError = otp ? validateOtp(otp) : "";

    // Evaluates to true only if OTP is typed and contains zero validation errors
    const isFormValid = otp && !otpError;

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      return setSnackbar({ open: true, message: "Please enter a 4-digit OTP", severity: "error" });
    }

    setLoading(true);
    try {
      let res = await api.post(`/resetPass/VerifyOtp`,{otp},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("forgetToken")}`,
        },
      });
      console.log("res data :",res.data)

      if (res.status !== 200) {
        setSnackbar({ open: true, message: "Invalid OTP. Please check the code and try again.", severity: "error" });
        return;
      }

      setVerified(true);
      setSnackbar({ open: true, message: "OTP verified! You can now reset your password.", severity: "success" });
      setTimeout(() => navigate(`forget/forgetverifyOtp/resetpassword`), 1500);
    } catch(err) {
      console.log(err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Verification failed. Please try again.", severity: "error" });
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
              KritiAtHome
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500, letterSpacing: '0.5px' }}>
              E-Commerce Web Application
            </Typography>
            
            <Box sx={{ width: '60px', height: '4px', bgcolor: '#6366F1', borderRadius: '2px', my: 1 }} />

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left', width: '100%' }}>
              <Typography variant="h2" sx={{ color: 'rgba(255, 255, 255, 0.08)', fontFamily: 'serif', lineHeight: 0.1, mt: 1, fontSize: '4rem' }}>“</Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.6 }}>
                A seamless digital experience that brings you closer to your favorite homemade tastes. Safe, secure, and instant.
              </Typography>
              <Typography variant="body2" sx={{ color: '#A78BFA', fontWeight: 700, mt: 1, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>
                — KritiAtHome Experience
              </Typography>
            </Box>
          </Box>
        }
        rightContent={
          <AuthCard
            title="Verify OTP"
            sx={{
              width: "100%",
              boxShadow: "none",
              bgcolor: "transparent",
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                A verification code has been generated. Please enter it below to verify your account.
              </Typography>

              <TextField
                fullWidth
                label="Enter OTP"
                name="otp"
                value={otp}
                onChange={handleChange}
                error={!!otpError}
                helperText={otpError}
                autoComplete="one-time-code"
                margin="normal"
                slotProps={{ 
                  htmlInput: { maxLength: 6 },
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Verify"}
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
                Back to sign up?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6366F1",
                  fontWeight: "bold",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/register")}
              >
                Register
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

export default ForgotVerifyOtp;