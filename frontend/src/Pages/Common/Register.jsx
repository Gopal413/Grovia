
import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, CircularProgress, Snackbar, Alert, Stack, Button } from "@mui/material";
import {
  validatePassword, validatePhone, validateName, validateConfirmPassword, PasswordField
} from "../utils/Validation";
import { useNavigate } from "react-router-dom";
import MainAuthCard from "./MainAuthCard";
import AuthCard from "./AuthCard";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";

function Register() {
  const navigate = useNavigate();
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  useEffect(() => {
    const securityToken = localStorage.getItem("kritiathome_auth_handshake_token");
    console.log("securityToken :",securityToken)
    if (!securityToken) {
      setSnackbar({ open: true, message: "Session tracing timeline invalid. Re-routing to entry.", severity: "error" });
      setTimeout(() => navigate("/verify-email"), 2000);
    } else {
      // Decode the token to get the email
      const decodedToken = jwtDecode(securityToken);
      const activeEmail = decodedToken.email;
      setVerifiedEmail(activeEmail);
    }
  }, [navigate]);

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nameError = formData.name ? validateName(formData.name) : "";
  const passwordError = formData.password ? validatePassword(formData.password) : "";
  const confirmPasswordError = formData.confirmPassword ? validateConfirmPassword(formData.confirmPassword) : "";
  const phoneError = formData.phone ? validatePhone(formData.phone) : "";

  const isFormValid =
    formData.name &&
    formData.phone &&
    formData.password &&
    formData.confirmPassword &&
    !nameError &&
    !phoneError &&
    !passwordError &&
    !confirmPasswordError;

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return showToast("Passwords do not match.", "error");
    }

    setLoading(true);
    try {
      const registrationPayload = {
        name: formData.name,
        email: verifiedEmail,
        phone: formData.phone,
        password: formData.password,
      };

      let res = await api.post("/auth/register", registrationPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("kritiathome_auth_handshake_token")}`,
        },
      });
      console.log("register :",res)
      showToast("Account created successfully!", "success");
      
      // Complete cleanup of temporary storage keys
      //localStorage.removeItem("kritiathome_auth_handshake_token");

      setFormData({ name: "", password: "", confirmPassword: "", phone: "" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Account creation failed.", "error");
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
                Empowering local cooks and supporting small businesses. KritiAtHome helps you start your culinary journey and build a sustainable local economy.
              </Typography>
              <Typography variant="body2" sx={{ color: '#A78BFA', fontWeight: 700, mt: 1, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>
                — KritiAtHome Community
              </Typography>
            </Box>
          </Box>
        }
        rightContent={
          <AuthCard title="Create Profile" sx={{ width: "100%", boxShadow: "none", bgcolor: "transparent" }}>
            <Box component="form" onSubmit={handleProfileSubmit} noValidate sx={{ mt: 1 }}>
              
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={verifiedEmail}
                disabled
                margin="normal"
                slotProps={{
                  input: {
                    sx: { borderRadius: '12px' }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!nameError}
                helperText={nameError}
                autoComplete="name"
                margin="normal"
                required
                slotProps={{
                  input: {
                    sx: { borderRadius: '12px' }
                  }
                }}
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                error={!!phoneError}
                helperText={phoneError}
                autoComplete="tel"
                margin="normal"
                required
                slotProps={{
                  input: {
                    sx: { borderRadius: '12px' }
                  }
                }}
              />

              <PasswordField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete="new-password"
                margin="normal"
                required
                slotProps={{
                  input: {
                    sx: { borderRadius: '12px' }
                  }
                }}
              />
              
              <PasswordField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                autoComplete="new-password"
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Complete Registration"}
              </Button>
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

export default Register;
