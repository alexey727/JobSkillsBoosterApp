import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  DialogContentText,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
  interviewOptions: any;
};

export default function InterviewModal({
  open,
  onClose,
  interviewOptions,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [interviewId, setInterviewId] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<null | {
    question: string;
    answerOptions: string[];
    type: string;
    answer: string;
  }>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (open && interviewOptions) {
      const startInterview = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/start-interview`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(interviewOptions),
            }
          );

          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }

          const result = await res.json();
          console.log("Interview started, timestamp:", result.timestamp);
          setInterviewId(result.timestamp);
        } catch (error) {
          console.error("Failed to start interview:", error);
        }
      };

      startInterview();
    }
  }, [open, interviewOptions]);

  useEffect(() => {
    if (open && interviewId) {
      const fetchQuestion = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/question/get-question/${interviewId}`
          );
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          const data = await res.json();
          setCurrentQuestion(data.question);
        } catch (error) {
          console.error("Failed to load question:", error);
        }
      };

      fetchQuestion();
    }
  }, [open, interviewId]);

  const handleRequestClose = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setCurrentQuestion(null);
    onClose();
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  const handleClose = (
    event: object,
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    handleRequestClose();
  };

  const infoSx = {
    mt: 0.1,
    mb: 0.1,
    fontSize: "0.8rem",
    fontWeight: 200,
  };

  const infoDataSx = {
    mt: 0.1,
    mb: 0.1,
    fontSize: "0.8rem",
    fontWeight: 600,
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Interview in Progress. ID {interviewId}
          <IconButton onClick={handleRequestClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" gap={2} marginY={1}>
            <Typography sx={infoSx}>
              Candidate:{" "}
              <Typography component="span" sx={infoDataSx}>
                {interviewOptions.candidateName}
              </Typography>
            </Typography>
            <Typography sx={infoSx}>
              Vacancy:{" "}
              <Typography component="span" sx={infoDataSx}>
                {interviewOptions.vacancyName}
              </Typography>
            </Typography>
            <Typography sx={infoSx}>
              Difficulty:{" "}
              <Typography component="span" sx={infoDataSx}>
                {interviewOptions.selectedDifficulty}
              </Typography>
            </Typography>
          </Box>
          <Box display="flex" gap={2} marginY={1}>
            <Typography sx={infoSx}>
              Mode:{" "}
              <Typography component="span" sx={infoDataSx}>
                {interviewOptions.selectedCommunication}
              </Typography>
            </Typography>
            <Typography sx={infoSx}>
              Test Type :{" "}
              <Typography component="span" sx={infoDataSx}>
                {interviewOptions.selectedTestType}
              </Typography>
            </Typography>
            <Typography sx={infoSx}>
              AI Model:{" "}
              <Typography component="span" sx={infoDataSx}>
                {interviewOptions.selectedAIModel}
              </Typography>
            </Typography>
            <Typography sx={infoSx}>
              Qty. Questions:{" "}
              <Typography component="span" sx={infoDataSx}>
                {interviewOptions.testDuration}
              </Typography>
            </Typography>
          </Box>

          <Divider />

          {currentQuestion && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom textAlign="center">
                Question {currentQuestion.id} from{" "}
                {interviewOptions.testDuration}
              </Typography>

              {interviewOptions.selectedTestType === "single" ? (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    {currentQuestion.question}
                  </Typography>

                  <RadioGroup
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                  >
                    {currentQuestion.answerOptions.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ) : (
                // Если testType не выбран - кнопки
                <Box display="flex" flexDirection="column" gap={1}>
                  {currentQuestion.answerOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedAnswer === option ? "contained" : "outlined"
                      }
                      fullWidth
                      sx={{ textAlign: "left" }}
                      onClick={() => setSelectedAnswer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>
          )}

          <Box mt={2} textAlign="center">
            <Button
              disabled={!selectedAnswer}
              variant="contained"
              color="primary"
              onClick={async () => {
                try {
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/question/answer`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        interviewId,
                        answer: selectedAnswer,
                      }),
                    }
                  );

                  if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                  }

                  const data = await res.json();
                  console.log("Answer saved:", data);


                  setSelectedAnswer(null);
                } catch (error) {
                  console.error("Failed to send answer:", error);
                }
              }}
            >
              Send Answer
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleRequestClose}
            color="primary"
            variant="contained"
          >
            Break Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения */}
      <Dialog
        open={confirmOpen}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          handleCancelConfirm();
        }}
      >
        <DialogTitle>Confirm Exit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to stop the interview? Your progress will be
            lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm}>Cancel</Button>
          <Button
            onClick={handleConfirmClose}
            variant="contained"
            color="error"
          >
            Yes, Exit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
