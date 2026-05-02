export interface Skill {
  id: string;
  name: string;
  description: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  task: string;
  baseAgent: string;
  skills: Skill[];
  outputWithoutSkills: string;
  outputWithSkills: string;
  trace: string;
  quickPrompts: string[];
  explanation: string;
}

export const PRESETS: Preset[] = [
  {
    id: "data-analyst",
    name: "Data Analyst Skill",
    description: "Analyze financial data and identify anomalies.",
    task: "Summarize quarterly revenue trends and flag any anomalies",
    baseAgent: "General-purpose assistant with no domain expertise",
    skills: [
      { id: "s-da", name: "Data Analysis", description: "Extracts insights from structured data" },
      { id: "s-cr", name: "Chart Reasoning", description: "Interprets visual data trends" },
      { id: "s-si", name: "Statistical Interpretation", description: "Identifies statistical significance" }
    ],
    outputWithoutSkills: "Q1 revenue was $2.1M, Q2 was $2.4M, Q3 was $2.9M, Q4 was $3.2M. Revenue increased over the year.",
    outputWithSkills: "Revenue showed strong growth throughout the year, ending with 14% quarter-over-quarter growth. There was a notable acceleration in Q3-Q4. I have flagged the jump from Q2 to Q3 as statistically significant (a 22% increase compared to the 10% baseline). I recommend investigating the factors contributing to this Q3 surge and suggesting a trend visualization for further clarity.",
    trace: "Statistical Interpretation skill activated anomaly detection → Chart Reasoning skill structured the comparison → Data Analysis skill added actionable recommendation",
    quickPrompts: ["Show me YoY comparison", "Flag outliers only", "Add forecast for Q1 next year", "Summarize for exec presentation"],
    explanation: "Without skills, the agent just repeats the data back to you. With the Data Analyst skills attached, the agent performs actual math (calculating 14% QoQ growth), identifies a statistically significant jump, and provides actionable recommendations based on the findings."
  },
  {
    id: "legal-review",
    name: "Legal Review Skill",
    description: "Analyze contracts for risk and market standards.",
    task: "Review this software vendor contract clause for risk:\n\n'Vendor may modify service terms with 7 days notice. Liability is limited to fees paid in the last 30 days.'",
    baseAgent: "General-purpose assistant",
    skills: [
      { id: "s-ca", name: "Contract Analysis", description: "Compares clauses against market standards" },
      { id: "s-rf", name: "Risk Flagging", description: "Identifies potential legal exposure" },
      { id: "s-ja", name: "Jurisdiction Awareness", description: "Notes regional enforceability differences" }
    ],
    outputWithoutSkills: "This clause allows the vendor to change terms and limits what you can claim. You should consult a lawyer.",
    outputWithSkills: "This clause contains 3 specific high-risk items:\n1. Short modification notice: 7 days is unusually low (standard is 30-90 days).\n2. Liability cap exposure: A 30-day fee cap may equal $0 for annual contracts, leaving you fully exposed.\n3. Lack of termination rights.\n\nRecommendation: Negotiate mutual termination rights if terms change, and establish a minimum liability floor.",
    trace: "Risk Flagging identified 2 high-risk clauses → Contract Analysis compared against market standards → Jurisdiction Awareness noted that clause enforceability varies by region",
    quickPrompts: ["Compare to market standard", "Draft a counter-proposal", "Identify all liability clauses", "Summarize risks for non-lawyers"],
    explanation: "The base agent gives a generic warning. The skilled agent provides a structured risk assessment, comparing the terms against industry standards and offering specific negotiation tactics to mitigate the identified risks."
  },
  {
    id: "support-copilot",
    name: "Support Copilot Skill",
    description: "Handle escalated customer support tickets effectively.",
    task: "Customer says: 'I've been charged twice and nobody has helped me for 3 days'",
    baseAgent: "General text assistant",
    skills: [
      { id: "s-ec", name: "Empathy Calibration", description: "Adjusts tone based on user sentiment" },
      { id: "s-ed", name: "Escalation Detection", description: "Flags high-priority or delayed issues" },
      { id: "s-rp", name: "Resolution Playbook", description: "Applies standard operating procedures for common issues" }
    ],
    outputWithoutSkills: "I'm sorry to hear about this. Please contact our billing team at billing@company.com and they will resolve the duplicate charge.",
    outputWithSkills: "I sincerely apologize for the delay and the frustration this duplicate charge has caused. I have immediately confirmed the duplicate charge and initiated a refund, which will appear in your account within 24 hours. Because you've been waiting 3 days, I've escalated this to our billing priority queue and applied a $15 credit to your account for the inconvenience. I will personally follow up tomorrow to ensure the refund has processed.",
    trace: "Escalation Detection flagged 3-day wait as priority → Empathy Calibration shaped opening tone → Resolution Playbook activated refund + compensation protocol",
    quickPrompts: ["De-escalate angry tone", "Draft apology email", "Check churn risk", "Suggest retention offer"],
    explanation: "The generic response offloads the work back to the angry customer. The skilled response takes immediate ownership, applies a specific resolution protocol (refund + credit), and commits to a follow-up, drastically improving the customer experience."
  },
  {
    id: "research-synthesizer",
    name: "Research Synthesizer Skill",
    description: "Synthesize academic research with proper citations.",
    task: "What does the latest research say about sleep and cognitive performance?",
    baseAgent: "General assistant with no research methodology expertise",
    skills: [
      { id: "s-rs", name: "Research Synthesis", description: "Structures findings by evidence type" },
      { id: "s-ca2", name: "Citation Awareness", description: "Links claims to source quality" },
      { id: "s-eg", name: "Evidence Grading", description: "Evaluates strength of claims" }
    ],
    outputWithoutSkills: "Sleep is very important for cognitive performance. Studies show that getting 7-9 hours is recommended for adults.",
    outputWithSkills: "Current research indicates a strong link between sleep and cognitive performance, structured across several domains:\n\n- Memory Consolidation (Strong Evidence): Sleep is critical for transferring short-term memories to long-term storage (Walker, 2017; Tononi & Cirelli sleep homeostasis model).\n- Creativity Links (Moderate Evidence): REM sleep has been associated with novel problem-solving, though causality is harder to isolate.\n\nGaps remain in long-term longitudinal data, and studies often struggle to distinguish the effects of acute versus chronic sleep deprivation.",
    trace: "Research Synthesis structured findings by evidence type → Citation Awareness linked claims to source quality → Evidence Grading flagged weaker correlational claims",
    quickPrompts: ["Focus on memory consolidation", "Compare nap vs full sleep", "Summarize for a health article", "What's still contested?"],
    explanation: "The base agent gives a generic, unhelpful summary. The skilled agent provides a structured review of the literature, cites specific models, grades the evidence strength, and acknowledges current gaps in the research."
  }
];
