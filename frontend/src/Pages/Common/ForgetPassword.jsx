
import React, { useState } from "react";
import { Box, Button, Typography, TextField, CircularProgress, Snackbar, Alert } from "@mui/material";
import { validateEmail } from "../utils/Validation";
import AuthCard from "./AuthCard";
import MainAuthCard from "./MainAuthCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api/axiosConfig";
//import MailOutlineIcon from '@mui/icons-material/MailOutline'; // Optional: run `npm install @mui/icons-material` if you haven't

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  // Validation Check
  const emailError = email ? validateEmail(email) : "";
  const isFormValid = email && !emailError;

  const handleSubmit = async(event) => {
    event.preventDefault();

    if (!isFormValid) return;

    setLoading(true);
    try {
      console.log("Sending recovery link to:", email);
      // TODO: Integrate your actual Password Reset API endpoint here
      let response = await api.post("/resetPass/forgotpassword",{email});
      console.log("res data :",response.data)
      localStorage.setItem("forgetToken",response.data.token)
      // Toggle success state to show a beautiful success confirmation
      setIsSubmitted(true);
      setSnackbar({ open: true, message: "A recovery OTP has been sent to your email.", severity: "success" });

      setTimeout(() => navigate(`/forget/forgetverifyOtp`), 1500);
    } catch(err) {
      console.log(err.response?.data?.message);
      let alreadyOtp = localStorage.getItem("forgetToken")
      if(alreadyOtp){
         setIsSubmitted(true);
        setSnackbar({ open: true, message: "You already have an active OTP. Please verify it.", severity: "info" });
      } else {
        setSnackbar({ open: true, message: err.response?.data?.message || "Failed to send OTP. Please try again.", severity: "error" });
      }
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to send OTP. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
}


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
                Security and trust form the foundation of KritiAtHome. Rest assured, your credentials are protected with our multi-layered authentication.
              </Typography>
              <Typography variant="body2" sx={{ color: '#A78BFA', fontWeight: 700, mt: 1, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>
                — KritiAtHome Security
              </Typography>
            </Box>
          </Box>
        } 
        rightContent={
          <AuthCard 
            title={isSubmitted ? "Check Your Email" : "Forgot Password?"} 
            sx={{
              width: '100%',
              boxShadow: 'none',
              bgcolor: 'transparent'
            }}
          >
            {!isSubmitted ? (
              // STEP 1: Request Email Form
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enter your registered email address below. We'll send you instructions to reset your password safely.
                </Typography>

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  error={!!emailError}
                  helperText={emailError}
                  autoComplete="email"
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Send Recovery OTP"}
                </Button>
              </Box>
            ) : (
              // STEP 2: Beautiful Post-Submission UI Success State
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  py: 2 
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    fontSize: '28px', // Controls emoji size
                    mb: 2
                  }}
                >
                  ✉️
                </Box>
                <Typography variant="body1" fontWeight="bold" gutterBottom sx={{ color: '#0f172a' }}>
                  Reset Link Dispatched!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  We have sent a secure verification code to <strong>{email}</strong>. Please check your inbox.
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setIsSubmitted(false)}
                  sx={{ py: 1.2, borderColor: '#6366F1', color: '#6366F1', fontWeight: 'bold', borderRadius: '12px', textTransform: 'none', mt: 2, '&:hover': { borderColor: '#4F46E5', color: '#4F46E5' } }}
                >
                  Resend OTP
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/forget/forgetverifyOtp`)}
                  sx={{ py: 1.2, bgcolor: '#6366F1', color: '#ffffff', fontWeight: 'bold', borderRadius: '12px', textTransform: 'none', mt: 2, '&:hover': { bgcolor: '#4F46E5' } }}
                >
                  Verify OTP
                </Button>
              </Box>
            )}
            
            {/* BACK TO LOGIN FOOTER LINK */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
              }}
            >
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
                ← Back to Login
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

export default ForgotPassword;