import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  // Validate token format (UUID)
  const parsedToken = z.string().uuid().safeParse(token);
  if (!parsedToken.success) {
    return NextResponse.json({ success: false, status: "invalid" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, status, created_at")
    .eq("token", parsedToken.data)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, status: "invalid" }, { status: 404 });
  }

  const tokenAgeMs = Date.now() - new Date(data.created_at).getTime();
  const isExpired = tokenAgeMs > 24 * 60 * 60 * 1000; // 24 hours

  if (isExpired) {
    return NextResponse.json({ success: false, status: "expired", message: "Token has expired." }, { status: 400 });
  }

  if (data.status !== "unverified") {
    return NextResponse.json({ success: false, status: "already" }, { status: 200 });
  }

  const { error: updateError } = await supabase
    .from("reviews")
    .update({ status: "pending" })
    .eq("token", parsedToken.data);

  if (updateError) {
    return NextResponse.json({ success: false, status: "invalid" }, { status: 500 });
  }

  return NextResponse.json({ success: true, status: "success" }, { status: 200 });
}