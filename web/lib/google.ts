import { google } from "googleapis";

/**
 * Build an authenticated OAuth2 client from user tokens.
 * This runs SERVER-SIDE ONLY — never import this file from client components.
 */
export function getOAuth2Client(accessToken: string, refreshToken?: string) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return client;
}

/**
 * Create a new spreadsheet titled "SheetScan Data" inside the user's Drive.
 * Returns the spreadsheetId and spreadsheet URL.
 */
export async function createSpreadsheet(accessToken: string, refreshToken?: string) {
  const auth = getOAuth2Client(accessToken, refreshToken);
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: "SheetScan Data",
      },
      sheets: [
        {
          properties: {
            title: "Scans",
            gridProperties: { frozenRowCount: 1 },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: "Timestamp" } },
                    { userEnteredValue: { stringValue: "OCR Text" } },
                    { userEnteredValue: { stringValue: "Confidence" } },
                    { userEnteredValue: { stringValue: "Source" } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const spreadsheetId = response.data.spreadsheetId!;
  const spreadsheetUrl = response.data.spreadsheetUrl!;

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Append a single row of OCR data to the user's spreadsheet.
 */
export async function appendRow(
  accessToken: string,
  refreshToken: string | undefined,
  spreadsheetId: string,
  ocrText: string,
  confidence: number,
  source: string = "Camera"
) {
  const auth = getOAuth2Client(accessToken, refreshToken);
  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toISOString();

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Scans!A:D",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[timestamp, ocrText, `${confidence}%`, source]],
    },
  });

  return response.data;
}

/**
 * Get basic spreadsheet metadata (title, url).
 */
export async function getSpreadsheetInfo(accessToken: string, refreshToken?: string, spreadsheetId?: string) {
  if (!spreadsheetId) return null;

  const auth = getOAuth2Client(accessToken, refreshToken);
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "properties.title,spreadsheetUrl,spreadsheetId",
  });

  return {
    spreadsheetId: response.data.spreadsheetId,
    title: response.data.properties?.title,
    url: response.data.spreadsheetUrl,
  };
}
