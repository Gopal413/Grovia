
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, Snackbar, Alert, Stack } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input"; // Imported native package hook
import { useNavigate } from "react-router-dom";
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import api from "../../api/axiosConfig";
import MainAuthCard from "./MainAuthCard";
import AuthCard from "./AuthCard";

function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleOtpChange = (newValue) => {
    // Basic regex validation check mapping numerical characters only
    const cleanValue = newValue.replace(/[^0-9]/g, "");
    setOtp(cleanValue);
  };

  const isFormValid = otp.length === 4;

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const response = await api.post("/auth/verifyOtp", { otp });
      
      localStorage.setItem("kritiathome_auth_handshake_token", response.data.token);
      
      setOtp("");
      setSnackbar({ open: true, message: "Security pass authenticated! Loading registration workspace...", severity: "success" });
      
      setTimeout(() => navigate("/register"), 1500);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Invalid or expired code token.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: { xs: 2, sm: 3 },
        background: "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 45%), #090D1A",
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
          <AuthCard title="Verify Email" sx={{ width: "100%", boxShadow: "none", bgcolor: "transparent" }}>
            <Stack alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <MarkEmailReadOutlinedIcon sx={{ fontSize: 28, color: '#6366F1' }} />
                <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a" }}>
                  Verify Passcode
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.5 }}>
                We sent a verification passcode to <br />
                <strong style={{ color: "#344054" }}>{targetEmail || "your inbox"}</strong>.
              </Typography>
            </Stack>

            <Box component="form" onSubmit={handleOtpSubmit} noValidate>
              
              <MuiOtpInput
                value={otp}
                onChange={handleOtpChange}
                length={4}
                validateChar={(val) => !isNaN(Number(val))}
                sx={{
                  gap: { xs: 1, sm: 1.5 },
                  my: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    height: { xs: 46, sm: 54 },
                    bgcolor: "#f8fafc",
                    transition: "all 0.15s ease",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6366F1",
                      borderWidth: "2px",
                      boxShadow: "0px 0px 0px 4px rgba(99, 102, 241, 0.12)"
                    }
                  },
                  "& .MuiOutlinedInput-input": {
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#101828",
                    p: 0
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isFormValid || loading}
                sx={{ 
                  mt: 2, 
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Verify & Continue"}
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5, mt: 4 }}>
              <Typography variant="body2" color="text.secondary">Mistyped your email?</Typography>
              <Typography
                variant="body2"
                sx={{ color: "#6366F1", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                onClick={() => navigate("/verify-email")}
              >
                Change Email
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%", borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default VerifyOtp;
