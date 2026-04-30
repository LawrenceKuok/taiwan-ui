/**
 * Server-side government API wrappers.
 *
 * These modules perform network I/O against authoritative Taiwan government
 * data sources. They MUST be imported only from server contexts (Route
 * Handlers, Server Components, edge functions, backend services) — never
 * from client-side React components.
 *
 * Available wrappers:
 *
 *   - lookupCompanyByTaxID — 商業司 公司基本資料 (gcis.nat.gov.tw, public, no auth)
 *
 * Coming in v0.3:
 *
 *   - getInvoicePrizeStatus  — 財政部 統一發票中獎號碼 bimonthly feed
 *   - lookupNHIPharmacy      — 健保署 健保特約藥局 listing (read-only)
 *
 * NOT planned (legal / privacy reasons):
 *
 *   - 戶政司 個人身分證真偽驗證 — requires applicant-specific credentials
 *     registered with 內政部. Reference integration example will live in
 *     /docs but not as a published wrapper.
 *   - 健保 IC 卡讀取 — requires 讀卡機 SDK from 健保署.
 *
 * Compliance reminder: do NOT log validated personal data. The format
 * validators in lib/validators/ run client-side specifically to keep PII
 * off the server. This server-side surface is for *business / public
 * record* lookups only.
 */

export {
  lookupCompanyByTaxID,
  COMPANY_STATUS,
  type CompanyLookupResult,
  type CompanyStatus,
  type LookupOptions,
} from "./tax-id-lookup";
