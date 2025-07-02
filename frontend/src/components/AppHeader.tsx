"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function AppHeader() {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ marginLeft: 1 }}>
            JobSkillsBooster
          </Typography>
        </Box>
        <Box>
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
        <Box></Box>
      </Toolbar>
    </AppBar>
  );
}
