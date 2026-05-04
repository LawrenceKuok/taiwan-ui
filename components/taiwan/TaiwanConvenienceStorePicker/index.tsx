"use client";

import { useMemo, useState } from "react";
import storeData from "@/data/taiwan-convenience-stores.json";

/**
 * Taiwan convenience store (超商) pickup-location picker.
 *
 * Used in 90%+ of Taiwan e-commerce checkouts: customer picks a 7-Eleven,
 * FamilyMart, Hi-Life, or OK Mart store for "超商取貨" delivery.
 *
 * IMPORTANT: This component ships with a DEMO dataset (~50 stores across
 * major cities) for UI development and grant-application demos. Production
 * deployments MUST swap in live data from one of:
 *
 *   - ECPay logistics API (https://www.ecpay.com.tw/) — most common
 *   - Pay2go / NewebPay logistics
 *   - Each chain's official store-locator API
 *   - The 內政部 Open Data store-list datasets
 *
 * To use your own data, pass a `stores` prop with the same shape as
 * data/taiwan-convenience-stores.json — see lib/code-examples/.
 *
 * The bundled chain-color/name metadata is correct as of 2026-04 and
 * useful even when overriding store data.
 */

export type ConvenienceChain = "711" | "family" | "hilife" | "okmart";

export interface ConvenienceStore {
  id: string;
  chain: ConvenienceChain;
  name: string;
  address: string;
  city: string;
  district: string;
  postal: string;
  hours?: string;
}

interface ChainMeta {
  id: ConvenienceChain;
  name: string;
  zhName: string;
  color: string;
}

interface RawData {
  _meta: { chains: ChainMeta[] };
  stores: ConvenienceStore[];
}

const DATA = storeData as RawData;
const DEFAULT_CHAINS = DATA._meta.chains;
const DEFAULT_STORES = DATA.stores;

export interface TaiwanConvenienceStorePickerProps {
  /** Selected store (controlled). */
  value?: ConvenienceStore | null;
  /** Selection change callback. */
  onChange?: (store: ConvenienceStore | null) => void;
  /** Override the bundled demo dataset with live data. */
  stores?: ConvenienceStore[];
  /** Restrict to specific chains (default: all four). */
  chains?: ConvenienceChain[];
  /** Initial city filter (default: all). */
  defaultCity?: string;
}

export default function TaiwanConvenienceStorePicker({
  value,
  onChange,
  stores: providedStores,
  chains: enabledChains,
  defaultCity = "",
}: TaiwanConvenienceStorePickerProps) {
  const stores = providedStores ?? DEFAULT_STORES;
  const visibleChains = useMemo(
    () =>
      enabledChains
        ? DEFAULT_CHAINS.filter((c) => enabledChains.includes(c.id))
        : DEFAULT_CHAINS,
    [enabledChains]
  );

  const chainById = useMemo(() => {
    const map = new Map<ConvenienceChain, ChainMeta>();
    for (const c of visibleChains) map.set(c.id, c);
    return map;
  }, [visibleChains]);

  const [activeChain, setActiveChain] = useState<ConvenienceChain | "all">("all");
  const [city, setCity] = useState(defaultCity);
  const [search, setSearch] = useState("");

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const s of stores) set.add(s.city);
    return Array.from(set).sort();
  }, [stores]);

  const filteredStores = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stores.filter((s) => {
      if (activeChain !== "all" && s.chain !== activeChain) return false;
      if (city && s.city !== city) return false;
      if (!chainById.has(s.chain)) return false;
      if (q) {
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.address.toLowerCase().includes(q) &&
          !s.district.includes(q) &&
          !s.id.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [stores, activeChain, city, search, chainById]);

  const handleSelect = (store: ConvenienceStore) => {
    onChange?.(store);
  };

  return (
    <div className="w-full max-w-2xl space-y-3">
      {/* Chain filter pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveChain("all")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeChain === "all"
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          全部 · All
        </button>
        {visibleChains.map((c) => {
          const active = activeChain === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveChain(c.id)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
              style={{
                backgroundColor: active ? c.color : "transparent",
                color: active ? "#fff" : "var(--muted)",
                border: active ? "none" : `1px solid ${c.color}40`,
              }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              {c.zhName}
            </button>
          );
        })}
      </div>

      {/* City + search */}
      <div className="grid sm:grid-cols-[1fr_2fr] gap-2">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="City filter"
          className="px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有縣市 · All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋門市名稱、地址、區… Search store, address, district…"
          autoComplete="off"
          aria-label="Search stores"
          className="px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Results */}
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] max-h-80 overflow-y-auto divide-y divide-[var(--card-border)]">
        {filteredStores.length === 0 ? (
          <p className="px-3 py-3 text-xs text-[var(--muted)]">
            無符合條件門市 · No matching stores
          </p>
        ) : (
          filteredStores.map((s) => {
            const meta = chainById.get(s.chain);
            const selected = value?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s)}
                aria-pressed={selected}
                className={`w-full text-left px-3 py-2.5 transition-colors flex items-center gap-3 ${
                  selected ? "bg-blue-500/15" : "hover:bg-[var(--surface)]"
                }`}
              >
                <span
                  className="inline-flex items-center justify-center w-12 h-6 rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: meta?.color ?? "#999" }}
                >
                  {meta?.zhName?.slice(0, 4) ?? s.chain}
                </span>
                <span className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-[10px] text-[var(--muted)] truncate">
                    {s.address}
                  </div>
                </span>
                <span className="text-[10px] text-[var(--muted)] tabular-nums shrink-0">
                  {s.id}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Selected display */}
      {value && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 text-sm">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-12 h-6 rounded text-[10px] font-bold text-white"
              style={{
                backgroundColor: chainById.get(value.chain)?.color ?? "#999",
              }}
            >
              {chainById.get(value.chain)?.zhName?.slice(0, 4) ?? value.chain}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{value.name}</div>
              <div className="text-[10px] text-[var(--muted)] truncate">
                {value.address}
              </div>
              <div className="text-[10px] text-[var(--muted)]">
                {value.postal} · {value.hours ?? "—"} · 店號 {value.id}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange?.(null)}
              className="text-[var(--muted)] hover:text-[var(--foreground)] text-xs"
              aria-label="Clear selection"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <p className="text-[10px] text-[var(--muted)] leading-relaxed">
        ⓘ 內建範例資料庫（{DEFAULT_STORES.length} 家門市）。生產環境請傳入 <code className="text-[10px]">stores</code> prop 串接 ECPay/Pay2go 物流 API 之即時門市清單。
      </p>
    </div>
  );
}
