"use client";

import React from "react";
import { ValidationReport, ValidationReportData } from "../../components/ui/ValidationReport";

// Example dummy data matching the image
const dummyData: ValidationReportData = {
  ideaName: "NewIdea",
  subtitle: "An AI-driven platform for personalized nutrition and wellness guidance.",
  statusLabel: "Validated",
  score: 8.2,
  quickTake: "This concept addresses a growing need for personalized nutrition and wellness solutions, offering a scalable approach to improving health outcomes. Challenges include ensuring user engagement and maintaining data privacy.",
  problemMarketFit: "Lack of personalized nutrition guidance leads to ineffective eating habits in health conscious individuals.",
  aiComment: "Addressing this problem can significantly improve health outcomes for a large and growing market.",
  market: { tam: "50M", sam: "10M", som: "2M" },
  competitors: [
    { name: "Competitor A", strength: "", weakness: "" },
    { name: "Competitor B", strength: "Strong Ux", weakness: "High price" },
    { name: "Competitor C", strength: "Nartoy focats", weakness: "Neinprlocus" }
  ],
  solutionSummary: "An AI-powered platform that offers personalized nutrition and wellness plans.",
  recommendations: [
    "Enhance data privacy measures",
    "Improve user engagement features"
  ],
  risks: {
    topRisks: [
      { risk: "Market saturation", description: "Risk sutihgentes" },
      { risk: "Competition", description: "Market saturas tion.ekstbst" },
      { risk: "Data privacy concerns", description: "Competition ia data privacy partnates" }
    ],
    riskLevel: "Medium",
    riskLevelValue: 60
  },
  goToMarket: { 
    earlyStrategy: "Launch with a targeted beta program.", 
    channels: ["SEO", "Social ads", "influencer parhir-", "Content marketing"] 
  },
  finalVerdict: 8.2,
};

// Default export required for Next.js page
export default function Page() {
  return <ValidationReport data={dummyData} />;
}
