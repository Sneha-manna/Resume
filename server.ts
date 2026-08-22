import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support up to 25mb for PDF/DOCX base64 uploads
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. ANALYZE RESUME ENDPOINT
  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { resumeText, fileData, mimeType, fileName } = req.body;

      if (!resumeText && !fileData) {
        return res.status(400).json({ error: "No resume text or file data provided." });
      }

      const ai = getGenAI();
      const prompt = `You are an elite Tech Recruiter and Senior Technical Interviewer.
Analyze the provided candidate resume thoroughly and extract structured details, strengths, weaknesses, and potential interview focus areas.

Identify all:
1. Candidate Personal Info (Name, inferred Target Role, Contact info if present)
2. Summary & Overview
3. Resume Strength Score (0 to 100) with subscores for:
   - completeness (0-100)
   - technicalDepth (0-100)
   - projectImpact (0-100)
   - formattingClarity (0-100)
4. Technical Skills grouped by categories (e.g., Programming Languages, Frameworks & Libraries, Databases, Cloud & DevOps, Tools & Methods)
5. Projects: For each project extract Title, Technologies Used, Description, Key Metrics/Impact, and specific technical questions that should be asked about it.
6. Work Experience & Internships: Company/Org, Role, Duration, Bullet Points, Key Achievements.
7. Education: Degree, Institution, Year, GPA/Honors if specified.
8. Certifications & Achievements.
9. Resume Insights:
   - strongAreas: array of 3-5 specific strengths
   - areasToImprove: array of 2-4 gaps or potential vulnerabilities
   - interviewPrepTips: array of 3-5 high-impact advice items for interviewing
10. Initial Question Pool: Generate 10-15 deep, personalized interview questions directly derived from specific projects, skills, or experience bullets in this resume, plus essential HR questions. For every resume question, explicitly state the 'resumeSource' (e.g. "Based on your project: Breast Cancer Prediction" or "Based on your skill: Random Forest").

Resume text or document content follows below:
${resumeText || "(Document attached as inline file)"}`;

      const contents: any[] = [];
      if (fileData && mimeType) {
        contents.push({
          inlineData: {
            mimeType: mimeType,
            data: fileData,
          },
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: contents.length === 1 ? contents[0].text : { parts: contents },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              candidateName: { type: Type.STRING },
              targetRole: { type: Type.STRING },
              summary: { type: Type.STRING },
              overallScore: { type: Type.NUMBER },
              scoreBreakdown: {
                type: Type.OBJECT,
                properties: {
                  completeness: { type: Type.NUMBER },
                  technicalDepth: { type: Type.NUMBER },
                  projectImpact: { type: Type.NUMBER },
                  formattingClarity: { type: Type.NUMBER },
                },
                required: ["completeness", "technicalDepth", "projectImpact", "formattingClarity"],
              },
              skills: {
                type: Type.OBJECT,
                properties: {
                  programmingLanguages: { type: Type.ARRAY, items: { type: Type.STRING } },
                  frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  databases: { type: Type.ARRAY, items: { type: Type.STRING } },
                  toolsAndPlatforms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  domainExpertise: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["programmingLanguages", "frameworks", "toolsAndPlatforms"],
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                    description: { type: Type.STRING },
                    keyImpact: { type: Type.STRING },
                    suggestedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["title", "technologies", "description"],
                },
              },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    period: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["company", "role", "highlights"],
                },
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    year: { type: Type.STRING },
                    details: { type: Type.STRING },
                  },
                  required: ["institution", "degree"],
                },
              },
              certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
              insights: {
                type: Type.OBJECT,
                properties: {
                  strongAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                  areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
                  interviewPrepTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["strongAreas", "areasToImprove", "interviewPrepTips"],
              },
              generatedQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    category: { type: Type.STRING }, // "HR" | "Project" | "Technical" | "Behavioral" | "System Design"
                    difficulty: { type: Type.STRING }, // "Easy" | "Medium" | "Hard"
                    resumeSource: { type: Type.STRING }, // e.g. "Based on your project: Breast Cancer Prediction"
                    suggestedAnswer: { type: Type.STRING },
                    keyEvaluationPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["id", "question", "category", "difficulty", "resumeSource", "suggestedAnswer"],
                },
              },
            },
            required: [
              "candidateName",
              "targetRole",
              "overallScore",
              "skills",
              "projects",
              "insights",
              "generatedQuestions",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("Error analyzing resume:", error);
      res.status(500).json({
        error: "Failed to analyze resume with AI.",
        details: error?.message || String(error),
      });
    }
  });

  // 2. DYNAMIC QUESTION GENERATION ENDPOINT
  app.post("/api/generate-questions", async (req, res) => {
    try {
      const { resumeSummary, interviewType, difficulty, count = 8 } = req.body;

      const ai = getGenAI();
      const prompt = `You are conducting an interview for this candidate.
Based strictly on the candidate's resume context provided below, generate ${count} customized interview questions.

Interview Type: ${interviewType || "Mixed Interview"}
Selected Difficulty: ${difficulty || "Mixed Difficulty"} (Easy, Medium, Hard, or Mixed)

CRITICAL INSTRUCTIONS:
- Every technical or project question MUST specifically reference things from their resume (e.g. project names like 'Breast Cancer Prediction', exact tools like 'Random Forest', 'Streamlit', 'SQL queries', or job experiences).
- Do NOT generate generic textbook questions if resume facts are available.
- For each question identify the exact 'resumeSource', for example: "Based on your project: Breast Cancer Prediction" or "Based on your experience at CloudMetrics".
- Provide a high-quality model answer and evaluation rubric for each question.

Candidate Resume Context:
${JSON.stringify(resumeSummary, null, 2)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    category: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                    resumeSource: { type: Type.STRING },
                    suggestedAnswer: { type: Type.STRING },
                    keyEvaluationPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["id", "question", "category", "difficulty", "resumeSource", "suggestedAnswer"],
                },
              },
            },
            required: ["questions"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, questions: parsed.questions || [] });
    } catch (error: any) {
      console.error("Error generating questions:", error);
      res.status(500).json({ error: "Failed to generate questions.", details: error?.message });
    }
  });

  // 3. REAL-TIME ANSWER EVALUATION & DYNAMIC FOLLOW-UP ENDPOINT
  app.post("/api/evaluate-answer", async (req, res) => {
    try {
      const { question, resumeSource, candidateAnswer, suggestedAnswer, previousDialog } = req.body;

      if (!question || !candidateAnswer) {
        return res.status(400).json({ error: "Question and candidate answer are required." });
      }

      const ai = getGenAI();
      const prompt = `You are a warm, sharp, and encouraging Senior Technical Interviewer evaluating a candidate's answer.

INTERVIEW QUESTION: "${question}"
CONTEXT / SOURCE: "${resumeSource || ""}"
REFERENCE MODEL ANSWER: "${suggestedAnswer || ""}"
CANDIDATE'S ANSWER: "${candidateAnswer}"
${previousDialog ? `PREVIOUS DIALOG HISTORY: ${JSON.stringify(previousDialog)}` : ""}

Evaluate the candidate's answer critically and constructively:
1. Assign an Answer Score from 1 to 10.
2. List 2-3 specific things that were GOOD about their response (accuracy, clarity, technical terminology used).
3. List 1-3 specific things that were MISSING or could be improved (e.g. lacked metrics, didn't address tradeoffs, missed preprocessing steps).
4. Provide a refined "Better Answer Suggestion" showing how a top 1% candidate would formulate the response.
5. Formulate a dynamic, realistic FOLLOW-UP QUESTION directly linked to what the candidate specifically stated in their answer!
   Example: If they said "I used Random Forest because it gives good accuracy", you ask "You mentioned accuracy. Which evaluation metric did you use (e.g. Precision, Recall, F1 or ROC-AUC), and why did that matter for your project?"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER }, // 1 to 10
              whatWasGood: { type: Type.ARRAY, items: { type: Type.STRING } },
              whatWasMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
              betterAnswerSuggestion: { type: Type.STRING },
              followUpQuestion: { type: Type.STRING },
              quickTake: { type: Type.STRING }, // 1-sentence supportive remark
            },
            required: [
              "score",
              "whatWasGood",
              "whatWasMissing",
              "betterAnswerSuggestion",
              "followUpQuestion",
              "quickTake",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, evaluation: parsed });
    } catch (error: any) {
      console.error("Error evaluating answer:", error);
      res.status(500).json({ error: "Failed to evaluate answer.", details: error?.message });
    }
  });

  // 4. FINAL INTERVIEW PERFORMANCE REPORT ENDPOINT
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { candidateName, interviewType, interviewHistory, resumeSummary } = req.body;

      const ai = getGenAI();
      const prompt = `You are the Lead Interview Panel Chair.
Synthesize the complete interview session of candidate "${candidateName || "Candidate"}" into an executive performance report.

Interview Type: ${interviewType || "Mixed Interview"}
Total Questions Practiced: ${interviewHistory?.length || 0}
Interview History & Transcripts:
${JSON.stringify(interviewHistory, null, 2)}

Candidate Resume Profile:
${JSON.stringify(resumeSummary, null, 2)}

Generate:
1. Overall Interview Score (0-100) and Readiness Level (e.g., "Ready for Final Rounds", "Strong Technical Foundation", "Needs Practice on Deep Metrics").
2. Six Core Dimensional Scores (0-100 each):
   - technicalKnowledge
   - communication
   - projectUnderstanding
   - problemSolving
   - confidence
   - resumeKnowledge
3. "Questions You Need To Prepare": Identify the specific questions where the candidate scored lowest or gave incomplete answers, explaining why and what they must review.
4. "Recommended Topics": Array of 5-8 targeted technical concepts or tools to revise (e.g. ["Precision-Recall Tradeoff", "Random Forest Hyperparameters", "SQL Window Functions", "Cross-Validation"]).
5. "AI Feedback": Comprehensive, encouraging 3-paragraph executive summary detailing key strengths, critical growth opportunities, and a concrete 3-step action plan.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER },
              readinessLevel: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  technicalKnowledge: { type: Type.NUMBER },
                  communication: { type: Type.NUMBER },
                  projectUnderstanding: { type: Type.NUMBER },
                  problemSolving: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER },
                  resumeKnowledge: { type: Type.NUMBER },
                },
                required: [
                  "technicalKnowledge",
                  "communication",
                  "projectUnderstanding",
                  "problemSolving",
                  "confidence",
                  "resumeKnowledge",
                ],
              },
              weakQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    source: { type: Type.STRING },
                    scoreReceived: { type: Type.NUMBER },
                    keyIssue: { type: Type.STRING },
                    howToImprove: { type: Type.STRING },
                  },
                  required: ["question", "scoreReceived", "keyIssue", "howToImprove"],
                },
              },
              recommendedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              aiFeedback: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  topStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  nextStepsActionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["summary", "topStrengths", "criticalGaps", "nextStepsActionPlan"],
              },
            },
            required: ["overallScore", "readinessLevel", "scores", "weakQuestions", "recommendedTopics", "aiFeedback"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, report: parsed });
    } catch (error: any) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: "Failed to generate report.", details: error?.message });
    }
  });

  // 5. GENERATE SIMILAR QUESTION ENDPOINT (For Question Bank)
  app.post("/api/generate-similar-question", async (req, res) => {
    try {
      const { baseQuestion, resumeSource, category, difficulty } = req.body;

      const ai = getGenAI();
      const prompt = `Based on the following interview question from a candidate's resume:
Question: "${baseQuestion}"
Source: "${resumeSource}"
Category: "${category}"
Difficulty: "${difficulty}"

Generate a fresh, alternate interview question probing the same or a related angle of this project/skill from the candidate's resume. Provide a model answer and key points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              resumeSource: { type: Type.STRING },
              suggestedAnswer: { type: Type.STRING },
              keyEvaluationPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["id", "question", "category", "difficulty", "resumeSource", "suggestedAnswer"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, question: parsed });
    } catch (error: any) {
      console.error("Error generating similar question:", error);
      res.status(500).json({ error: "Failed to generate similar question.", details: error?.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`InterviewIQ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
