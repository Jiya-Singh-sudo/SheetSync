import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { appendRow } from "@/lib/google";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated. Please sign in with Google." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text, confidence, spreadsheetId, source } = body;

    if (!text || confidence === undefined || !spreadsheetId) {
      return NextResponse.json(
        { error: "Missing required fields: text, confidence, spreadsheetId" },
        { status: 400 }
      );
    }

    const result = await appendRow(
      session.accessToken,
      session.refreshToken,
      spreadsheetId,
      text,
      confidence,
      source || "Camera"
    );

    return NextResponse.json({
      success: true,
      updatedRange: result.updates?.updatedRange,
      updatedRows: result.updates?.updatedRows,
    });
  } catch (error: any) {
    console.error("[/api/sheets/append] Error:", error?.message || error);

    // If token expired, tell the client to re-authenticate
    if (error?.code === 401 || error?.message?.includes("invalid_grant")) {
      return NextResponse.json(
        { error: "Google token expired. Please sign in again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Failed to append row to sheet" },
      { status: 500 }
    );
  }
}
