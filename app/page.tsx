"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { PageHeader, ChartCard, KpiCard, TOOLTIP_STYLE, AXIS_STYLE, GRID_STROKE } from "@/lib/ui";
import { fmt, fmtKrw } from "@/lib/format";
import {
  DEFENSE_PRODUCTS, CERTIFICATIONS, MILESTONES, RESEARCH_REFS, BUDGET,
  PHASE_LABELS, PHASE_COLORS, STATUS_LABELS, STATUS_COLORS,
  CATEGORY_LABELS, CATEGORY_ICONS, MS_ICONS,
  getTotalBudget, getCertsForProduct,
} from "@/data/defense";

const PIE_COLORS = ["#8B5CF6", "#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#EC4899", "#06B6D4"];

export default function Home() {
  const budget = useMemo(() => getTotalBudget(), []);

  const budgetPie = useMemo(() =>
    BUDGET.map((b) => ({ name: b.category, value: b.planned })), []);

  const certSummary = useMemo(() => {
    const t = CERTIFICATIONS.length;
    const c = CERTIFICATIONS.filter((x) => x.status === "completed").length;
    const p = CERTIFICATIONS.filter((x) => x.status === "in_progress" || x.status === "submitted").length;
    const n = CERTIFICATIONS.filter((x) => x.status === "not_started").length;
    return { total: t, completed: c, inProgress: p, notStarted: n };
  }, []);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return MILESTONES.filter((m) => !m.done && m.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8);
  }, []);

  const doneMs = MILESTONES.filter((m) => m.done).length;

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 space-y-5 sm:space-y-8 max-w-[1440px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#556B2F] rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-sm">D</div>
        <PageHeader title="범우연합 방산TF" subtitle="제독제 · 세정유 · 윤활유 방산 진입 프로젝트 현황" />
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard label="추진 제품" value={`${DEFENSE_PRODUCTS.length}개`} icon="🛡" accent="olive" sub="제독제·세정유·윤활유" />
        <KpiCard label="인증 진행률" value={`${certSummary.completed}/${certSummary.total}`} icon="📋" accent="blue" sub={`미착수 ${certSummary.notStarted} / 진행 ${certSummary.inProgress}`} />
        <KpiCard label="총 예산" value={fmtKrw(budget.planned)} icon="💰" accent="emerald" sub={`집행 ${fmtKrw(budget.spent)} (${budget.rate.toFixed(0)}%)`} />
        <KpiCard label="마일스톤" value={`${doneMs}/${MILESTONES.length}`} icon="🎯" accent="amber" sub={upcoming[0] ? `다음: ${upcoming[0].title}` : "일정 없음"} />
      </div>

      {/* ── 제품 포트폴리오 ── */}
      <ChartCard title="제품 포트폴리오" subtitle={`${DEFENSE_PRODUCTS.length}개 제품 · 방산 진입 로드맵`}>
        <div className="space-y-4">
          {DEFENSE_PRODUCTS.map((p) => {
            const certs = getCertsForProduct(p.id);
            return (
              <div key={p.id} className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">{CATEGORY_ICONS[p.category]}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-[15px] font-semibold text-slate-900">{p.name}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${PHASE_COLORS[p.currentPhase]}`}>
                          {PHASE_LABELS[p.currentPhase]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{p.milSpec} · {CATEGORY_LABELS[p.category]}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500">목표: <span className="font-medium text-slate-700">{p.targetDate}</span></p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.assignee}</p>
                  </div>
                </div>
                <p className="text-[13px] text-slate-600 mt-3 leading-relaxed">{p.description}</p>
                {/* 진행률 */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-500">진행률</span>
                    <span className="text-[11px] font-semibold text-slate-700">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all bg-gradient-to-r from-[#556B2F] to-[#8B9A6B]" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                {/* 인증 뱃지 */}
                {certs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {certs.map((c) => (
                      <span key={c.id} className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[c.status]}`}>
                        {c.name.length > 22 ? c.name.slice(0, 22) + "..." : c.name} · {STATUS_LABELS[c.status]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* ── 인증 + 예산 도넛 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="인증 현황" subtitle={`전체 ${CERTIFICATIONS.length}건`}>
          <div className="overflow-x-auto max-h-[420px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#F7F8FA] z-10">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2.5 px-3 text-[12px] font-medium text-slate-500">인증 항목</th>
                  <th className="text-left py-2.5 px-3 text-[12px] font-medium text-slate-500">유형</th>
                  <th className="text-left py-2.5 px-3 text-[12px] font-medium text-slate-500">상태</th>
                  <th className="text-right py-2.5 px-3 text-[12px] font-medium text-slate-500">예상 비용</th>
                  <th className="text-left py-2.5 px-3 text-[12px] font-medium text-slate-500">목표일</th>
                </tr>
              </thead>
              <tbody>
                {CERTIFICATIONS.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-[12px] text-slate-900 font-medium max-w-[200px]">
                      <div className="truncate">{c.name}</div>
                      {c.notes && <div className="text-[10px] text-slate-400 mt-0.5 truncate">{c.notes.slice(0, 45)}...</div>}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{c.type}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[c.status]}`}>
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[12px] text-slate-900 font-semibold text-right whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {fmtKrw(c.estimatedCostKrw)}
                    </td>
                    <td className="py-2.5 px-3 text-[12px] text-slate-500">{c.targetDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard title="예산 배분" subtitle={`총 ${fmtKrw(budget.planned)} · 집행률 ${budget.rate.toFixed(0)}%`}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={budgetPie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {budgetPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [fmtKrw(Number(v)), "예산"]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── 예산 바 차트 ── */}
      <ChartCard title="항목별 예산 현황" subtitle="계획 vs 집행 (만원)">
        <ResponsiveContainer width="100%" height={Math.max(220, BUDGET.length * 44)}>
          <BarChart
            data={BUDGET.map((b) => ({
              name: b.category.length > 16 ? b.category.slice(0, 16) + "..." : b.category,
              계획: Math.round(b.planned / 10000),
              집행: Math.round(b.spent / 10000),
            }))}
            layout="vertical" margin={{ left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
            <XAxis type="number" {...AXIS_STYLE} tickFormatter={(v) => fmt(v)} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#0F172A", fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [fmt(Number(v)) + "만원"]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="계획" fill="#556B2F" radius={[0, 4, 4, 0]} />
            <Bar dataKey="집행" fill="#10B981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── 타임라인 ── */}
      <ChartCard title="마일스톤 타임라인" subtitle={`완료 ${doneMs}/${MILESTONES.length} · 다가오는 ${upcoming.length}건`}>
        <div className="space-y-0">
          {MILESTONES.map((ms, i) => {
            const isLast = i === MILESTONES.length - 1;
            const overdue = ms.date < new Date().toISOString().slice(0, 10) && !ms.done;
            return (
              <div key={ms.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${ms.done ? "bg-emerald-500" : overdue ? "bg-red-400" : "bg-slate-300"}`} />
                  {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
                </div>
                <div className={`pb-4 ${ms.done ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">{MS_ICONS[ms.category]}</span>
                    <span className={`text-[13px] font-medium ${ms.done ? "line-through text-slate-400" : "text-slate-900"}`}>{ms.title}</span>
                    {overdue && <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">지연</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ms.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* ── 논문 레퍼런스 ── */}
      <ChartCard title="기술 레퍼런스" subtitle={`참고 논문 ${RESEARCH_REFS.length}건`}>
        <div className="space-y-3">
          {RESEARCH_REFS.map((r) => (
            <div key={r.id} className="border border-slate-100 rounded-lg p-3 sm:p-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2 flex-wrap">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-blue-600 hover:underline leading-snug">
                  {r.title}
                </a>
                <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  r.relevance === "high" ? "bg-red-50 text-red-600" : r.relevance === "medium" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
                }`}>
                  {r.relevance === "high" ? "핵심" : r.relevance === "medium" ? "참고" : "일반"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{r.authors} · {r.source} · {r.year}</p>
              <p className="text-[12px] text-slate-600 mt-1.5 leading-relaxed">{r.summary}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* ── 진입 로드맵 ── */}
      <ChartCard title="군납 진입 로드맵" subtitle="단계별 프로세스">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { step: "1", title: "규격 확인", desc: "KDSIS에서 해당 KDS 규격 검색. 없으면 규격화 신청.", icon: "🔍", bg: "border-purple-200 bg-purple-50" },
            { step: "2", title: "DQMS 인증", desc: "국방품질경영시스템 인증 취득. ISO 9001 기반.", icon: "📋", bg: "border-blue-200 bg-blue-50" },
            { step: "3", title: "시험성적서", desc: "KTR/SPL 등 공인기관에서 규격 시험 통과.", icon: "🔬", bg: "border-amber-200 bg-amber-50" },
            { step: "4", title: "나라장터 입찰", desc: "G2B 입찰 참여 또는 군 수의계약.", icon: "🏛", bg: "border-emerald-200 bg-emerald-50" },
          ].map((s) => (
            <div key={s.step} className={`border rounded-xl p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">{s.step}</span>
                <span className="text-sm">{s.icon}</span>
                <span className="text-[13px] font-semibold text-slate-800">{s.title}</span>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* 푸터 */}
      <div className="text-center py-6 text-[11px] text-slate-400">
        범우연합 방산TF · BWC Defense Task Force Dashboard v1.0
      </div>
    </div>
  );
}
