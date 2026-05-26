import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSpreadsheetInfo } from "@/lib/google";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { spreadsheetId } = body;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: "Missing spreadsheetId" },
        { status: 400 }
      );
    }

    const info = await getSpreadsheetInfo(
      session.accessToken,
      session.refreshToken,
      spreadsheetId
    );

    if (!info) {
      return NextResponse.json(
        { error: "Spreadsheet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      spreadsheetId: info.spreadsheetId,
      title: info.title,
      url: info.url,
    });
  } catch (error: any) {
    console.error("[/api/sheets/status] Error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch spreadsheet info" },
      { status: 500 }
    );
  }
}
