import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

export async function POST(request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        error:
          "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      },
      { status: 500 },
    );
  }

  try {
    const { email, password, fullName, origin } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const appOrigin =
      typeof origin === "string" && origin.startsWith("http")
        ? origin
        : request.nextUrl.origin;

    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        data: { full_name: (fullName || "").trim() },
        email_redirect_to: `${appOrigin}/auth/callback`,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.msg ||
            data.error_description ||
            data.error ||
            "Registration failed. Please try again.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to reach the authentication service right now. Please try again in a moment.",
      },
      { status: 503 },
    );
  }
}
