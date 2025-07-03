"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Image from "next/image";
import { Config } from "@/types/types";

export default function Home() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/config`
        );
        const data = await res.json();
        setConfig(data);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  if (!config) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      padding="2rem"
    >
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={200}
        height={0}
        style={{ height: "auto" }}
      />

      <Typography variant="h6" mt={3} mb={2}>
        {config.about}
      </Typography>

      <Typography variant="h6" mt={4}>
        Available AI Models
      </Typography>

      <Box maxWidth="400px" width="100%" mt={1}>
        <List dense>
          {config.settings.aiModels.map((model) => (
            <ListItem key={model.name}>
              <ListItemText primary={model.model} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
