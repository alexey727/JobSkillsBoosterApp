"use client";

import React from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import HomeContent from "@/components/HomeContent";

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <main style={{ flex: 1, marginTop: "64px", paddingBottom: "4rem" }}>
        <HomeContent />
      </main>
      <AppFooter />
    </div>
  );
}
