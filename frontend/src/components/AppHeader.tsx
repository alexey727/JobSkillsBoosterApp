"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Link from "next/link";

export default function AppHeader() {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        {/* Блок с названием и меню рядом */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600 }}
          >
            JobSkillsBooster
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
          <Button color="inherit" component={Link} href="/interview">
            Interview
          </Button>
          <Button color="inherit" component={Link} href="/help">
            Help
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
