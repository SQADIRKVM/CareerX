'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { use, useState, useEffect, useMemo, useRef } from 'react';
import { Compass, ArrowRight, ArrowLeft, Loader2, Sparkles, AlertCircle, CheckCircle2, ChevronRight, MessageSquare, Star, SlidersHorizontal, Layers, X } from 'lucide-react';
import Link from 'next/link';

type QuestionType = 'multi_select' | 'yes_no' | 'rating' | 'slider' | 'text';
type QuestionSection = 'academic' | 'interests' | 'skills' | 'personality' | 'goals' | 'constraints';

interface GeneratedQuestion {
    id: string;
    section: QuestionSection;
    text: string;
    type: QuestionType;
    options?: string[];
    min?: number;
    max?: number;
    allowSkip: boolean;
    helpText?: string;
}

export default function QuestionnairePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
    const params = use(searchParams);
    const router = useRouter();
    const typeParam = params.type || (typeof window !== 'undefined' ? localStorage.getItem('student_type') : null) || 'general';
    const userName = typeof window !== 'undefined' ? localStorage.getItem('user_name') : 'Student';

    const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    
    // For Other/Custom text inputs on multi-select
    const [showOtherInput, setShowOtherInput] = useState<Record<string, boolean>>({});
    const [otherText, setOtherText] = useState<Record<string, string>>({});

    useEffect(() => {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const fetchQuestions = async () => {
            try {
                const res = await fetch('/api/generate-questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentType: typeParam,
                        userName: userName,
                        previousAnswers: {}
                    }),
                    signal: controller.signal
                });

                const json = await res.json();
                if (!res.ok || !json.success) throw new Error(json.error || 'Failed to generate questions');
                
                if (!controller.signal.aborted) {
                    setQuestions(json.data);
                    setIsLoading(false);
                }
            } catch (err: any) {
                if (!controller.signal.aborted) {
                    setError(err.message);
                    setIsLoading(false);
                }
            }
        };

        fetchQuestions();

        return () => {
            controller.abort();
        };
    }, [typeParam, userName]);

    const step = questions[currentStep];
    const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

    const handleSelectOption = (qId: string, option: string, isMulti: boolean) => {
        setAnswers(prev => {
            const current = (prev[qId] as string[]) || [];
            if (!isMulti) return { ...prev, [qId]: [option] };
            
            if (current.includes(option)) {
                return { ...prev, [qId]: current.filter(o => o !== option) };
            }
            return { ...prev, [qId]: [...current, option] };
        });
    };

    const handleTextAnswer = (qId: string, text: string) => {
        setAnswers(prev => ({ ...prev, [qId]: text }));
    };

    const handleSliderAnswer = (qId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const toggleOther = (qId: string) => {
        setShowOtherInput(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    const isValid = () => {
        if (!step) return false;
        if (step.allowSkip) return true;

        const val = answers[step.id];
        
        switch (step.type) {
            case 'multi_select':
                const hasSelectedOptions = Array.isArray(val) && val.length > 0;
                const hasOther = showOtherInput[step.id] && (otherText[step.id] || '').trim().length > 0;
                return hasSelectedOptions || hasOther;
            case 'yes_no':
                return Array.isArray(val) && val.length > 0;
            case 'text':
                return typeof val === 'string' && val.trim().length > 0;
            case 'rating':
            case 'slider':
                return typeof val === 'number';
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            // Finalize mapping for RAG Dashboard
            const finalAnswers: Record<string, string> = {};
            
            questions.forEach(q => {
                let ansString = '';
                const val = answers[q.id];
                
                if (q.type === 'multi_select') {
                    const sel = Array.isArray(val) ? val : [];
                    const ot = showOtherInput[q.id] ? (otherText[q.id] || '').trim() : '';
                    ansString = [...sel, ...(ot ? [ot] : [])].join(', ');
                } else if (q.type === 'yes_no') {
                    ansString = Array.isArray(val) ? val.join(', ') : String(val || '');
                } else {
                    ansString = String(val || '');
                }

                if (!ansString.trim() && q.allowSkip) {
                    ansString = 'Skipped / Not specified';
                }
                
                finalAnswers[q.text] = ansString;
            });

            finalAnswers._role = typeParam;
            const onboardingType = localStorage.getItem('student_type') ?? typeParam;
            finalAnswers._currentEducationLevel = onboardingType;

            localStorage.setItem('questionnaire_answers', JSON.stringify(finalAnswers));
            router.push('/dashboard');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(s => s - 1);
        else router.push('/onboarding');
    };

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        router.push('/onboarding');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing your profile...</h2>
                <p className="text-slate-500 font-medium">Generating highly personalized questions for you.</p>
                <button 
                    onClick={handleStop}
                    className="mt-10 px-8 py-3 rounded-2xl border-2 border-rose-200 text-rose-600 font-bold text-sm bg-white hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center gap-2 active:scale-95"
                >
                    <X className="w-4 h-4" /> Stop Generation
                </button>
            </div>
        );
    }

    if (error || !questions.length) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-6" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Oops, something went wrong</h2>
                <p className="text-slate-500 mb-8">{error || "Couldn't generate questions."}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 pb-36">
            {/* Header */}
            <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
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
                    Step {currentStep + 1} of {questions.length}
                </div>
            </header>

            {/* Progress */}
            <div className="w-full h-0.5 bg-slate-200">
                <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} className="h-full bg-indigo-600" />
            </div>

            {/* Role Context */}
            <div className="flex justify-center pt-8 mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-500">
                        Profile: <span className="text-slate-900 font-bold">{typeParam}</span>
                    </span>
                </div>
            </div>

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-4 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="w-full"
                    >
                        {/* Question Title Layer */}
                        <div className="mb-10 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
                                {step.section.replace('_', ' ')}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3">
                                {step.text}
                            </h1>
                            {step.helpText && (
                                <p className="text-slate-500 font-medium text-lg border-l-2 border-indigo-200 pl-4 py-1">
                                    {step.helpText}
                                </p>
                            )}
                        </div>

                        {/* Rendering Switch */}
                        <div className="w-full mt-8">
                            
                            {/* MULTI_SELECT or YES_NO */}
                            {(step.type === 'multi_select' || step.type === 'yes_no') && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {/* Default Yes/No options if not provided by Ai but type is yes_no */}
                                    {(step.options || (step.type === 'yes_no' ? ['Yes', 'No'] : [])).map((opt) => {
                                        const isSelected = (answers[step.id] as string[] || []).includes(opt);
                                        const isMulti = step.type === 'multi_select';
                                        return (
                                            <button
                                                key={opt}
                                                onClick={() => handleSelectOption(step.id, opt, isMulti)}
                                                className={`relative flex items-center p-5 rounded-2xl border-2 transition-all text-left
                                                    ${isSelected 
                                                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600/20' 
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-md mr-4 shrink-0 flex items-center justify-center transition-colors border
                                                    ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 text-transparent'}`}>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <span className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                    {opt}
                                                </span>
                                            </button>
                                        )
                                    })}

                                    {/* OTHER / CUSTOM Option for Multi-Select */}
                                    {step.type === 'multi_select' && (
                                        <button 
                                            onClick={() => toggleOther(step.id)}
                                            className={`relative flex items-center p-5 rounded-2xl border-2 border-dashed transition-all text-left
                                                ${showOtherInput[step.id] ? 'border-indigo-400 bg-indigo-50 shadow-sm' : 'border-slate-300 bg-white hover:border-indigo-300 hover:bg-slate-50'}`}
                                        >
                                            <div className="w-6 h-6 rounded-md mr-4 shrink-0 flex items-center justify-center bg-slate-100 text-slate-500">
                                                <MessageSquare className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-slate-700">Other / Custom</span>
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* RATING */}
                            {step.type === 'rating' && (
                                <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleSliderAnswer(step.id, num)}
                                            className={`w-16 h-16 flex items-center justify-center rounded-2xl border-2 font-bold text-xl transition-all
                                                ${answers[step.id] === num 
                                                    ? 'border-indigo-600 bg-indigo-600 text-white hover:scale-105 shadow-md shadow-indigo-200' 
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:scale-105'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* SLIDER */}
                            {step.type === 'slider' && (
                                <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 py-10 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-600 opacity-20" />
                                    
                                    <div className="flex items-center justify-between font-bold text-slate-500 text-sm mb-6">
                                        <span>{step.min ?? 0}</span>
                                        <span className="text-indigo-600 text-3xl">{answers[step.id] ?? (step.min ?? 0)}</span>
                                        <span>{step.max ?? 100}</span>
                                    </div>
                                    
                                    <input 
                                        type="range" 
                                        min={step.min ?? 0} 
                                        max={step.max ?? 100} 
                                        value={answers[step.id] ?? (step.min ?? 0)} 
                                        onChange={(e) => handleSliderAnswer(step.id, Number(e.target.value))}
                                        className="w-full appearance-none h-3 bg-slate-100 rounded-full outline-none accent-indigo-600 slider-thumb-premium" 
                                    />
                                    
                                    {/* Inline CSS just for this unique slider thumb to look premium */}
                                    <style jsx>{`
                                        input[type=range].slider-thumb-premium::-webkit-slider-thumb {
                                            appearance: none;
                                            width: 28px;
                                            height: 28px;
                                            background: #fff;
                                            border: 3px solid #4f46e5;
                                            border-radius: 50%;
                                            cursor: pointer;
                                            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
                                            transition: transform 0.1s;
                                        }
                                        input[type=range].slider-thumb-premium::-webkit-slider-thumb:hover {
                                            transform: scale(1.15);
                                        }
                                    `}</style>
                                </div>
                            )}

                            {/* TEXT / TEXTAREA */}
                            {(step.type === 'text' || (step.type === 'multi_select' && showOtherInput[step.id])) && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    className="pt-4"
                                >
                                    <textarea
                                        autoFocus
                                        value={step.type === 'text' ? (answers[step.id] || '') : (otherText[step.id] || '')}
                                        onChange={(e) => {
                                            if (step.type === 'text') handleTextAnswer(step.id, e.target.value);
                                            else setOtherText(prev => ({ ...prev, [step.id]: e.target.value }));
                                        }}
                                        placeholder="Type your answer here in your own words..."
                                        rows={4}
                                        className="w-full text-lg font-medium text-slate-900 placeholder:text-slate-400 bg-white border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 rounded-2xl p-5 transition-all outline-none resize-none"
                                    />
                                </motion.div>
                            )}

                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Nav Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 py-4 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={handleBack} className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    
                    <div className="flex gap-2 isolate hidden sm:flex">
                        {questions.map((_, i) => (
                            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-indigo-600' : i < currentStep ? 'w-3 bg-indigo-300' : 'w-3 bg-slate-200'}`} />
                        ))}
                    </div>

                    <button onClick={handleNext} disabled={!isValid()}
                        className="flex items-center gap-2 px-7 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:translate-y-0">
                        {currentStep === questions.length - 1 ? 'Analyze Trajectory' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
