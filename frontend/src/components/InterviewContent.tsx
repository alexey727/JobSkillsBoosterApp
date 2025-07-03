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
  Tooltip
} from "@mui/material";
import SettingsPanel from "@/components/SettingsPanel";
import DebugBlock from "@/components/DebugBlock";
import InterviewModal from "@/components/InterviewModal";
import { Config } from "@/types/types";

export default function InterviewForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Form state
  const [candidateName, setCandidateName] = useState("Best Candidate");
  const [companyName, setCompanyName] = useState("DreamWork");
  const [vacancyName, setVacancyName] = useState(
    "Senior Fullstack Developer (Focus on Frontend) – Platform Team"
  );
  // const [preparationLevel, setPreparationLevel] = useState("");
  const [vacancyDescription, setVacancyDescription] = useState(`
      Are you experienced in front-end development with React and proficient in full-stack development with Python on the backend? Are you looking for a new challenge where you can not only write code but also use your technical expertise to design sustainable and scalable software architecture? Then join our Platform team as a Senior Full-Stack Developer (focus on front-end).

Our Platform team is part of CONTACT Software's internal software and product development and forms the technological foundation for our entire product portfolio. Your work has a direct impact on the long-term development of our software products. As a Senior Full-Stack Developer, you will take responsibility for key technical components, drive innovation, and actively shape our system architecture. We rely on modern web technologies and place great value on high-quality, future-proof software solutions with long-term added value for our customers. Together, we will further develop the user interface for enterprise systems and set technological standards.

As a leading provider of digital transformation in industry, CONTACT Elements offers groundbreaking solutions for PLM (Product Lifecycle Management), project management, and MES (Manufacturing Execution Systems). Our platform supports companies worldwide in more efficient collaboration and digital transformation.

Your Responsibilities

Architecture and further development of our user interfaces for highly complex enterprise systems
Design and development of frameworks for our B2B product landscape
Design and implementation of the next generation of our software products
Technical responsibility and mentoring within the team to establish best practices and share knowledge
Participation in all phases of software development: from technical conception to implementation, test automation, and code reviews, as well as documentation and maintenance
Close collaboration with our experienced UX coaches to develop intuitive and high-performance applications
Ensuring a sustainable software architecture and long-term maintainability of developed solutions
Use of state-of-the-art technologies and continuous technological development

Our technology stack:

We primarily work with JavaScript/React/Redux on the frontend and Python/C++ on the backend. We deploy our software both in on-premises scenarios and in cloud environments using Kubernetes, Helm, and OpenTelemetry with hyperscalers like AWS. We work in agile projects with appropriate automation (CI/CD pipelines).

What you should bring with you:

Completed degree in computer science, digital media, or a related technical field with a proven focus on computer science – alternatively, a comparable IT qualification with several years of professional experience.
Several years of experience in the development and architecture of modern web applications using React/JavaScript.
Confident use of web technologies such as HTTP/3, HTML5, CSS, JavaScript, and the associated developer tools.
Extensive knowledge of the use and integration of open source software in enterprise environments.
Passion for software development and modern web technologies.
In-depth experience with software design principles and best practices for scalable web architectures.
Solid knowledge of backend development with Python and its interfaces to modern web frontends.
Experience in developing modular, maintainable, and high-performance systems.
Structured, analytical, and solution-oriented working style.
Enjoyment of collaborative work in a highly qualified, dedicated team.
Very good written and spoken German and English skills

What we offer

Exciting projects and varied tasks within a diverse team spread across Germany that is looking forward to meeting you!
A market-oriented salary and flat hierarchies within a rapidly growing organization with a "du" culture up to management level
Individual and professional onboarding with a mentoring program and support from your teammates
Selection of various training courses from our training catalog for professional and personal development
Your own choice of development environment
Discounts for company fitness as well as participation in various sports groups, regular team and company events
Choice between working at one of our locations, working from home, or a hybrid position
An open and appreciative corporate culture where your own ideas are not only allowed but also welcomed
Flexible working hours with time tracking and 30 days of vacation (based on a 5-day week)
Subsidy for the Deutschlandticket (Germany Ticket)
Fresh fruit and a variety of hot and cold drinks at our locations
      `);

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
            rows={8}
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

      </Box>
  );
}
