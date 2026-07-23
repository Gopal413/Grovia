import React, { useState } from "react";
import { 
  Box, Typography, TextField, CircularProgress, Snackbar, Alert, Button, Stack
} from "@mui/material";
import { validateEmail } from "../utils/Validation";
import { useNavigate } from "react-router-dom";
import MainAuthCard from "./MainAuthCard";
import AuthCard from "./AuthCard";
import api from "../../api/axiosConfig";

function EmailVerify() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const emailError = email ? validateEmail(email) : "";
  const isFormValid = email && !emailError;

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      await api.post("/auth/verifyEmail", { email });
      showToast("Verification code dispatched to your inbox!", "success");
      
      setTimeout(() => navigate("/verify-otp"), 1200);
    } catch (err) {
      console.error(err);

      showToast(err.response?.data?.message || "Failed sending verification OTP code.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 45%), #090D1A', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: { xs: 2, sm: 3 }
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
                Discover fresh, homemade snacks and gourmet sweets, crafted with hygiene and passion. Your gateway to local culinary delights.
              </Typography>
              <Typography variant="body2" sx={{ color: '#A78BFA', fontWeight: 700, mt: 1, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>
                — KritiAtHome Flavors
              </Typography>
            </Box>
          </Box>
        }
        rightContent={
          <AuthCard title="Verify Email" sx={{ width: "100%", boxShadow: "none", bgcolor: "transparent" }}>
            <Box component="form" onSubmit={handleEmailSubmit} noValidate sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please share your email address to receive your 4-digit dynamic authentication pass.
              </Typography>

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                autoComplete="email"
                margin="normal"
                required
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Send Verification Pass"}
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 4 }}>
              <Typography variant="body2" color="text.secondary">Already have an account?</Typography>
              <Typography
                variant="body2"
                sx={{ color: "#6366F1", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
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
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%", borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EmailVerify;
