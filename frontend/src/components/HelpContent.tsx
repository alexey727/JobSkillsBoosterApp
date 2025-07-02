"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

type Config = {
  about: string;
  settings: {
    communicationModes: { name: string; details: string, direktAnswer: boolean }[];
    testTypes: { type: string; name: string }[];
    aiModels: string[];
    difficultyLevels: string[];
    temperatureRange: { min: number; max: number };
    maxTokensRange: { min: number; max: number };
    testDurations: number[];
    resultOptions: { name: string; details: string }[];
  };
};

export default function HelpContent() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/config`);
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

  const { settings } = config;

  return (
    <Box maxWidth="800px" margin="0 auto" padding="2rem">
      <Typography variant="h4" gutterBottom>
        Help
      </Typography>

      <Typography variant="body1" paragraph>
        {config.about}
      </Typography>

      <Typography variant="h6" mt={2}>
        AI Models
      </Typography>
      <List dense>
        {settings.aiModels.map((model) => (
          <ListItem key={model}>
            <ListItemText
        primary={model.name}
        secondary={`${model.ai} — ${model.model}`}
      />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" mt={2}>
        Communication Modes
      </Typography>
      <List dense>
        {settings.communicationModes.map((mode) => (
          <ListItem key={mode.name} >
            <ListItemText primary={mode.details} 
              secondary={`Type: ${mode.name} , Direct Answer: ${mode.directAnswer ? "Yes" : "No"}`}
            /> 
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" mt={2}>
        Test Types
      </Typography>
      <List dense>
        {settings.testTypes.map((test) => (
          <ListItem key={test.type}>
            <ListItemText primary={test.name} secondary={test.type} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" mt={2}>
        Difficulty Levels
      </Typography>
      <List dense>
        {settings.difficultyLevels.map((level) => (
          <ListItem key={level}>
            <ListItemText primary={level} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" mt={2}>
        Result Options
      </Typography>
      <List dense>
        {settings.resultOptions.map((result) => (
          <ListItem key={result.name}>
            <ListItemText primary={result.details} secondary={result.name} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" mt={4}>
        Test Durations (minutes)
      </Typography>
      <List dense>
        {settings.testDurations.map((duration) => (
          <ListItem key={duration}>
            <ListItemText primary={`${duration} minutes`} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" mt={4}>
        Temperature Range
      </Typography>
      <Typography>
        Min: {settings.temperatureRange.min}, Max: {settings.temperatureRange.max}
      </Typography>

      <Typography variant="h6" mt={4}>
        MaxTokens Range
      </Typography>
      <Typography>
        Min: {settings.maxTokensRange.min}, Max: {settings.maxTokensRange.max}
      </Typography>
    </Box>
  );
}
