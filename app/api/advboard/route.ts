import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connector";

export async function POST(request: NextRequest) {
  await connectDB();
  return NextResponse.json({ message: "Contribute endpoint works!" });
}
