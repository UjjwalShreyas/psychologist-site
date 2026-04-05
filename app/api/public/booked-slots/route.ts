import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  
  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("time")
      .eq("date", date)
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
