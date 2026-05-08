"use server";

import { auth } from '@/lib/auth/server';
import { prisma } from "@/lib/prisma";

export async function addCourseAction(title: string, platform: string, url?: string, reminderAt?: string) {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        const course = await prisma.trackedCourse.create({
            data: {
                userId: session.user.id,
                title,
                platform,
                url: url || null,
                reminderAt: reminderAt || null,
                progress: 0,
            },
        });
        return { success: true, course };
    } catch (error) {
        console.error("Prisma Add Course Error:", error);
        return { success: false, error: "Failed to add course to database" };
    }
}

export async function updateCourseProgressAction(courseId: string, progress: number, notes?: string) {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        const updated = await prisma.trackedCourse.update({
            where: { id: courseId, userId: session.user.id },
            data: {
                progress,
                notes: notes !== undefined ? notes : undefined,
            },
        });
        return { success: true, course: updated };
    } catch (error) {
        console.error("Prisma Update Course Error:", error);
        return { success: false, error: "Failed to update course progress" };
    }
}

export async function deleteCourseAction(courseId: string) {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        await prisma.trackedCourse.delete({
            where: { id: courseId, userId: session.user.id },
        });
        return { success: true };
    } catch (error) {
        console.error("Prisma Delete Course Error:", error);
        return { success: false, error: "Failed to delete course" };
    }
}

export async function getTrackedCoursesAction() {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) return [];

    try {
        const courses = await prisma.trackedCourse.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        });
        return courses;
    } catch (error) {
        console.error("Prisma Fetch Courses Error:", error);
        return [];
    }
}
