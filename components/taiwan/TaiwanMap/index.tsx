"use client";

import { useState, useMemo, useCallback } from "react";

/**
 * Taiwan administrative-region selector map.
 *
 * 22 counties / cities + 3 outlying island groups, positioned in a stylised
 * tile layout that preserves rough geographic relationships (北→南, 東→西).
 * Codes follow Taiwan's two-letter ISO-style identifiers used by 內政部
 * (KEE, TPE, NWT, …).
 *
 * Pure SVG, zero deps, full keyboard navigation, dark-mode aware.
 */

export type TaiwanCountyCode =
  | "KEE" | "TPE" | "NWT" | "TAO" | "HSZ" | "HSQ" | "MIA"
  | "TXG" | "CHA" | "NAN" | "YUN"
  | "CYI" | "CYQ" | "TNN" | "KHH" | "PIF"
  | "ILA" | "HUA" | "TTT"
  | "PEN" | "KIN" | "LIE";

export interface TaiwanCounty {
  code: TaiwanCountyCode;
  name: string;       // e.g. "Taipei City"
  zhName: string;     // e.g. "臺北市"
  region: "north" | "central" | "south" | "east" | "islands";
}

// Tile layout: x and y are grid units, w/h are widths in grid units.
// Grid is 6 wide × 11 tall. Outlying islands sit in the left gutter.
interface Tile { code: TaiwanCountyCode; x: number; y: number; w: number; h: number; }

const TILES: Tile[] = [
  // North
  { code: "KEE", x: 4, y: 0, w: 1, h: 1 },
  { code: "TPE", x: 3, y: 1, w: 1, h: 1 },
  { code: "NWT", x: 4, y: 1, w: 1, h: 1 },
  { code: "TAO", x: 3, y: 2, w: 2, h: 1 },
  { code: "HSZ", x: 3, y: 3, w: 1, h: 1 },
  { code: "HSQ", x: 4, y: 3, w: 1, h: 1 },
  { code: "MIA", x: 3, y: 4, w: 2, h: 1 },
  // Central
  { code: "TXG", x: 3, y: 5, w: 2, h: 1 },
  { code: "CHA", x: 3, y: 6, w: 1, h: 1 },
  { code: "NAN", x: 4, y: 6, w: 1, h: 1 },
  { code: "YUN", x: 3, y: 7, w: 2, h: 1 },
  // South
  { code: "CYI", x: 3, y: 8, w: 1, h: 1 },
  { code: "CYQ", x: 4, y: 8, w: 1, h: 1 },
  { code: "TNN", x: 3, y: 9, w: 2, h: 1 },
  { code: "KHH", x: 3, y: 10, w: 1, h: 1 },
  { code: "PIF", x: 4, y: 10, w: 1, h: 1 },
  // East
  { code: "ILA", x: 5, y: 2, w: 1, h: 2 },
  { code: "HUA", x: 5, y: 4, w: 1, h: 4 },
  { code: "TTT", x: 5, y: 8, w: 1, h: 3 },
  // Outlying islands (left gutter)
  { code: "LIE", x: 0, y: 1, w: 2, h: 1 },
  { code: "KIN", x: 0, y: 3, w: 2, h: 1 },
  { code: "PEN", x: 0, y: 6, w: 2, h: 1 },
];

export const TAIWAN_COUNTIES: Record<TaiwanCountyCode, TaiwanCounty> = Object.freeze({
  KEE: { code: "KEE", name: "Keelung", zhName: "基隆市", region: "north" },
  TPE: { code: "TPE", name: "Taipei", zhName: "臺北市", region: "north" },
  NWT: { code: "NWT", name: "New Taipei", zhName: "新北市", region: "north" },
  TAO: { code: "TAO", name: "Taoyuan", zhName: "桃園市", region: "north" },
  HSZ: { code: "HSZ", name: "Hsinchu City", zhName: "新竹市", region: "north" },
  HSQ: { code: "HSQ", name: "Hsinchu County", zhName: "新竹縣", region: "north" },
  MIA: { code: "MIA", name: "Miaoli", zhName: "苗栗縣", region: "north" },
  TXG: { code: "TXG", name: "Taichung", zhName: "臺中市", region: "central" },
  CHA: { code: "CHA", name: "Changhua", zhName: "彰化縣", region: "central" },
  NAN: { code: "NAN", name: "Nantou", zhName: "南投縣", region: "central" },
  YUN: { code: "YUN", name: "Yunlin", zhName: "雲林縣", region: "central" },
  CYI: { code: "CYI", name: "Chiayi City", zhName: "嘉義市", region: "south" },
  CYQ: { code: "CYQ", name: "Chiayi County", zhName: "嘉義縣", region: "south" },
  TNN: { code: "TNN", name: "Tainan", zhName: "臺南市", region: "south" },
  KHH: { code: "KHH", name: "Kaohsiung", zhName: "高雄市", region: "south" },
  PIF: { code: "PIF", name: "Pingtung", zhName: "屏東縣", region: "south" },
  ILA: { code: "ILA", name: "Yilan", zhName: "宜蘭縣", region: "east" },
  HUA: { code: "HUA", name: "Hualien", zhName: "花蓮縣", region: "east" },
  TTT: { code: "TTT", name: "Taitung", zhName: "臺東縣", region: "east" },
  PEN: { code: "PEN", name: "Penghu", zhName: "澎湖縣", region: "islands" },
  KIN: { code: "KIN", name: "Kinmen", zhName: "金門縣", region: "islands" },
  LIE: { code: "LIE", name: "Lienchiang", zhName: "連江縣", region: "islands" },
} as Record<TaiwanCountyCode, TaiwanCounty>);

const REGION_FILL: Record<string, string> = {
  north: "rgba(59, 130, 246, 0.18)",   // blue
  central: "rgba(34, 197, 94, 0.18)",  // green
  south: "rgba(249, 115, 22, 0.18)",   // orange
  east: "rgba(168, 85, 247, 0.18)",    // purple
  islands: "rgba(148, 163, 184, 0.18)",// slate
};

const REGION_STROKE: Record<string, string> = {
  north: "rgb(59, 130, 246)",
  central: "rgb(34, 197, 94)",
  south: "rgb(249, 115, 22)",
  east: "rgb(168, 85, 247)",
  islands: "rgb(148, 163, 184)",
};

export interface TaiwanMapProps {
  /** Currently-selected county code(s). Pass a string for single-select, array for multi-select. */
  value?: TaiwanCountyCode | TaiwanCountyCode[] | null;
  /** Click/select handler. Receives the clicked county code. */
  onSelect?: (code: TaiwanCountyCode, county: TaiwanCounty) => void;
  /** Optional per-county color override (e.g., for choropleth / data viz). */
  colorize?: (code: TaiwanCountyCode) => string | undefined;
  /** Show county labels on tiles. */
  showLabels?: boolean;
  /** Use English names instead of 中文. */
  english?: boolean;
  /** Highlight color for selected tile(s). */
  highlightColor?: string;
  /** Disable interaction (useful for read-only data viz). */
  disabled?: boolean;
  /** Width in pixels (height auto). */
  width?: number;
  ariaLabel?: string;
}

const CELL = 56;       // grid cell size in viewBox units
const PAD = 4;         // padding between tiles
const COLS = 6;
const ROWS = 11;

export default function TaiwanMap({
  value,
  onSelect,
  colorize,
  showLabels = true,
  english = false,
  highlightColor = "rgb(59, 130, 246)",
  disabled = false,
  width = 360,
  ariaLabel = "台灣縣市選擇地圖",
}: TaiwanMapProps) {
  const [hover, setHover] = useState<TaiwanCountyCode | null>(null);
  const selected = useMemo(
    () => new Set(Array.isArray(value) ? value : value ? [value] : []),
    [value]
  );

  const handleClick = useCallback(
    (code: TaiwanCountyCode) => {
      if (disabled) return;
      const county = TAIWAN_COUNTIES[code];
      onSelect?.(code, county);
    },
    [disabled, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGRectElement>, code: TaiwanCountyCode) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(code);
      }
    },
    [handleClick]
  );

  const vbW = COLS * CELL;
  const vbH = ROWS * CELL;
  const aspectRatio = vbW / vbH;
  const height = Math.round(width / aspectRatio);

  return (
    <div className="inline-block" style={{ width }}>
      <svg
        role="group"
        aria-label={ariaLabel}
        viewBox={`0 0 ${vbW} ${vbH}`}
        width={width}
        height={height}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {TILES.map((tile) => {
          const c = TAIWAN_COUNTIES[tile.code];
          const x = tile.x * CELL + PAD / 2;
          const y = tile.y * CELL + PAD / 2;
          const w = tile.w * CELL - PAD;
          const h = tile.h * CELL - PAD;
          const isSelected = selected.has(tile.code);
          const isHover = hover === tile.code;
          const customColor = colorize?.(tile.code);
          const fill = customColor ?? (isSelected ? highlightColor : REGION_FILL[c.region]);
          const stroke = isSelected || isHover ? highlightColor : REGION_STROKE[c.region];
          const labelColor = isSelected || customColor ? "#fff" : "currentColor";

          return (
            <g key={tile.code}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={6}
                ry={6}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? 2 : 1}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-label={`${c.zhName} ${c.name}`}
                aria-pressed={isSelected}
                onMouseEnter={() => !disabled && setHover(tile.code)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => !disabled && setHover(tile.code)}
                onBlur={() => setHover(null)}
                onClick={() => handleClick(tile.code)}
                onKeyDown={(e) => handleKeyDown(e, tile.code)}
                style={{
                  cursor: disabled ? "not-allowed" : "pointer",
                  transition: "fill 120ms, stroke 120ms",
                  outline: "none",
                  opacity: disabled ? 0.5 : 1,
                }}
              />
              {showLabels && (
                <text
                  x={x + w / 2}
                  y={y + h / 2 + 4}
                  textAnchor="middle"
                  pointerEvents="none"
                  fontSize={Math.min(12, w / 4)}
                  fontWeight={600}
                  fill={labelColor}
                  style={{ userSelect: "none" }}
                >
                  {english ? c.name : c.zhName.replace(/[市縣]$/, "")}
                </text>
              )}
            </g>
          );
        })}
        {/* Decorative strait label */}
        <text
          x={CELL * 2.5}
          y={CELL * 5.5}
          textAnchor="middle"
          fontSize={11}
          fill="currentColor"
          opacity={0.35}
          style={{ userSelect: "none", letterSpacing: 4 }}
        >
          {english ? "Taiwan Strait" : "台灣海峽"}
        </text>
      </svg>
    </div>
  );
}
