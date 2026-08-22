import React, { useState } from "react";
import {
  HelpCircle,
  Star,
  Copy,
  Check,
  Sparkles,
  PlayCircle,
  Filter,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Tag,
  Flame,
  Layers,
  Code2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { QuestionItem, ResumeData } from "../types";
import { apiGenerateSimilarQuestion } from "../services/api";

interface QuestionBankViewProps {
  questions: QuestionItem[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
  resumeData: ResumeData;
  onPracticeQuestion: (question: QuestionItem) => void;
  onStartFullInterview: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  setQuestions,
  resumeData,
  onPracticeQuestion,
  onStartFullInterview,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingVariantId, setGeneratingVariantId] = useState<string | null>(null);

  const categories = [
    "All",
    "HR",
    "Resume-Based Project",
    "Technical / Coding",
    "Data Science & ML",
    "System & Model Design",
  ];

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const toggleFavorite = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isFavorite: !q.isFavorite } : q))
    );
  };

  const toggleExpandAnswer = (id: string) => {
    setExpandedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (q: QuestionItem) => {
    const textToCopy = `Question: ${q.question}\nSource: ${q.resumeSource}\nCategory: ${q.category} | Difficulty: ${q.difficulty}\n\nSuggested Model Answer:\n${q.suggestedAnswer}\n\nKey Evaluation Points:\n${q.keyEvaluationPoints?.map((p) => `- ${p}`).join("\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateSimilar = async (q: QuestionItem) => {
    setGeneratingVariantId(q.id);
    try {
      const variant = await apiGenerateSimilarQuestion(
        q.question,
        q.resumeSource,
        q.category,
        q.difficulty
      );
      setQuestions((prev) => [variant, ...prev]);
      // Auto expand new question
      setExpandedAnswers((prev) => ({ ...prev, [variant.id]: true }));
    } catch (err) {
      console.error("Failed to generate similar question:", err);
    } finally {
      setGeneratingVariantId(null);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory =
      selectedCategory === "All" ||
      q.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === "HR" && q.category === "HR");

    const matchesDifficulty =
      selectedDifficulty === "All" || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.resumeSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.suggestedAnswer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFav = !onlyFavorites || q.isFavorite;

    return matchesCategory && matchesDifficulty && matchesSearch && matchesFav;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
            🟢 Easy
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80">
            🟡 Medium
          </span>
        );
      case "hard":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80">
            🔴 Hard
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
            {diff}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#161b22]/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Targeted Candidate Question Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#f0f6fc] tracking-tight">
            Your Interview Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e]">
            Personalized questions derived from {resumeData.candidateName}'s resume. Review model answers, key scoring rubrics, and generate variations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="bank-btn-start-mock"
            onClick={onStartFullInterview}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_2px_15px_rgba(99,102,241,0.4)] flex items-center gap-2 active:scale-95 transition"
          >
            <PlayCircle className="w-4 h-4" />
            Launch Mock Interview
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/80 dark:bg-[#161b22]/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, project (e.g. Breast Cancer), or tool (e.g. Random Forest)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] text-slate-900 dark:text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-[#8b949e]"
            />
          </div>

          {/* Favorites Filter */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 ${
              onlyFavorites
                ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                : "bg-slate-100 dark:bg-[#0d1117] text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-[#30363d]"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-amber-500 text-amber-500" : ""}`} />
            <span>Saved ({questions.filter((q) => q.isFavorite).length})</span>
          </button>
        </div>

        {/* Categories & Difficulty Selector */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-[#21262d]">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1">
            <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-[#8b949e] uppercase tracking-wider mr-1 shrink-0">
              CATEGORY:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-[#0d1117] text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-[#30363d]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Chips */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-[#8b949e] uppercase tracking-wider mr-1">
              DIFFICULTY:
            </span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedDifficulty === diff
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs"
                    : "bg-slate-100 dark:bg-[#0d1117] text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-[#30363d]"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8b949e] font-medium px-1">
          <span className="font-mono">Showing {filteredQuestions.length} Questions</span>
          <span>Click any card to read model answer and practice</span>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white/80 dark:bg-[#161b22]/90 rounded-3xl border border-slate-200 dark:border-[#30363d] space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-[#8b949e] mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-[#f0f6fc]">
              No questions found matching your filter
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8b949e]">
              Try changing the search keywords or selecting "All" categories.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isExpanded = !!expandedAnswers[q.id];
            const isGenerating = generatingVariantId === q.id;

            return (
              <div
                key={q.id || idx}
                className="bg-white/80 dark:bg-[#161b22]/90 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-xs hover:border-indigo-400/60 dark:hover:border-indigo-500/60 transition-all duration-200 p-5 space-y-4 backdrop-blur-md"
              >
                {/* Header row with badges and actions */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {getDifficultyBadge(q.difficulty)}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#21262d] text-slate-700 dark:text-[#f0f6fc] border border-slate-200/80 dark:border-[#30363d]">
                      {q.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                      {q.resumeSource}
                    </span>
                  </div>

                  {/* Top Right Action Icons */}
                  <div className="flex items-center gap-1.5">
                    {/* Favorite */}
                    <button
                      onClick={() => toggleFavorite(q.id)}
                      className={`p-1.5 rounded-lg transition ${
                        q.isFavorite
                          ? "text-amber-500 bg-amber-50 dark:bg-amber-950"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#21262d]"
                      }`}
                      title={q.isFavorite ? "Remove from saved" : "Save question"}
                    >
                      <Star className={`w-4 h-4 ${q.isFavorite ? "fill-amber-500" : ""}`} />
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => handleCopy(q)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#21262d] transition"
                      title="Copy Question & Answer"
                    >
                      {copiedId === q.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Generate Similar Question */}
                    <button
                      onClick={() => handleGenerateSimilar(q)}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition disabled:opacity-50"
                      title="Generate similar question with AI"
                    >
                      <RefreshCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
                      <span>{isGenerating ? "Generating..." : "Similar Question"}</span>
                    </button>

                    {/* Practice Single Question */}
                    <button
                      onClick={() => onPracticeQuestion(q)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
                    >
                      <PlayCircle className="w-3 h-3" />
                      <span>Practice</span>
                    </button>
                  </div>
                </div>

                {/* Main Question Text */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#f0f6fc] leading-snug">
                  {q.question}
                </h3>

                {/* Model Suggested Answer Toggle & Content */}
                <div className="pt-1">
                  <button
                    onClick={() => toggleExpandAnswer(q.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isExpanded ? "Hide Suggested Model Answer" : "View Suggested Model Answer & Key Points"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-[#30363d] space-y-3 animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">
                          Suggested Top-1% Answer:
                        </span>
                        <p className="text-xs text-slate-700 dark:text-[#8b949e] leading-relaxed">
                          {q.suggestedAnswer}
                        </p>
                      </div>

                      {q.keyEvaluationPoints && q.keyEvaluationPoints.length > 0 && (
                        <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-[#21262d]">
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">
                            Key Evaluation Rubric:
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                            {q.keyEvaluationPoints.map((point, i) => (
                              <li
                                key={i}
                                className="text-xs text-slate-600 dark:text-[#8b949e] flex items-center gap-1.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
