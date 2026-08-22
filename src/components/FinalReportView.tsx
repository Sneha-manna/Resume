import React, { useEffect, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Download,
  HelpCircle,
  PlayCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  FileText,
  Share2,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FinalReportData, InterviewRecord, ResumeData } from "../types";

interface FinalReportViewProps {
  reportData: FinalReportData;
  history: InterviewRecord[];
  resumeData: ResumeData;
  interviewType: string;
  onRetake: () => void;
  onGoToBank: () => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({
  reportData,
  history,
  resumeData,
  interviewType,
  onRetake,
  onGoToBank,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if in restricted environment
    }
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400 bg-emerald-500";
    if (score >= 65) return "text-indigo-600 dark:text-indigo-400 bg-indigo-500";
    return "text-amber-600 dark:text-amber-400 bg-amber-500";
  };

  const handleShareOrCopy = () => {
    const summary = `🎯 InterviewIQ Performance Report
Candidate: ${resumeData.candidateName}
Track: ${interviewType}
Overall Score: ${reportData.overallScore}/100 (${reportData.readinessLevel})

Dimensional Scores:
- Technical Knowledge: ${reportData.scores.technicalKnowledge}%
- Project Understanding: ${reportData.scores.projectUnderstanding}%
- Communication: ${reportData.scores.communication}%
- Problem Solving: ${reportData.scores.problemSolving}%
- Confidence: ${reportData.scores.confidence}%
- Resume Knowledge: ${reportData.scores.resumeKnowledge}%

AI Feedback: ${reportData.aiFeedback.summary}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dimensions = [
    { label: "Technical Knowledge", val: reportData.scores.technicalKnowledge },
    { label: "Project Understanding", val: reportData.scores.projectUnderstanding },
    { label: "Communication & Articulation", val: reportData.scores.communication },
    { label: "Problem Solving & Logic", val: reportData.scores.problemSolving },
    { label: "Confidence & Delivery", val: reportData.scores.confidence },
    { label: "Resume Knowledge & Grounding", val: reportData.scores.resumeKnowledge },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Top Banner with Overall Score */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#1e1b4b] p-6 sm:p-10 text-white shadow-2xl border border-[#30363d] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 backdrop-blur-md border border-indigo-500/30 text-xs font-mono font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interview Session Completed</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Candidate Performance Evaluation
            </h1>

            <p className="text-sm sm:text-base text-slate-300">
              Candidate: <span className="text-white font-bold">{resumeData.candidateName}</span> • Track:{" "}
              <span className="text-indigo-300 font-semibold">{interviewType}</span>
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs font-bold text-white">
              <span className="text-slate-400 font-mono">Readiness Level:</span>
              <span className="text-indigo-300 font-mono">{reportData.readinessLevel}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onRetake}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake Interview
              </button>

              <button
                onClick={handleShareOrCopy}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied Summary!" : "Copy Report Summary"}</span>
              </button>
            </div>
          </div>

          {/* Big Score Ring */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center">
            <div className="bg-[#0d1117]/80 backdrop-blur-md p-6 rounded-3xl border border-indigo-500/30 text-center flex flex-col items-center gap-2 shadow-inner">
              <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">
                {reportData.overallScore}
                <span className="text-lg font-normal text-slate-400">/100</span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Overall Score
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Based on {history.length} evaluated questions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dimensional Performance Breakdown Cards */}
      <div className="bg-white/80 dark:bg-[#161b22]/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-[#0d1117] flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-transparent dark:border-[#30363d]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#f0f6fc]">
              Dimensional Score Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8b949e]">
              Evaluation across key engineering and interview criteria.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map((dim, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-[#30363d] space-y-2"
            >
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-800 dark:text-[#f0f6fc]">{dim.label}</span>
                <span className={`${getScoreColor(dim.val).split(" ")[0]} font-mono`}>{dim.val}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-[#161b22] border border-transparent dark:border-[#30363d] overflow-hidden">
                <div
                  className={`h-full ${getScoreColor(dim.val).split(" ")[1]} transition-all duration-700`}
                  style={{ width: `${dim.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions You Need To Prepare Section */}
      <div className="bg-white/80 dark:bg-[#161b22]/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-[#0d1117] flex items-center justify-center text-rose-600 dark:text-rose-400 border border-transparent dark:border-[#30363d]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#f0f6fc]">
              Questions You Need To Prepare
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8b949e]">
              Focus areas where scores were lower or where deeper technical details were missing.
            </p>
          </div>
        </div>

        <div className="space-y-3.5 pt-1">
          {reportData.weakQuestions.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-rose-50/40 dark:bg-[#0d1117] border border-rose-200/60 dark:border-rose-900/40 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-[#f0f6fc]">
                  {item.question}
                </h3>
                {item.scoreReceived > 0 && (
                  <span className="text-[11px] font-mono font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-md self-start sm:self-auto shrink-0 border border-rose-200/50 dark:border-rose-800/50">
                    Score: {item.scoreReceived}/10
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-[#8b949e] uppercase tracking-wider">
                    Key Missing Element:
                  </span>
                  <p className="text-slate-700 dark:text-[#8b949e]">{item.keyIssue}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Recommended Model Answer:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{item.howToImprove}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Topics Section */}
      <div className="bg-white/80 dark:bg-[#161b22]/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-[#0d1117] flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-transparent dark:border-[#30363d]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#f0f6fc]">
              Recommended Topics To Revise
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8b949e]">
              Core tools and concepts to review before your real-world interviews.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {reportData.recommendedTopics?.map((topic, i) => (
            <span
              key={i}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs"
            >
              📚 {topic}
            </span>
          ))}
        </div>
      </div>

      {/* AI Feedback & Growth Roadmap */}
      <div className="bg-white/80 dark:bg-[#161b22]/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#0d1117] flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-transparent dark:border-[#30363d]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#f0f6fc]">
              Personalized AI Feedback & Roadmap
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8b949e]">
              Expert advice synthesized from your answers and resume background.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-[#30363d] text-xs sm:text-sm text-slate-700 dark:text-[#8b949e] leading-relaxed">
          {reportData.aiFeedback?.summary}
        </div>

        {/* Strengths & Gaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Key Strengths Demonstrated
            </span>
            <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-300">
              {reportData.aiFeedback?.topStrengths?.map((str, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Critical Growth Opportunities
            </span>
            <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-300">
              {reportData.aiFeedback?.criticalGaps?.map((gap, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3-Step Action Plan */}
        <div className="space-y-2.5 pt-2">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
            3-Step Next Actions Action Plan:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {reportData.aiFeedback?.nextStepsActionPlan?.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-[#0d1117] border border-indigo-200/60 dark:border-[#30363d] space-y-1.5"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-[#30363d]">
          <button
            onClick={onGoToBank}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#8b949e] hover:bg-slate-100 dark:hover:bg-[#0d1117] border border-transparent dark:border-[#30363d] transition flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Review All Questions in Question Bank
          </button>

          <button
            onClick={onRetake}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_2px_15px_rgba(99,102,241,0.4)] active:scale-95 transition flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Start New Mock Session
          </button>
        </div>
      </div>
    </div>
  );
};
