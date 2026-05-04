"use client";

import { useMemo, useState } from "react";
import mrtData from "@/data/taiwan-mrt.json";

/**
 * Taiwan MRT (mass rapid transit) station picker.
 *
 * Bundles the public station listing for Taipei Metro (TRTC), Kaohsiung
 * Metro (KRTC), and Taichung Metro (TMRT). Stations are filterable by
 * system + line color and searchable by 中文/English name.
 *
 * Data is sourced from operator public listings as of 2026-04. To use a
 * live feed (e.g. real-time departures), wrap this component or replace
 * the imported `taiwan-mrt.json` with a fetched dataset.
 *
 * Out of scope: real-time arrival times (operator-specific APIs), fare
 * calculation, route planning. Those are separate concerns.
 */

interface MRTStation {
  code: string;
  name: string;
  zhName: string;
  interchange?: string[];
}

interface MRTLine {
  id: string;
  name: string;
  zhName: string;
  color: string;
  stations: MRTStation[];
}

interface MRTSystem {
  id: string;
  name: string;
  zhName: string;
  lines: MRTLine[];
}

interface MRTData {
  systems: MRTSystem[];
}

const DATA = mrtData as MRTData;

export interface MRTSelection {
  systemId: string;
  systemName: string;
  systemZhName: string;
  lineId: string;
  lineName: string;
  lineZhName: string;
  lineColor: string;
  stationCode: string;
  stationName: string;
  stationZhName: string;
}

export interface TaiwanMRTPickerProps {
  /** Currently-selected station (controlled). */
  value?: MRTSelection | null;
  /** Selection change handler. */
  onChange?: (selection: MRTSelection | null) => void;
  /** Restrict to specific systems (default: all three). */
  systems?: ("trtc" | "krtc" | "tmrt")[];
  /** Display language preference. */
  lang?: "zh" | "en";
  /** Placeholder for the search input. */
  placeholder?: string;
}

export default function TaiwanMRTPicker({
  value,
  onChange,
  systems,
  lang = "zh",
  placeholder = "搜尋車站… Search stations…",
}: TaiwanMRTPickerProps) {
  const visibleSystems = useMemo(
    () =>
      systems
        ? DATA.systems.filter((s) => systems.includes(s.id as "trtc" | "krtc" | "tmrt"))
        : DATA.systems,
    [systems]
  );

  const [search, setSearch] = useState("");
  const [activeSystemId, setActiveSystemId] = useState<string | null>(
    visibleSystems[0]?.id ?? null
  );
  const [activeLineId, setActiveLineId] = useState<string | null>(null);

  const activeSystem = useMemo(
    () => visibleSystems.find((s) => s.id === activeSystemId) ?? null,
    [visibleSystems, activeSystemId]
  );

  // Flatten matching stations across systems/lines for search results
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;

    const out: MRTSelection[] = [];
    for (const sys of visibleSystems) {
      for (const line of sys.lines) {
        for (const stn of line.stations) {
          if (
            stn.zhName.toLowerCase().includes(q) ||
            stn.name.toLowerCase().includes(q) ||
            stn.code.toLowerCase().includes(q)
          ) {
            out.push({
              systemId: sys.id,
              systemName: sys.name,
              systemZhName: sys.zhName,
              lineId: line.id,
              lineName: line.name,
              lineZhName: line.zhName,
              lineColor: line.color,
              stationCode: stn.code,
              stationName: stn.name,
              stationZhName: stn.zhName,
            });
          }
        }
      }
    }
    return out.slice(0, 50);
  }, [search, visibleSystems]);

  const handleSelect = (sel: MRTSelection) => {
    onChange?.(sel);
    setSearch("");
  };

  const lines = activeSystem?.lines ?? [];
  const activeLine =
    lines.find((l) => l.id === activeLineId) ?? lines[0] ?? null;

  return (
    <div className="w-full max-w-2xl space-y-3">
      {/* Search */}
      <div>
        <label htmlFor="mrt-search" className="sr-only">
          搜尋捷運車站
        </label>
        <input
          id="mrt-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search results */}
      {searchResults && (
        <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] max-h-72 overflow-y-auto divide-y divide-[var(--card-border)]">
          {searchResults.length === 0 ? (
            <p className="px-3 py-3 text-xs text-[var(--muted)]">
              無相符車站 · No matching stations
            </p>
          ) : (
            searchResults.map((r) => (
              <button
                key={`${r.systemId}-${r.lineId}-${r.stationCode}`}
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-3 py-2 hover:bg-[var(--surface)] transition-colors flex items-center gap-3"
              >
                <span
                  className="inline-flex items-center justify-center min-w-[44px] h-6 rounded text-[10px] font-bold text-white px-1.5"
                  style={{ backgroundColor: r.lineColor }}
                >
                  {r.stationCode}
                </span>
                <span className="flex-1">
                  <span className="text-sm font-medium">
                    {lang === "zh" ? r.stationZhName : r.stationName}
                  </span>
                  <span className="text-[10px] text-[var(--muted)] ml-2">
                    {lang === "zh" ? r.stationName : r.stationZhName}
                  </span>
                </span>
                <span className="text-[10px] text-[var(--muted)]">{r.systemZhName}</span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Browse by system + line — only when not searching */}
      {!searchResults && (
        <>
          {visibleSystems.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleSystems.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveSystemId(s.id);
                    setActiveLineId(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeSystemId === s.id
                      ? "bg-[var(--foreground)] text-[var(--background)]"
                      : "bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {s.zhName}
                </button>
              ))}
            </div>
          )}

          {/* Line tabs */}
          {lines.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lines.map((l) => {
                const active = (activeLine?.id ?? lines[0]?.id) === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setActiveLineId(l.id)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
                    style={{
                      backgroundColor: active ? l.color : "transparent",
                      color: active ? "#fff" : "var(--muted)",
                      border: active ? "none" : `1px solid ${l.color}40`,
                    }}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: l.color }}
                    />
                    {lang === "zh" ? l.zhName : l.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Station list for active line */}
          {activeLine && activeSystem && (
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] max-h-72 overflow-y-auto divide-y divide-[var(--card-border)]">
              {activeLine.stations.map((stn) => {
                const selected =
                  value &&
                  value.systemId === activeSystem.id &&
                  value.lineId === activeLine.id &&
                  value.stationCode === stn.code;
                return (
                  <button
                    key={stn.code}
                    type="button"
                    onClick={() =>
                      handleSelect({
                        systemId: activeSystem.id,
                        systemName: activeSystem.name,
                        systemZhName: activeSystem.zhName,
                        lineId: activeLine.id,
                        lineName: activeLine.name,
                        lineZhName: activeLine.zhName,
                        lineColor: activeLine.color,
                        stationCode: stn.code,
                        stationName: stn.name,
                        stationZhName: stn.zhName,
                      })
                    }
                    aria-pressed={!!selected}
                    className={`w-full text-left px-3 py-2 transition-colors flex items-center gap-3 ${
                      selected
                        ? "bg-blue-500/15"
                        : "hover:bg-[var(--surface)]"
                    }`}
                  >
                    <span
                      className="inline-flex items-center justify-center min-w-[44px] h-6 rounded text-[10px] font-bold text-white px-1.5"
                      style={{ backgroundColor: activeLine.color }}
                    >
                      {stn.code}
                    </span>
                    <span className="flex-1">
                      <span className="text-sm font-medium">
                        {lang === "zh" ? stn.zhName : stn.name}
                      </span>
                      <span className="text-[10px] text-[var(--muted)] ml-2">
                        {lang === "zh" ? stn.name : stn.zhName}
                      </span>
                    </span>
                    {stn.interchange && stn.interchange.length > 0 && (
                      <span className="flex gap-0.5">
                        {stn.interchange.map((ic) => (
                          <span
                            key={ic}
                            className="text-[9px] px-1 py-0.5 rounded bg-[var(--surface)] text-[var(--muted)]"
                          >
                            {ic}
                          </span>
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Selected display */}
      {value && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 flex items-center gap-3 text-sm">
          <span
            className="inline-flex items-center justify-center min-w-[44px] h-6 rounded text-[10px] font-bold text-white px-1.5"
            style={{ backgroundColor: value.lineColor }}
          >
            {value.stationCode}
          </span>
          <div className="flex-1">
            <div className="font-semibold">
              {value.stationZhName}{" "}
              <span className="text-[10px] text-[var(--muted)] font-normal">
                {value.stationName}
              </span>
            </div>
            <div className="text-[10px] text-[var(--muted)]">
              {value.systemZhName} · {value.lineZhName}
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
      )}
    </div>
  );
}
