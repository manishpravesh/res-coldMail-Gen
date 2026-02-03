import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => {
    const formData = new FormData();
    formData.append("username", data.email);
    formData.append("password", data.password);
    return api.post("/api/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getCurrentUser: () => api.get("/api/auth/me"),
};

// Resume API
export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/resumes/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getAll: (skip = 0, limit = 10) =>
    api.get(`/api/resumes?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/api/resumes/${id}`),
  delete: (id) => api.delete(`/api/resumes/${id}`),
};

// Job API
export const jobAPI = {
  create: (data) => api.post("/api/jobs", data),
  getAll: (skip = 0, limit = 10) =>
    api.get(`/api/jobs?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/api/jobs/${id}`),
  update: (id, data) => api.put(`/api/jobs/${id}`, data),
  delete: (id) => api.delete(`/api/jobs/${id}`),
};

// Email API
export const emailAPI = {
  generate: (data) => api.post("/api/emails/generate", data),
  getAll: (skip = 0, limit = 10) =>
    api.get(`/api/emails?skip=${skip}&limit=${limit}`),
  getById: (id) => api.get(`/api/emails/${id}`),
  delete: (id) => api.delete(`/api/emails/${id}`),
  getUsageStats: () => api.get("/api/emails/usage/stats"),
};

// Enhanced Features API
export const enhancedAPI = {
  // Job URL Scraping
  scrapeJobUrl: (url) => api.post("/api/enhanced/scrape-job", { url }),

  // Quick Generation (no database save)
  quickGenerate: (data) => api.post("/api/enhanced/quick-generate", data),
  quickEmail: (data) => api.post("/api/enhanced/quick-email", data),

  // Cover Letter
  generateCoverLetter: (data) => api.post("/api/enhanced/cover-letter", data),

  // Resume Analysis
  analyzeResume: (data) => api.post("/api/enhanced/analyze-resume", data),
  getAtsScore: (data) => api.post("/api/enhanced/ats-score", data),

  // LaTeX Resume
  generateLatexResume: (data) => api.post("/api/enhanced/latex-resume", data),

  // Interview Prep
  generateInterviewPrep: (data) =>
    api.post("/api/enhanced/interview-prep", data),

  // File Upload with Analysis
  uploadAndAnalyze: (
    file,
    jobDescription = "",
    jobTitle = "",
    companyName = "",
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    if (jobDescription) formData.append("job_description", jobDescription);
    if (jobTitle) formData.append("job_title", jobTitle);
    if (companyName) formData.append("company_name", companyName);
    return api.post("/api/enhanced/upload-and-analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Batch Generation
  batchGenerate: (data) => api.post("/api/enhanced/batch-generate", data),
};

export default api;
