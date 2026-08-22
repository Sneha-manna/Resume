export type DifficultyLevel = "Easy" | "Medium" | "Hard" | "Mixed Difficulty";

export type QuestionCategory =
  | "HR"
  | "Resume-Based Project"
  | "Technical / Coding"
  | "Data Science & ML"
  | "System & Model Design"
  | "Behavioral"
  | "General";

export type InterviewType =
  | "HR Interview"
  | "Technical Interview"
  | "Project Interview"
  | "Data Science Interview"
  | "Python Interview"
  | "SQL Interview"
  | "Mixed Interview";

export interface ProjectItem {
  title: string;
  technologies: string[];
  description: string;
  keyImpact?: string;
  suggestedQuestions?: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period?: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  year?: string;
  details?: string;
}

export interface ResumeSkills {
  programmingLanguages: string[];
  frameworks: string[];
  databases?: string[];
  toolsAndPlatforms: string[];
  domainExpertise?: string[];
}

export interface ResumeInsights {
  strongAreas: string[];
  areasToImprove: string[];
  interviewPrepTips: string[];
}

export interface ScoreBreakdown {
  completeness: number;
  technicalDepth: number;
  projectImpact: number;
  formattingClarity: number;
}

export interface QuestionItem {
  id: string;
  question: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  resumeSource: string; // e.g. "Based on your project: Breast Cancer Prediction"
  suggestedAnswer: string;
  keyEvaluationPoints: string[];
  isFavorite?: boolean;
}

export interface ResumeData {
  candidateName: string;
  targetRole: string;
  summary?: string;
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  skills: ResumeSkills;
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications?: string[];
  insights: ResumeInsights;
  generatedQuestions: QuestionItem[];
}

export interface AnswerEvaluation {
  score: number; // 1 - 10
  whatWasGood: string[];
  whatWasMissing: string[];
  betterAnswerSuggestion: string;
  followUpQuestion: string;
  quickTake?: string;
}

export interface InterviewRecord {
  questionId: string;
  question: string;
  resumeSource: string;
  category: string;
  difficulty: string;
  suggestedAnswer: string;
  userAnswer: string;
  evaluation?: AnswerEvaluation;
  followUpAnswer?: string;
  timeSpentSeconds: number;
  isSkipped?: boolean;
}

export interface FinalReportData {
  overallScore: number;
  readinessLevel: string;
  scores: {
    technicalKnowledge: number;
    communication: number;
    projectUnderstanding: number;
    problemSolving: number;
    confidence: number;
    resumeKnowledge: number;
  };
  weakQuestions: {
    question: string;
    source: string;
    scoreReceived: number;
    keyIssue: string;
    howToImprove: string;
  }[];
  recommendedTopics: string[];
  aiFeedback: {
    summary: string;
    topStrengths: string[];
    criticalGaps: string[];
    nextStepsActionPlan: string[];
  };
}
