import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Keyboard,
  FastForward,
  Send,
  Sparkles,
  Bot,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  Award,
} from "lucide-react";
import {
  QuestionItem,
  AnswerEvaluation,
  InterviewRecord,
  InterviewType,
  DifficultyLevel,
} from "../types";
import { apiEvaluateAnswer } from "../services/api";

interface ActiveInterviewViewProps {
  questions: QuestionItem[];
  interviewType: InterviewType;
  difficulty: DifficultyLevel;
  onFinishInterview: (history: InterviewRecord[]) => void;
  onExit: () => void;
}

export const ActiveInterviewView: React.FC<ActiveInterviewViewProps> = ({
  questions,
  interviewType,
  difficulty,
  onFinishInterview,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputMode, setInputMode] = useState<"type" | "voice">("type");
  const [answerText, setAnswerText] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState<string>("");
  const [isAnsweringFollowUp, setIsAnsweringFollowUp] = useState<boolean>(false);
  const [history, setHistory] = useState<InterviewRecord[]>([]);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const currentQuestion = questions[currentIndex] || questions[0];

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !currentEvaluation) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentEvaluation]);

  // Voice speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => {
          // If we had existing text, append smartly
          const cleanPrev = prev.trim();
          if (!cleanPrev) return currentTranscript;
          // Avoid duplicate continuous appends
          return `${cleanPrev} ${currentTranscript}`;
        });
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  const handleSpeakQuestion = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    try {
      const evalResult = await apiEvaluateAnswer(
        currentQuestion.question,
        currentQuestion.resumeSource,
        answerText,
        currentQuestion.suggestedAnswer
      );

      setCurrentEvaluation(evalResult);
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSkip = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const record: InterviewRecord = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      resumeSource: currentQuestion.resumeSource,
      category: currentQuestion.category,
      difficulty: currentQuestion.difficulty,
      suggestedAnswer: currentQuestion.suggestedAnswer,
      userAnswer: "[Skipped]",
      timeSpentSeconds: timerSeconds,
      isSkipped: true,
    };

    const newHistory = [...history, record];
    setHistory(newHistory);

    if (currentIndex < questions.length - 1) {
      goToNextQuestion(newHistory);
    } else {
      onFinishInterview(newHistory);
    }
  };

  const handleNextQuestion = () => {
    const record: InterviewRecord = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      resumeSource: currentQuestion.resumeSource,
      category: currentQuestion.category,
      difficulty: currentQuestion.difficulty,
      suggestedAnswer: currentQuestion.suggestedAnswer,
      userAnswer: answerText,
      evaluation: currentEvaluation || undefined,
      followUpAnswer: followUpAnswer || undefined,
      timeSpentSeconds: timerSeconds,
      isSkipped: false,
    };

    const newHistory = [...history, record];
    setHistory(newHistory);

    if (currentIndex < questions.length - 1) {
      goToNextQuestion(newHistory);
    } else {
      onFinishInterview(newHistory);
    }
  };

  const goToNextQuestion = (currentHistory: InterviewRecord[]) => {
    setCurrentIndex((prev) => prev + 1);
    setAnswerText("");
    setCurrentEvaluation(null);
    setFollowUpAnswer("");
    setIsAnsweringFollowUp(false);
    setTimerSeconds(0);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Top Header & Progress */}
      <div className="bg-white/80 dark:bg-[#161b22]/90 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#30363d] shadow-sm backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-[#f0f6fc]">
              Live Mock Interview • {interviewType}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0d1117] border border-transparent dark:border-[#30363d] text-xs font-mono font-semibold text-slate-700 dark:text-[#f0f6fc]">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>

            {/* Exit Session */}
            <button
              onClick={onExit}
              className="text-xs font-medium text-slate-500 dark:text-[#8b949e] hover:text-rose-600 dark:hover:text-rose-400 transition"
            >
              Exit Session
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-semibold text-slate-600 dark:text-[#8b949e]">
            <span>
              QUESTION {String(currentIndex + 1).padStart(2, "0")}/
              {String(questions.length).padStart(2, "0")}
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#0d1117] border border-transparent dark:border-[#30363d] overflow-hidden">
            <div
              className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Display Card */}
      <div className="bg-white/80 dark:bg-[#161b22]/90 rounded-3xl border border-slate-200 dark:border-[#30363d] shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden backdrop-blur-md">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Resume Source Banner & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-mono font-semibold text-indigo-700 dark:text-indigo-300">
            <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{currentQuestion.resumeSource}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#0d1117] text-slate-700 dark:text-[#f0f6fc] border border-transparent dark:border-[#30363d]">
              {currentQuestion.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-indigo-100/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              {currentQuestion.difficulty}
            </span>

            {/* Audio Voice read out */}
            <button
              onClick={handleSpeakQuestion}
              className={`p-2 rounded-xl border transition ${
                isSpeaking
                  ? "bg-indigo-600 text-white border-indigo-600 animate-pulse"
                  : "bg-slate-100 dark:bg-[#0d1117] text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-[#30363d]"
              }`}
              title={isSpeaking ? "Stop Voice" : "Listen to Interviewer Question"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-[#8b949e] uppercase tracking-wider">
            Interviewer Asks:
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#f0f6fc] leading-relaxed">
            "{currentQuestion.question}"
          </h2>
        </div>

        {/* Answering Area (If not evaluated yet) */}
        {!currentEvaluation && (
          <div className="space-y-4 pt-2">
            {/* Input Mode Selector & Recording controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-[#30363d]">
                <button
                  id="btn-mode-type"
                  onClick={() => setInputMode("type")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    inputMode === "type"
                      ? "bg-white dark:bg-[#161b22] text-indigo-600 dark:text-indigo-400 shadow-xs border border-transparent dark:border-[#30363d]"
                      : "text-slate-600 dark:text-[#8b949e]"
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  Type Answer
                </button>

                <button
                  id="btn-mode-voice"
                  onClick={() => setInputMode("voice")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    inputMode === "voice"
                      ? "bg-white dark:bg-[#161b22] text-indigo-600 dark:text-indigo-400 shadow-xs border border-transparent dark:border-[#30363d]"
                      : "text-slate-600 dark:text-[#8b949e]"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  Answer by Voice
                </button>
              </div>

              {inputMode === "voice" && voiceSupported && (
                <button
                  id="btn-toggle-mic"
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    isRecording
                      ? "bg-rose-600 text-white animate-pulse"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? "Stop Recording" : "Start Speaking"}</span>
                </button>
              )}
            </div>

            {/* Voice wave indicator if recording */}
            {isRecording && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span className="font-semibold">Microphone active — speaking to AI...</span>
                </div>
                <span className="text-[11px] opacity-80 font-mono">Speak clearly into your microphone</span>
              </div>
            )}

            {/* Textarea Input */}
            <div className="relative">
              <textarea
                id="interview-answer-textarea"
                rows={6}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder={
                  inputMode === "voice"
                    ? "Click 'Start Speaking' or type your answer here. Transcribed speech appears automatically..."
                    : "Formulate your response here. Mention key methodologies, metrics, tradeoffs, and impact..."
                }
                className="w-full rounded-2xl p-4 text-sm bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] text-slate-900 dark:text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y placeholder:text-slate-400 dark:placeholder:text-[#8b949e]"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8b949e] font-mono pt-1 px-1">
                <span>
                  {answerText.trim() ? `${answerText.trim().split(/\s+/).length} words` : "0 words"}
                </span>
                <span>Press Submit when finished speaking or typing</span>
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                id="btn-skip-question"
                onClick={handleSkip}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8b949e] hover:bg-slate-100 dark:hover:bg-[#0d1117] border border-transparent dark:border-[#30363d] transition flex items-center gap-1.5"
              >
                <FastForward className="w-4 h-4" />
                <span>Skip Question</span>
              </button>

              <button
                id="btn-submit-answer"
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim() || isEvaluating}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_2px_15px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI is Evaluating Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* AI Evaluation Card Result (After Submission) */}
        {currentEvaluation && (
          <div className="space-y-6 pt-2 animate-fade-in">
            {/* Score & Quick Take Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#1e1b4b] border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                    AI Answer Evaluation
                  </span>
                </div>
                {currentEvaluation.quickTake && (
                  <p className="text-sm font-semibold text-[#f0f6fc]">
                    "{currentEvaluation.quickTake}"
                  </p>
                )}
              </div>

              {/* Score Badge */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto bg-[#161b22] px-4 py-2 rounded-xl border border-[#30363d] shadow-sm">
                <Award className="w-5 h-5 text-indigo-400" />
                <div>
                  <span className="text-xl font-mono font-black text-white">
                    {currentEvaluation.score}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/10</span>
                </div>
              </div>
            </div>

            {/* What Was Good & What Was Missing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What Was Good */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  What was good
                </span>
                <ul className="space-y-1.5">
                  {currentEvaluation.whatWasGood?.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Was Missing */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  What was missing / could improve
                </span>
                <ul className="space-y-1.5">
                  {currentEvaluation.whatWasMissing?.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs text-amber-900 dark:text-amber-300 flex items-start gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Better Answer Suggestion */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-[#30363d] space-y-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Better Answer Suggestion (Expert Formulation)
              </span>
              <p className="text-xs text-slate-700 dark:text-[#8b949e] leading-relaxed font-sans">
                {currentEvaluation.betterAnswerSuggestion}
              </p>
            </div>

            {/* Dynamic AI Follow-up Question */}
            {currentEvaluation.followUpQuestion && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-[#30363d] space-y-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wide text-indigo-900 dark:text-indigo-300">
                    Interviewer Follow-up Question
                  </span>
                </div>
                <p className="text-sm font-bold text-indigo-950 dark:text-[#f0f6fc]">
                  "{currentEvaluation.followUpQuestion}"
                </p>

                {isAnsweringFollowUp ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={3}
                      value={followUpAnswer}
                      onChange={(e) => setFollowUpAnswer(e.target.value)}
                      placeholder="Type your quick response to the follow-up question..."
                      className="w-full rounded-xl p-3 text-xs bg-white dark:bg-[#0d1117] border border-indigo-200 dark:border-[#30363d] text-slate-900 dark:text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAnsweringFollowUp(true)}
                    className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 underline underline-offset-4 hover:text-indigo-900 dark:hover:text-indigo-300"
                  >
                    + Answer this Follow-Up Question
                  </button>
                )}
              </div>
            )}

            {/* Next Question / Finish Action */}
            <div className="flex items-center justify-end pt-2">
              <button
                id="btn-next-question"
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_2px_15px_rgba(99,102,241,0.4)] active:scale-95 transition flex items-center gap-2"
              >
                <span>
                  {currentIndex < questions.length - 1
                    ? "Continue to Next Question"
                    : "Finish Interview & View Final Report"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
