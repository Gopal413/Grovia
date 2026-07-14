import React, { useState } from "react";
import { Box, Button, Typography, TextField, CircularProgress, Snackbar, Alert } from "@mui/material";
import { validateEmail, validatePassword, PasswordField } from "../utils/Validation";
import AuthCard from "./AuthCard";
import MainAuthCard from "./MainAuthCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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

 


  // Validation Checks
  const emailError = formData.email ? validateEmail(formData.email) : "";
  const passwordError = formData.password ? validatePassword(formData.password) : "";

  // Form validity rule: fields must be filled and error-free
  const isFormValid = 
    formData.email && 
    formData.password && 
    !emailError && 
    !passwordError;

  const handleSubmit = async(event) => {
    event.preventDefault();
    
    if (!isFormValid) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        email: formData.email.toLowerCase(),
      };

      console.log("Logging in with:", payload);
      let response = await api.post("/auth/login", payload);

    console.log("res data :",response.data)
    
    let token = response.data.token;
    console.log("token :",token);
    localStorage.setItem("token",response.data.token);
    const decoded = jwtDecode(token);
    console.log("decoded :",decoded)  
    // Dynamic reset after an API handshake (or keep for convenience)
    setFormData({ email: "", password: "" });

    if(decoded.role == "customer"){
      navigate("/Customer")
    }
    else if(decoded.role == "admin"){
      navigate("/admin")
    }
}
  catch(err){
    console.log("data ",err.response?.data); 
    console.log("error ",err); 
    if(err.response?.data?.isVerified === false){
      setSnackbar({ open: true, message: err.response?.data?.message || "Please verify your account before logging in.", severity: "error" });
      setTimeout(() => navigate(`/verify-email`), 1500);
    }
    else if(err.response?.data?.isUser === true){
      setSnackbar({ open: true, message: err.response?.data?.message || "Account not found. Please register.", severity: "error" });
      setTimeout(() => navigate("/verify-email"), 1500);
    }
    else{
      setSnackbar({ open: true, message: err.response?.data?.message || "Login failed. Please check your credentials and try again.", severity: "error" });
    }
    
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
              Grovia
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500, letterSpacing: '0.5px' }}>
              E-Commerce Web Application
            </Typography>
            
            <Box sx={{ width: '60px', height: '4px', bgcolor: '#6366F1', borderRadius: '2px', my: 1 }} />

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left', width: '100%' }}>
              <Typography variant="h2" sx={{ color: 'rgba(255, 255, 255, 0.08)', fontFamily: 'serif', lineHeight: 0.1, mt: 1, fontSize: '4rem' }}>“</Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Connecting local kitchens and home-based artisans to food enthusiasts everywhere. Authenticity in every bite, convenience in every click.
              </Typography>
              <Typography variant="body2" sx={{ color: '#A78BFA', fontWeight: 700, mt: 1, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>
                — Grovia Marketplace
              </Typography>
            </Box>
          </Box>
        } 
        rightContent={
          <AuthCard 
            title="Welcome Back" 
            sx={{
              width: '100%',
              boxShadow: 'none',
              bgcolor: 'transparent'
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
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
              <PasswordField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete="current-password"
                margin="normal"
                slotProps={{
                  input: {
                    sx: { borderRadius: '12px' }
                  }
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#6366F1",
                  display:'flex',
                  justifyContent:'flex-end',
                  fontWeight: "bold",
                  cursor: "pointer",
                  mt: 1,
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/forget")}
              >
                Forgot Password?
              </Typography>
 
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
            </Box>
            
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                mt: 4,
                justifyContent: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Don't have an account?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6366F1",
                  fontWeight: "bold",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/verify-email")}
              >
                Sign Up
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

export default Login;