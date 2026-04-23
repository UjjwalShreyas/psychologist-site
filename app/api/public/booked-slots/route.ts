import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  
  const parsedDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").safeParse(date);
  if (!parsedDate.success) {
    return NextResponse.json({ error: "Date parameter is missing or invalid" }, { status: 400 });
  }

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("time")
      .eq("date", parsedDate.data)
      .eq("status", "approved");

    if (error) {
      console.error("Error fetching booked slots:", error);
      return NextResponse.json({ error: "Failed to fetch booked slots" }, { status: 500 });
    }

    const times = data.map((item) => item.time);
    return NextResponse.json(times);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
