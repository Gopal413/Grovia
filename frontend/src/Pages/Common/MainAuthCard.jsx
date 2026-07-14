
import React from 'react';
import { Box, Grid } from '@mui/material';

function MainAuthCard({ leftContent, rightContent }) {
  return (
    <Grid
      container
      sx={{
        maxWidth: { xs: 400, md: 960 },
        width: "100%",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0px 30px 60px rgba(0, 0, 0, 0.35)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        background: "rgba(15, 23, 42, 0.3)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Left Column */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: "100%",
            p: { xs: 5, md: 6 },
            background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
            color: "white",
            position: "relative",
            overflow: "hidden",
            borderRight: { md: "1px solid rgba(255, 255, 255, 0.08)" },
            // Soft background glowing elements
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-20%',
              left: '-20%',
              width: '80%',
              height: '80%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-20%',
              right: '-20%',
              width: '80%',
              height: '80%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }
          }}
        >
          {leftContent}
        </Box>
      </Grid>

      {/* Right Column */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
        <Box
          sx={{
            flex: 1,
            width: "100%",
            p: { xs: 4, sm: 5, md: 6 },
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {rightContent}
        </Box>
      </Grid>
    </Grid>
  );
}

export default MainAuthCard;