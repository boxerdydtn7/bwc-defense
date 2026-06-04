"use client";

import React from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function ChartCard({
  title, subtitle, children, className = "",
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

export function KpiCard({
  label, value, icon, accent = "blue", sub,
}: {
  label: string;
  value: string;
  icon?: string;
  accent?: "blue" | "emerald" | "amber" | "red" | "violet" | "slate" | "olive";
  sub?: string;
}) {
  const bar: Record<string, string> = {
    blue: "bg-blue-500", emerald: "bg-emerald-500", amber: "bg-amber-500",
    red: "bg-red-500", violet: "bg-violet-500", slate: "bg-slate-400", olive: "bg-[#556B2F]",
  };
  return (
    <div className="relative bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col gap-2 min-h-[100px] sm:min-h-[120px]">
      <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${bar[accent]}`} />
      <div className="flex items-center justify-between">
        <span className="text-[13px] sm:text-sm font-medium text-slate-500 tracking-tight">{label}</span>
        {icon && <span className="text-slate-400 text-lg">{icon}</span>}
      </div>
      <span className="text-[28px] sm:text-[36px] font-bold text-slate-900 leading-tight tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
      {sub && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium text-slate-500 bg-slate-100 w-fit">
          {sub}
        </span>
      )}
    </div>
  );
}

export const TOOLTIP_STYLE = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  fontSize: 12,
  color: "#0F172A",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
} as const;

export const AXIS_STYLE = {
  tick: { fill: "#64748B", fontSize: 11 },
  axisLine: false as const,
  tickLine: false as const,
};

export const GRID_STROKE = "#E2E8F0";
