"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import SettingsPanel from "@/components/SettingsPanel";
import DebugBlock from "@/components/DebugBlock";
import InterviewModal from "@/components/InterviewModal";
import { Tooltip } from "@mui/material";

type Config = {
  about: string;
  settings: {
    communicationModes: { name: string; details: string }[];
    testTypes: { type: string; name: string }[];
    aiModels: { name: string; ai: string; model: string }[];
    difficultyLevels: string[];
    temperatureRange: { min: number; max: number };
    testDurations: number[];
    resultOptions: { name: string; details: string }[];
  };
  info: { evaluate: string };
  errors: { evaluation_requirement: string };
};

export default function InterviewForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Form state
  const [candidateName, setCandidateName] = useState("Best Candidate");
  const [companyName, setCompanyName] = useState("DreamWork");
  const [vacancyName, setVacancyName] = useState("Senior Frontend Developer (m/w/d)");
  // const [preparationLevel, setPreparationLevel] = useState("");
const [vacancyDescription, setVacancyDescription] = useState(`Mit gyde verfolgen wir die Mission, die Zukunft des Lernens für Unternehmen und Talente zu gestalten.
Wir sind davon überzeugt, dass eine game-changing Lernerfahrung extrem niedrigschwellig sein und sowohl die intellektuellen als auch die emotionalen Herausforderungen der teilnehmenden Talente ansprechen muss.
Um dies zu erreichen, kombinieren wir App-basiertes Micro-Learning und persönliche Reflexionsübungen mit spannenden Peer-Coaching-Interaktionen.
Wir sind auf der Suche nach talentierten und leidenschaftlichen Menschen, die Teil unserer Mission werden wollen.
Tasks
Enge Zusammenarbeit mit unserem CTO, Entwicklern und UI/UX Designern für die Entwicklung unserer Web Apps
Integration von REST APIs und Anbindung unseres Backends und Serverless Umgebung.
Umsetzung von Designs
Weiterentwicklung unserer Architektur und Mitgestaltung unserer Systemlandschaft – wir bauen was Cooles und sind noch am Anfang unserer Reise!`);

  // Settings state
  const [selectedCommunication, setSelectedCommunication] = useState("");
  const [selectedTestType, setSelectedTestType] = useState("");
  const [selectedAI, setSelectedAI] = useState("");
  const [selectedAIModel, setSelectedAIModel] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [temperature, setTemperature] = useState(50);
  const [maxTokens, setMaxTokens] = useState(50);
  const [testDuration, setTestDuration] = useState(20);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

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

  useEffect(() => {
    if (config) {
      const defaults = config.settings?.defaults;
      setSelectedCommunication(defaults.communicationMode);
      setSelectedTestType(defaults.testType);
      setSelectedAIModel(defaults.aiModel);
      const defaultModel = config.settings.aiModels.find(
        (m) => m.model === defaults.aiModel
      );
      setSelectedAI(defaultModel?.ai || "");
      setSelectedDifficulty(defaults.difficultyLevel);
      setTemperature(defaults.temperature);
      setMaxTokens(defaults.maxTokens);
      setTestDuration(defaults.testDuration);
      setSelectedResults(defaults.resultOptions);
      // setPreparationLevel(defaults.difficultyLevel);
    }
  }, [config]);

  useEffect(() => {
    if (config) {
      const found = config.settings.aiModels.find(
        (m) => m.model === selectedAIModel
      );
      setSelectedAI(found?.ai || "");
    }
  }, [selectedAIModel, config]);

  if (!config) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const { settings } = config;

  const handleResultChange = (name: string) => {
    if (selectedResults.includes(name)) {
      setSelectedResults(selectedResults.filter((n) => n !== name));
    } else {
      setSelectedResults([...selectedResults, name]);
    }
  };

  const prompt = `
Prepare an interview based on the following:
- Vacancy: ${vacancyName || "Not specified"}
- Description: ${vacancyDescription || "No description"}
- Difficulty: ${selectedDifficulty || "Not specified"}
- Temperature: ${temperature}
- MaxTokens: ${maxTokens}
- Number of questions: ${testDuration}
`.trim();

  const handleEvaluateClick = async () => {
    if (!vacancyName.trim() && !vacancyDescription.trim()) {
      setSnackbarMessage(config.errors.evaluation_requirement);
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/evaluate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ainame: selectedAI,
            aimodel: selectedAIModel,
            temperature,
            maxTokens,
            vacancy_name: vacancyName,
            vacancy_description: vacancyDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (
        data.suggested_level &&
        settings.difficultyLevels.includes(data.suggested_level)
      ) {
        setSelectedDifficulty(data.suggested_level);
        setSnackbarMessage(`Suggested level: ${data.suggested_level}`);
        setSnackbarOpen(true);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      setSnackbarMessage("Failed to evaluate description.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      display="flex"
      gap={2}
      flexWrap="wrap"
      alignItems="flex-start"
      padding="1rem"
    >
      {/* Left: Form */}
      <Box flex={1} minWidth="300px">
        <Typography variant="h5" gutterBottom>
          Interview
        </Typography>

        <TextField
          label="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Box display="flex" gap={2} marginY={2}>
          <TextField
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Vacancy Name"
            value={vacancyName}
            onChange={(e) => setVacancyName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Box>

        <TextField
          label="Vacancy Description"
          value={vacancyDescription}
          onChange={(e) => setVacancyDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />

        <Box display="flex" gap={2} alignItems="center" marginTop={2}>
          <FormControl fullWidth>
            <InputLabel id="preparation-level-label">
              Preparation Level
            </InputLabel>
            <Select
              labelId="preparation-level-label"
              value={selectedDifficulty}
              label="Preparation Level"
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {settings.difficultyLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title={config.info.evaluate}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleEvaluateClick}
            >
              Evaluate
            </Button>
          </Tooltip>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          onClick={() => setModalOpen(true)}
          disabled={!vacancyDescription.trim()}
        >
          Start Interview
        </Button>

        {process.env.NEXT_PUBLIC_MODE === "debug" && (
          <DebugBlock
            data={{
              candidateName,
              companyName,
              vacancyName,
              vacancyDescription,
              selectedCommunication,
              selectedTestType,
              selectedAI,
              selectedAIModel,
              selectedDifficulty,
              temperature,
              maxTokens,
              testDuration,
              selectedResults,
              prompt,
            }}
          />
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="warning"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
      <SettingsPanel
        settings={settings}
        selectedCommunication={selectedCommunication}
        setSelectedCommunication={setSelectedCommunication}
        selectedTestType={selectedTestType}
        setSelectedTestType={setSelectedTestType}
        selectedAIModel={selectedAIModel}
        setSelectedAIModel={setSelectedAIModel}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        temperature={temperature}
        setTemperature={setTemperature}
        maxTokens={maxTokens}
        setMaxTokens={setMaxTokens}
        testDuration={testDuration}
        setTestDuration={setTestDuration}
        selectedResults={selectedResults}
        handleResultChange={handleResultChange}
      />
      <InterviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        interviewOptions={{
          selectedCommunication,
          selectedTestType,
          selectedAI,
          selectedAIModel,
          temperature,
          maxTokens,
          testDuration,
          selectedResults,
          candidateName,
          vacancyName,
          vacancyDescription,
          selectedDifficulty,
        }}
      />
      selectedCommunication={selectedCommunication}
      setSelectedCommunication={setSelectedCommunication}
      selectedTestType={selectedTestType}
      setSelectedTestType={setSelectedTestType}
      selectedAIModel={selectedAIModel}
      setSelectedAIModel={setSelectedAIModel}
      selectedDifficulty={selectedDifficulty}
      setSelectedDifficulty={setSelectedDifficulty}
      temperature={temperature}
      setTemperature={setTemperature}
      maxTokens={maxTokens}
      setMaxTokens={setMaxTokens}
      testDuration={testDuration}
      setTestDuration={setTestDuration}
      selectedResults={selectedResults}
      handleResultChange={handleResultChange}
    </Box>
  );
}
