/**
 * Google Sheets Integration for CRM
 *
 * This module handles authentication and data operations with Google Sheets.
 * Used to store contact form submissions as a simple CRM solution.
 *
 * Required Environment Variables:
 * - GOOGLE_SERVICE_KEY: JSON content of the Service Account key file
 * - GOOGLE_SHEET_ID: The ID of the Google Sheet (from the URL)
 */

import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// ============================================
// TYPES
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  industry?: string;
  message: string;
  source?: string;
  language?: string;
}

interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Parse and process the Service Account credentials from environment variable.
 * Handles the common issue with newline characters in private_key.
 */
function getServiceAccountCredentials(): ServiceAccountCredentials | null {
  const serviceKeyJson = process.env.GOOGLE_SERVICE_KEY;

  if (!serviceKeyJson) {
    console.error("[Google Sheets] GOOGLE_SERVICE_KEY environment variable is not set");
    return null;
  }

  try {
    // Parse the JSON string
    const credentials = JSON.parse(serviceKeyJson) as ServiceAccountCredentials;

    // Handle escaped newline characters in private_key
    // Environment variables often escape \n as \\n
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
    }

    // Validate required fields
    if (!credentials.client_email || !credentials.private_key) {
      console.error(
        "[Google Sheets] Invalid service account credentials: missing client_email or private_key"
      );
      return null;
    }

    return credentials;
  } catch (error) {
    console.error("[Google Sheets] Failed to parse GOOGLE_SERVICE_KEY:", error);
    return null;
  }
}

/**
 * Create a JWT auth client for Google Sheets API.
 */
function getAuthClient(): JWT | null {
  const credentials = getServiceAccountCredentials();

  if (!credentials) {
    return null;
  }

  try {
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file",
      ],
    });

    return auth;
  } catch (error) {
    console.error("[Google Sheets] Failed to create auth client:", error);
    return null;
  }
}

/**
 * Get an authenticated GoogleSpreadsheet instance.
 */
async function getSpreadsheet(): Promise<GoogleSpreadsheet | null> {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    console.error("[Google Sheets] GOOGLE_SHEET_ID environment variable is not set");
    return null;
  }

  const auth = getAuthClient();

  if (!auth) {
    return null;
  }

  try {
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    console.log(`[Google Sheets] Connected to spreadsheet: "${doc.title}"`);
    return doc;
  } catch (error) {
    console.error("[Google Sheets] Failed to connect to spreadsheet:", error);
    return null;
  }
}

// ============================================
// DATA OPERATIONS
// ============================================

/**
 * Get or create the contacts worksheet.
 * Creates headers if the sheet is new.
 */
async function getOrCreateContactsSheet(
  doc: GoogleSpreadsheet
): Promise<GoogleSpreadsheetWorksheet | null> {
  const SHEET_NAME = "Kontaktanfragen";
  const HEADERS = [
    "Datum",
    "Uhrzeit",
    "Name",
    "E-Mail",
    "Firma",
    "Telefon",
    "Branche",
    "Nachricht",
    "Quelle",
    "Sprache",
    "Status",
  ];

  try {
    // Try to get existing sheet
    let sheet = doc.sheetsByTitle[SHEET_NAME];

    if (!sheet) {
      // Create new sheet with headers
      console.log(`[Google Sheets] Creating new sheet: "${SHEET_NAME}"`);
      sheet = await doc.addSheet({
        title: SHEET_NAME,
        headerValues: HEADERS,
      });
    }

    return sheet;
  } catch (error) {
    console.error("[Google Sheets] Failed to get/create contacts sheet:", error);
    return null;
  }
}

/**
 * Format current date and time for German locale.
 */
function formatDateTime(): { date: string; time: string } {
  const now = new Date();

  // Format for German locale
  const dateFormatter = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return {
    date: dateFormatter.format(now),
    time: timeFormatter.format(now),
  };
}

/**
 * Append a contact form submission to Google Sheets.
 *
 * This function follows the "Fire and Forget" / "Fail Safe" pattern:
 * - Returns { success: true } even if the operation fails
 * - Only logs errors to console
 * - Never throws exceptions
 *
 * @param data - Contact form data to append
 * @returns Object with success status and optional error message
 */
export async function appendToSheet(data: ContactFormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Check if Google Sheets is configured
    if (!process.env.GOOGLE_SERVICE_KEY || !process.env.GOOGLE_SHEET_ID) {
      console.warn("[Google Sheets] Not configured - skipping CRM storage");
      return { success: true }; // Fail safe - don't block user
    }

    const doc = await getSpreadsheet();

    if (!doc) {
      console.error("[Google Sheets] Could not connect to spreadsheet");
      return { success: true }; // Fail safe
    }

    const sheet = await getOrCreateContactsSheet(doc);

    if (!sheet) {
      console.error("[Google Sheets] Could not get contacts sheet");
      return { success: true }; // Fail safe
    }

    const { date, time } = formatDateTime();

    // Append the row
    await sheet.addRow({
      Datum: date,
      Uhrzeit: time,
      Name: data.name || "",
      "E-Mail": data.email || "",
      Firma: data.company || "",
      Telefon: data.phone || "",
      Branche: data.industry || "",
      Nachricht: data.message || "",
      Quelle: data.source || "Website Contact Form",
      Sprache: data.language || "de",
      Status: "Neu",
    });

    console.log(`[Google Sheets] ✅ Contact saved: ${data.name} (${data.email})`);
    return { success: true };
  } catch (error) {
    // Log error but don't fail the user experience
    console.error("[Google Sheets] ❌ Failed to save contact:", error);

    return {
      success: true, // Fail safe - still return success
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test the Google Sheets connection.
 * Useful for debugging and health checks.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const doc = await getSpreadsheet();

    if (!doc) {
      return false;
    }

    console.log("[Google Sheets] Connection test successful!");
    console.log(`[Google Sheets] Sheet title: ${doc.title}`);
    console.log(`[Google Sheets] Sheet count: ${doc.sheetCount}`);

    return true;
  } catch (error) {
    console.error("[Google Sheets] Connection test failed:", error);
    return false;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Sanitize input data to prevent formula injection in spreadsheets.
 * Prefixes dangerous characters with a single quote.
 */
export function sanitizeForSheet(value: string): string {
  if (!value) return "";

  // Characters that could start a formula
  const dangerousChars = ["=", "+", "-", "@", "\t", "\r", "\n"];

  const trimmed = value.trim();

  if (dangerousChars.some((char) => trimmed.startsWith(char))) {
    return `'${trimmed}`;
  }

  return trimmed;
}
