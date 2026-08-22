import React, { useState } from "react";
import {
  PlayCircle,
  Sparkles,
  Bot,
  Briefcase,
  Code2,
  Database,
  Layers,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { DifficultyLevel, InterviewType, ResumeData } from "../types";

interface InterviewSetupViewProps {
  resumeData: ResumeData;
  onLaunchInterview: (type: InterviewType, difficulty: DifficultyLevel, count: number) => void;
  onBack: () => void;
}

export const InterviewSetupView: React.FC<InterviewSetupViewProps> = ({
  resumeData,
  onLaunchInterview,
  onBack,
}) => {
  const [selectedType, setSelectedType] = useState<InterviewType>("Mixed Interview");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("Mixed Difficulty");
  const [questionCount, setQuestionCount] = useState<number>(8);

  const interviewTypes: {
    type: InterviewType;
    title: string;
    description: string;
    icon: any;
    badge?: string;
  }[] = [
    {
      type: "Mixed Interview",
      title: "Mixed Comprehensive Interview",
      description: "Blends resume projects, technical coding concepts, HR questions, and domain theory.",
      icon: Sparkles,
      badge: "Recommended",
    },
    {
      type: "Project Interview",
      title: "Project Deep-Dive Interview",
      description: "Scrutinizes architectures, algorithms, challenges, and metrics from your resume projects.",
      icon: Layers,
    },
    {
      type: "Technical Interview",
      title: "Technical Knowledge & System Design",
      description: "Covers data structures, framework internals, tradeoffs, and engineering architecture.",
      icon: Code2,
    },
    {
      type: "Data Science Interview",
      title: "Data Science & Machine Learning",
      description: "Probes model selection (Random Forest, XGBoost), evaluation metrics, PCA, and ML pipelines.",
      icon: Bot,
    },
    {
      type: "Python Interview",
      title: "Python Engineering & Optimizations",
      description: "Tests Python internals, Pandas memory management, vectorized operations, and libraries.",
      icon: Code2,
    },
    {
      type: "SQL Interview",
      title: "SQL & Relational Databases",
      description: "Evaluates SQL queries, Window Functions, indexing, partitioning, and schema design.",
      icon: Database,
    },
    {
      type: "HR Interview",
      title: "HR, Cultural & Behavioral",
      description: "Assesses communication, leadership, conflict resolution, strengths, and career trajectory.",
      icon: Briefcase,
    },
  ];

  const difficultyOptions: {
    diff: DifficultyLevel;
    label: string;
    desc: string;
    color: string;
  }[] = [
    {
      diff: "Mixed Difficulty",
      label: "🔀 Mixed Difficulty",
      desc: "Progresses from easy warmup questions to challenging technical dilemmas.",
      color: "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30",
    },
    {
      diff: "Easy",
      label: "🟢 Easy",
      desc: "Foundational definitions, overview questions, and high-level summaries.",
      color: "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30",
    },
    {
      diff: "Medium",
      label: "🟡 Medium",
      desc: "Detailed project tradeoffs, implementation nuances, and metric formulas.",
      color: "border-amber-500 bg-amber-50/50 dark:bg-amber-950/30",
    },
    {
      diff: "Hard",
      label: "🔴 Hard",
      desc: "Edge-case scaling, production bottlenecks, failure recovery, and deep algorithmic defense.",
      color: "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI Mock Simulation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#f0f6fc] tracking-tight">
          Configure Your Mock Interview
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#8b949e] max-w-xl mx-auto">
          Tailor the session to match your upcoming company interview format. Questions will be generated dynamically from {resumeData.candidateName}'s resume.
        </p>
      </div>

      {/* Step 1: Select Interview Type */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc] flex items-center gap-2">
            <span className="w-5 h-5 rounded-md font-mono bg-indigo-600 text-white text-xs flex items-center justify-center">
              1
            </span>
            <span>Select Interview Track</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {interviewTypes.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedType === item.type;

            return (
              <div
                key={item.type}
                onClick={() => setSelectedType(item.type)}
                className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between backdrop-blur-md ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-950/40 shadow-md ring-1 ring-indigo-500/30"
                    : "border-slate-200 dark:border-[#30363d] bg-white/80 dark:bg-[#161b22]/90 hover:border-indigo-400/50 dark:hover:border-indigo-500/50"
                }`}
              >
                {item.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
                    {item.badge}
                  </span>
                )}

                <div className="space-y-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-[#0d1117] text-slate-700 dark:text-[#f0f6fc] border border-transparent dark:border-[#30363d]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-[#f0f6fc]">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#8b949e] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between text-[11px] font-semibold">
                  <span
                    className={
                      isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-[#8b949e]"
                    }
                  >
                    {isSelected ? "Selected Track" : "Select Track"}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Difficulty */}
      <div className="space-y-3.5">
        <label className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc] flex items-center gap-2">
          <span className="w-5 h-5 rounded-md font-mono bg-indigo-600 text-white text-xs flex items-center justify-center">
            2
          </span>
          <span>Select Question Difficulty</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {difficultyOptions.map((opt) => {
            const isSelected = selectedDifficulty === opt.diff;

            return (
              <div
                key={opt.diff}
                onClick={() => setSelectedDifficulty(opt.diff)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all backdrop-blur-md ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30 shadow-sm"
                    : "border-slate-200 dark:border-[#30363d] bg-white/80 dark:bg-[#161b22]/90 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-[#f0f6fc]">
                    {opt.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8b949e] leading-snug">
                    {opt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Question Count */}
      <div className="space-y-3.5">
        <label className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc] flex items-center gap-2">
          <span className="w-5 h-5 rounded-md font-mono bg-indigo-600 text-white text-xs flex items-center justify-center">
            3
          </span>
          <span>Number of Questions</span>
        </label>

        <div className="grid grid-cols-4 gap-3 max-w-lg">
          {[5, 8, 10, 15].map((cnt) => (
            <button
              key={cnt}
              onClick={() => setQuestionCount(cnt)}
              className={`py-3 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-0.5 ${
                questionCount === cnt
                  ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30"
                  : "bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#8b949e] hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <span className="text-base font-mono">{cnt}</span>
              <span className="text-[10px] font-normal opacity-80">Questions</span>
            </button>
          ))}
        </div>
      </div>

      {/* Launch Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#21262d]">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8b949e] hover:bg-slate-100 dark:hover:bg-[#21262d] transition"
        >
          ← Back to Dashboard
        </button>

        <button
          id="btn-launch-interview"
          onClick={() => onLaunchInterview(selectedType, selectedDifficulty, questionCount)}
          className="px-7 py-3.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_2px_20px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2.5"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Launch AI Interview Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
