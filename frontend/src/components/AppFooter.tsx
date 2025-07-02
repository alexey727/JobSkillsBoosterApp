"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#000000",
        color: "white",
        padding: "1rem",
        textAlign: "center"
      }}
    >
      <Typography variant="body2">
        © 2025 JobSkillsBooster. All rights reserved.
      </Typography>
    </Box>
  );
}
