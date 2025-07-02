"use client";

import React from "react";
import {
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  FormGroup,
  Checkbox,
  Paper,
} from "@mui/material";

const sectionTitleSx = {
  mt: 1,
  mb: 0.5,
  fontSize: "0.9rem",
  fontWeight: 900,
};

const labelSx = {
  "& .MuiFormControlLabel-label": {
    fontSize: "0.80rem",
  },
  minHeight: "0",
  marginY: "0",
  height: "28px",
};

type ConfigSettings = {
  communicationModes: { name: string; details: string }[];
  testTypes: { type: string; name: string }[];
  aiModels: { name: string; ai: string; model: string }[];
  difficultyLevels: string[];
  temperatureRange: { min: number; max: number };
  maxTokensRange: { min: number; max: number };
  testDurations: number[];
  resultOptions: { name: string; details: string }[];
};

type SettingsPanelProps = {
  settings: ConfigSettings;
  selectedCommunication: string;
  setSelectedCommunication: (value: string) => void;
  selectedTestType: string;
  setSelectedTestType: (value: string) => void;
  selectedAIModel: string;
  setSelectedAIModel: (value: string) => void;
  selectedAI: string;
  setSelectedAI: (value: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (value: string) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  maxTokens: number;
  setMaxTokens: (value: number) => void;
  testDuration: number;
  setTestDuration: (value: number) => void;
  selectedResults: string[];
  handleResultChange: (name: string) => void;
};

export default function SettingsPanel({
  settings,
  selectedCommunication,
  setSelectedCommunication,
  selectedTestType,
  setSelectedTestType,
  selectedAIModel,
  setSelectedAIModel,
  selectedDifficulty,
  setSelectedDifficulty,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  testDuration,
  setTestDuration,
  selectedResults,
  handleResultChange,
}: SettingsPanelProps) {
  return (
    <Paper elevation={3} sx={{ padding: 2, maxWidth: "360px", flex: 1 }}>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>

      <Typography sx={sectionTitleSx}>Communication Mode</Typography>
      <RadioGroup
        value={selectedCommunication}
        onChange={(e) => setSelectedCommunication(e.target.value)}
        sx={{
          gap: "0px",
          "& .MuiFormControlLabel-root": {
            minHeight: "0",
            marginY: "0",
          },
        }}
      >
        {settings.communicationModes.map((mode) => (
          <FormControlLabel
            sx={labelSx}
            key={mode.name}
            value={mode.name}
            control={<Radio size="small" />}
            label={mode.details}
          />
        ))}
      </RadioGroup>

      <Typography sx={sectionTitleSx}>Test Type</Typography>
      <RadioGroup
        value={selectedTestType}
        onChange={(e) => setSelectedTestType(e.target.value)}
      >
        {settings.testTypes.map((test) => (
          <FormControlLabel
            sx={labelSx}
            key={test.type}
            value={test.type}
            control={<Radio />}
            label={test.name}
          />
        ))}
      </RadioGroup>

      <Typography sx={sectionTitleSx}>AI Model</Typography>
      <RadioGroup
        value={selectedAIModel}
        onChange={(e) => {
          const modelValue = e.target.value;
          setSelectedAIModel(modelValue);
        }}
      >
        {settings.aiModels.map((model) => (
          <FormControlLabel
            sx={labelSx}
            key={model.name}
            value={model.model}
            control={<Radio />}
            label={model.name}
          />
        ))}
      </RadioGroup>

      <Typography sx={sectionTitleSx}>Difficulty Level</Typography>
      <RadioGroup
        value={selectedDifficulty}
        onChange={(e) => setSelectedDifficulty(e.target.value)}
      >
        {settings.difficultyLevels.map((level) => (
          <FormControlLabel
            sx={labelSx}
            key={level}
            value={level}
            control={<Radio />}
            label={level}
          />
        ))}
      </RadioGroup>

      <Typography sx={sectionTitleSx}>
        Temperature
        <Typography
          component="span"
          sx={{ marginLeft:"8px", fontWeight: 400, fontSize: "1em", color: "gray" }}
        >
          ({temperature})
        </Typography>
      </Typography>
      <Slider
        value={temperature}
        onChange={(e, val) => setTemperature(val as number)}
        min={settings.temperatureRange.min}
        max={settings.temperatureRange.max}
        step={0.1}
        valueLabelDisplay="auto"
      />

      <Typography sx={sectionTitleSx}>
        Max Tokens
        <Typography
          component="span"
          sx={{ marginLeft:"8px", fontWeight: 400, fontSize: "1em", color: "gray" }}
        >
          ({maxTokens})
        </Typography>
      </Typography>
      <Slider
        value={maxTokens}
        onChange={(e, val) => setMaxTokens(val as number)}
        min={settings.maxTokensRange.min}
        max={settings.maxTokensRange.max}
        step={1}
        valueLabelDisplay="auto"
      />

      <Typography sx={sectionTitleSx}>
        Test Duration
        <Typography
          component="span"
          sx={{ marginLeft:"8px", fontWeight: 400, fontSize: "1em", color: "gray" }}
        >
          (questions)
        </Typography>
      </Typography>
      <Slider
        value={testDuration}
        onChange={(e, val) => setTestDuration(val as number)}
        min={Math.min(...settings.testDurations)}
        max={Math.max(...settings.testDurations)}
        step={10}
        marks={settings.testDurations.map((d) => ({ value: d, label: `${d}` }))}
        valueLabelDisplay="auto"
      />

      <Typography sx={sectionTitleSx}>Result Options</Typography>
      <FormGroup>
        {settings.resultOptions.map((option) => (
          <FormControlLabel
            sx={labelSx}
            key={option.name}
            control={
              <Checkbox
                checked={selectedResults.includes(option.name)}
                onChange={() => handleResultChange(option.name)}
              />
            }
            label={option.details}
          />
        ))}
      </FormGroup>
    </Paper>
  );
}
