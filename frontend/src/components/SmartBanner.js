"use client";

import React from "react";
import "./SmartBanner.css"; // Import CSS file

const SmartBanner = () => {
  const handleGetStarted = () => {
    alert("Redirecting to setup wizard...");
    // window.location.href = "/start"; // Optional redirect
  };

  return (
    <div className="banner">
      <div className="text-section">
        <h1>Ready to manage your money smarter?</h1>
        <p>
          Start your journey to smarter spending and better saving — it only
          takes 2 minutes.
        </p>
        <button className="cta-button" onClick={handleGetStarted}>
          Get Started <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
</svg>
</span>
        </button>
      </div>
    </div>
  );
};

export default SmartBanner;
