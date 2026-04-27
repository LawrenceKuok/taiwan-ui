"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Taiwan e-invoice QR-code scanner.
 *
 * Uses the browser's native `BarcodeDetector` API where available
 * (Chrome/Edge/Android Chrome 83+). Falls back to a clear unsupported
 * message on browsers without it (Safari, Firefox today).
 *
 * Decodes the LEFT QR-code on a Taiwan 統一發票. The left QR contains the
 * invoice header (號碼、日期、隨機碼、金額、賣方統編、買方統編、加密驗證碼);
 * the right QR contains the item list. This v1 only parses the left QR.
 *
 * Pure browser API — zero runtime deps. Camera permission required.
 *
 * Spec: 財政部電子發票整合服務平台「統一發票二維條碼明細格式」.
 */

export interface ParsedInvoice {
  /** Invoice number, e.g. "AB12345678" */
  invoiceNumber: string;
  /** ROC date as YYYYMMDD (year is民國-3-digit), e.g. "1140315" */
  date: string;
  /** Random verification code (隨機碼) */
  randomCode: string;
  /** Sales amount as string (in NTD, no separator) */
  salesAmount: string;
  /** Total amount as string */
  totalAmount: string;
  /** Buyer (customer) tax ID, may be empty */
  buyerTaxId: string;
  /** Seller (vendor) tax ID */
  sellerTaxId: string;
  /** Encryption verification code (加密驗證碼) */
  encryptCode: string;
  /** Raw QR string */
  raw: string;
}

/**
 * Parse a left-side e-invoice QR string.
 * Format (colons separate fields): `<10-char invoice no><7-digit date><4-char random><8-hex sales><8-hex total><8-digit buyer><8-digit seller><24-char encrypt>:<rest>`
 */
export function parseInvoiceQR(raw: string): ParsedInvoice | null {
  if (!raw || raw.length < 77) return null;
  try {
    const invoiceNumber = raw.slice(0, 10);
    const date = raw.slice(10, 17);
    const randomCode = raw.slice(17, 21);
    const salesHex = raw.slice(21, 29);
    const totalHex = raw.slice(29, 37);
    const buyerTaxId = raw.slice(37, 45);
    const sellerTaxId = raw.slice(45, 53);
    const encryptCode = raw.slice(53, 77);

    if (!/^[A-Z]{2}\d{8}$/.test(invoiceNumber)) return null;
    if (!/^\d{7}$/.test(date)) return null;

    const salesAmount = parseInt(salesHex, 16).toString();
    const totalAmount = parseInt(totalHex, 16).toString();

    return {
      invoiceNumber,
      date,
      randomCode,
      salesAmount,
      totalAmount,
      buyerTaxId,
      sellerTaxId,
      encryptCode,
      raw,
    };
  } catch {
    return null;
  }
}

interface BarcodeDetectorAPI {
  detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetectorAPI;
  getSupportedFormats?: () => Promise<string[]>;
}

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

export interface EInvoiceQRScannerProps {
  /** Called when a valid invoice QR is decoded. */
  onScan: (invoice: ParsedInvoice) => void;
  /** Called on a non-invoice QR (returns the raw string). */
  onRawScan?: (raw: string) => void;
  /** Auto-stop after first successful scan. */
  oneShot?: boolean;
  /** Width of the video preview in pixels. */
  width?: number;
  ariaLabel?: string;
}

type State =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "unsupported"; reason: string }
  | { kind: "ready" }
  | { kind: "scanning" }
  | { kind: "error"; message: string };

export default function EInvoiceQRScanner({
  onScan,
  onRawScan,
  oneShot = true,
  width = 320,
  ariaLabel = "電子發票 QR Code 掃描器",
}: EInvoiceQRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetectorAPI | null>(null);
  const rafRef = useRef<number | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [lastScan, setLastScan] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setState({ kind: "checking" });
    try {
      if (typeof window === "undefined" || !window.BarcodeDetector) {
        setState({
          kind: "unsupported",
          reason:
            "本瀏覽器不支援 BarcodeDetector API。請使用 Chrome / Edge 或 Android。This browser does not support the BarcodeDetector API. Please use Chrome, Edge, or Android.",
        });
        return;
      }
      detectorRef.current = new window.BarcodeDetector({ formats: ["qr_code"] });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setState({ kind: "scanning" });

      const tick = async () => {
        if (!videoRef.current || !detectorRef.current || !streamRef.current) return;
        try {
          const codes = await detectorRef.current.detect(videoRef.current);
          if (codes.length > 0) {
            const raw = codes[0]!.rawValue;
            setLastScan(raw);
            const parsed = parseInvoiceQR(raw);
            if (parsed) {
              onScan(parsed);
              if (oneShot) {
                stopCamera();
                setState({ kind: "ready" });
                return;
              }
            } else {
              onRawScan?.(raw);
            }
          }
        } catch {
          // Detection error — keep trying.
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState({ kind: "error", message });
    }
  }, [onScan, onRawScan, oneShot, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="inline-block" style={{ width }}>
      <div
        className="relative rounded-xl overflow-hidden bg-black border border-[var(--card-border)]"
        style={{ aspectRatio: "1", width }}
        role="region"
        aria-label={ariaLabel}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        {(state.kind === "idle" || state.kind === "ready") && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              {state.kind === "ready" ? "再掃一張 Scan again" : "開始掃描 Start"}
            </button>
          </div>
        )}
        {state.kind === "checking" && (
          <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm">
            等待相機權限… Awaiting camera permission…
          </div>
        )}
        {state.kind === "unsupported" && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-white text-xs leading-relaxed">
            {state.reason}
          </div>
        )}
        {state.kind === "error" && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-red-300 text-xs leading-relaxed">
            掃描失敗 / Scan failed: {state.message}
          </div>
        )}
        {state.kind === "scanning" && (
          <>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-green-400 rounded-lg" />
            </div>
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setState({ kind: "idle" });
              }}
              className="absolute top-2 right-2 px-2 py-1 rounded bg-white/90 text-xs font-semibold text-black"
              aria-label="Stop scanning"
            >
              ⏹ Stop
            </button>
          </>
        )}
      </div>
      {lastScan && (
        <p className="mt-2 text-[10px] text-[var(--muted)] font-mono break-all">
          last: {lastScan.slice(0, 40)}…
        </p>
      )}
    </div>
  );
}
