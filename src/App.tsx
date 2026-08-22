import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ResumeUploadView } from "./components/ResumeUploadView";
import { ResumeDashboard } from "./components/ResumeDashboard";
import { QuestionBankView } from "./components/QuestionBankView";
import { InterviewSetupView } from "./components/InterviewSetupView";
import { ActiveInterviewView } from "./components/ActiveInterviewView";
import { FinalReportView } from "./components/FinalReportView";
import {
  ResumeData,
  QuestionItem,
  InterviewType,
  DifficultyLevel,
  InterviewRecord,
  FinalReportData,
} from "./types";
import { DEMO_PARSED_RESUME } from "./data/demoResume";
import { apiGenerateQuestions, apiGenerateReport } from "./services/api";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [activeTab, setActiveTab] = useState<
    "landing" | "upload" | "dashboard" | "bank" | "interview-setup" | "interview-active" | "report"
  >("landing");

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewType>("Mixed Interview");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("Mixed Difficulty");
  const [activeInterviewQuestions, setActiveInterviewQuestions] = useState<QuestionItem[]>([]);
  const [interviewHistory, setInterviewHistory] = useState<InterviewRecord[]>([]);
  const [finalReport, setFinalReport] = useState<FinalReportData | null>(null);
  const [isGeneratingInterview, setIsGeneratingInterview] = useState<boolean>(false);

  // Sync dark mode class with html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleResumeAnalysisComplete = (data: ResumeData) => {
    setResumeData(data);
    setQuestions(data.generatedQuestions || []);
    setActiveTab("dashboard");
  };

  const handleLoadDemo = () => {
    setResumeData(DEMO_PARSED_RESUME);
    setQuestions(DEMO_PARSED_RESUME.generatedQuestions || []);
    setActiveTab("dashboard");
  };

  const handleLaunchInterview = async (
    type: InterviewType,
    difficulty: DifficultyLevel,
    count: number
  ) => {
    if (!resumeData) return;
    setSelectedInterviewType(type);
    setSelectedDifficulty(difficulty);
    setIsGeneratingInterview(true);

    try {
      const generated = await apiGenerateQuestions(resumeData, type, difficulty, count);
      const chosenQuestions =
        generated && generated.length > 0
          ? generated
          : questions.slice(0, count);

      setActiveInterviewQuestions(chosenQuestions);
      setActiveTab("interview-active");
    } catch (err) {
      console.error("Error launching interview:", err);
      setActiveInterviewQuestions(questions.slice(0, count));
      setActiveTab("interview-active");
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  const handlePracticeSingleQuestion = (question: QuestionItem) => {
    setActiveInterviewQuestions([question]);
    setSelectedInterviewType("Project Interview");
    setSelectedDifficulty(question.difficulty as DifficultyLevel);
    setActiveTab("interview-active");
  };

  const handleFinishInterview = async (history: InterviewRecord[]) => {
    setInterviewHistory(history);
    if (!resumeData) return;

    try {
      const report = await apiGenerateReport(
        resumeData.candidateName,
        selectedInterviewType,
        history,
        resumeData
      );
      setFinalReport(report);
    } catch (err) {
      console.error("Error generating final report:", err);
    }

    setActiveTab("report");
  };

  return (
    <div className="min-h-screen geometric-bg-light dark:geometric-bg text-slate-900 dark:text-[#f0f6fc] transition-colors duration-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        resumeData={resumeData}
        onLoadDemo={handleLoadDemo}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === "landing" && (
          <HeroSection
            onUploadClick={() => setActiveTab("upload")}
            onDemoClick={handleLoadDemo}
          />
        )}

        {activeTab === "upload" && (
          <ResumeUploadView
            onAnalysisComplete={handleResumeAnalysisComplete}
            onCancel={resumeData ? () => setActiveTab("dashboard") : undefined}
          />
        )}

        {activeTab === "dashboard" && resumeData && (
          <ResumeDashboard
            resumeData={resumeData}
            onStartInterview={() => setActiveTab("interview-setup")}
            onViewQuestionBank={() => setActiveTab("bank")}
            onReupload={() => setActiveTab("upload")}
          />
        )}

        {activeTab === "bank" && resumeData && (
          <QuestionBankView
            questions={questions}
            setQuestions={setQuestions}
            resumeData={resumeData}
            onPracticeQuestion={handlePracticeSingleQuestion}
            onStartFullInterview={() => setActiveTab("interview-setup")}
          />
        )}

        {activeTab === "interview-setup" && resumeData && (
          <InterviewSetupView
            resumeData={resumeData}
            onLaunchInterview={handleLaunchInterview}
            onBack={() => setActiveTab("dashboard")}
          />
        )}

        {activeTab === "interview-active" && activeInterviewQuestions.length > 0 && (
          <ActiveInterviewView
            questions={activeInterviewQuestions}
            interviewType={selectedInterviewType}
            difficulty={selectedDifficulty}
            onFinishInterview={handleFinishInterview}
            onExit={() => setActiveTab(resumeData ? "dashboard" : "landing")}
          />
        )}

        {activeTab === "report" && finalReport && resumeData && (
          <FinalReportView
            reportData={finalReport}
            history={interviewHistory}
            resumeData={resumeData}
            interviewType={selectedInterviewType}
            onRetake={() => setActiveTab("interview-setup")}
            onGoToBank={() => setActiveTab("bank")}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-[#30363d] bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#8b949e]">
          <p>© 2026 InterviewIQ. AI-Powered Resume to Interview Simulation Platform.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Google Gemini 3.7 Flash</span>
            <span>•</span>
            <span>Zero Mock Placeholders</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
