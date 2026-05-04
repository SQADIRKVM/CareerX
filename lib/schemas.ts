import { z } from 'zod';

// ============================================
// ONBOARDING & QUESTIONNAIRE SCHEMAS
// ============================================

export const StudentTypeSchema = z.enum(['plus_two', 'degree', 'graduate']);
export const QuestionTypeSchema = z.enum(['slider', 'multi_select', 'text', 'rating', 'yes_no']);

export const QuestionSchema = z.object({
    id: z.string(),
    section: z.enum(['academic', 'interests', 'skills', 'personality', 'goals', 'constraints']),
    text: z.string(),
    type: QuestionTypeSchema,
    options: z.array(z.string()).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    allowSkip: z.boolean().default(true),
    helpText: z.string().optional(),
});

export const QuestionnaireProgressSchema = z.object({
    studentType: StudentTypeSchema,
    currentSection: z.string(),
    completedSections: z.array(z.string()),
    progress: z.number().min(0).max(100),
    answers: z.record(z.string(), z.any()),
});

// ============================================
// DASHBOARD DATA SCHEMAS (enriched)
// ============================================

// Source citation (shown inline throughout the dashboard)
export const SourceSchema = z.object({
    id: z.string(),
    title: z.string(),
    url: z.string(),
    domain: z.string().optional().describe("e.g. 'naukri.com', 'reddit.com'"),
    snippet: z.string().optional(),
});

// Career pathway — now with source refs and a context-aware label
export const CareerPathwaySchema = z.object({
    title: z.string(),
    category: z.string().optional().describe("e.g. 'Startup', 'Research', 'Government', 'Creative'"),
    reasoning: z.string().describe("Why this fits the user"),
    matchPercentage: z.number().min(0).max(100),
    salaryRange: z.string(),
    marketDemand: z.string(),
    requiredSkills: z.array(z.string()),
    sourceIds: z.array(z.string()).optional().describe("IDs of sources backing this data"),
});

// Degree with course/application links
export const DegreeSchema = z.object({
    level: z.enum(['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate', 'Bootcamp', 'Fellowship']),
    field: z.string(),
    duration: z.string(),
    description: z.string(),
    applyUrl: z.string().optional().describe("Direct URL to the program page or application"),
});

// Certification with platform link
export const CertificationSchema = z.object({
    name: z.string(),
    provider: z.string(),
    relevance: z.string(),
    courseUrl: z.string().optional().describe("Direct link to the course on Coursera, Udemy, etc."),
    estimatedHours: z.string().optional(),
    cost: z.string().optional(),
});

export const EducationPathwaySchema = z.object({
    degrees: z.array(DegreeSchema),
    certifications: z.array(CertificationSchema),
});

// University with official site link
export const UniversitySchema = z.object({
    name: z.string(),
    location: z.string(),
    ranking: z.string().optional(),
    averageFees: z.string(),
    topPrograms: z.array(z.string()),
    websiteUrl: z.string().optional().describe("Official university or program URL"),
    applicationDeadline: z.string().optional(),
    scholarshipAvailable: z.boolean().optional(),
});

// Job with portal deep-link
export const JobMappingSchema = z.object({
    role: z.string(),
    relatedDegree: z.string(),
    entrySalary: z.string(),
    growthPath: z.string(),
    demandTrend: z.enum(['rising', 'stable', 'declining']),
    skillsRequired: z.array(z.string()),
    // Deep links to job portals (pre-filled search URLs)
    jobPortalLinks: z.array(z.object({
        portal: z.string().describe("e.g. 'LinkedIn', 'Naukri', 'Indeed', 'Glassdoor'"),
        url: z.string().describe("Pre-filled search URL for this role"),
    })).optional(),
    averageOpenings: z.string().optional().describe("e.g. '2,400 openings on Naukri as of 2026'"),
});

// Skill gap with milestone details
export const RoadmapMilestoneSchema = z.object({
    year: z.string(),
    title: z.string(),
    focusAreas: z.array(z.string()),
    milestones: z.array(z.string()),
    resourceLinks: z.array(z.object({
        label: z.string(),
        url: z.string(),
    })).optional().describe("Links to free/paid resources for this milestone"),
});

export const SkillGapSchema = z.object({
    currentSkills: z.array(z.string()),
    neededSkills: z.array(z.string()),
    roadmap: z.array(RoadmapMilestoneSchema),
});

// Social review (Reddit, LinkedIn, etc.)
export const SocialReviewSchema = z.object({
    source: z.string(),
    author: z.string().optional(),
    sentiment: z.enum(['positive', 'negative', 'neutral', 'mixed']),
    content: z.string(),
    url: z.string().optional(),
    relatedTopic: z.string(),
});

// ============================================
// PERSONA-SPECIFIC SECTION SCHEMAS
// ============================================

// For founders: startup ecosystem info
export const StartupResourceSchema = z.object({
    name: z.string().describe("e.g. 'Y Combinator', 'T-Hub Hyderabad'"),
    type: z.enum(['Accelerator', 'Incubator', 'VC Fund', 'Grant', 'Community', 'Event']),
    location: z.string(),
    description: z.string(),
    url: z.string().optional(),
    applicationOpen: z.boolean().optional(),
});

// For parents: scholarship opportunities
export const ScholarshipSchema = z.object({
    name: z.string(),
    provider: z.string(),
    amount: z.string(),
    eligibility: z.string(),
    deadline: z.string().optional(),
    url: z.string().optional(),
});

// For healthcare / legal / creative: professional bodies
export const ProfessionalBodySchema = z.object({
    name: z.string(),
    country: z.string(),
    description: z.string(),
    membershipUrl: z.string().optional(),
});

// ============================================
// COMPLETE DASHBOARD RESPONSE
// ============================================

export const DashboardDataSchema = z.object({
    // Profile
    profileSummary: z.string(),
    userCategory: z.string().optional().describe("Detected category: student, founder, faculty, etc."),

    // Core sections (used by most personas)
    careerPathways: z.array(CareerPathwaySchema),
    education: EducationPathwaySchema,
    topUniversities: z.array(UniversitySchema),
    jobs: z.array(JobMappingSchema),
    skillGaps: SkillGapSchema,

    // Extended persona-specific sections (optional — only populated if relevant)
    startupResources: z.array(StartupResourceSchema).optional()
        .describe("Populated for founders/entrepreneurs"),
    scholarships: z.array(ScholarshipSchema).optional()
        .describe("Populated for students and parents"),
    professionalBodies: z.array(ProfessionalBodySchema).optional()
        .describe("Populated for healthcare, legal, faculty"),

    // Social proof
    socialReviews: z.array(SocialReviewSchema).optional(),

    // Source citations (used throughout dashboard)
    sources: z.array(SourceSchema).optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type StudentType = z.infer<typeof StudentTypeSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionnaireProgress = z.infer<typeof QuestionnaireProgressSchema>;
export type CareerPathway = z.infer<typeof CareerPathwaySchema>;
export type Degree = z.infer<typeof DegreeSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type EducationPathway = z.infer<typeof EducationPathwaySchema>;
export type University = z.infer<typeof UniversitySchema>;
export type JobMapping = z.infer<typeof JobMappingSchema>;
export type SkillGap = z.infer<typeof SkillGapSchema>;
export type RoadmapMilestone = z.infer<typeof RoadmapMilestoneSchema>;
export type StartupResource = z.infer<typeof StartupResourceSchema>;
export type Scholarship = z.infer<typeof ScholarshipSchema>;
export type ProfessionalBody = z.infer<typeof ProfessionalBodySchema>;
export type Source = z.infer<typeof SourceSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
export type QuestionnaireResponse = z.infer<typeof QuestionnaireProgressSchema>;
export type DashboardResponse = { status: string; data?: DashboardData };

