import React from "react";
import {
  BrainCircuit,
  FileText,
  LayoutDashboard,
  HelpCircle,
  PlayCircle,
  Award,
  Sparkles,
  Sun,
  Moon,
  Upload,
} from "lucide-react";
import { ResumeData } from "../types";

interface NavbarProps {
  activeTab: "landing" | "upload" | "dashboard" | "bank" | "interview-setup" | "interview-active" | "report";
  setActiveTab: (tab: any) => void;
  resumeData: ResumeData | null;
  onLoadDemo: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  resumeData,
  onLoadDemo,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#161b22]/80 border-b border-slate-200 dark:border-[#30363d] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          id="nav-brand-logo"
          onClick={() => setActiveTab(resumeData ? "dashboard" : "landing")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform duration-200">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-[#f0f6fc]">
                Interview<span className="text-indigo-600 dark:text-indigo-400">IQ</span>
              </span>
              <span className="text-[10px] font-mono font-semibold tracking-wide px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                AI POWERED
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#8b949e] hidden sm:block">
              Resume to Interview Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-[#0d1117]/90 p-1 rounded-xl border border-slate-200 dark:border-[#30363d]">
          <button
            id="nav-tab-landing"
            onClick={() => setActiveTab("landing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "landing"
                ? "bg-white dark:bg-[#161b22] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-[#30363d]"
                : "text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]"
            }`}
          >
            Home
          </button>

          {resumeData ? (
            <>
              <button
                id="nav-tab-dashboard"
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-white dark:bg-[#161b22] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-[#30363d]"
                    : "text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Resume Analysis
              </button>

              <button
                id="nav-tab-bank"
                onClick={() => setActiveTab("bank")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "bank"
                    ? "bg-white dark:bg-[#161b22] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-[#30363d]"
                    : "text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Question Bank
              </button>

              <button
                id="nav-tab-interview"
                onClick={() => setActiveTab("interview-setup")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "interview-setup" || activeTab === "interview-active"
                    ? "bg-white dark:bg-[#161b22] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-[#30363d]"
                    : "text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]"
                }`}
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Mock Interview
              </button>
            </>
          ) : (
            <button
              id="nav-tab-upload"
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "upload"
                  ? "bg-white dark:bg-[#161b22] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-[#30363d]"
                  : "text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Resume
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {resumeData ? (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <span className="text-slate-600 dark:text-[#f0f6fc] font-medium truncate max-w-[120px]">
                {resumeData.candidateName}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                {resumeData.overallScore}/100
              </span>
            </div>
          ) : (
            <button
              id="nav-btn-demo-quick"
              onClick={onLoadDemo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-[#f0f6fc] bg-slate-100 hover:bg-slate-200 dark:bg-[#21262d] dark:hover:bg-[#30363d] border border-transparent dark:border-[#30363d] transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Try Demo
            </button>
          )}

          <button
            id="nav-btn-upload-cta"
            onClick={() => setActiveTab("upload")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_2px_10px_rgba(99,102,241,0.3)] active:scale-95 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{resumeData ? "New Resume" : "Upload"}</span>
          </button>

          {/* Dark / Light toggle */}
          <button
            id="nav-btn-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#21262d] border border-transparent dark:border-[#30363d] transition"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
