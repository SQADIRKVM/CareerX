'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Trash2, ExternalLink, Calendar, BookOpen, 
    Video, Sparkles, CheckCircle2, AlertCircle, Clock 
} from 'lucide-react';
import { 
    getTrackedCoursesAction, addCourseAction, 
    updateCourseProgressAction, deleteCourseAction 
} from '@/app/actions/trackedCourse';

interface Course {
    id: string;
    title: string;
    platform: string;
    url: string | null;
    progress: number;
    notes: string | null;
    reminderAt: string | null;
}

export function LearningHub() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form states
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('youtube');
    const [url, setUrl] = useState('');
    const [reminderAt, setReminderAt] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const data = await getTrackedCoursesAction();
                setCourses(data as Course[]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    // Helper to extract YouTube video/playlist ID and get embed URL
    function getYouTubeEmbedUrl(urlStr: string | null): string | null {
        if (!urlStr) return null;
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = urlStr.match(regExp);
            if (match && match[2].length === 11) {
                return `https://www.youtube.com/embed/${match[2]}`;
            }
            const playlistReg = /[&?]list=([^&]+)/;
            const playlistMatch = urlStr.match(playlistReg);
            if (playlistMatch) {
                return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}`;
            }
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Course title is required');
            return;
        }
        setSubmitting(true);
        setError('');

        try {
            const res = await addCourseAction(title, platform, url, reminderAt);
            if (res.success && res.course) {
                setCourses([res.course as Course, ...courses]);
                setTitle('');
                setUrl('');
                setReminderAt('');
            } else {
                setError(res.error || 'Failed to add course');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateProgress = async (id: string, newProgress: number) => {
        const clamped = Math.max(0, Math.min(100, newProgress));
        setCourses(courses.map(c => c.id === id ? { ...c, progress: clamped } : c));
        try {
            await updateCourseProgressAction(id, clamped);
        } catch (err) {
            console.error(err);
        }
    };

    const confirmDelete = async () => {
        if (!courseToDelete) return;
        const id = courseToDelete;
        setCourses(courses.filter(c => c.id !== id));
        setCourseToDelete(null);
        try {
            await deleteCourseAction(id);
        } catch (err) {
            console.error(err);
        }
    };

    const avgProgress = courses.length > 0 
        ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) 
        : 0;

    const completedCount = courses.filter(c => c.progress === 100).length;

    return (
        <div className="space-y-10">
            {/* Stats Header Grid */}
            <div className="grid sm:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Total Tracked Courses</p>
                    <p className="text-3xl font-black text-slate-800 dark:text-white">{courses.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Average Progress</p>
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-black text-indigo-500 dark:text-indigo-400">{avgProgress}%</p>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${avgProgress}%` }} />
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Completed Courses</p>
                    <p className="text-3xl font-black text-emerald-500 dark:text-emerald-400">{completedCount}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Form to Add Course */}
                <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-6 shadow-sm h-fit">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Track New Course</h3>
                    </div>

                    <form onSubmit={handleAddCourse} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Course Title</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Masterclass in Python or YouTube Playlist"
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/35 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Platform</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'youtube', label: 'YouTube' },
                                    { id: 'udemy', label: 'Udemy' },
                                    { id: 'coursera', label: 'Coursera' },
                                    { id: 'other', label: 'Other/Custom' },
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setPlatform(p.id)}
                                        className={`h-10 text-xs font-bold rounded-lg border transition-all ${
                                            platform === p.id
                                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                : 'border-slate-200 dark:border-white/5 bg-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Course or Playlist URL</label>
                            <input 
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/35 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Study Reminder Schedule</label>
                            <input 
                                type="text"
                                value={reminderAt}
                                onChange={(e) => setReminderAt(e.target.value)}
                                placeholder="e.g. Saturdays at 10:00 AM"
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/35 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            {submitting ? 'Adding...' : 'Add Course Tracker'}
                        </button>
                    </form>
                </div>

                {/* Courses Progress list */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-zinc-400 text-sm font-semibold">Loading courses...</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center">
                            <BookOpen className="w-10 h-10 text-slate-400 dark:text-zinc-600 mb-4" />
                            <h4 className="text-base font-bold text-slate-700 dark:text-zinc-300 mb-1">No Tracked Courses Yet</h4>
                            <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-sm">Start tracking your Udemy, Coursera, or YouTube playlist progress to keep your educational roadmap active!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence>
                                {courses.map((course) => {
                                    const embedUrl = getYouTubeEmbedUrl(course.url);
                                    return (
                                        <motion.div
                                            key={course.id}
                                            layout
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -15 }}
                                            className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-6 shadow-sm space-y-6"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2.5 mb-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            course.platform === 'youtube'
                                                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                                                : course.platform === 'udemy'
                                                                ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                                                : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                                                        }`}>
                                                            {course.platform}
                                                        </span>
                                                        {course.reminderAt && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                                                                <Clock className="w-3 h-3" />
                                                                {course.reminderAt}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-2">{course.title}</h4>
                                                </div>
                                                <button
                                                    onClick={() => setCourseToDelete(course.id)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* YouTube Embed Player integration if available */}
                                            {embedUrl && (
                                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-white/10">
                                                    <iframe 
                                                        src={embedUrl} 
                                                        title={course.title}
                                                        className="w-full h-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            )}

                                            {/* Progress slider tracking */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-slate-500 dark:text-zinc-400">Progress Tracker</span>
                                                    <span className="font-black text-indigo-600 dark:text-indigo-400">{course.progress}%</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <input 
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={course.progress}
                                                        onChange={(e) => handleUpdateProgress(course.id, parseInt(e.target.value))}
                                                        className="flex-1 h-2 bg-slate-100 dark:bg-black/35 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                    />
                                                    <div className="flex gap-1.5">
                                                        <button 
                                                            onClick={() => handleUpdateProgress(course.id, course.progress - 10)}
                                                            className="h-7 w-7 rounded-md border border-slate-200 dark:border-white/5 text-xs font-black text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                                                        >
                                                            -10
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateProgress(course.id, course.progress + 10)}
                                                            className="h-7 w-7 rounded-md border border-slate-200 dark:border-white/5 text-xs font-black text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                                                        >
                                                            +10
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateProgress(course.id, 100)}
                                                            className="h-7 px-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                                                        >
                                                            Complete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {course.url && (
                                                <a 
                                                    href={course.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Go to Course Website
                                                </a>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Premium Delete Confirmation Dialog */}
            <AnimatePresence>
                {courseToDelete && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        {/* Backdrop overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCourseToDelete(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        
                        {/* Dialog Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] p-6 shadow-2xl space-y-6"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            
                            <div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-white">Delete Course Tracker?</h3>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                                    Are you sure you want to delete this course? This action will permanently delete all your tracked study progress and schedules.
                                </p>
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setCourseToDelete(null)}
                                    className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-white/5 bg-transparent text-slate-600 dark:text-zinc-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/10 cursor-pointer transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
