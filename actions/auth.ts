"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

// Types
export interface SessionUser {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
    [key: string]: string | null | undefined;
}

// Sign up new teacher
export async function signup(data: {
    name: string;
    email: string;
    password: string;
}) {
    try {
        // Check if user already exists
        const existingTeacher = await db.teacher.findUnique({
            where: { email: data.email },
        });

        if (existingTeacher) {
            return { success: false, error: "Email already registered" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create teacher
        const teacher = await db.teacher.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });

        // Create session
        await createSession({
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            avatar: teacher.avatar,
        });

        return { success: true, teacher: { id: teacher.id, email: teacher.email, name: teacher.name } };
    } catch (error) {
        console.error("Signup error:", error);
        return { success: false, error: "Failed to create account" };
    }
}

// Login teacher
export async function login(data: { email: string; password: string }) {
    try {
        // Find teacher
        const teacher = await db.teacher.findUnique({
            where: { email: data.email },
        });

        if (!teacher) {
            return { success: false, error: "Invalid email or password" };
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(data.password, teacher.password);

        if (!isValidPassword) {
            return { success: false, error: "Invalid email or password" };
        }

        // Create session
        await createSession({
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            avatar: teacher.avatar,
        });

        return { success: true, teacher: { id: teacher.id, email: teacher.email, name: teacher.name } };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Failed to login" };
    }
}

// Logout
export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

// Get current session
export async function getSession(): Promise<SessionUser | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session");

        if (!sessionCookie) {
            return null;
        }

        const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
        return payload as unknown as SessionUser;
    } catch (error) {
        return null;
    }
}

// Get current user with full details
export async function getCurrentUser() {
    const session = await getSession();

    if (!session) {
        return null;
    }

    const teacher = await db.teacher.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            bio: true,
            createdAt: true,
        },
    });

    return teacher;
}

// Helper: Create session token
async function createSession(user: SessionUser) {
    const token = await new SignJWT(user)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}
