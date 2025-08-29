// login/actions.ts
"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length > 5;
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate email format
  if (!isValidEmail(email)) {
    console.error("❌ Invalid email format:", email);
    throw new Error("Please enter a valid email address");
  }

  // Validate password
  if (!password || password.length < 1) {
    console.error("❌ Password required");
    throw new Error("Password is required");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("❌ Login error:", error.message);

    // Handle specific error cases
    if (error.message.includes("Invalid login credentials")) {
      throw new Error(
        "Wrong credentials. Please check your email and password."
      );
    }

    if (error.message.includes("Email not confirmed")) {
      throw new Error("Please verify your email before logging in.");
    }

    if (
      error.message.includes("User not found") ||
      error.message.includes("Invalid login credentials")
    ) {
      throw new Error("User not found. Please register first.");
    }

    throw new Error(error.message);
  }

  // Allow cookies to sync before redirect
  redirect("/chat");
}
