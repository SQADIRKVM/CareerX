'use client';

import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Compass, Database, Zap, ShieldCheck, Cpu, 
  Search, Globe, Network, Github, Twitter, Linkedin, Mail, PlayCircle, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#0A0A0A] text-zinc-50 font-sans selection:bg-indigo-500/30 selection:text-white overflow-hidden">
      
      {/* Subtle Premium Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 rounded-full blur-[120px]" />
        {/* Very subtle grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.015] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Minimalist Header */}
        <header className="w-full border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
                <Compass className="w-4 h-4 text-zinc-100" />
              </div>
              <span className="text-xl font-semibold tracking-tight">CareerX</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {['Methodology', 'Platform', 'Security'].map((item) => (
                <Link key={item} href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href="/dashboard" onClick={() => localStorage.removeItem('questionnaire_answers')} className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/onboarding">
                <Button className="bg-white hover:bg-zinc-200 text-black rounded-full px-6 h-10 transition-all font-medium text-sm">
                  Start Assessment
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section: Clean & Authoritative */}
        <section className="relative pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
          <div className="max-w-4xl mx-auto text-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8 text-xs font-medium text-zinc-300 backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
              Career Intelligence Framework v1.0
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-8 text-white leading-[1.05]"
            >
              Architect your future with <span className="text-zinc-500">precision.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-normal leading-relaxed"
            >
              A high-fidelity platform that cross-references your academic profile with real-time industry demands to generate personalized, data-backed career roadmaps.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center flex-col sm:flex-row gap-4"
            >
              <Link href="/onboarding">
                <Button className="h-12 px-8 rounded-full font-medium bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                  Begin Exploration
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard" onClick={() => localStorage.removeItem('questionnaire_answers')}>
                <Button variant="outline" className="h-12 px-8 rounded-full font-medium border-white/10 text-white bg-transparent hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <PlayCircle className="w-4 h-4 text-zinc-400" />
                  View Demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 px-6 md:px-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">Platform Infrastructure</h2>
              <p className="text-zinc-400 max-w-xl text-lg">Designed for accuracy, eliminating hallucination through real-time search synthesis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="col-span-1 md:col-span-2 p-10 rounded-[2rem] bg-zinc-900/50 border border-white/5 flex flex-col justify-between overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Network className="w-48 h-48 text-indigo-500" />
                </div>
                <div className="relative z-10 max-w-md">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-8 border border-white/10">
                    <Globe className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Live Decentralized Synthesis</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    We aggregate data across 100+ decentralized search instances simultaneously, providing you with uncensored, up-to-the-minute market intelligence and salary data.
                  </p>
                </div>
              </motion.div>

              {/* Standard Card 1 */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="col-span-1 p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 flex flex-col"
              >
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  <Cpu className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Adaptive Intelligence</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Dynamic questionnaires that evolve in real-time based on your previous answers to build a high-fidelity profile.
                </p>
              </motion.div>

              {/* Standard Card 2 */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="col-span-1 p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 flex flex-col"
              >
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Schema Validated</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Strictly enforced JSON constraints ensure that every roadmap is structured, logical, and reliably formatted.
                </p>
              </motion.div>

              {/* Wide Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="col-span-1 md:col-span-2 p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 flex flex-col md:flex-row items-center gap-8"
              >
                <div className="flex-1">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                    <Database className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Stateless Architecture</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Zero persistent server-side storage. Your session data remains client-side, ensuring absolute privacy and data ownership.
                  </p>
                </div>
                <div className="w-full md:w-1/3 aspect-video bg-black rounded-xl border border-white/10 flex items-center justify-center">
                   <span className="text-xs font-mono text-zinc-600">sessionStorage.clear()</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Execution Flow */}
        <section className="py-24 px-6 md:px-12 border-t border-white/5 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight mb-8">The Assessment Pipeline</h2>
                <div className="space-y-10">
                  {[
                    { num: '01', title: 'Data Ingestion', desc: 'Provide your academic background, core interests, and geographical constraints.' },
                    { num: '02', title: 'Contextual Web Retrieval', desc: 'The system fetches live university requirements and industry demands tailored to your profile.' },
                    { num: '03', title: 'Roadmap Synthesis', desc: 'Receive a personalized dashboard featuring skill gap analysis, job deep-links, and verifiable citations.' },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-6 group">
                      <div className="text-sm font-mono text-zinc-600 mt-1">{step.num}</div>
                      <div>
                        <h4 className="text-lg font-semibold text-zinc-100 mb-2">{step.title}</h4>
                        <p className="text-zinc-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/5 bg-zinc-900/30 p-8 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                <div className="space-y-4 font-mono text-xs text-zinc-400">
                  <div className="flex justify-between items-center p-3 rounded bg-black/50 border border-white/5">
                    <span>Initiating Search Protocol...</span>
                    <span className="text-indigo-400">OK</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded bg-black/50 border border-white/5">
                    <span>Scraping 10 authoritative sources...</span>
                    <span className="text-indigo-400">OK</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded bg-black/50 border border-white/5">
                    <span>Aggregating salary data for Entry-Level...</span>
                    <span className="text-indigo-400">OK</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded bg-black/50 border border-white/5">
                    <span>Generating Zod-validated schema...</span>
                    <span className="text-indigo-400">OK</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    <span>Dashboard synthesis complete.</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 md:px-12 relative overflow-hidden flex justify-center border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20 pointer-events-none" />
          <div className="max-w-3xl text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">Ready to map your trajectory?</h2>
            <p className="text-zinc-400 text-lg mb-10">Stop guessing. Start building your professional future with verifiable, data-backed intelligence.</p>
            <Link href="/onboarding">
              <Button className="h-14 px-10 rounded-full font-medium bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mx-auto">
                Begin Assessment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="py-12 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium text-zinc-500">CareerX Framework</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
