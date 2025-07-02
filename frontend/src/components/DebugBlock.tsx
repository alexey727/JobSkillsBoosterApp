"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar,
  Alert, } from "@mui/material";

export default function DebugBlock({ data }: { data: any }) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

  const [imageDescription, setImageDescription] = useState("");

  const handleGenerateImage = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate_image_pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: imageDescription || "A generic placeholder image"
      })
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    console.log("PDF saved at:", data.pdf_path);

    setSnackbarMessage(`Image PDF generated: ${data.pdf_path}`);
    setSnackbarOpen(true);
  } catch (error) {
    console.error("Image generation failed:", error);
    setSnackbarMessage("Failed to generate image.");
    setSnackbarOpen(true);
  }
};

  return (
    <Box
      mt={4}
      p={2}
      sx={{
        backgroundColor: "#f5f5f5",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        fontSize: "0.85rem"
      }}
    >
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Debug Info
        </Typography>
        {JSON.stringify(data, null, 2)}

        <Box>
          <TextField
                    label="Image Description"
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                  />

          <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }} onClick={handleGenerateImage}>
                    Generate Image
                  </Button>
        </Box>

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
      
    </Box>
  );
}
