import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Cpu,
  FileText,
  Target,
  Clock,
  Star,
  ChevronDown,
  Play,
  Rocket,
  BarChart3,
  Globe,
  Lock,
  Wand2,
  MessageSquare,
  Layers,
  Menu,
  X,
  Send,
  Award,
  Briefcase,
} from "lucide-react";

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Floating particles background
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary-500/30 rounded-full"
        initial={{
          x:
            Math.random() *
            (typeof window !== "undefined" ? window.innerWidth : 1000),
          y:
            Math.random() *
            (typeof window !== "undefined" ? window.innerHeight : 800),
        }}
        animate={{
          y: [null, Math.random() * -500],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description:
        "Our advanced AI analyzes your resume and job descriptions to craft hyper-personalized cold emails that resonate with hiring managers.",
      gradient: "from-primary-500 to-primary-600",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description:
        "Generate professional, tailored emails in under 5 seconds. Save hours of writing time with our intelligent automation.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Targeting",
      description:
        "Extract key requirements from job postings and highlight your most relevant skills automatically.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multiple Tones",
      description:
        "Choose from professional, friendly, or enthusiastic tones to match your personality and the company culture.",
      gradient: "from-secondary-500 to-pink-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description:
        "Enterprise-grade encryption protects your data. Your resumes and emails are never shared or used for training.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description:
        "Track your email generation, monitor usage patterns, and optimize your outreach strategy with detailed insights.",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const stats = [
    { label: "Emails Generated", value: 50000, suffix: "+" },
    { label: "Success Rate", value: 94, suffix: "%" },
    { label: "Hours Saved", value: 10000, suffix: "+" },
    { label: "Happy Users", value: 2500, suffix: "+" },
  ];

  const testimonials = [
    {
      quote:
        "LanditAI completely transformed my job search. I went from getting zero responses to landing 5 interviews in just two weeks. The AI-generated emails are incredibly personalized.",
      author: "Sarah Chen",
      role: "Software Engineer",
      company: "Hired at Google",
      avatar: "SC",
      rating: 5,
    },
    {
      quote:
        "As a recruiter, I recommend LanditAI to every job seeker I work with. The quality of emails it produces is remarkable - they're professional, compelling, and authentic.",
      author: "Michael Rodriguez",
      role: "Senior Recruiter",
      company: "Tech Talent Agency",
      avatar: "MR",
      rating: 5,
    },
    {
      quote:
        "I was skeptical about AI-generated content, but LanditAI exceeded all expectations. Each email perfectly highlights my relevant experience for the specific role.",
      author: "Emily Thompson",
      role: "Marketing Manager",
      company: "Hired at Spotify",
      avatar: "ET",
      rating: 5,
    },
    {
      quote:
        "The time savings alone make it worth it. What used to take me an hour per application now takes 2 minutes. And the quality is even better than what I wrote manually.",
      author: "David Park",
      role: "Product Designer",
      company: "Hired at Airbnb",
      avatar: "DP",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for trying out LanditAI",
      features: [
        "10 emails per month",
        "Basic resume parsing",
        "3 email tones",
        "Email history",
        "Community support",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "Best for active job seekers",
      features: [
        "Unlimited emails",
        "Advanced AI models",
        "All email tones & lengths",
        "Priority email generation",
        "Advanced analytics",
        "Email performance tracking",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "/month",
      description: "For teams and agencies",
      features: [
        "Everything in Professional",
        "Team collaboration",
        "API access",
        "Custom integrations",
        "White-label solution",
        "Dedicated account manager",
        "Custom AI training",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "How does LanditAI generate personalized emails?",
      answer:
        "LanditAI uses advanced AI models to analyze your resume and the job description. It identifies key skills, experiences, and achievements that match the role requirements, then crafts a compelling email that highlights your relevant qualifications while maintaining a natural, human tone.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption to protect all your data. Your resumes and generated emails are stored securely and never shared with third parties or used to train our AI models. You can delete your data at any time.",
    },
    {
      question: "Can I customize the generated emails?",
      answer:
        "Yes! You can choose from multiple tones (professional, friendly, enthusiastic) and lengths (short, medium, long). After generation, you can edit and refine the email before using it. Think of our AI as a starting point that saves you 90% of the writing time.",
    },
    {
      question: "What file formats do you support for resumes?",
      answer:
        "We support PDF, DOC, DOCX, and TXT formats. Our AI extracts text and key information regardless of your resume's format or structure.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 14-day money-back guarantee. If you're not satisfied with LanditAI for any reason, contact our support team within 14 days of your purchase for a full refund.",
    },
  ];

  const useCases = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Job Seekers",
      description:
        "Stand out from hundreds of applicants with personalized cold emails that get responses.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Career Changers",
      description:
        "Highlight transferable skills and make compelling cases for role transitions.",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Freelancers",
      description:
        "Pitch your services to potential clients with professional, tailored outreach.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Recent Graduates",
      description:
        "Leverage your education and projects to land your first professional role.",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-dark-800/50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-white">
                Landit<span className="gradient-text">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#how-it-works" className="nav-link">
                How it Works
              </a>
              <a href="#pricing" className="nav-link">
                Pricing
              </a>
              <a href="#testimonials" className="nav-link">
                Testimonials
              </a>
              <a href="#faq" className="nav-link">
                FAQ
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-dark-300 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-dark-900 border-t border-dark-800"
            >
              <div className="container-custom py-4 space-y-4">
                <a
                  href="#features"
                  className="block py-2 text-dark-300 hover:text-white"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block py-2 text-dark-300 hover:text-white"
                >
                  How it Works
                </a>
                <a
                  href="#pricing"
                  className="block py-2 text-dark-300 hover:text-white"
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="block py-2 text-dark-300 hover:text-white"
                >
                  Testimonials
                </a>
                <div className="pt-4 space-y-3">
                  <Link
                    to="/login"
                    className="btn btn-secondary w-full block text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary w-full block text-center"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="orb orb-primary w-[600px] h-[600px] -top-48 -left-48" />
          <div
            className="orb orb-secondary w-[500px] h-[500px] top-1/4 -right-48"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="orb orb-accent w-[400px] h-[400px] bottom-0 left-1/3"
            style={{ animationDelay: "4s" }}
          />
          <FloatingParticles />
        </div>

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary-400 mr-2" />
                <span className="text-sm text-primary-300">
                  AI-Powered Email Generation
                </span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">Land Your Dream Job with</span>
                <br />
                <span className="gradient-text">AI-Powered</span>
                <span className="text-white"> Cold Emails</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg lg:text-xl text-dark-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Generate personalized, high-converting cold emails in seconds.
                Upload your resume, add job descriptions, and let our AI craft
                compelling outreach that gets responses.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Link
                  to="/register"
                  className="btn btn-primary text-base lg:text-lg px-8 py-4 group"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="btn btn-secondary text-base lg:text-lg px-8 py-4 group">
                  <Play className="w-5 h-5 mr-2 inline" />
                  Watch Demo
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-dark-400 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                  10 free emails
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                  Cancel anytime
                </div>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main Card */}
              <div className="relative z-10 card p-6 lg:p-8">
                {/* Window Controls */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-4 text-sm text-dark-500">
                    LanditAI - Email Generator
                  </span>
                </div>

                {/* Email Preview */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/50">
                    <FileText className="w-5 h-5 text-primary-400" />
                    <span className="text-dark-300 text-sm">
                      resume_john_doe.pdf
                    </span>
                    <span className="ml-auto badge badge-success text-xs">
                      Parsed
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/50">
                    <Briefcase className="w-5 h-5 text-secondary-400" />
                    <span className="text-dark-300 text-sm">
                      Senior Developer @ TechCorp
                    </span>
                    <span className="ml-auto badge text-xs">Selected</span>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
                    <div className="flex items-center mb-3">
                      <Sparkles className="w-5 h-5 text-primary-400 mr-2" />
                      <span className="text-white font-medium">
                        Generated Email
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-dark-700/50 rounded w-3/4"></div>
                      <div className="h-2 bg-dark-700/50 rounded w-full"></div>
                      <div className="h-2 bg-primary-500/30 rounded w-5/6"></div>
                      <div className="h-2 bg-dark-700/50 rounded w-2/3"></div>
                      <div className="h-2 bg-dark-700/50 rounded w-full"></div>
                      <div className="h-2 bg-secondary-500/30 rounded w-4/5"></div>
                    </div>
                  </div>

                  <button className="btn btn-primary w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </button>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-6 -right-6 card p-4 shadow-glow"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Email Sent!
                    </div>
                    <div className="text-xs text-dark-400">Just now</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 card p-4"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      94% Match
                    </div>
                    <div className="text-xs text-dark-400">
                      With job posting
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container-custom">
          <div className="card p-8 lg:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="stat-card"
                >
                  <div className="stat-value">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Land More Jobs</span>
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              Powerful features designed to supercharge your job search and help
              you stand out from the competition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-card"
              >
                <div
                  className={`icon-wrapper bg-gradient-to-br ${feature.gradient}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding bg-dark-900/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Generate Emails in{" "}
              <span className="gradient-text">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              Our streamlined process makes it effortless to create personalized
              cold emails.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />

            {[
              {
                step: "01",
                title: "Upload Your Resume",
                description:
                  "Upload your resume in PDF, DOC, or TXT format. Our AI extracts your skills, experience, and achievements automatically.",
                icon: <FileText className="w-8 h-8" />,
              },
              {
                step: "02",
                title: "Add Job Descriptions",
                description:
                  "Paste the job description or add job details. Our AI analyzes requirements and identifies the best matches with your profile.",
                icon: <Target className="w-8 h-8" />,
              },
              {
                step: "03",
                title: "Generate & Send",
                description:
                  "Click generate and get a personalized email in seconds. Copy it, customize if needed, and send to the hiring manager.",
                icon: <Send className="w-8 h-8" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="card p-8 text-center relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center text-primary-400">
                    {item.icon}
                  </div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-dark-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge mb-4">Use Cases</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Who is <span className="gradient-text">LanditAI</span> for?
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              Whether you're actively job hunting or exploring new
              opportunities, LanditAI adapts to your needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center card-hover"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center text-primary-400">
                  {useCase.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {useCase.title}
                </h3>
                <p className="text-dark-400 text-sm">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="section-padding bg-dark-900/50 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="orb orb-primary w-[400px] h-[400px] top-0 right-0 opacity-20" />
          <div className="orb orb-secondary w-[300px] h-[300px] bottom-0 left-0 opacity-20" />
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge mb-4">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by <span className="gradient-text">Job Seekers</span>
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              See what our users have to say about their experience with
              LanditAI.
            </p>
          </motion.div>

          {/* Main Testimonial */}
          <div className="max-w-4xl mx-auto mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="testimonial-card p-8 lg:p-12"
              >
                <div className="flex mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-amber-400 fill-current"
                      />
                    ),
                  )}
                </div>
                <blockquote className="text-xl lg:text-2xl text-dark-200 mb-6 leading-relaxed">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold mr-4">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonials[activeTestimonial].author}
                    </div>
                    <div className="text-dark-400 text-sm">
                      {testimonials[activeTestimonial].role} •{" "}
                      {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial
                    ? "bg-primary-500 w-8"
                    : "bg-dark-700 hover:bg-dark-600"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge mb-4">Pricing</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              Choose the plan that fits your job search needs. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`pricing-card ${plan.popular ? "popular scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-dark-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-dark-400">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-dark-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`btn w-full ${plan.popular ? "btn-primary" : "btn-secondary"}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-dark-400">
              All plans include a 14-day money-back guarantee.{" "}
              <a href="#faq" className="text-primary-400 hover:underline">
                Read our FAQ
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding bg-dark-900/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge mb-4">FAQ</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-white pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-dark-400 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-dark-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-secondary-600/20 to-accent-600/20" />
        <div className="absolute inset-0">
          <div className="orb orb-primary w-[600px] h-[600px] -top-48 -left-48 opacity-30" />
          <div className="orb orb-secondary w-[600px] h-[600px] -bottom-48 -right-48 opacity-30" />
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Job
              Search?
            </h2>
            <p className="text-xl text-dark-300 mb-10">
              Join thousands of job seekers who are landing more interviews with
              AI-powered cold emails. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-primary text-lg px-10 py-4 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary text-lg px-10 py-4"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-dark-800">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Landit<span className="gradient-text">AI</span>
                </span>
              </Link>
              <p className="text-dark-400 mb-6 max-w-sm">
                AI-powered cold email generation platform that helps you land
                your dream job with personalized, compelling outreach.
              </p>
              <div className="flex space-x-4">
                {["twitter", "linkedin", "github"].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-dark-400 hover:bg-dark-700 hover:text-white transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "API", "Integrations"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Cookies"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h4 className="font-semibold text-white mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={`#${link.toLowerCase()}`}
                        className="text-dark-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="divider mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center text-dark-500 text-sm">
            <p>&copy; 2026 LanditAI. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Made with ❤️ for job seekers everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
