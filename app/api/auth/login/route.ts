import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { User } from "@/types/auth";

// Simple password hashing (must match registration)
function hashPassword(password: string): string {
  return Buffer.from(password).toString("base64");
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const hashedInputPassword = hashPassword(password);
    if (user.password !== hashedInputPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
