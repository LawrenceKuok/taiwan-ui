/**
 * 商業司公司搜尋 API 包裝
 * Wrapper around the Ministry of Economic Affairs (商業司) public company-
 * search endpoint at gcis.nat.gov.tw.
 *
 * This is a v0.3 ROADMAP deliverable: pairing the lib/validators/tax-id.ts
 * format checker with an authoritative existence check.
 *
 * The 商業司 endpoint is public (no API key required) but rate-limited.
 * Callers are responsible for caching and respecting reasonable limits.
 *
 * Spec: https://data.gov.tw/dataset/9931 (商業司開放資料說明)
 *
 * IMPORTANT: this module performs network I/O — do NOT import it from
 * client-side React components. Use it only from Next.js Route Handlers,
 * Server Components, edge functions, or backend services.
 */

import { validateTaxID, type TaxIDValidationResult } from "../validators/tax-id";

/** Mapping from 商業司 status codes to a human-readable status. */
const COMPANY_STATUS = Object.freeze({
  "01": "核准設立",
  "02": "解散",
  "03": "撤銷",
  "04": "廢止",
  "05": "撤回",
  "06": "歇業",
  "07": "停業",
  "08": "其他",
  "09": "核准設立(分公司)",
  "10": "命令解散",
  "11": "裁定解散",
  "12": "合併解散",
}) as Readonly<Record<string, string>>;

export type CompanyStatus = keyof typeof COMPANY_STATUS | "unknown";

export interface CompanyLookupResult {
  /** Whether the tax ID exists in the 商業司 database (i.e. a real company). */
  exists: boolean;
  /** Tax ID checksum + format result, regardless of existence. */
  format: TaxIDValidationResult;
  /** Registered company name, if found. */
  companyName?: string;
  /** Status code from 商業司. */
  statusCode?: string;
  /** Human-readable status. */
  status?: string;
  /** Registered capital in NTD, if available. */
  capitalNtd?: number;
  /** Registered address, if available. */
  registeredAddress?: string;
  /** Date of company establishment (ISO 8601 YYYY-MM-DD). */
  establishedDate?: string;
  /** Raw API response (for debugging / extended use). */
  raw?: unknown;
  /** Reason for failure, if `exists` is false. */
  reason?: "format" | "checksum" | "not-found" | "network" | "rate-limited";
}

export interface LookupOptions {
  /** AbortSignal for cancellation. Recommended: AbortSignal.timeout(5000). */
  signal?: AbortSignal;
  /** Override the API base URL (for testing). */
  baseUrl?: string;
}

const DEFAULT_BASE = "https://data.gcis.nat.gov.tw/od/data/api";
/** 商業司「公司基本資料」dataset ID. */
const DATASET = "5F64D864-61CB-4D0D-8AD9-492047CC1EA6";

/**
 * Check if a tax ID corresponds to a real, currently-listed company.
 *
 * Always validates format/checksum locally first. If the format fails, no
 * network call is made.
 *
 * Network failures intentionally degrade gracefully — `exists: false` with
 * `reason: 'network'` rather than throwing, so caller logic stays simple.
 */
export async function lookupCompanyByTaxID(
  taxId: string,
  options: LookupOptions = {}
): Promise<CompanyLookupResult> {
  const format = validateTaxID(taxId);
  if (!format.valid) {
    return {
      exists: false,
      format,
      reason: format.reason === "format" ? "format" : "checksum",
    };
  }

  const base = options.baseUrl ?? DEFAULT_BASE;
  const url = `${base}/${DATASET}?$format=json&$filter=Business_Accounting_NO eq ${format.raw}&$skip=0&$top=1`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: options.signal,
    });
  } catch {
    return { exists: false, format, reason: "network" };
  }

  if (res.status === 429) {
    return { exists: false, format, reason: "rate-limited" };
  }
  if (!res.ok) {
    return { exists: false, format, reason: "network" };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { exists: false, format, reason: "network" };
  }

  if (!Array.isArray(data) || data.length === 0) {
    return { exists: false, format, reason: "not-found" };
  }

  const row = data[0] as Record<string, unknown>;
  const statusCode = typeof row.Company_Status === "string" ? row.Company_Status : undefined;
  const statusName =
    statusCode && Object.hasOwn(COMPANY_STATUS, statusCode)
      ? COMPANY_STATUS[statusCode as keyof typeof COMPANY_STATUS]
      : undefined;

  const capital = typeof row.Capital_Stock_Amount === "number"
    ? row.Capital_Stock_Amount
    : typeof row.Capital_Stock_Amount === "string"
      ? Number(row.Capital_Stock_Amount) || undefined
      : undefined;

  return {
    exists: true,
    format,
    companyName: typeof row.Company_Name === "string" ? row.Company_Name : undefined,
    statusCode,
    status: statusName,
    capitalNtd: capital,
    registeredAddress:
      typeof row.Company_Location === "string" ? row.Company_Location : undefined,
    establishedDate:
      typeof row.Company_Setup_Date === "string"
        ? formatRocDate(row.Company_Setup_Date)
        : undefined,
    raw: row,
  };
}

/**
 * 商業司 returns dates as YYYMMDD (ROC year). E.g. "1080615" → 2019-06-15.
 * Returns ISO 8601 (Gregorian) string, or undefined if the input shape is unexpected.
 */
function formatRocDate(rocYYYMMDD: string): string | undefined {
  const m = rocYYYMMDD.match(/^(\d{2,3})(\d{2})(\d{2})$/);
  if (!m) return undefined;
  const rocYear = Number(m[1]);
  const month = m[2];
  const day = m[3];
  if (!Number.isFinite(rocYear)) return undefined;
  const gregorian = rocYear + 1911;
  return `${gregorian}-${month}-${day}`;
}

export { COMPANY_STATUS };
