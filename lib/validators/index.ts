/**
 * Public entry point for all Taiwan-specific validators.
 *
 * All functions exported here are PURE — no side effects, no DOM access, no
 * network calls. They are safe to call from server components, route handlers,
 * unit tests, and CLI tools.
 *
 * Compliance disclaimer: these validators implement the FORMAT and CHECKSUM
 * rules as published by the relevant Taiwan authorities (戶政司, 財政部,
 * 移民署, 交通部, 健保署) as of 2026-Q1. They do NOT verify that a given ID,
 * number, or plate corresponds to a real, active entity — for that, integrate
 * the appropriate government API.
 */

export * from "./twid";
export * from "./tax-id";
export * from "./phone";
export * from "./license-plate";
export * from "./nhi-card";
export * from "./uniform-invoice";
export * from "./phone-barcode";
export * from "./passport";
export * from "./driving-license";
