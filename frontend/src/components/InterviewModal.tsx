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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Interview, InterviewSettings } from "@/types/types";

type Props = {
  open: boolean;
  onClose: () => void;
  interviewOptions: InterviewSettings;
};

export default function InterviewModal({
  open,
  onClose,
  interviewOptions,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [interviewId, setInterviewId] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<null | {
    id: string;
    question: string;
    answerOptions: string[];
    type: string;
    answer: string;
  }>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [interviewResults, setInterviewResults] = useState<Interview | null>(
    null
  );

  useEffect(() => {
    if (open && interviewOptions) {
      resetInterviewState();
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
          setCurrentQuestionNumber(1);
          setInterviewFinished(false);
        } catch (error) {
          console.error("Failed to start interview:", error);
        }
      };

      startInterview();
    }
  }, [open, interviewOptions]);

  useEffect(() => {
    if (open && currentQuestionNumber) {
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
  }, [open, currentQuestionNumber]);

  useEffect(() => {
    if (open && interviewFinished) {
      const fetchInterview = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/interview/get-result/${interviewId}`
          );
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          const data = await res.json();
          console.log(data.questions);
          setInterviewResults(data);

          const points = data.questions.reduce(
            (acc: number, q: any) => acc + (q.point || 0),
            0
          );
          setTotalPoints(points);
        } catch (error) {
          console.error("Failed to load question:", error);
        }
      };

      fetchInterview();
    }
  }, [open, interviewId, interviewFinished]);

  const handleRequestClose = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    resetInterviewState();
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

  const resetInterviewState = () => {
    setInterviewId(false);
    setInterviewFinished(false);
    setCurrentQuestionNumber(0);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setInterviewResults(null);
    setTotalPoints(null);
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
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            minHeight: "80%",
          },
        }}
      >
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

          {!currentQuestion && !interviewFinished && (
            <Box
              mt={3}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <CircularProgress />
              <Typography mt={1}>The question is being formed...</Typography>
            </Box>
          )}

          {!interviewFinished && currentQuestion && (
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
                    setCurrentQuestion(null);
                    if (currentQuestionNumber < interviewOptions.testDuration) {
                      setCurrentQuestionNumber(currentQuestionNumber + 1);
                    } else {
                      setInterviewFinished(true);
                    }
                  } catch (error) {
                    console.error("Failed to send answer:", error);
                  }
                }}
              >
                Send Answer
              </Button>
            </Box>
          )}

          {interviewFinished && (
            <Box mt={3} textAlign="center">
              <Typography variant="h6" gutterBottom>
                Interview Finished
              </Typography>

              {totalPoints !== null && (
                <Typography variant="body1" mb={2}>
                  You scored {totalPoints} points out of{" "}
                  {interviewOptions.testDuration}
                </Typography>
              )}

              {interviewResults && (
                <>
                  <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    {interviewResults.questions.map((q) => (
                      <Box
                        key={q.id}
                        p={2}
                        bgcolor="#f5f5f5"
                        borderRadius={2}
                        textAlign="left"
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {q.id}. {q.question}
                        </Typography>
                        <Box pl={2}>
                          {q.answerOptions.map((option, idx) => (
                            <Typography
                              key={idx}
                              variant="body2"
                              sx={{
                                fontWeight:
                                  option === q.answer ? "bold" : "normal",
                                color:
                                  option === q.rightAnswer
                                    ? "green"
                                    : option === q.answer
                                    ? "red"
                                    : "inherit",
                              }}
                            >
                              {option}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    gap={2}
                    mt={2}
                    p={2}
                    bgcolor="#C2DAB8"
                    minHeight={"100px"}
                    borderRadius={2}
                  >
                    TODO: AI recommendations to improve your skills
                  </Box>

                  {totalPoints !== null &&
                    totalPoints / interviewOptions.testDuration >= 0.8 && (
                      <Box
                        mt={2}
                        p={2}
                        bgcolor="#E0F7FA"
                        borderRadius={2}
                        textAlign="center"
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                        >
                          🎉 Certificate of Achievement
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          Congratulations! You have successfully passed the test
                          with{" "}
                          {Math.round(
                            (totalPoints / interviewOptions.testDuration) * 100
                          )}
                          % correct answers.
                        </Typography>
                      </Box>
                    )}
                </>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          {interviewFinished ? (
            <Button
              onClick={() => {
                resetInterviewState();
                onClose();
              }}
              color="primary"
              variant="contained"
            >
              Close
            </Button>
          ) : (
            <Button
              onClick={handleRequestClose}
              color="primary"
              variant="contained"
            >
              Break Interview
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog confirm */}
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
