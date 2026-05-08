"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const posts = [
  {
    slug: "how-to-switch-careers-without-starting-over",
    badge: "Career Pivots",
    badgeColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    title: "How to Switch Careers Without Starting Over",
    excerpt:
      "Thinking about changing careers but terrified of losing everything you've built? Here's how to transfer your existing skills into a completely new field — without going back to square one.",
    date: "May 8, 2026",
    readTime: "6 min read",
    gradient: "from-indigo-500/10 to-violet-500/10",
  },
  {
    slug: "beat-the-ats-resume-tips-that-actually-work",
    badge: "Resume Tips",
    badgeColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    title: "Beat the ATS: Resume Tips That Actually Work in 2026",
    excerpt:
      "Most resumes never reach a human being. They get filtered out by an Applicant Tracking System before anyone sees them. Here's exactly how to write a resume that passes ATS checks and lands interviews.",
    date: "May 7, 2026",
    readTime: "8 min read",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    slug: "build-a-self-guided-learning-roadmap",
    badge: "Learning Paths",
    badgeColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    title: "How to Build Your Own Learning Roadmap for High-Growth Tech Careers",
    excerpt:
      "You don't need a degree from a top university to break into tech in 2026. What you need is a clear, structured self-guided roadmap — and the discipline to follow it. Here's how to build one from scratch.",
    date: "May 6, 2026",
    readTime: "7 min read",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-200 dark:selection:bg-emerald-500/25 antialiased overflow-hidden">
      {/* Background Gradients */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 10%, #4f46e5 0, transparent 40%), radial-gradient(circle at 20% 80%, #10b981 0, transparent 40%)",
        }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/92 dark:bg-[#080808]/92 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="/banner.png"
              alt="Forfwd"
              className="h-15 w-auto object-contain block dark:hidden transition-transform group-hover:scale-[1.02]"
            />
            <img
              src="/banner-dark.png"
              alt="Forfwd"
              className="h-15 w-auto object-contain hidden dark:block transition-transform group-hover:scale-[1.02]"
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-500 dark:text-zinc-400 transition-colors hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1000px] px-6 py-16 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-6 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Career Intelligence Blog
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Real Advice for Real Careers
            </h1>
            <p className="text-slate-600 dark:text-zinc-400 text-base md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
              Practical, honest, and actionable guides to help you move forward — whether you're
              changing careers, optimizing your resume, or building skills that actually matter in
              today's job market.
            </p>
          </div>

          {/* Blog Cards */}
          <div className="grid gap-8 md:grid-cols-1">
            {posts.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border ${post.badgeColor}`}
                      >
                        {post.badge}
                      </span>
                      <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {post.readTime}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm md:text-base font-normal leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      Read Article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
