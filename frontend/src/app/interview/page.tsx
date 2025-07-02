"use client";

import React from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import InterviewContent from "@/components/InterviewContent";

export default function InterviewPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <main style={{ flex: 1, paddingTop: "5rem", paddingBottom: "4rem" }}>
        <InterviewContent />
      </main>
      <AppFooter />
    </div>
  );
}
