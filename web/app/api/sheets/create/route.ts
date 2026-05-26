import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSpreadsheet } from "@/lib/google";

export async function POST() {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated. Please sign in with Google." },
        { status: 401 }
      );
    }

    // Check if user already has a spreadsheet stored in the session/cookie
    // For now, always create — the frontend should only call this once
    const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(
      session.accessToken,
      session.refreshToken
    );

    return NextResponse.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl,
    });
  } catch (error: any) {
    console.error("[/api/sheets/create] Error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to create spreadsheet" },
      { status: 500 }
    );
  }
}
