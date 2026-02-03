import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Mail,
  Upload,
  Briefcase,
  Sparkles,
  BarChart3,
  LogOut,
  FileText,
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Zap,
  ExternalLink,
  Download,
  RefreshCw,
  Wand2,
  Layers,
  X,
  Menu,
  Link2,
  FileCode,
  MessageSquare,
  Target,
  Rocket,
  GraduationCap,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { resumeAPI, jobAPI, emailAPI, enhancedAPI } from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("quick-generate");
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewEmail, setPreviewEmail] = useState(null);

  // Quick Generate States
  const [quickMode, setQuickMode] = useState("all");
  const [resumeText, setResumeText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobData, setJobData] = useState(null);
  const [manualJobInput, setManualJobInput] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [emailTone, setEmailTone] = useState("professional");
  const [emailLength, setEmailLength] = useState("medium");
  const [coverLetterTone, setCoverLetterTone] = useState("professional");
  const [latexTemplate, setLatexTemplate] = useState("modern");
  const [generateResults, setGenerateResults] = useState(null);

  // Analysis States
  const [analysisResult, setAnalysisResult] = useState(null);
  const [interviewPrep, setInterviewPrep] = useState(null);

  // Legacy states
  const [newJob, setNewJob] = useState({
    company_name: "",
    job_title: "",
    job_description: "",
    job_url: "",
  });

  const [copiedId, setCopiedId] = useState(null);
  const [scrapingJob, setScrapingJob] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === "saved-data" || activeTab === "emails") {
        const [resumesRes, jobsRes, emailsRes] = await Promise.all([
          resumeAPI.getAll(),
          jobAPI.getAll(),
          emailAPI.getAll(),
        ]);
        setResumes(resumesRes.data);
        setJobs(jobsRes.data);
        setEmails(emailsRes.data);
      }
      if (activeTab === "analytics") {
        const statsRes = await emailAPI.getUsageStats();
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Scrape Job URL
  const handleScrapeJobUrl = async () => {
    if (!jobUrl.trim()) {
      toast.error("Please enter a job URL");
      return;
    }

    setScrapingJob(true);
    try {
      const response = await enhancedAPI.scrapeJobUrl(jobUrl);
      setJobData(response.data);
      setCompanyName(response.data.company_name || "");
      setJobTitle(response.data.job_title || "");
      setJobDescription(response.data.job_description || "");
      toast.success("Job details extracted successfully!");
    } catch (error) {
      toast.error("Failed to scrape job URL. Try manual input.");
      setManualJobInput(true);
    } finally {
      setScrapingJob(false);
    }
  };

  // Dropzone for resume upload
  const onDropResume = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await enhancedAPI.uploadAndAnalyze(file);
      setResumeText(response.data.content);
      toast.success("Resume loaded successfully!");
    } catch (error) {
      toast.error("Failed to process resume");
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropResume,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 10485760,
    multiple: false,
  });

  // Quick Generate All
  const handleQuickGenerate = async () => {
    if (!resumeText.trim()) {
      toast.error("Please upload or paste your resume");
      return;
    }
    if (!jobDescription.trim() && !jobData) {
      toast.error("Please provide job details");
      return;
    }

    setLoading(true);
    setGenerateResults(null);

    try {
      const options = {
        generate_email: quickMode === "all" || quickMode === "email",
        generate_cover_letter:
          quickMode === "all" || quickMode === "cover-letter",
        analyze_resume: quickMode === "all" || quickMode === "analyze",
        generate_latex: quickMode === "latex",
        generate_interview_prep: quickMode === "interview",
        email_tone: emailTone,
        email_length: emailLength,
        cover_letter_tone: coverLetterTone,
        latex_template: latexTemplate,
      };

      const response = await enhancedAPI.quickGenerate({
        resume_content: resumeText,
        job_description: jobDescription || jobData?.job_description,
        company_name: companyName || jobData?.company_name || "",
        job_title: jobTitle || jobData?.job_title || "",
        options,
      });

      setGenerateResults(response.data);
      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  // Generate Interview Prep
  const handleGenerateInterviewPrep = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error("Please provide resume and job details");
      return;
    }

    setLoading(true);
    try {
      const response = await enhancedAPI.generateInterviewPrep({
        resume_content: resumeText,
        job_description: jobDescription,
        job_title: jobTitle,
        company_name: companyName,
      });
      setInterviewPrep(response.data);
      toast.success("Interview prep generated!");
    } catch (error) {
      toast.error("Failed to generate interview prep");
    } finally {
      setLoading(false);
    }
  };

  // Analyze Resume Only
  const handleAnalyzeResume = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error("Please provide resume and job details");
      return;
    }

    setLoading(true);
    try {
      const response = await enhancedAPI.analyzeResume({
        resume_content: resumeText,
        job_description: jobDescription,
        job_title: jobTitle,
        company_name: companyName,
      });
      setAnalysisResult(response.data);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  // Legacy handlers
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobAPI.create(newJob);
      toast.success("Job added successfully!");
      setNewJob({
        company_name: "",
        job_title: "",
        job_description: "",
        job_url: "",
      });
      loadData();
    } catch (error) {
      toast.error("Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      await resumeAPI.delete(id);
      toast.success("Resume deleted");
      loadData();
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await jobAPI.delete(id);
      toast.success("Job deleted");
      loadData();
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const handleDeleteEmail = async (id) => {
    try {
      await emailAPI.delete(id);
      toast.success("Email deleted");
      loadData();
    } catch (error) {
      toast.error("Failed to delete email");
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadLatex = (latexCode) => {
    const blob = new Blob([latexCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.tex";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("LaTeX file downloaded!");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    {
      id: "quick-generate",
      icon: <Rocket className="w-5 h-5" />,
      label: "Quick Generate",
      desc: "On-the-go generation",
    },
    {
      id: "analyze",
      icon: <Target className="w-5 h-5" />,
      label: "Resume Analyzer",
      desc: "ATS & match scoring",
    },
    {
      id: "interview-prep",
      icon: <GraduationCap className="w-5 h-5" />,
      label: "Interview Prep",
      desc: "Practice questions",
    },
    {
      id: "saved-data",
      icon: <Layers className="w-5 h-5" />,
      label: "Saved Data",
      desc: "Resumes & jobs",
    },
    {
      id: "emails",
      icon: <Mail className="w-5 h-5" />,
      label: "Email History",
      desc: "Past generations",
    },
    {
      id: "analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
      desc: "Usage stats",
    },
  ];

  // Score component
  const ScoreCircle = ({ score, label }) => {
    const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
    return (
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-2">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-dark-800"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${(score / 100) * 201} 201`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{score}</span>
          </div>
        </div>
        <p className="text-sm text-dark-400">{label}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? "w-72" : "w-20"} bg-dark-900/95 backdrop-blur-xl border-r border-dark-800`}
      >
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow flex-shrink-0">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-white">
                Landit<span className="gradient-text">AI</span>
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border border-primary-500/30" : "text-dark-400 hover:bg-dark-800 hover:text-white"}`}
            >
              <span className={activeTab === item.id ? "text-primary-400" : ""}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <div className="text-left">
                  <span className="font-medium block">{item.label}</span>
                  <span className="text-xs text-dark-500">{item.desc}</span>
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-800">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.username}
                </p>
                <p className="text-dark-500 text-sm truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full mt-2 flex items-center space-x-3 px-4 py-3 rounded-xl text-dark-400 hover:bg-dark-800 hover:text-red-400 transition-all ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-400 hover:text-white"
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
          />
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-xl border-b border-dark-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-dark-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-white">LanditAI</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-dark-900 border-r border-dark-800 z-50 overflow-y-auto"
            >
              <div className="p-4 border-b border-dark-800 flex items-center justify-between">
                <span className="text-xl font-bold text-white">LanditAI</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-dark-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white" : "text-dark-400 hover:bg-dark-800 hover:text-white"}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"} pt-16 lg:pt-0`}
      >
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              {navItems.find((item) => item.id === activeTab)?.label}
            </h1>
            <p className="text-dark-400">
              {navItems.find((item) => item.id === activeTab)?.desc}
            </p>
          </div>

          {/* Quick Generate Tab */}
          {activeTab === "quick-generate" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Mode Selector */}
              <div className="card p-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      id: "all",
                      label: "All-in-One",
                      icon: <Sparkles className="w-4 h-4" />,
                    },
                    {
                      id: "email",
                      label: "Cold Email",
                      icon: <Mail className="w-4 h-4" />,
                    },
                    {
                      id: "cover-letter",
                      label: "Cover Letter",
                      icon: <FileText className="w-4 h-4" />,
                    },
                    {
                      id: "latex",
                      label: "LaTeX Resume",
                      icon: <FileCode className="w-4 h-4" />,
                    },
                    {
                      id: "analyze",
                      label: "Analyze Only",
                      icon: <Target className="w-4 h-4" />,
                    },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setQuickMode(mode.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${quickMode === mode.id ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white" : "bg-dark-800 text-dark-300 hover:text-white"}`}
                    >
                      {mode.icon}
                      <span className="text-sm font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Column */}
                <div className="space-y-6">
                  {/* Resume Input */}
                  <div className="card p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          Resume
                        </h2>
                        <p className="text-sm text-dark-400">
                          Upload or paste your resume
                        </p>
                      </div>
                    </div>

                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4 ${isDragActive ? "border-primary-500 bg-primary-500/10" : "border-dark-700 hover:border-primary-500/50"}`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="w-8 h-8 text-dark-500 mx-auto mb-2" />
                      <p className="text-dark-400 text-sm">
                        {isDragActive
                          ? "Drop here..."
                          : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-dark-500 text-xs mt-1">
                        PDF, DOC, DOCX, TXT
                      </p>
                    </div>

                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="input min-h-[200px]"
                      placeholder="Or paste your resume content here..."
                    />
                  </div>

                  {/* Job Input */}
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500/20 to-primary-500/20 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-secondary-400" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            Job Details
                          </h2>
                          <p className="text-sm text-dark-400">
                            Paste URL or enter manually
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setManualJobInput(!manualJobInput)}
                        className="text-sm text-primary-400 hover:text-primary-300"
                      >
                        {manualJobInput ? "Use URL" : "Manual Input"}
                      </button>
                    </div>

                    {!manualJobInput ? (
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            value={jobUrl}
                            onChange={(e) => setJobUrl(e.target.value)}
                            className="input flex-1"
                            placeholder="Paste job URL (LinkedIn, Indeed, etc.)"
                          />
                          <button
                            onClick={handleScrapeJobUrl}
                            disabled={scrapingJob}
                            className="btn btn-primary px-4"
                          >
                            {scrapingJob ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Link2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {jobData && (
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                            <p className="text-emerald-400 text-sm mb-1">
                              ✓ Job details extracted
                            </p>
                            <p className="text-white font-medium">
                              {jobData.job_title}
                            </p>
                            <p className="text-dark-400 text-sm">
                              {jobData.company_name}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="input"
                            placeholder="Company"
                          />
                          <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="input"
                            placeholder="Job Title"
                          />
                        </div>
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          className="input min-h-[150px]"
                          placeholder="Paste the job description..."
                        />
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="card p-6">
                    <h3 className="text-white font-semibold mb-4">
                      Generation Options
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {(quickMode === "all" || quickMode === "email") && (
                        <>
                          <div>
                            <label className="block text-sm text-dark-300 mb-2">
                              Email Tone
                            </label>
                            <select
                              value={emailTone}
                              onChange={(e) => setEmailTone(e.target.value)}
                              className="input"
                            >
                              <option value="professional">Professional</option>
                              <option value="friendly">Friendly</option>
                              <option value="enthusiastic">Enthusiastic</option>
                              <option value="confident">Confident</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-dark-300 mb-2">
                              Email Length
                            </label>
                            <select
                              value={emailLength}
                              onChange={(e) => setEmailLength(e.target.value)}
                              className="input"
                            >
                              <option value="short">Short</option>
                              <option value="medium">Medium</option>
                              <option value="long">Long</option>
                            </select>
                          </div>
                        </>
                      )}
                      {(quickMode === "all" ||
                        quickMode === "cover-letter") && (
                        <div>
                          <label className="block text-sm text-dark-300 mb-2">
                            Cover Letter Tone
                          </label>
                          <select
                            value={coverLetterTone}
                            onChange={(e) => setCoverLetterTone(e.target.value)}
                            className="input"
                          >
                            <option value="professional">Professional</option>
                            <option value="enthusiastic">Enthusiastic</option>
                            <option value="confident">Confident</option>
                            <option value="storytelling">Storytelling</option>
                          </select>
                        </div>
                      )}
                      {quickMode === "latex" && (
                        <div>
                          <label className="block text-sm text-dark-300 mb-2">
                            Template Style
                          </label>
                          <select
                            value={latexTemplate}
                            onChange={(e) => setLatexTemplate(e.target.value)}
                            className="input"
                          >
                            <option value="modern">Modern</option>
                            <option value="classic">Classic</option>
                            <option value="minimal">Minimal</option>
                            <option value="creative">Creative</option>
                            <option value="academic">Academic</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleQuickGenerate}
                      disabled={loading || !resumeText.trim()}
                      className="btn btn-primary w-full mt-6 py-3"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate {quickMode === "all" ? "All Content" : ""}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Results Column */}
                <div className="space-y-6">
                  {generateResults ? (
                    <>
                      {generateResults.analysis && (
                        <div className="card p-6">
                          <h3 className="text-lg font-semibold text-white mb-4">
                            Resume Analysis
                          </h3>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <ScoreCircle
                              score={generateResults.analysis.ats_score || 0}
                              label="ATS Score"
                            />
                            <ScoreCircle
                              score={generateResults.analysis.match_score || 0}
                              label="Match Score"
                            />
                          </div>
                          <p className="text-dark-300 text-sm">
                            {generateResults.analysis.summary}
                          </p>
                        </div>
                      )}

                      {generateResults.email && (
                        <div className="card p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                              Cold Email
                            </h3>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `Subject: ${generateResults.email.subject}\n\n${generateResults.email.body}`,
                                  "email",
                                )
                              }
                              className="btn btn-secondary text-sm"
                            >
                              {copiedId === "email" ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              Copy
                            </button>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-800/50 mb-3">
                            <span className="text-xs text-dark-500">
                              Subject:
                            </span>
                            <p className="text-white">
                              {generateResults.email.subject}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-800/50 max-h-60 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-dark-200 text-sm font-sans">
                              {generateResults.email.body}
                            </pre>
                          </div>
                        </div>
                      )}

                      {generateResults.cover_letter && (
                        <div className="card p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                              Cover Letter
                            </h3>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  generateResults.cover_letter.cover_letter,
                                  "cl",
                                )
                              }
                              className="btn btn-secondary text-sm"
                            >
                              {copiedId === "cl" ? (
                                <Check className="w-4 h-4 mr-1" />
                              ) : (
                                <Copy className="w-4 h-4 mr-1" />
                              )}
                              Copy
                            </button>
                          </div>
                          <div className="p-4 rounded-lg bg-dark-800/50 max-h-80 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-dark-200 text-sm font-sans leading-relaxed">
                              {generateResults.cover_letter.cover_letter}
                            </pre>
                          </div>
                        </div>
                      )}

                      {generateResults.latex_resume && (
                        <div className="card p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                              LaTeX Resume
                            </h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    generateResults.latex_resume.latex_code,
                                    "latex",
                                  )
                                }
                                className="btn btn-secondary text-sm"
                              >
                                {copiedId === "latex" ? (
                                  <Check className="w-4 h-4 mr-1" />
                                ) : (
                                  <Copy className="w-4 h-4 mr-1" />
                                )}
                                Copy
                              </button>
                              <button
                                onClick={() =>
                                  downloadLatex(
                                    generateResults.latex_resume.latex_code,
                                  )
                                }
                                className="btn btn-primary text-sm"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download .tex
                              </button>
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-dark-800/50 max-h-80 overflow-y-auto">
                            <pre className="text-dark-300 text-xs font-mono overflow-x-auto">
                              {generateResults.latex_resume.latex_code.substring(
                                0,
                                1500,
                              )}
                              ...
                            </pre>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="card p-12 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-dark-800/50 flex items-center justify-center">
                        <Rocket className="w-10 h-10 text-dark-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Ready to Generate
                      </h3>
                      <p className="text-dark-400 mb-4">
                        Upload your resume and provide job details to get
                        started
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-dark-800 text-dark-400 text-xs">
                          Cold Email
                        </span>
                        <span className="px-3 py-1 rounded-full bg-dark-800 text-dark-400 text-xs">
                          Cover Letter
                        </span>
                        <span className="px-3 py-1 rounded-full bg-dark-800 text-dark-400 text-xs">
                          ATS Analysis
                        </span>
                        <span className="px-3 py-1 rounded-full bg-dark-800 text-dark-400 text-xs">
                          LaTeX Resume
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Resume Analyzer Tab */}
          {activeTab === "analyze" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Resume Content
                  </h3>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all mb-4 ${isDragActive ? "border-primary-500 bg-primary-500/10" : "border-dark-700 hover:border-primary-500/50"}`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-6 h-6 text-dark-500 mx-auto mb-1" />
                    <p className="text-dark-400 text-sm">Upload resume</p>
                  </div>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="input min-h-[150px]"
                    placeholder="Or paste resume content..."
                  />
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Job Description
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="input"
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="input"
                      placeholder="Job Title"
                    />
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="input min-h-[150px]"
                    placeholder="Paste job description..."
                  />
                  <button
                    onClick={handleAnalyzeResume}
                    disabled={loading}
                    className="btn btn-primary w-full mt-4"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Target className="w-5 h-5 mr-2" />
                    )}
                    Analyze Resume
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {analysisResult ? (
                  <>
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold text-white mb-6">
                        Scores
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <ScoreCircle
                          score={analysisResult.ats_score || 0}
                          label="ATS Score"
                        />
                        <ScoreCircle
                          score={analysisResult.match_score || 0}
                          label="Job Match"
                        />
                      </div>
                    </div>

                    {analysisResult.keyword_match && (
                      <div className="card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Keyword Analysis
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-dark-400 mb-2">
                              Matched Keywords
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.keyword_match.matched_keywords?.map(
                                (kw, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs"
                                  >
                                    {kw}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-dark-400 mb-2">
                              Missing Keywords
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.keyword_match.missing_keywords?.map(
                                (kw, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs"
                                  >
                                    {kw}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {analysisResult.improvement_suggestions && (
                      <div className="card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Suggestions
                        </h3>
                        <div className="space-y-3">
                          {analysisResult.improvement_suggestions
                            .slice(0, 5)
                            .map((sug, i) => (
                              <div
                                key={i}
                                className="flex items-start space-x-3 p-3 rounded-lg bg-dark-800/50"
                              >
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${sug.priority === "high" ? "bg-red-500/20 text-red-400" : sug.priority === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}
                                >
                                  {sug.priority}
                                </span>
                                <p className="text-dark-300 text-sm">
                                  {sug.suggestion}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="card p-12 text-center">
                    <Target className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Resume Analysis
                    </h3>
                    <p className="text-dark-400">
                      Get ATS score, keyword match, and improvement suggestions
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Interview Prep Tab */}
          {activeTab === "interview-prep" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Your Background
                  </h3>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="input min-h-[120px]"
                    placeholder="Paste resume or background info..."
                  />
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Job Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="input"
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="input"
                      placeholder="Job Title"
                    />
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="input min-h-[120px]"
                    placeholder="Job description..."
                  />
                  <button
                    onClick={handleGenerateInterviewPrep}
                    disabled={loading}
                    className="btn btn-primary w-full mt-4"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <GraduationCap className="w-5 h-5 mr-2" />
                    )}
                    Generate Interview Prep
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {interviewPrep?.questions ? (
                  <>
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Interview Questions ({interviewPrep.questions.length})
                      </h3>
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {interviewPrep.questions.map((q, i) => (
                          <details key={i} className="group">
                            <summary className="flex items-start cursor-pointer p-4 rounded-lg bg-dark-800/50 hover:bg-dark-800 transition-colors">
                              <ChevronRight className="w-5 h-5 text-dark-500 mr-2 mt-0.5 group-open:rotate-90 transition-transform" />
                              <div className="flex-1">
                                <span className="px-2 py-0.5 rounded bg-dark-700 text-dark-400 text-xs mb-2 inline-block">
                                  {q.category}
                                </span>
                                <p className="text-white">{q.question}</p>
                              </div>
                            </summary>
                            <div className="mt-2 ml-7 p-4 rounded-lg bg-dark-900/50 border border-dark-700/50">
                              <p className="text-xs text-dark-500 mb-2">
                                Why they ask this:
                              </p>
                              <p className="text-dark-300 text-sm mb-3">
                                {q.why_asked}
                              </p>
                              <p className="text-xs text-dark-500 mb-2">
                                Suggested approach:
                              </p>
                              <p className="text-dark-200 text-sm">
                                {q.suggested_answer}
                              </p>
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>

                    {interviewPrep.questions_to_ask_interviewer && (
                      <div className="card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Questions to Ask
                        </h3>
                        <ul className="space-y-2">
                          {interviewPrep.questions_to_ask_interviewer.map(
                            (q, i) => (
                              <li
                                key={i}
                                className="flex items-start space-x-2 text-dark-300"
                              >
                                <MessageSquare className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{q}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="card p-12 text-center">
                    <GraduationCap className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Interview Preparation
                    </h3>
                    <p className="text-dark-400">
                      Get likely questions, suggested answers, and tips
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Saved Data Tab */}
          {activeTab === "saved-data" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Saved Resumes
                </h3>
                {resumes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resumes.map((resume) => (
                      <div key={resume.id} className="card p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {resume.filename}
                            </p>
                            <p className="text-xs text-dark-500">
                              {new Date(resume.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteResume(resume.id)}
                          className="btn btn-secondary w-full text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-8 text-center">
                    <FileText className="w-12 h-12 text-dark-600 mx-auto mb-2" />
                    <p className="text-dark-400">No saved resumes</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Saved Jobs
                </h3>
                <div className="card p-6 mb-6">
                  <h4 className="text-white font-medium mb-4">Add New Job</h4>
                  <form onSubmit={handleCreateJob} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newJob.company_name}
                        onChange={(e) =>
                          setNewJob({ ...newJob, company_name: e.target.value })
                        }
                        className="input"
                        placeholder="Company Name"
                        required
                      />
                      <input
                        type="text"
                        value={newJob.job_title}
                        onChange={(e) =>
                          setNewJob({ ...newJob, job_title: e.target.value })
                        }
                        className="input"
                        placeholder="Job Title"
                        required
                      />
                    </div>
                    <input
                      type="url"
                      value={newJob.job_url}
                      onChange={(e) =>
                        setNewJob({ ...newJob, job_url: e.target.value })
                      }
                      className="input"
                      placeholder="Job URL (optional)"
                    />
                    <textarea
                      value={newJob.job_description}
                      onChange={(e) =>
                        setNewJob({
                          ...newJob,
                          job_description: e.target.value,
                        })
                      }
                      className="input"
                      rows={4}
                      placeholder="Job Description"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Job
                    </button>
                  </form>
                </div>

                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="card p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-secondary-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {job.job_title}
                              </p>
                              <p className="text-dark-400 text-sm">
                                {job.company_name}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {job.job_url && (
                              <a
                                href={job.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary p-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="btn btn-secondary p-2 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-8 text-center">
                    <Briefcase className="w-12 h-12 text-dark-600 mx-auto mb-2" />
                    <p className="text-dark-400">No saved jobs</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Emails Tab */}
          {activeTab === "emails" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {emails.length > 0 ? (
                <div className="space-y-4">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className="card p-4 cursor-pointer hover:border-primary-500/30"
                      onClick={() => setPreviewEmail(email)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {email.subject}
                            </p>
                            <p className="text-dark-500 text-sm line-clamp-1">
                              {email.body}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(
                                `Subject: ${email.subject}\n\n${email.body}`,
                                email.id,
                              );
                            }}
                            className="btn btn-secondary p-2"
                          >
                            {copiedId === email.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEmail(email.id);
                            }}
                            className="btn btn-secondary p-2 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <Mail className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No saved emails
                  </h3>
                  <p className="text-dark-400">
                    Generated emails will appear here
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {stats ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: <Mail className="w-6 h-6" />,
                      value: stats.total_emails_generated,
                      label: "Emails Generated",
                    },
                    {
                      icon: <FileText className="w-6 h-6" />,
                      value: stats.total_resumes_uploaded,
                      label: "Resumes",
                    },
                    {
                      icon: <Briefcase className="w-6 h-6" />,
                      value: stats.total_jobs_added,
                      label: "Jobs",
                    },
                    {
                      icon: <Zap className="w-6 h-6" />,
                      value: stats.total_tokens_used,
                      label: "Tokens Used",
                    },
                  ].map((stat, i) => (
                    <div key={i} className="card p-6 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400">
                        {stat.icon}
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {stat.value?.toLocaleString() || 0}
                      </p>
                      <p className="text-dark-400 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <RefreshCw className="w-8 h-8 text-dark-600 mx-auto mb-4 animate-spin" />
                  <p className="text-dark-400">Loading analytics...</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Email Preview Modal */}
      <AnimatePresence>
        {previewEmail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50"
              onClick={() => setPreviewEmail(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl card p-6 z-50 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Email Preview
                </h2>
                <button
                  onClick={() => setPreviewEmail(null)}
                  className="btn btn-secondary p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 rounded-lg bg-dark-800/50 mb-4">
                <p className="text-xs text-dark-500 mb-1">Subject</p>
                <p className="text-white">{previewEmail.subject}</p>
              </div>
              <div className="p-4 rounded-lg bg-dark-800/50">
                <p className="text-xs text-dark-500 mb-2">Body</p>
                <pre className="whitespace-pre-wrap text-dark-200 text-sm font-sans">
                  {previewEmail.body}
                </pre>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
