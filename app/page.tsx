"use client"

import Navbar from "@/components/Navbar";
import { ArrowUpRight, Github, Loader2, Mail } from "lucide-react";
import React, { useState } from "react";

interface EmailFormProps {
  buttonText?: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ buttonText = "Join Waitlist" }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✨ Check your email for confirmation!' });
        setEmail("");
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input 
          type="email" 
          placeholder="your@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-900 text-white border border-gray-700 rounded-lg hover:border-gray-600 focus:border-blue-500 focus:outline-none transition-all duration-200 placeholder-gray-500 text-sm sm:text-base"
        />
        <button 
          type="submit"
          disabled={loading}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 animate-glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Subscribing..." : buttonText}
          {!loading && <ArrowUpRight size={18} />}
        </button>
      </div>
      {message && (
        <p className={`text-xs ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message.text}
        </p>
      )}
      {!message && <p className="text-xs text-gray-500">✨ Early access launching Q1 2025 • Join fellow educators on the waitlist</p>}
    </form>
  );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => {
  const isSeconds = label === 'Seconds';
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2.5 md:gap-3">
      <div className="relative">
        {/* Minimal glow background - subtle and refined */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Minimal timer box with elegant design */}
        <div className={`relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-black/40 backdrop-blur-sm border border-blue-400/20 rounded-lg sm:rounded-xl flex items-center justify-center hover:border-blue-400/40 transition-all duration-300 group ${isSeconds ? 'animate-pulse-glow' : ''}`}>
          <p className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tighter text-blue-200" style={{fontFamily: 'var(--font-inter)'}}>
            {String(value).padStart(2, '0')}
          </p>
        </div>
      </div>
      <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-light mt-0.5" style={{fontFamily: 'var(--font-inter)'}}>{label}</p>
    </div>
  );
};

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date("2026-04-30T00:00:00").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="hidden sm:block h-12 sm:h-16 md:h-20 w-px bg-linear-to-b from-transparent via-blue-500/50 to-transparent"></div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="hidden sm:block h-12 sm:h-16 md:h-20 w-px bg-linear-to-b from-transparent via-blue-500/50 to-transparent"></div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="hidden sm:block h-12 sm:h-16 md:h-20 w-px bg-linear-to-b from-transparent via-blue-500/50 to-transparent"></div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}

const ContributorCard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });

      const data: { error?: string } = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage({ type: "success", text: "Thanks for reaching out! We'll connect with you soon." });
        setName("");
        setEmail("");
      } else {
        setMessage({ type: "error", text: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Unable to submit right now. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setMessage(null);
  };

  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 bg-linear-to-r from-blue-600/40 to-cyan-600/40 rounded-2xl blur transition duration-500 ${
          isFormOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      ></div>
      <div
        className={`relative p-8 sm:p-10 bg-black border rounded-2xl flex flex-col h-full transition-all duration-300 ${
          isFormOpen ? "border-blue-500/50" : "border-gray-800 group-hover:border-blue-500/50"
        }`}
      >
        {!isFormOpen && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-14 h-14 bg-linear-to-br from-blue-500/20 to-cyan-500/10 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                isFormOpen ? "" : "group-hover:scale-110"
              }`}
            >
              <Github className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="font-bold text-xl text-white">Become a Contributor</h3>
          </div>

          {isFormOpen ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 grow">
              <p className="text-gray-400 leading-relaxed">
                Share your details and we&apos;ll send the onboarding kit for contributors.
              </p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="contributor-name" className="text-sm font-medium text-gray-300">
                    Full name
                  </label>
                  <input
                    id="contributor-name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contributor-email" className="text-sm font-medium text-gray-300">
                    Work email
                  </label>
                  <input
                    id="contributor-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                    placeholder="you@school.edu"
                  />
                </div>
              </div>
              {message && (
                <p className={`text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                  {message.text}
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-3 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-gray-400 leading-relaxed mb-8 grow">
                Help us build the future of education. Contribute code, ideas, or content to Aedura.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(true);
                  setMessage(null);
                }}
                className="flex items-center gap-2 text-blue-400 font-semibold group-hover:text-blue-300 transition-colors"
              >
                Get in touch
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AdvisoryBoardCard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/advboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, expertise })
      });

      const data: { error?: string } = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage({ type: "success", text: "Thanks for your interest! We'll be in touch with next steps." });
        setName("");
        setEmail("");
        setExpertise("");
      } else {
        setMessage({ type: "error", text: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Unable to submit right now. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setMessage(null);
  };

  return (
    <div className="group relative">
      <div
        className={`absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur transition duration-500 ${
          isFormOpen ? "opacity-100" : "opacity-30 group-hover:opacity-100"
        }`}
      ></div>
      <div
        className={`relative p-8 sm:p-10 bg-linear-to-br from-purple-950/40 to-black border rounded-2xl flex flex-col h-full transition-all duration-300 shadow-2xl shadow-purple-500/10 ${
          isFormOpen ? "border-purple-400" : "border-purple-500/50 group-hover:border-purple-400 group-hover:shadow-purple-500/30"
        }`}
      >
        <div className="absolute -top-1 -right-1 px-4 py-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white">
          FEATURED
        </div>
        {!isFormOpen && (
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-300"></div>
        )}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6 mt-4">
            <div
              className={`w-14 h-14 bg-linear-to-br from-purple-500/30 to-pink-500/20 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                isFormOpen ? "" : "group-hover:scale-110"
              }`}
            >
              <Mail className="w-7 h-7 text-purple-300" />
            </div>
            <h3 className="font-bold text-xl text-white">Join Advisory Board</h3>
          </div>

          {isFormOpen ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 grow">
              <p className="text-gray-300 leading-relaxed">
                Tell us a little about your background so we can schedule an introductory conversation.
              </p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="advisory-name" className="text-sm font-medium text-purple-200">
                    Full name
                  </label>
                  <input
                    id="advisory-name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/20 border border-purple-500/40 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-300 transition"
                    placeholder="Taylor Morgan"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="advisory-email" className="text-sm font-medium text-purple-200">
                    Email
                  </label>
                  <input
                    id="advisory-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/20 border border-purple-500/40 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-300 transition"
                    placeholder="you@organization.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="advisory-expertise" className="text-sm font-medium text-purple-200">
                    Area of expertise
                  </label>
                  <textarea
                    id="advisory-expertise"
                    required
                    value={expertise}
                    onChange={(event) => setExpertise(event.target.value)}
                    className="w-full px-4 py-3 bg-purple-950/20 border border-purple-500/40 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:border-purple-300 transition h-28 resize-none"
                    placeholder="Leadership roles, domains, or initiatives you've championed"
                  ></textarea>
                </div>
              </div>
              {message && (
                <p className={`text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                  {message.text}
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-3 bg-black/40 text-purple-200 font-medium rounded-lg hover:bg-black/60 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-gray-300 leading-relaxed mb-8 grow">
                Shape our vision and strategy. We&apos;re looking for experienced education leaders to guide our mission.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(true);
                  setMessage(null);
                }}
                className="flex items-center gap-2 text-purple-300 font-semibold group-hover:text-purple-200 transition-colors"
              >
                Get in touch
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black font-sans text-white">
      <Navbar />
      <main className="flex flex-1 flex-col w-full items-center justify-center pt-16 sm:pt-20">
        
        {/* Hero Section */}
        <section className="w-full h-screen px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex items-center justify-center bg-linear-to-b from-black via-blue-950/10 to-black relative overflow-hidden">
          {/* Gradient orb backgrounds - Now with floating animation */}
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50 parallax-slow" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-32 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 parallax-medium" style={{animationDelay: '2s'}}></div>

          <div className="w-full max-w-5xl space-y-8 sm:space-y-12 text-center relative z-10">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/50 rounded-full animate-pulse">
                <p className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                  🎓 The Future of Personalized Learning
                </p>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight bg-linear-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
                Aedura
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                The all-in-one AI-powered school management and learning platform built for modern K-12 institutions.
              </p>
            </div>

            {/* Email Waitlist Input */}
            <div className="flex justify-center pt-8 max-w-md mx-auto w-full">
              <EmailForm />
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section id="countdown" className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-linear-to-b from-black to-gray-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-30 parallax-medium" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-30 parallax-fast" style={{animationDelay: '2s'}}></div>
          
          <div className="w-full max-w-4xl space-y-12 sm:space-y-16 relative z-10">
            <div className="text-center space-y-4 sm:space-y-6 animate-fade-in-up">
              <p className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                ⏰ Launch Countdown
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                The Future is Almost Here
              </h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
                Join thousands of educators waiting for Aedura. We&apos;re launching soon with exclusive early access for our community.
              </p>
            </div>

            {/* Large Countdown Display */}
            <div className="flex justify-center animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="bg-linear-to-br from-gray-900/50 to-black border border-gray-800/50 rounded-3xl p-10 sm:p-16 md:p-20 backdrop-blur-sm shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
                <CountdownTimer />
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col gap-4 items-center justify-center pt-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="max-w-md w-full">
                <EmailForm buttonText="Get Early Access" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full h-screen px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-linear-to-b from-gray-950 via-black to-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-40"></div>
          <div className="w-full max-w-5xl space-y-12 sm:space-y-16 relative z-10">
            <div className="space-y-4 sm:space-y-6 text-center animate-fade-in-up">
              <p className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                🚀 Features
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                Outstanding Capabilities
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              {[
                {
                  title: "Smart Note Generation",
                  description: "AI automatically extracts key concepts, creates summaries, and organizes information from any course material",
                  icon: "📝",
                  gradient: "from-blue-500/20",
                  metrics: "80% faster than manual"
                },
                {
                  title: "Gamified Learning",
                  description: "Earn XP, unlock badges, compete on leaderboards, and make studying fun and engaging for all students",
                  icon: "🎮",
                  gradient: "from-purple-500/20",
                  metrics: "3x more engagement"
                },
                {
                  title: "Adaptive Assessments",
                  description: "Personalized quizzes that adjust difficulty based on performance for optimal learning outcomes",
                  icon: "🎯",
                  gradient: "from-cyan-500/20",
                  metrics: "40% improvement in scores"
                }
              ].map((feature, i) => (
                <div key={i} className={`p-6 sm:p-8 bg-linear-to-br ${feature.gradient} to-transparent rounded-xl hover:shadow-2xl transition-all duration-300 group border border-gray-800 hover:border-blue-500/50 hover:shadow-blue-500/20`}>
                  <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
                  <h3 className="font-semibold text-white mb-2 text-lg sm:text-xl">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                  <div className="pt-4 border-t border-gray-700/50">
                    <p className="text-xs font-semibold text-blue-400">{feature.metrics}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities/Vision Section */}
        <section id="vision" className="w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-linear-to-b from-black to-gray-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl opacity-30"></div>
          <div className="w-full max-w-4xl space-y-8 sm:space-y-12 relative z-10">
            <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
              <p className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                💡 Our Vision
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                Building the Future of Learning
              </h2>
            </div>
            <div className="space-y-8 sm:space-y-10 max-w-3xl">
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                To build the world&apos;s most powerful academic intelligence platform that measurably improves learning outcomes and ensures that every student receives personalized support to reach their full potential.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 items-start group">
                  <div className="w-1 h-20 bg-linear-to-b from-blue-500 to-transparent rounded group-hover:h-24 transition-all duration-300"></div>
                  <div>
                    <h4 className="font-semibold text-white mb-2 text-lg">Empowering Through Technology</h4>
                    <p className="text-gray-400">We envision a future where AI empowers teachers, elevates student performance, and transforms schools into data-driven, outcome-focused learning environments.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start group">
                  <div className="w-1 h-20 bg-linear-to-b from-purple-500 to-transparent rounded group-hover:h-24 transition-all duration-300"></div>
                  <div>
                    <h4 className="font-semibold text-white mb-2 text-lg">For Schools Reimagining Learning</h4>
                    <p className="text-gray-400">Aedura is designed for schools and educational institutes committed to reimagining how students learn and grow.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800/50">
                <h4 className="font-semibold text-white mb-6 text-lg">Our Core Principles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-3 items-start">
                    <span className="text-blue-400 font-bold text-xl mt-0.5">→</span>
                    <div>
                      <p className="font-medium text-white text-sm">Personalization at Scale</p>
                      <p className="text-xs text-gray-500 mt-1">Every student gets a unique learning journey</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-cyan-400 font-bold text-xl mt-0.5">→</span>
                    <div>
                      <p className="font-medium text-white text-sm">Data-Driven Decisions</p>
                      <p className="text-xs text-gray-500 mt-1">Real insights for better student outcomes</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-purple-400 font-bold text-xl mt-0.5">→</span>
                    <div>
                      <p className="font-medium text-white text-sm">Teacher Empowerment</p>
                      <p className="text-xs text-gray-500 mt-1">AI handles the work, teachers guide the learning</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-green-400 font-bold text-xl mt-0.5">→</span>
                    <div>
                      <p className="font-medium text-white text-sm">Measurable Impact</p>
                      <p className="text-xs text-gray-500 mt-1">Track progress and celebrate real growth</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="text-orange-400 font-bold text-xl mt-0.5">→</span>
                    <div>
                      <p className="font-medium text-white text-sm">Inclusive Excellence</p>
                      <p className="text-xs text-gray-500 mt-1">Quality education for every student, everywhere</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tri-Stakeholder Capability Section */}
        <section id="capabilities" className="w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-linear-to-b from-gray-950 to-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-20 right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl opacity-30"></div>
          <div className="w-full max-w-6xl space-y-12 sm:space-y-16 relative z-10">
            <div className="text-center space-y-4 sm:space-y-6 animate-fade-in-up">
              <p className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                🎯 Tri-Stakeholder Capability
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                Purpose-Built for Everyone
              </h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
                Students, teachers, and schools collaborating and excelling together
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              {[
                {
                  title: "For Students",
                  icon: "👨‍🎓",
                  features: [
                    "Adaptive Learning Paths",
                    "Personalized Practice & Quizzes",
                    "AI Doubt Solving",
                    "Progress Tracking & Insights"
                  ]
                },
                {
                  title: "For Teachers",
                  icon: "👩‍🏫",
                  features: [
                    "Centralized Resource Library",
                    "Automated Grading & Assessment",
                    "Lesson Planning Tools",
                    "Class Performance Analytics"
                  ]
                },
                {
                  title: "For Schools",
                  icon: "🏫",
                  features: [
                    "School-Level Real-Time Analytics",
                    "Academic Health Tracking",
                    "Parent Engagement Dashboards",
                    "Multi-Campus Support"
                  ]
                }
              ].map((stakeholder, i) => (
                <div key={i} className="p-6 sm:p-8 bg-linear-to-br from-gray-900/50 to-black border border-gray-800/50 rounded-xl hover:border-gray-700 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl sm:text-4xl">{stakeholder.icon}</span>
                    <h3 className="font-semibold text-white text-lg sm:text-xl">{stakeholder.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {stakeholder.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-400 group-hover:text-gray-300 transition-colors">
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section id="core-features" className="w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-linear-to-b from-black to-gray-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="w-full max-w-5xl space-y-12 sm:space-y-16 relative z-10">
            <div className="text-center space-y-4 sm:space-y-6 animate-fade-in-up">
              <p className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                ⭐ Core Features
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                Purpose-Built Capabilities
              </h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
                Designed to transform student learning and school outcomes
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              {[
                {
                  title: "AI-Powered Doubt Solving",
                  description: "Instant answers with step-by-step explanations based on real school syllabus and exam standards. Students get personalized support 24/7.",
                  icon: "🤖"
                },
                {
                  title: "Smart Assessments & Question Paper Generation",
                  description: "Automatically generate personalized worksheets, practice papers, and full exams aligned to curriculum and student performance data.",
                  icon: "📋"
                },
                {
                  title: "Predictive Analytics & Performance Insights",
                  description: "Track student progress, identify weaknesses before exams, forecast results, and recommend targeted learning plans with precision.",
                  icon: "📊"
                }
              ].map((feature, i) => (
                <div key={i} className="p-6 sm:p-8 bg-linear-to-br from-gray-900/50 to-black border border-gray-800/50 rounded-xl hover:border-gray-700 transition-all duration-300 group">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span className="text-4xl sm:text-5xl shrink-0 group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg sm:text-xl mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech" className="w-full h-screen px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-linear-to-b from-gray-950 via-black to-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl opacity-40 animate-float" style={{animationDelay: '1.5s'}}></div>
          <div className="w-full space-y-12 sm:space-y-16 relative z-10">
            <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto animate-fade-in-up">
              <p className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                ⚙️ Tech Stack
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                Built with Modern Tech
              </h2>
            </div>
            
            {/* Tech Stack Marquee */}
            <div className="w-full overflow-hidden rounded-2xl py-10 sm:py-14 border border-gray-800/50 hover:border-gray-700 transition-all duration-300">
              <div className="flex gap-10 sm:gap-14 md:gap-20 animate-marquee whitespace-nowrap px-4">
                {['React', 'Next.js', 'TypeScript', 'Tailwind', 'OpenAI', 'Prisma', 'PostgreSQL', 'ChromaDB', 'AWS'].map((tech, i) => (
                  <span key={i} className="text-sm sm:text-base font-semibold text-gray-400 hover:text-blue-300 transition-colors duration-300">
                    {tech}
                  </span>
                ))}
                {['React', 'Next.js', 'TypeScript', 'Tailwind', 'OpenAI', 'Prisma', 'PostgreSQL', 'ChromaDB', 'AWS'].map((tech, i) => (
                  <span key={`repeat-${i}`} className="text-sm sm:text-base font-semibold text-gray-400 hover:text-blue-300 transition-colors duration-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contribute Section */}
        <section className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-linear-to-b from-gray-950 to-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-32 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-30 animate-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-32 right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          
          <div className="w-full max-w-5xl space-y-12 sm:space-y-16 relative z-10">
            <div className="space-y-4 sm:space-y-6 text-center animate-fade-in-up">
              <p className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                👥 Join Us
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                Be Part of the Movement
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <ContributorCard />
              <AdvisoryBoardCard />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-black text-white border-t border-gray-800 flex items-center justify-center">
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Aedura</h3>
                <p className="text-sm text-gray-400">AI study coach for the modern student.</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-400">
              <p>&copy; 2025 Aedura. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
