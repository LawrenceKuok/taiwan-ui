import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { lookupCompanyByTaxID } from "@/lib/server/tax-id-lookup";

const MOCK_TSMC_ROW = {
  Business_Accounting_NO: "04595252",
  Company_Name: "台灣積體電路製造股份有限公司",
  Company_Status: "01",
  Capital_Stock_Amount: 259303804580,
  Company_Location: "新竹科學園區新竹市力行六路8號",
  Company_Setup_Date: "0760221",
};

describe("lookupCompanyByTaxID / format gating", () => {
  it("rejects bad-checksum tax IDs without making network call", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const r = await lookupCompanyByTaxID("12345678"); // fails checksum
    expect(r.exists).toBe(false);
    expect(r.reason).toBe("checksum");
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("rejects malformed tax IDs without making network call", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    // 8-char input that's wrong shape (validator returns "format")
    const r = await lookupCompanyByTaxID("ABCDEFGH");
    expect(r.exists).toBe(false);
    expect(r.reason).toBe("format");
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("treats wrong-length input as a non-network failure", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const r = await lookupCompanyByTaxID("ABC"); // length-fail
    expect(r.exists).toBe(false);
    // length failures are surfaced as 'checksum' reason in the lookup wrapper
    // (validateTaxID returns reason="length", which the lookup re-maps to
    // checksum since that's the closest user-facing category)
    expect(["checksum", "format"]).toContain(r.reason);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

describe("lookupCompanyByTaxID / network responses", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch");
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns full company info on a successful upstream response", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([MOCK_TSMC_ROW]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const r = await lookupCompanyByTaxID("04595252");
    expect(r.exists).toBe(true);
    expect(r.companyName).toBe("台灣積體電路製造股份有限公司");
    expect(r.statusCode).toBe("01");
    expect(r.status).toBe("核准設立");
    expect(r.capitalNtd).toBe(259303804580);
    expect(r.establishedDate).toBe("1987-02-21"); // 民國 76 → 西元 1987
  });

  it("returns not-found when upstream returns empty array", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const r = await lookupCompanyByTaxID("04595252");
    expect(r.exists).toBe(false);
    expect(r.reason).toBe("not-found");
  });

  it("returns rate-limited on 429", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response("", { status: 429 })
    );
    const r = await lookupCompanyByTaxID("04595252");
    expect(r.exists).toBe(false);
    expect(r.reason).toBe("rate-limited");
  });

  it("returns network on 5xx", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response("", { status: 503 })
    );
    const r = await lookupCompanyByTaxID("04595252");
    expect(r.exists).toBe(false);
    expect(r.reason).toBe("network");
  });

  it("returns network on fetch throw", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("ECONNRESET"));
    const r = await lookupCompanyByTaxID("04595252");
    expect(r.exists).toBe(false);
    expect(r.reason).toBe("network");
  });

  it("returns network on invalid JSON", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response("not json", { status: 200 })
    );
    const r = await lookupCompanyByTaxID("04595252");
    expect(r.exists).toBe(false);
    expect(r.reason).toBe("network");
  });
});

describe("lookupCompanyByTaxID / ROC date conversion", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch");
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("converts 民國 100 (年) → 2011", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([{ ...MOCK_TSMC_ROW, Company_Setup_Date: "1000101" }]), { status: 200 })
    );
    const r = await lookupCompanyByTaxID("04595252");
    expect(r.establishedDate).toBe("2011-01-01");
  });

  it("converts 民國 76 → 1987", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([{ ...MOCK_TSMC_ROW, Company_Setup_Date: "0760221" }]), { status: 200 })
    );
    const r = await lookupCompanyByTaxID("04595252");
    expect(r.establishedDate).toBe("1987-02-21");
  });

  it("returns undefined for malformed date", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([{ ...MOCK_TSMC_ROW, Company_Setup_Date: "garbage" }]), { status: 200 })
    );
    const r = await lookupCompanyByTaxID("04595252");
    expect(r.establishedDate).toBeUndefined();
  });
});
