import { ResumeData } from "../types";

export const DEMO_RESUME_TEXT = `
ALEX MORGAN
Email: alex.morgan.ds@example.com | Phone: +1 (555) 234-5678 | San Francisco, CA
LinkedIn: linkedin.com/in/alexmorgands | GitHub: github.com/alexm-ml

PROFESSIONAL SUMMARY
Results-driven Data Scientist & Machine Learning Practitioner with 2+ years of experience analyzing complex datasets, deploying machine learning classification models, and building interactive analytics applications. Proficient in Python, SQL, Scikit-learn, and ensemble modeling with proven ability to deliver predictive pipelines and actionable geospatial intelligence.

TECHNICAL SKILLS
• Programming Languages: Python (Proficient), SQL (PostgreSQL, MySQL), R
• Frameworks & Libraries: Scikit-learn, Pandas, NumPy, XGBoost, LightGBM, Statsmodels, Matplotlib, Seaborn
• Machine Learning: Random Forest, Gradient Boosting, Logistic Regression, PCA, Hyperparameter Tuning (Optuna, GridSearchCV), Cross-Validation
• Web & Deployment: Streamlit, Flask, Docker, Git, REST APIs
• Databases & Cloud: PostgreSQL, SQLite, AWS S3, Google BigQuery

PROJECTS

1. Breast Cancer Prediction & Diagnostic Classification System
Technologies: Python, Scikit-learn, Random Forest, Logistic Regression, Pandas, Streamlit
• Developed an automated diagnostic prediction system utilizing the Wisconsin Diagnostic Breast Cancer dataset (569 samples, 30 cellular features).
• Applied Principal Component Analysis (PCA) to reduce dimensionality while retaining 95% of feature variance; handled class imbalance using SMOTE.
• Trained and tuned Random Forest and Logistic Regression classifiers, achieving a 96.4% recall rate and 97.2% ROC-AUC score, prioritizing the reduction of false negatives in clinical diagnosis.
• Built and deployed an interactive Streamlit dashboard allowing healthcare specialists to input diagnostic parameters and receive real-time risk scores with SHAP-based feature interpretability.

2. Solar Rooftop Potential Mapping & Geospatial Analysis
Technologies: Python, OpenCV, Scikit-learn, Rasterio, GeoPandas, NumPy, Streamlit
• Architected an end-to-end solar irradiance calculation pipeline for urban rooftop aerial imagery covering 12,000+ residential and commercial parcels.
• Implemented computer vision contour detection and semantic thresholding to segment usable roof areas, filtering out rooftop obstructions like chimneys and HVAC units.
• Calculated annual solar insolation potential by combining localized NASA POWER solar meteorological irradiance data with rooftop polygon angles and tilt orientations.
• Created an intuitive interactive geospatial map providing estimated annual kilowatt-hour energy yields and estimated payback period for property owners.

WORK EXPERIENCE & INTERNSHIPS

Data Science Intern | CloudMetrics Labs, San Francisco, CA
June 2024 – December 2024
• Built automated ETL pipelines in Python and PostgreSQL to clean, deduplicate, and process 1.5M+ daily user telemetry records, reducing data pipeline latency by 35%.
• Engineered 20+ feature variables for customer churn classification; evaluated Random Forest and XGBoost algorithms using 5-fold cross-validation.
• Collaborated with product engineering teams to deploy churn score microservices on Docker containers.

EDUCATION
Bachelor of Science in Computer Science & Applied Statistics
University of California, Berkeley | 2020 – 2024
Relevant Coursework: Machine Learning, Statistical Inference, Algorithms & Data Structures, Linear Algebra, Database Systems.

CERTIFICATIONS
• AWS Certified Machine Learning – Specialty (Amazon Web Services)
• DeepLearning.AI Machine Learning Specialization (Coursera)
`;

export const DEMO_PARSED_RESUME: ResumeData = {
  candidateName: "Alex Morgan",
  targetRole: "Data Scientist / Machine Learning Engineer",
  summary:
    "Data Scientist with hands-on experience developing predictive ML models, geospatial algorithms, and full-stack interactive Streamlit applications with Python and SQL.",
  overallScore: 88,
  scoreBreakdown: {
    completeness: 92,
    technicalDepth: 88,
    projectImpact: 86,
    formattingClarity: 88,
  },
  skills: {
    programmingLanguages: ["Python", "SQL", "R"],
    frameworks: [
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "XGBoost",
      "LightGBM",
      "Statsmodels",
      "OpenCV",
    ],
    databases: ["PostgreSQL", "MySQL", "SQLite", "Google BigQuery"],
    toolsAndPlatforms: ["Streamlit", "Flask", "Docker", "Git", "AWS S3", "GeoPandas", "SHAP"],
    domainExpertise: [
      "Classification Models",
      "Random Forest",
      "Feature Engineering & PCA",
      "Geospatial Analytics",
      "Model Interpretability",
    ],
  },
  projects: [
    {
      title: "Breast Cancer Prediction & Diagnostic Classification",
      technologies: ["Python", "Scikit-learn", "Random Forest", "Logistic Regression", "Streamlit", "SHAP"],
      description:
        "Trained Random Forest and Logistic Regression classifiers on clinical dataset with PCA and SMOTE, achieving 96.4% recall and 97.2% ROC-AUC for medical diagnosis.",
      keyImpact: "96.4% Recall score prioritizing minimal false negatives with interactive SHAP explanation.",
      suggestedQuestions: [
        "Why did you choose Random Forest over simpler models for Breast Cancer Prediction?",
        "How did you handle the class imbalance and evaluate false negatives?",
        "Explain how PCA was applied and what variance threshold was preserved.",
      ],
    },
    {
      title: "Solar Rooftop Potential Mapping",
      technologies: ["Python", "OpenCV", "GeoPandas", "Scikit-learn", "Rasterio", "Streamlit"],
      description:
        "Architected an end-to-end solar irradiance calculation pipeline for aerial imagery covering 12,000+ parcels using CV contour detection and NASA irradiance data.",
      keyImpact: "Estimated annual kWh energy yield and economic payback period across 12,000+ parcels.",
      suggestedQuestions: [
        "Explain the architecture of your solar rooftop project.",
        "How did you calculate solar potential using meteorological data and roof tilt?",
        "What challenges did you face with rooftop obstruction segmentation?",
      ],
    },
  ],
  experience: [
    {
      company: "CloudMetrics Labs",
      role: "Data Science Intern",
      period: "June 2024 – December 2024",
      highlights: [
        "Built automated ETL pipelines in Python & PostgreSQL for 1.5M+ daily telemetry records, reducing latency by 35%.",
        "Engineered 20+ feature variables for customer churn classification with Random Forest and XGBoost.",
        "Collaborated with product teams to containerize scoring microservices with Docker.",
      ],
    },
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science & Applied Statistics",
      year: "2020 – 2024",
      details: "Focus on Machine Learning, Statistical Inference, and Database Systems.",
    },
  ],
  certifications: [
    "AWS Certified Machine Learning – Specialty",
    "DeepLearning.AI Machine Learning Specialization",
  ],
  insights: {
    strongAreas: [
      "Clear metrics-oriented project bullets with quantitative results (e.g. 96.4% recall, 1.5M records, 35% latency reduction)",
      "Strong machine learning fundamentals pairing traditional models (Random Forest) with interpretability (SHAP)",
      "End-to-end delivery demonstrated through deployed Streamlit apps and Docker microservices",
    ],
    areasToImprove: [
      "Could elaborate on production model monitoring and drift detection in production",
      "Mention CI/CD or automated unit testing for ML data pipelines",
    ],
    interviewPrepTips: [
      "Be prepared to defend why Random Forest was preferred over deep neural networks or gradient boosting for both projects.",
      "Review the mathematical formulas for Precision vs. Recall vs. F1-Score, especially for clinical applications.",
      "Be ready to write clean SQL queries involving JOINs, Window Functions (e.g., ROW_NUMBER, LAG), and aggregations.",
    ],
  },
  generatedQuestions: [
    {
      id: "q-demo-1",
      question: "Explain your Breast Cancer Prediction project. Why did you choose Random Forest for this classification task?",
      category: "Resume-Based Project",
      difficulty: "Medium",
      resumeSource: "Based on your project: Breast Cancer Prediction",
      suggestedAnswer:
        "In the Breast Cancer Prediction project, my objective was to accurately classify tumors while prioritizing high recall to minimize false negatives. I selected Random Forest because it is an ensemble of bagging decision trees that naturally resists overfitting on tabular clinical data with moderate sample size (569 rows), handles non-linear relationships without heavy feature scaling, and provides robust out-of-bag feature importances which paired well with SHAP interpretability.",
      keyEvaluationPoints: [
        "Mentions ensemble bagging nature of Random Forest",
        "Discusses resilience to overfitting on tabular clinical data",
        "Connects model selection to clinical priorities (minimizing false negatives/high recall)",
        "References feature importances / interpretability",
      ],
    },
    {
      id: "q-demo-2",
      question: "What preprocessing and feature engineering steps did you perform on the Wisconsin dataset before training?",
      category: "Resume-Based Project",
      difficulty: "Medium",
      resumeSource: "Based on your project: Breast Cancer Prediction",
      suggestedAnswer:
        "First, I checked for missing values and confirmed data integrity. Given that the 30 cellular attributes had varying scales (e.g., mean radius vs. fractal dimension), I normalized the features using StandardScaler. I then addressed multicollinearity among radius, perimeter, and area using Principal Component Analysis (PCA) to retain 95% variance. Finally, I used SMOTE to balance the benign/malignant distribution on the training fold strictly after train-test split to prevent data leakage.",
      keyEvaluationPoints: [
        "Data normalization / scaling with StandardScaler",
        "Multicollinearity handling and PCA 95% variance",
        "SMOTE for class imbalance prevention of data leakage",
      ],
    },
    {
      id: "q-demo-3",
      question: "Explain the architecture of your Solar Rooftop Potential Mapping project and how you calculated solar irradiance.",
      category: "Resume-Based Project",
      difficulty: "Hard",
      resumeSource: "Based on your project: Solar Rooftop Potential Mapping",
      suggestedAnswer:
        "The architecture had 3 stages: Image Acquisition & Preprocessing, Usable Roof Area Segmentation, and Insolation Computation. We loaded high-resolution aerial raster imagery via GeoPandas and Rasterio, used OpenCV thresholding and morphological filtering to isolate rooftop planes from chimneys/HVAC shadows, and calculated total unobstructed surface area. Next, we matched parcel coordinates with localized NASA POWER solar meteorological irradiance (GHI - Global Horizontal Irradiance) factoring in rooftop pitch angles to compute estimated annual kWh yield.",
      keyEvaluationPoints: [
        "Outlines end-to-end pipeline components",
        "Explains obstacle filtering with computer vision",
        "Details formula for solar irradiance integration with NASA POWER data",
      ],
    },
    {
      id: "q-demo-4",
      question: "At CloudMetrics Labs, you reduced data pipeline latency by 35% processing 1.5M daily records. What optimizations did you implement in Python and PostgreSQL?",
      category: "Technical / Coding",
      difficulty: "Hard",
      resumeSource: "Based on your experience: Data Science Intern at CloudMetrics Labs",
      suggestedAnswer:
        "I identified bottlenecks in single-row Python insertions and unindexed PostgreSQL queries. First, I refactored the ingestion scripts to use bulk batch loading via COPY and psycopg2 execute_values instead of ORM inserts. Second, I introduced composite B-tree indexes and partitioned daily telemetry tables by date timestamp. In Python, I optimized Pandas transformations with vectorized NumPy operations and multiprocessing for data deduplication.",
      keyEvaluationPoints: [
        "Bulk loading vs row-by-row inserts",
        "PostgreSQL indexing & partitioning strategies",
        "Vectorized operations and parallel data processing",
      ],
    },
    {
      id: "q-demo-5",
      question: "Tell me about yourself, your background in Data Science, and what drives you.",
      category: "HR",
      difficulty: "Easy",
      resumeSource: "HR & Behavioral Foundation",
      suggestedAnswer:
        "I am a Data Scientist with a background in Computer Science and Applied Statistics from UC Berkeley. I specialize in turning raw, messy datasets into predictive machine learning solutions that solve tangible problems. For instance, in healthcare diagnostics, I developed a high-recall breast cancer classifier with explainable AI, and in clean tech, I built a geospatial mapping pipeline for 12,000+ rooftops. During my internship at CloudMetrics, I enjoyed scaling production pipelines handling over 1.5M records daily. I am passionate about applying rigorous statistical modeling to build high-impact, deployed systems.",
      keyEvaluationPoints: [
        "Succinct chronological summary of education and experience",
        "Highlights 2 impactful projects with concrete results",
        "Clear professional narrative and enthusiasm",
      ],
    },
    {
      id: "q-demo-6",
      question: "Why should we hire you for this Machine Learning & Data Science role over other candidates?",
      category: "HR",
      difficulty: "Medium",
      resumeSource: "HR & Candidate Value Proposition",
      suggestedAnswer:
        "You should hire me because I bridge the gap between theoretical data science and production engineering. Rather than stopping at Jupyter notebooks, I build end-to-end pipelines—from data ingestion and rigorous model validation to interactive Streamlit interfaces, SHAP model interpretability, and Dockerized microservices. My track record at CloudMetrics demonstrates that I can quickly optimize data systems while maintaining scientific accuracy.",
      keyEvaluationPoints: [
        "Bridges theory with production deployment",
        "Mentions end-to-end ownership",
        "Directly leverages past internship success",
      ],
    },
    {
      id: "q-demo-7",
      question: "In Python, how do Pandas DataFrames store data internally in memory, and how do you handle memory bottlenecks with large datasets?",
      category: "Technical / Coding",
      difficulty: "Medium",
      resumeSource: "Based on your skill: Python & Pandas",
      suggestedAnswer:
        "Pandas DataFrames use a BlockManager that groups columns of identical NumPy dtypes into contiguous 2D ndarray blocks. To handle memory bottlenecks, I: 1) Downcast numeric types (e.g. float64 to float32 or int32), 2) Convert high-cardinality repetitive strings to category dtypes, 3) Use chunksize iteration with pd.read_csv to process data in batches, and 4) Leverage Polars or PyArrow engines for out-of-core operations.",
      keyEvaluationPoints: [
        "Understands BlockManager / column-oriented memory layout",
        "Downcasting numeric types & categorical optimization",
        "Batch chunking and modern alternatives (PyArrow/Polars)",
      ],
    },
    {
      id: "q-demo-8",
      question: "Explain the bias-variance tradeoff in Random Forest compared to a single Decision Tree.",
      category: "Data Science & ML",
      difficulty: "Medium",
      resumeSource: "Based on your skill: Random Forest & Scikit-learn",
      suggestedAnswer:
        "A single deep decision tree has low bias but very high variance because it is prone to fitting noise in training data. Random Forest employs Bagging (Bootstrap Aggregation) and feature subsampling across an ensemble of decorrelated deep trees. Each individual tree still maintains low bias, but averaging their predictions significantly reduces the ensemble's overall variance without increasing bias.",
      keyEvaluationPoints: [
        "Individual tree: low bias, high variance",
        "Ensemble bagging: variance reduction through averaging",
        "Feature subsampling decorrelates individual trees",
      ],
    },
  ],
};
