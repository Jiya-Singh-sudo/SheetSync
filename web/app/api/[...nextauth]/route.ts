import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Endpoint moved to /api/auth/[...nextauth]" }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ error: "Endpoint moved to /api/auth/[...nextauth]" }, { status: 404 });
}