import React, { useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Code2,
  GraduationCap,
  HelpCircle,
  Layers,
  Lightbulb,
  PlayCircle,
  Sparkles,
  Target,
  Wrench,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { ResumeData } from "../types";

interface ResumeDashboardProps {
  resumeData: ResumeData;
  onStartInterview: () => void;
  onViewQuestionBank: () => void;
  onReupload: () => void;
}

export const ResumeDashboard: React.FC<ResumeDashboardProps> = ({
  resumeData,
  onStartInterview,
  onViewQuestionBank,
  onReupload,
}) => {
  const [activeProjectTab, setActiveProjectTab] = useState(0);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 dark:text-emerald-400 stroke-emerald-500";
    if (score >= 70) return "text-indigo-600 dark:text-indigo-400 stroke-indigo-500";
    return "text-amber-600 dark:text-amber-400 stroke-amber-500";
  };

  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (resumeData.overallScore / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner & Score Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#1e1b4b] p-6 sm:p-8 text-white border border-[#30363d] shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Candidate Info */}
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 backdrop-blur-md border border-indigo-500/30 text-xs font-semibold text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Resume Analysis Complete</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f0f6fc]">
              {resumeData.candidateName}
            </h1>

            <p className="text-base sm:text-lg font-medium text-indigo-300">
              Target Role: <span className="text-white font-semibold">{resumeData.targetRole}</span>
            </p>

            {resumeData.summary && (
              <p className="text-xs sm:text-sm text-[#8b949e] max-w-2xl leading-relaxed">
                {resumeData.summary}
              </p>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                id="dash-btn-start-interview"
                onClick={onStartInterview}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_2px_15px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4 text-white" />
                Start AI Mock Interview
              </button>

              <button
                id="dash-btn-view-questions"
                onClick={onViewQuestionBank}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#f0f6fc] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] backdrop-blur-md transition flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                View Question Bank ({resumeData.generatedQuestions?.length || 8})
              </button>

              <button
                onClick={onReupload}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4 ml-2 transition"
              >
                Upload Different Resume
              </button>
            </div>
          </div>

          {/* Overall Score Dial */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <div className="bg-[#161b22]/90 backdrop-blur-md p-5 rounded-2xl border border-[#30363d] text-center flex flex-col items-center gap-3 shadow-inner">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="stroke-[#21262d] fill-none"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="stroke-indigo-500 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white font-mono">
                    {resumeData.overallScore}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                    Score
                  </span>
                </div>
              </div>

              <div className="text-xs font-bold text-[#f0f6fc]">
                Resume Score: {resumeData.overallScore}/100
              </div>

              {/* Subscores mini grid */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8b949e] w-full pt-1 border-t border-[#30363d]">
                <div className="flex justify-between">
                  <span>Depth:</span>
                  <span className="font-bold font-mono text-white">{resumeData.scoreBreakdown?.technicalDepth || 85}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Impact:</span>
                  <span className="font-bold font-mono text-white">{resumeData.scoreBreakdown?.projectImpact || 85}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Completeness:</span>
                  <span className="font-bold font-mono text-white">{resumeData.scoreBreakdown?.completeness || 90}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Clarity:</span>
                  <span className="font-bold font-mono text-white">{resumeData.scoreBreakdown?.formattingClarity || 88}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Skills, Projects, Work Experience */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Technical Skills Card */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-[#21262d] border border-blue-200/60 dark:border-[#30363d] flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-[#f0f6fc]">
                  Technical Skills & Technologies
                </h2>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-[#8b949e]">
                EXTRACTED BY AI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Programming Languages */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-[#30363d] space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-[#f0f6fc] flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                  Programming Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills?.programmingLanguages?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white dark:bg-[#161b22] text-slate-800 dark:text-[#f0f6fc] border border-slate-200 dark:border-[#30363d] shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Frameworks & Libraries */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-[#30363d] space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-[#f0f6fc] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  Frameworks & Machine Learning
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills?.frameworks?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white dark:bg-[#161b22] text-slate-800 dark:text-[#f0f6fc] border border-slate-200 dark:border-[#30363d] shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Databases */}
              {resumeData.skills?.databases && resumeData.skills.databases.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-[#30363d] space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-[#f0f6fc] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-cyan-500" />
                    Databases & Cloud
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.databases.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white dark:bg-[#161b22] text-slate-800 dark:text-[#f0f6fc] border border-slate-200 dark:border-[#30363d] shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools & Platforms */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-[#30363d] space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-[#f0f6fc] flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-500" />
                  Tools & Platforms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills?.toolsAndPlatforms?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white dark:bg-[#161b22] text-slate-800 dark:text-[#f0f6fc] border border-slate-200 dark:border-[#30363d] shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Projects Card */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-[#21262d] border border-indigo-200/60 dark:border-[#30363d] flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-[#f0f6fc]">
                  Identified Projects & AI Interview Angles
                </h2>
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                {resumeData.projects?.length || 0} PROJECTS ANALYZED
              </span>
            </div>

            {/* Project Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {resumeData.projects?.map((proj, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveProjectTab(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    activeProjectTab === idx
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-[#0d1117] text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc] border border-transparent dark:border-[#30363d]"
                  }`}
                >
                  {proj.title}
                </button>
              ))}
            </div>

            {/* Selected Project Details */}
            {resumeData.projects && resumeData.projects[activeProjectTab] && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-[#30363d] space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc]">
                    {resumeData.projects[activeProjectTab].title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.projects[activeProjectTab].technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-[#8b949e] leading-relaxed">
                  {resumeData.projects[activeProjectTab].description}
                </p>

                {resumeData.projects[activeProjectTab].keyImpact && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Key Impact:</strong>{" "}
                      {resumeData.projects[activeProjectTab].keyImpact}
                    </span>
                  </div>
                )}

                {/* Suggested Questions for this Project */}
                {resumeData.projects[activeProjectTab].suggestedQuestions && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-[#21262d]">
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">
                      Expected Technical Interview Questions:
                    </span>
                    <ul className="space-y-1.5">
                      {resumeData.projects[activeProjectTab].suggestedQuestions?.map((q, i) => (
                        <li
                          key={i}
                          className="text-xs text-slate-800 dark:text-[#f0f6fc] flex items-start gap-2 bg-white dark:bg-[#161b22] p-2.5 rounded-lg border border-slate-200/60 dark:border-[#30363d]"
                        >
                          <span className="text-indigo-500 font-bold font-mono shrink-0">Q{i + 1}:</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Work Experience & Internships */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-[#21262d] border border-purple-200/60 dark:border-[#30363d] flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-[#f0f6fc]">
                  Experience & Internships
                </h2>
              </div>

              <div className="space-y-4">
                {resumeData.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-[#30363d] space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc]">
                          {exp.role}
                        </h3>
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {exp.company}
                        </p>
                      </div>
                      {exp.period && (
                        <span className="text-[11px] text-slate-500 dark:text-[#8b949e] font-mono font-medium">
                          {exp.period}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-1 pt-1 text-xs text-slate-700 dark:text-[#8b949e] list-disc list-inside">
                      {exp.highlights?.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Resume Insights & Education/Certs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Resume Insights Card */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-6">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-[#21262d]">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-[#21262d] border border-amber-200/60 dark:border-[#30363d] flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc]">
                Resume Insights
              </h2>
            </div>

            {/* 1. Strong Areas */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Strong Areas
              </span>
              <ul className="space-y-2">
                {resumeData.insights?.strongAreas?.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Areas to Improve */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Areas to Improve
              </span>
              <ul className="space-y-2">
                {resumeData.insights?.areasToImprove?.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Interview Preparation Tips */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                Interview Preparation Tips
              </span>
              <ul className="space-y-2">
                {resumeData.insights?.interviewPrepTips?.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 text-xs text-indigo-950 dark:text-indigo-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Education & Certifications Card */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#161b22]/90 border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#21262d] border border-emerald-200/60 dark:border-[#30363d] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc]">
                Education & Certifications
              </h2>
            </div>

            {/* Education */}
            {resumeData.education?.map((edu, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-[#30363d] space-y-1"
              >
                <p className="text-xs font-bold text-slate-900 dark:text-[#f0f6fc]">
                  {edu.degree}
                </p>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {edu.institution} {edu.year ? `(${edu.year})` : ""}
                </p>
                {edu.details && (
                  <p className="text-[11px] text-slate-500 dark:text-[#8b949e] pt-0.5">{edu.details}</p>
                )}
              </div>
            ))}

            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#21262d]">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">
                  Certifications:
                </span>
                <ul className="space-y-1.5">
                  {resumeData.certifications.map((cert, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 dark:text-[#8b949e] flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
