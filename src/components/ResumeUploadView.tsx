import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  FileCode,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  ClipboardPaste,
  RefreshCw,
} from "lucide-react";
import { ResumeData } from "../types";
import { apiAnalyzeResume } from "../services/api";
import { DEMO_RESUME_TEXT, DEMO_PARSED_RESUME } from "../data/demoResume";

interface ResumeUploadViewProps {
  onAnalysisComplete: (data: ResumeData) => void;
  onCancel?: () => void;
}

export const ResumeUploadView: React.FC<ResumeUploadViewProps> = ({
  onAnalysisComplete,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [pastedText, setPastedText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingSteps = [
    "Reading resume document format & extracting text...",
    "Parsing technical skills, frameworks & programming languages...",
    "Deep-analyzing project architectures, metrics & work experience...",
    "Synthesizing candidate strength metrics (0-100)...",
    "Generating dynamic, resume-grounded interview questions...",
  ];

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = [".pdf", ".docx", ".doc", ".txt"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExt) && !file.type.includes("text") && !file.type.includes("pdf")) {
      setErrorMessage("Please upload a supported format: PDF, DOCX, or TXT.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage("File is too large (max 20MB). Please select a smaller file.");
      return;
    }

    setSelectedFile(file);
  };

  const startAnalysis = async (customText?: string, isDemo = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep(0);

    // Dynamic step animation
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      if (isDemo) {
        // Use demo directly
        const result = await apiAnalyzeResume({ resumeText: DEMO_RESUME_TEXT });
        clearInterval(stepInterval);
        onAnalysisComplete(result || DEMO_PARSED_RESUME);
        return;
      }

      let payload: any = {};

      if (activeTab === "paste" || customText) {
        const textToAnalyze = customText || pastedText.trim();
        if (!textToAnalyze) {
          throw new Error("Please paste your resume text before analyzing.");
        }
        payload = { resumeText: textToAnalyze };
      } else if (selectedFile) {
        // Read file
        if (selectedFile.type === "text/plain" || selectedFile.name.endsWith(".txt")) {
          const text = await selectedFile.text();
          if (!text.trim()) throw new Error("The uploaded text file is empty.");
          payload = { resumeText: text, fileName: selectedFile.name };
        } else {
          // Base64 file for PDF or docs
          const base64Data = await readFileAsBase64(selectedFile);
          payload = {
            fileData: base64Data,
            mimeType: selectedFile.type || "application/pdf",
            fileName: selectedFile.name,
          };
        }
      } else {
        throw new Error("Please select a file or paste your resume text.");
      }

      const parsedData = await apiAnalyzeResume(payload);
      clearInterval(stepInterval);
      onAnalysisComplete(parsedData);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsLoading(false);
      setErrorMessage(err.message || "Failed to analyze resume. Please try again or use the demo resume.");
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // remove data:*/*;base64, prefix
        const base64 = result.includes(",") ? result.split(",")[1] : result;
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white/80 dark:bg-[#161b22]/90 rounded-3xl border border-slate-200 dark:border-[#30363d] shadow-xl backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent border-b border-slate-200 dark:border-[#30363d] text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Upload className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#f0f6fc] tracking-tight">
            Upload your resume
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#8b949e] max-w-lg mx-auto">
            PDF, DOCX or TXT — We'll analyze your skills, projects, education and experience.
          </p>

          {/* Quick Demo Resume Button */}
          <div className="pt-2">
            <button
              id="upload-btn-demo-quick"
              onClick={() => startAnalysis(undefined, true)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or click here to load Sample Data Science Resume</span>
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading ? (
          <div className="p-10 sm:p-14 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-[#21262d]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#f0f6fc]">
                AI is analyzing your resume…
              </h3>
              <p className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 animate-fade-in">
                {loadingSteps[loadingStep]}
              </p>
            </div>

            {/* Step Progress Indicators */}
            <div className="max-w-md mx-auto space-y-2 text-left pt-4">
              {loadingSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                    idx <= loadingStep
                      ? "text-slate-800 dark:text-[#f0f6fc] font-medium"
                      : "text-slate-400 dark:text-[#8b949e]"
                  }`}
                >
                  {idx < loadingStep ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : idx === loadingStep ? (
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-[#30363d] shrink-0" />
                  )}
                  <span className="truncate">{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-[#0d1117] rounded-xl max-w-sm mx-auto border border-slate-200 dark:border-[#30363d]">
              <button
                id="upload-tab-file"
                onClick={() => setActiveTab("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === "upload"
                    ? "bg-white dark:bg-[#161b22] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-[#30363d]"
                    : "text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File
              </button>
              <button
                id="upload-tab-paste"
                onClick={() => setActiveTab("paste")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === "paste"
                    ? "bg-white dark:bg-[#161b22] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-[#30363d]"
                    : "text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc]"
                }`}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Paste Text
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400">
                    You can also try pasting raw text or clicking "Try Demo" to explore with sample data.
                  </p>
                </div>
              </div>
            )}

            {/* Upload Area Mode */}
            {activeTab === "upload" ? (
              <div
                id="resume-dropzone"
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[0.99]"
                    : selectedFile
                    ? "border-emerald-500/80 bg-emerald-50/30 dark:bg-emerald-950/20"
                    : "border-slate-300 dark:border-[#30363d] bg-slate-50/50 dark:bg-[#0d1117]/60 hover:border-indigo-500/70 hover:bg-slate-50 dark:hover:bg-[#161b22]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-[#21262d] border border-indigo-200/60 dark:border-[#30363d] flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                    {selectedFile ? (
                      <CheckCircle className="w-7 h-7 text-emerald-500" />
                    ) : (
                      <FileText className="w-7 h-7" />
                    )}
                  </div>

                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-[#f0f6fc]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-[#8b949e] font-mono">
                        {(selectedFile.size / 1024).toFixed(1)} KB — Ready for analysis
                      </p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium pt-1">
                        Click to choose a different file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-[#f0f6fc]">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">Click to browse</span> or drag & drop file here
                      </p>
                      <p className="text-xs text-slate-500 dark:text-[#8b949e]">
                        Supported formats: PDF, DOCX, TXT (up to 20MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Paste Text Mode */
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8b949e]">
                  Paste resume text content
                </label>
                <textarea
                  id="resume-paste-textarea"
                  rows={10}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your full resume text here including your skills, projects, experience, and education..."
                  className="w-full rounded-2xl p-4 text-xs font-mono bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] text-slate-800 dark:text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                />
                <p className="text-[11px] text-slate-500 dark:text-[#8b949e] text-right font-mono">
                  {pastedText.length > 0 ? `${pastedText.split(/\s+/).filter(Boolean).length} words` : "0 words"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                id="upload-btn-use-demo"
                onClick={() => startAnalysis(undefined, true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#21262d] transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Load Sample Data Science Resume
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-[#8b949e] hover:bg-slate-100 dark:hover:bg-[#21262d] transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  id="upload-btn-submit-analyze"
                  onClick={() => startAnalysis()}
                  disabled={activeTab === "upload" ? !selectedFile : !pastedText.trim()}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_4px_14px_rgba(99,102,241,0.35)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>Analyze Resume</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
