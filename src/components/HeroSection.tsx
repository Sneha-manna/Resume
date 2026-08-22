import React from "react";
import {
  Upload,
  Sparkles,
  FileSearch,
  Bot,
  Target,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  MessageSquareCode,
} from "lucide-react";

interface HeroSectionProps {
  onUploadClick: () => void;
  onDemoClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onUploadClick, onDemoClick }) => {
  return (
    <div className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24">
      {/* Background Decorative Gradient Radial */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0%,transparent_70%)] blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Geometric Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)] animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Next-Gen AI Resume & Mock Interview Intelligence</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-[#f0f6fc] leading-[1.15]">
            Turn Your Resume Into Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400">
              Interview
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#8b949e] max-w-2xl mx-auto font-normal leading-relaxed">
            Upload your resume and get personalized interview questions powered by AI. Experience
            deep project probing, real-time verbal answers, instant scoring, and tailored feedback.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              id="hero-btn-upload"
              onClick={onUploadClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5"
            >
              <Upload className="w-4 h-4" />
              Upload Resume
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </button>

            <button
              id="hero-btn-demo"
              onClick={onDemoClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-800 dark:text-[#f0f6fc] bg-white/90 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] hover:bg-slate-50 dark:hover:bg-[#21262d] hover:border-slate-300 dark:hover:border-[#484f58] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Try Demo (Data Scientist)
            </button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-[#8b949e]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero generic questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Voice & text answer modes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Contextual follow-up AI</span>
            </div>
          </div>
        </div>

        {/* Visual Showcase Glass Container */}
        <div className="mt-12 lg:mt-16 max-w-5xl mx-auto rounded-2xl bg-white/70 dark:bg-[#161b22]/80 p-4 sm:p-6 border border-slate-200 dark:border-[#30363d] shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Resume Excerpt */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl border border-slate-200/80 dark:border-[#30363d] shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-[#21262d]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FileSearch className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-[#f0f6fc]">
                    Resume Snippet
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  PARSED BY AI
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-[#8b949e] font-mono space-y-1.5 bg-white dark:bg-[#161b22] p-2.5 rounded-lg border border-slate-200/60 dark:border-[#30363d]">
                <p className="font-semibold text-slate-800 dark:text-[#f0f6fc]">
                  Project: Breast Cancer Prediction
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#8b949e]">
                  "Applied Random Forest & PCA on Wisconsin dataset; achieved 96.4% recall prioritizing low false negatives."
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                <Zap className="w-3.5 h-3.5" />
                Gemini targets exact algorithms & metrics
              </div>
            </div>

            {/* Middle Transformation Arrow */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">
                Generates
              </span>
            </div>

            {/* Right Generated Interview Question & Evaluation */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-[#0d1117] p-4 rounded-xl border border-slate-200/80 dark:border-[#30363d] shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-[#21262d]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <MessageSquareCode className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-[#f0f6fc]">
                    Dynamic Interview Question
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                  MEDIUM
                </span>
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-[#f0f6fc]">
                "Why did you choose Random Forest for your Breast Cancer dataset instead of simpler linear classifiers?"
              </p>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Evaluates Recall, Ensemble Theory & Tradeoffs</span>
                <span className="font-bold font-mono">Score 8.5/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Below Hero */}
        <div className="mt-16 lg:mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#f0f6fc] tracking-tight">
              A Complete AI Interview Simulation Engine
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#8b949e] mt-2">
              Engineered specifically for engineering, data science, and technical roles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Resume Analysis */}
            <div
              id="feature-card-analysis"
              onClick={onUploadClick}
              className="group p-6 rounded-2xl bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] shadow-sm hover:border-indigo-500/50 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)] transition-all duration-200 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#21262d] border border-blue-200/60 dark:border-[#30363d] flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc] flex items-center gap-1.5">
                <span>📄</span> Resume Analysis
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#8b949e] mt-2 leading-relaxed">
                Extracts skills, project architectures, metrics, and experience to generate a complete resume strength scorecard (0-100).
              </p>
            </div>

            {/* Feature 2: AI-Generated Questions */}
            <div
              id="feature-card-questions"
              onClick={onDemoClick}
              className="group p-6 rounded-2xl bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] shadow-sm hover:border-indigo-500/50 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)] transition-all duration-200 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-[#21262d] border border-indigo-200/60 dark:border-[#30363d] flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc] flex items-center gap-1.5">
                <span>🤖</span> AI-Generated Questions
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#8b949e] mt-2 leading-relaxed">
                Creates questions grounded in your actual work—not generic templates—citing the exact project or tool referenced.
              </p>
            </div>

            {/* Feature 3: Personalized Interview */}
            <div
              id="feature-card-interview"
              onClick={onDemoClick}
              className="group p-6 rounded-2xl bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] shadow-sm hover:border-indigo-500/50 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)] transition-all duration-200 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-[#21262d] border border-purple-200/60 dark:border-[#30363d] flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc] flex items-center gap-1.5">
                <span>🎯</span> Personalized Interview
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#8b949e] mt-2 leading-relaxed">
                Realistic mock session with voice & typing modes, live speech-to-text, and dynamic follow-up questions reacting to your answers.
              </p>
            </div>

            {/* Feature 4: Performance Analysis */}
            <div
              id="feature-card-report"
              onClick={onDemoClick}
              className="group p-6 rounded-2xl bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] shadow-sm hover:border-indigo-500/50 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)] transition-all duration-200 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-[#21262d] border border-cyan-200/60 dark:border-[#30363d] flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc] flex items-center gap-1.5">
                <span>📊</span> Performance Analysis
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#8b949e] mt-2 leading-relaxed">
                Comprehensive score report with dimensional breakdown, questions to prepare, recommended study topics, and an AI growth roadmap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
