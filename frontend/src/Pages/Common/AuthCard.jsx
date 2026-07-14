import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";

function AuthCard({ title, children, sx }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 380,
          borderRadius: 4,
          boxShadow: 'none',
          bgcolor: 'transparent',
          ...sx
        }}
      >
        <CardContent
          sx={{
            p: { xs: 0, sm: 1 },
          }}
        >
          {title && (
            <Typography 
              variant="h4" 
              align="center" 
              fontWeight={800}
              sx={{ color: '#0f172a', mb: 3, letterSpacing: '-0.5px' }}
            >
              {title}
            </Typography>
          )}
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}

export default AuthCard;
