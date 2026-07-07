"use client";

// app/Library.tsx — 📁 자료실 탭. data/library.ts 의 LIBRARY_DOCS 기반 자동 렌더링.

import { useState } from "react";
import { LIBRARY_DOCS, type LibDoc } from "@/data/library";

function DocTables({ doc }: { doc: LibDoc }) {
  if (!doc.tables?.length) return null;
  return (
    <div className="space-y-5">
      {doc.tables.map((t, i) => (
        <div key={i}>
          <h4 className="text-[13px] font-bold text-slate-700 mb-2">{t.heading}</h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-slate-50">
                  {t.cols.map((c, j) => (
                    <th key={j} className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((r, j) => (
                  <tr key={j} className="border-t border-slate-100">
                    {r.map((cell, k) => (
                      <td key={k} className={`px-3 py-2 text-slate-700 ${k === 0 ? "font-medium whitespace-nowrap" : ""}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {t.note && <p className="text-[10px] text-slate-400 mt-1.5">{t.note}</p>}
        </div>
      ))}
    </div>
  );
}

function DocCard({ doc }: { doc: LibDoc }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xl">{doc.icon}</span>
          <h3 className="text-[15px] font-bold text-slate-800">{doc.title}</h3>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">{doc.source} · {doc.dateLabel}</div>
        <p className="text-[13px] text-slate-600 leading-relaxed mt-2">{doc.summary}</p>
      </div>

      {doc.points && doc.points.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {doc.points.map((p, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3.5">
              <div className="text-[12px] font-bold text-[#556B2F]">{p.title}</div>
              <div className="text-[12px] text-slate-600 leading-relaxed mt-1">{p.desc}</div>
            </div>
          ))}
        </div>
      )}

      <DocTables doc={doc} />
    </div>
  );
}

export default function Library() {
  const [activeId, setActiveId] = useState(LIBRARY_DOCS[0]?.id);
  const doc = LIBRARY_DOCS.find((d) => d.id === activeId) || LIBRARY_DOCS[0];
  if (!doc) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="text-[16px] font-bold text-slate-800">📁 방산TF 자료실</h2>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {LIBRARY_DOCS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveId(d.id)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${d.id === doc.id ? "bg-[#556B2F] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {d.icon} {d.title.length > 18 ? d.title.slice(0, 18) + "…" : d.title}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-slate-400">회의록은 📋 회의록 탭에서 확인 · 원본 파일은 TF 공유폴더 보관</p>
      <DocCard doc={doc} />
    </div>
  );
}
