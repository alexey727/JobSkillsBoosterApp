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

type Config = {
  about: string;
  settings: {
    communicationModes: { name: string; details: string }[];
    testTypes: { type: string; name: string }[];
    aiModels: string[];
    difficultyLevels: string[];
    temperatureRange: { min: number; max: number };
    testDurations: number[];
    resultOptions: { name: string; details: string }[];
  };
};

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
            <ListItem key={model}>
              <ListItemText primary={model.details} secondary={model.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
