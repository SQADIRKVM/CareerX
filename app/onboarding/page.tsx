'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Compass, ArrowRight, ArrowLeft, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

const DEGREE_LEVELS = [
    "High school / GED equivalent",
    "Associate's degree",
    "Bachelor's degree",
    "Master's degree",
    "Doctorate or professional degree",
    "Professional certificate",
    "Vocational / technical certificate",
    "Other",
];

const STUDENT_KEYWORDS = ['student', 'learner', 'school', 'university', 'college', 'studying', 'undergrad', 'grad', 'pupil'];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<'name' | 'role' | 'location'>('name');
    const [name, setName] = useState('');
    const [roleInput, setRoleInput] = useState('');
    const [manualLocation, setManualLocation] = useState('');
    const [isStudentContext, setIsStudentContext] = useState(false);
    const [studentLevel, setStudentLevel] = useState('');
    const [subjectArea, setSubjectArea] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const roleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const isStudent = STUDENT_KEYWORDS.some(kw => roleInput.toLowerCase().includes(kw));
        setIsStudentContext(isStudent);
        if (!isStudent) { setStudentLevel(''); setSubjectArea(''); }
    }, [roleInput]);

    const handleNameSubmit = () => {
        if (name.trim()) {
            localStorage.setItem('user_name', name.trim());
            setStep('role');
            setTimeout(() => roleRef.current?.focus(), 400);
        }
    };

    const fetchLocation = async (): Promise<boolean> => {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const d = await res.json();
            if (d.country_name) {
                localStorage.setItem('user_location', `${d.city ? d.city + ', ' : ''}${d.country_name}`);
                localStorage.setItem('user_currency', d.currency || 'USD');
                return true;
            }
            return false;
        } catch { 
            return false;
        }
    };

    const handleContinue = async () => {
        if (!isValidRole()) return;
        let finalType = roleInput.trim();
        if (isStudentContext) {
            finalType = `Student — ${studentLevel || 'General'}, ${subjectArea || 'Undeclared'}`;
        }
        setIsLocating(true);
        const hasLocation = await fetchLocation();
        setIsLocating(false);
        
        if (!hasLocation) {
            setStep('location');
            return;
        }

        localStorage.setItem('student_type', finalType);
        router.push(`/questionnaire?type=${encodeURIComponent(finalType)}`);
    };

    const handleManualLocationSubmit = () => {
        if (!manualLocation.trim()) return;
        localStorage.setItem('user_location', manualLocation.trim());
        localStorage.setItem('user_currency', 'USD'); // default fallback
        
        let finalType = roleInput.trim();
        if (isStudentContext) {
            finalType = `Student — ${studentLevel || 'General'}, ${subjectArea || 'Undeclared'}`;
        }
        localStorage.setItem('student_type', finalType);
        router.push(`/questionnaire?type=${encodeURIComponent(finalType)}`);
    };

    const isValidRole = () => {
        if (!roleInput.trim()) return false;
        if (isStudentContext) return studentLevel.length > 0 && subjectArea.trim().length > 0;
        return true;
    };

    const progress = step === 'name' ? 33 : step === 'role' ? 66 : 100;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100">

            {/* Nav — matches landing page exactly */}
            <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-12">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shadow-indigo-200 shadow-sm transition-transform group-hover:rotate-6">
                                <Compass className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">CareerX</span>
                        </Link>
                        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
                        <button onClick={() => router.back()} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    </div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Step {step === 'name' ? '1' : step === 'role' ? '2' : '3'} of 3
                    </div>
                </nav>
            </header>

            {/* Progress bar */}
            <div className="w-full h-0.5 bg-slate-200">
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-indigo-600"
                />
            </div>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <AnimatePresence mode="wait">
                    {step === 'name' ? (
                        <motion.div
                            key="name"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full max-w-xl"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 mb-8 text-xs font-semibold text-indigo-700 uppercase tracking-widest shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                Getting started
                            </div>

                            <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.1]">
                                What's your name?
                            </h1>
                            <p className="text-slate-500 font-medium mb-10">
                                We'll personalise everything just for you.
                            </p>

                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                                placeholder="e.g. Haris Ahmed"
                                autoFocus
                                className="w-full text-2xl font-medium text-slate-900 placeholder:text-slate-300 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none py-3 transition-colors mb-3"
                            />
                            <p className="text-sm text-slate-400 mb-12">Press Enter or click Continue</p>

                            <motion.div animate={{ opacity: name.trim() ? 1 : 0 }}>
                                <button
                                    onClick={handleNameSubmit}
                                    disabled={!name.trim()}
                                    className="h-14 px-8 rounded-full text-base font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-0.5 inline-flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0"
                                >
                                    Continue <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        </motion.div>

                    ) : step === 'role' ? (
                        <motion.div
                            key="role"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full max-w-xl"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 mb-8 text-xs font-semibold text-indigo-700 uppercase tracking-widest shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                Your profile
                            </div>

                            <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.1]">
                                Hi {name}, what's your current role?
                            </h1>
                            <p className="text-slate-500 font-medium mb-10">
                                Share your current or most recent position — or type <span className="text-indigo-600 font-semibold">"student"</span> if you're studying.
                            </p>

                            {/* Role input */}
                            <input
                                ref={roleRef}
                                type="text"
                                value={roleInput}
                                onChange={e => setRoleInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && isValidRole() && !isLocating && handleContinue()}
                                placeholder="e.g. Founder, Software Engineer, student..."
                                className="w-full text-lg font-medium text-slate-900 placeholder:text-slate-300 bg-white border-2 border-slate-200 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-50 px-5 py-4 rounded-2xl transition-all mb-4"
                            />

                            {/* Student extra fields */}
                            <AnimatePresence>
                                {isStudentContext && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                        className="overflow-hidden space-y-3 mb-4"
                                    >
                                        {/* Level dropdown */}
                                        <div className="relative">
                                            <select
                                                value={studentLevel}
                                                onChange={e => setStudentLevel(e.target.value)}
                                                className="w-full appearance-none bg-white border-2 border-slate-200 focus:border-indigo-600 text-slate-900 font-medium px-5 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer"
                                            >
                                                <option value="" disabled>Select your education level...</option>
                                                {DEGREE_LEVELS.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        </div>

                                        {/* Subject */}
                                        <input
                                            type="text"
                                            value={subjectArea}
                                            onChange={e => setSubjectArea(e.target.value)}
                                            placeholder="What field do you study? (e.g. Computer Science)"
                                            className="w-full text-base font-medium text-slate-900 placeholder:text-slate-400 bg-white border-2 border-slate-200 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-50 px-5 py-4 rounded-2xl transition-all"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={() => setStep('name')}
                                    className="px-6 py-3 rounded-full text-slate-600 font-semibold hover:bg-slate-100 transition-colors text-sm"
                                >
                                    ← Back
                                </button>

                                <motion.div animate={{ opacity: isValidRole() ? 1 : 0.3 }}>
                                    <button
                                        onClick={handleContinue}
                                        disabled={!isValidRole() || isLocating}
                                        className="h-14 px-8 rounded-full text-base font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-0.5 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                                    >
                                        {isLocating ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Locating...</>
                                        ) : (
                                            <>Continue <ArrowRight className="w-5 h-5" /></>
                                        )}
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : step === 'location' ? (
                        <motion.div
                            key="location"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full max-w-xl"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-100 bg-rose-50/50 mb-8 text-xs font-semibold text-rose-700 uppercase tracking-widest shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                                Location Check
                            </div>

                            <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.1]">
                                Where are you located?
                            </h1>
                            <p className="text-slate-500 font-medium mb-10">
                                We couldn't fetch your location automatically. We need this to find local salaries, universities, and job trends!
                            </p>

                            <input
                                type="text"
                                value={manualLocation}
                                onChange={e => setManualLocation(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleManualLocationSubmit()}
                                placeholder="e.g. London, UK or New York"
                                autoFocus
                                className="w-full text-2xl font-medium text-slate-900 placeholder:text-slate-300 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none py-3 transition-colors mb-3"
                            />
                            <p className="text-sm text-slate-400 mb-12">Press Enter or click Finish</p>

                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={() => setStep('role')}
                                    className="px-6 py-3 rounded-full text-slate-600 font-semibold hover:bg-slate-100 transition-colors text-sm"
                                >
                                    ← Back
                                </button>

                                <motion.div animate={{ opacity: manualLocation.trim() ? 1 : 0.3 }}>
                                    <button
                                        onClick={handleManualLocationSubmit}
                                        disabled={!manualLocation.trim()}
                                        className="h-14 px-8 rounded-full text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-0.5 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                                    >
                                        Finish <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </main>
        </div>
    );
}
