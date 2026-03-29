import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ success: false, status: "invalid" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, status")
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, status: "invalid" }, { status: 404 });
  }

  if (data.status !== "unverified") {
    return NextResponse.json({ success: false, status: "already" }, { status: 200 });
  }

  const { error: updateError } = await supabase
    .from("reviews")
    .update({ status: "pending" })
    .eq("token", token);

  if (updateError) {
    return NextResponse.json({ success: false, status: "invalid" }, { status: 500 });
  }

  return NextResponse.json({ success: true, status: "success" }, { status: 200 });
}