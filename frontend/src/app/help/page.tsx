"use client";

import React from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import HelpContent from "@/components/HelpContent";

export default function HelpPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <main style={{ flex: 1, marginTop: "64px", paddingBottom: "4rem" }}>
        <HelpContent />
      </main>
      <AppFooter />
    </div>
  );
}
