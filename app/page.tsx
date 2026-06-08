"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { PageHeader, ChartCard, KpiCard, TOOLTIP_STYLE, AXIS_STYLE, GRID_STROKE } from "@/lib/ui";
import { fmt } from "@/lib/format";
import {
  type Category,
  CATEGORIES, STATUS_MAP, TF_MEMBERS, TRACKS, PROJECTS, MILESTONES,
  KCLP_PERFORMANCE, KCLP_COMPETITORS, ASSET_FLOWS, MARKET_DATA,
  RESEARCH_REFS, MEETING_NOTES, MILITARY_LOGISTICS,
  MILITARY_REPLACEMENTS, RR_DETAILS,
  getProjectsByCategory, getUpcomingMilestones, getOverdueMilestones,
} from "@/data/defense";

const TAB_ORDER: Category[] = ["k_clp", "decontaminant", "defense_venture", "etc_projects"];
const PIE_COLORS = ["#10B981", "#8B5CF6", "#3B82F6", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#6366F1", "#14B8A6"];

function Badge({ label, color }: { label: string; color: string }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${color}`}>{label}</span>;
}

function ProgressBar({ value, color = "from-[#556B2F] to-[#8B9A6B]" }: { value: number; color?: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div className={`h-2 rounded-full transition-all bg-gradient-to-r ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Category | "overview">("overview");

  const upcoming = useMemo(() => getUpcomingMilestones(6), []);
  const overdue = useMemo(() => getOverdueMilestones(), []);
  const totalProjects = PROJECTS.length;
  const inProgressCount = PROJECTS.filter((p) => p.status === "in_progress").length;
  const doneMilestones = MILESTONES.filter((m) => m.done).length;

  const categoryProgress = useMemo(() =>
    TAB_ORDER.map((cat) => {
      const ps = getProjectsByCategory(cat);
      const avg = ps.length > 0 ? Math.round(ps.reduce((s, p) => s + p.progress, 0) / ps.length) : 0;
      return { name: CATEGORIES[cat].label, value: avg };
    }), []);

  const defenseFieldPie = useMemo(() =>
    MARKET_DATA.defenseCompanies.byField.map((f) => ({ name: f.field, value: f.count })), []);

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 space-y-5 sm:space-y-8 max-w-[1440px] mx-auto">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#556B2F] rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-sm">D</div>
          <PageHeader title="범우연합 방산TF" subtitle="사업개발 트랙 · 4개 카테고리 통합 대시보드" />
        </div>
        <div className="sm:ml-auto text-[11px] text-slate-400">킥오프 2026.06.04 · PM 김승만 · 9명 TF</div>
      </div>

      {/* 탭 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "overview" ? "bg-[#556B2F] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          전체 현황
        </button>
        {TAB_ORDER.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === cat ? "bg-[#556B2F] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? <OverviewSection upcoming={upcoming} overdue={overdue} totalProjects={totalProjects} inProgressCount={inProgressCount} doneMilestones={doneMilestones} categoryProgress={categoryProgress} defenseFieldPie={defenseFieldPie} /> : <CategorySection category={activeTab} />}

      <div className="text-center py-6 text-[11px] text-slate-400">
        범우연합 방산TF · BWC Defense Task Force Dashboard v2.0
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 전체 현황 탭
// ─────────────────────────────────────────
function OverviewSection({ upcoming, overdue, totalProjects, inProgressCount, doneMilestones, categoryProgress, defenseFieldPie }: {
  upcoming: typeof MILESTONES;
  overdue: typeof MILESTONES;
  totalProjects: number;
  inProgressCount: number;
  doneMilestones: number;
  categoryProgress: { name: string; value: number }[];
  defenseFieldPie: { name: string; value: number }[];
}) {
  return (
    <>
      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="추진 프로젝트" value={`${totalProjects}개`} icon="🛡" accent="olive" sub={`진행 중 ${inProgressCount}개`} />
        <KpiCard label="TF 인원" value="9명" icon="👥" accent="blue" sub="PM 1 + R&D 3 + 영업 5" />
        <KpiCard label="마일스톤" value={`${doneMilestones}/${MILESTONES.length}`} icon="🎯" accent="emerald" sub={upcoming[0] ? `다음: ${upcoming[0].title.slice(0, 20)}...` : ""} />
        <KpiCard label="지연 항목" value={`${overdue.length}건`} icon="⚠" accent={overdue.length > 0 ? "red" : "slate"} sub={overdue.length > 0 ? overdue[0].title.slice(0, 25) + "..." : "없음"} />
      </div>

      {/* 카테고리별 진행률 + 방산업체 파이 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="카테고리별 평균 진행률" subtitle="4개 카테고리">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryProgress} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis dataKey="name" {...AXIS_STYLE} />
              <YAxis {...AXIS_STYLE} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "진행률"]} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {categoryProgress.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="국내 방산업체 분포" subtitle={`총 ${MARKET_DATA.defenseCompanies.total}개사 (주요 ${MARKET_DATA.defenseCompanies.major} / 일반 ${MARKET_DATA.defenseCompanies.general})`}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={defenseFieldPie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                {defenseFieldPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}개사`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 4개 카테고리 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TAB_ORDER.map((cat) => {
          const catMeta = CATEGORIES[cat];
          const ps = getProjectsByCategory(cat);
          const tracks = TRACKS.filter((t) => t.category === cat);
          const avgProgress = ps.length > 0 ? Math.round(ps.reduce((s, p) => s + p.progress, 0) / ps.length) : 0;
          return (
            <div key={cat} className={`border rounded-2xl p-5 ${catMeta.bgColor}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{catMeta.icon}</span>
                <h3 className={`text-[15px] font-bold ${catMeta.color}`}>{catMeta.label}</h3>
                <span className="ml-auto text-[12px] font-semibold text-slate-700">{avgProgress}%</span>
              </div>
              <ProgressBar value={avgProgress} />
              <div className="mt-3 space-y-1.5">
                {ps.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-[12px]">
                    <Badge label={STATUS_MAP[p.status].label} color={STATUS_MAP[p.status].color} />
                    <span className="text-slate-700 truncate">{p.name}</span>
                    <span className="ml-auto text-slate-400 shrink-0">{p.progress}%</span>
                  </div>
                ))}
              </div>
              {tracks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  {tracks.map((t) => (
                    <div key={t.id} className="text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600">{t.id}</span> {t.name} · {t.lead}({t.leadOrg})
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* TF 구성원 */}
      <ChartCard title="TF 구성원" subtitle="9명 · PM 1 + R&D 3 + 영업 5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-2 px-3 text-[11px] font-medium text-slate-500">이름</th>
                <th className="text-left py-2 px-3 text-[11px] font-medium text-slate-500">소속</th>
                <th className="text-left py-2 px-3 text-[11px] font-medium text-slate-500">역할</th>
                <th className="text-left py-2 px-3 text-[11px] font-medium text-slate-500">지역</th>
                <th className="text-left py-2 px-3 text-[11px] font-medium text-slate-500">1차 R&R</th>
                <th className="text-left py-2 px-3 text-[11px] font-medium text-slate-500">트랙</th>
              </tr>
            </thead>
            <tbody>
              {TF_MEMBERS.map((m) => (
                <tr key={m.name} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-2 px-3 text-[12px] font-semibold text-slate-900">{m.name}</td>
                  <td className="py-2 px-3"><Badge label={m.org} color="bg-slate-100 text-slate-700" /></td>
                  <td className="py-2 px-3 text-[12px] text-slate-600">{m.role}</td>
                  <td className="py-2 px-3 text-[12px] text-slate-500">{m.region}</td>
                  <td className="py-2 px-3 text-[12px] text-slate-600 max-w-[280px] truncate">{m.primary}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-1">{m.tracks.map((t) => <Badge key={t} label={t} color="bg-blue-50 text-blue-600" />)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* 군 대체 가능 제품 매핑 */}
      <ChartCard title="군 현용 제품 → 범우 대체 매핑" subtitle={`범우연합 1,897개 제품 중 군수 대체 가능 ${MILITARY_REPLACEMENTS.length}개 카테고리`}>
        <div className="space-y-3">
          {MILITARY_REPLACEMENTS.map((mr) => {
            const starColor = mr.feasibility === 3 ? "text-emerald-500" : mr.feasibility === 2 ? "text-amber-500" : "text-slate-400";
            const priorityColor = mr.priority === "최우선" ? "bg-red-100 text-red-700" : mr.priority === "핵심" ? "bg-blue-100 text-blue-700" : mr.priority === "유망" ? "bg-amber-100 text-amber-700" : mr.priority === "장기" ? "bg-slate-100 text-slate-600" : "bg-violet-100 text-violet-700";
            return (
              <div key={mr.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[14px] ${starColor}`}>{"★".repeat(mr.feasibility)}{"☆".repeat(3 - mr.feasibility)}</span>
                      <h4 className="text-[14px] font-bold text-slate-900">{mr.militaryItem}</h4>
                      <Badge label={mr.priority} color={priorityColor} />
                    </div>
                    <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
                      <div><span className="text-slate-400">현 공급사:</span> <span className="text-slate-600">{mr.currentSupplier}</span></div>
                      <div><span className="text-slate-400">MIL 규격:</span> <span className="text-slate-600 font-mono text-[11px]">{mr.milSpec}</span></div>
                      <div><span className="text-slate-400">범우 대체:</span> <span className="text-emerald-700 font-semibold">{mr.bwcProduct}</span></div>
                      <div><span className="text-slate-400">보유 제품:</span> <span className="text-slate-700 font-semibold">{mr.productCount}종</span></div>
                      <div className="sm:col-span-2"><span className="text-slate-400">타깃:</span> <span className="text-slate-600">{mr.targetCustomer}</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-blue-700 bg-blue-50 rounded px-2 py-1">액션: {mr.action}</div>
                {mr.notes && <p className="mt-1 text-[11px] text-slate-400">{mr.notes}</p>}
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* R&R 상세 지시사항 */}
      <ChartCard title="R&R 상세 지시사항" subtitle="9명 개인별 주간·월간 업무 + KPI + 마감일">
        <div className="space-y-4">
          {RR_DETAILS.map((rr) => (
            <details key={rr.name} className="border border-slate-200 rounded-xl overflow-hidden group">
              <summary className="px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors flex items-center gap-3">
                <span className="text-[14px] font-bold text-slate-900">{rr.name}</span>
                <Badge label={rr.org} color="bg-slate-100 text-slate-600" />
                <span className="ml-auto text-[11px] text-slate-400">보고: {rr.reportTo}</span>
                <span className="text-slate-400 group-open:rotate-90 transition-transform">▶</span>
              </summary>
              <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                <div>
                  <h5 className="text-[11px] font-semibold text-blue-600 uppercase mb-1.5">주간 업무</h5>
                  <ul className="space-y-1">
                    {rr.weeklyTasks.map((t, i) => (
                      <li key={i} className="text-[12px] text-slate-600 flex gap-2"><span className="text-blue-300 shrink-0">◆</span>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-[11px] font-semibold text-emerald-600 uppercase mb-1.5">월간 업무</h5>
                  <ul className="space-y-1">
                    {rr.monthlyTasks.map((t, i) => (
                      <li key={i} className="text-[12px] text-slate-600 flex gap-2"><span className="text-emerald-300 shrink-0">◆</span>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h5 className="text-[11px] font-semibold text-amber-600 uppercase mb-1.5">KPI 지표</h5>
                    <ul className="space-y-0.5">
                      {rr.kpiMetrics.map((k, i) => (
                        <li key={i} className="text-[11px] text-slate-500 flex gap-1"><span className="text-amber-400">▸</span>{k}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-semibold text-red-600 uppercase mb-1.5">마감일</h5>
                    <ul className="space-y-0.5">
                      {rr.deadlines.map((d, i) => (
                        <li key={i} className="text-[11px] text-slate-500 flex gap-1">
                          <span className="text-red-400 shrink-0">⏰</span>
                          <span className="font-medium text-slate-700">{d.date}</span> {d.task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </ChartCard>

      {/* 자산 흐름도 */}
      <ChartCard title="트랙 간 자산 흐름" subtitle="하나의 자산을 4번 활용 — T1이 출발점이자 모든 트랙의 디딤돌">
        <div className="space-y-3">
          {ASSET_FLOWS.map((af, i) => (
            <div key={i} className="flex items-start gap-3 border border-slate-100 rounded-xl p-3 hover:border-slate-300 transition-colors">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-[#556B2F] flex items-center justify-center text-white text-[11px] font-bold">{af.from}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-semibold text-slate-800">{af.asset}</span>
                  <span className="text-slate-300">→</span>
                  {af.to.map((t) => <Badge key={t} label={t} color="bg-amber-50 text-amber-700" />)}
                </div>
                <p className="text-[12px] text-slate-500 mt-0.5">{af.effect}</p>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* 마일스톤 타임라인 */}
      <ChartCard title="마일스톤 타임라인" subtitle={`완료 ${MILESTONES.filter((m) => m.done).length}/${MILESTONES.length}`}>
        <div className="space-y-0">
          {[...MILESTONES].sort((a, b) => a.date.localeCompare(b.date)).map((ms, i, arr) => {
            const isLast = i === arr.length - 1;
            const isOverdue = ms.date < new Date().toISOString().slice(0, 10) && !ms.done;
            return (
              <div key={ms.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${ms.done ? "bg-emerald-500" : isOverdue ? "bg-red-400" : "bg-slate-300"}`} />
                  {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
                </div>
                <div className={`pb-4 ${ms.done ? "opacity-50" : ""}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge label={ms.track} color="bg-slate-100 text-slate-600" />
                    <span className={`text-[13px] font-medium ${ms.done ? "line-through text-slate-400" : "text-slate-900"}`}>{ms.title}</span>
                    {isOverdue && <Badge label="지연" color="bg-red-100 text-red-600" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ms.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* 군수 체계 */}
      <ChartCard title="군수 체계 구분" subtitle="구매 · 물자 · 관리">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MILITARY_LOGISTICS.categories.map((c) => (
            <div key={c.code} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-7 h-7 rounded-lg bg-[#556B2F] flex items-center justify-center text-white text-[12px] font-bold">{c.code}</span>
                <span className="text-[14px] font-semibold text-slate-800">{c.name}</span>
              </div>
              <p className="text-[12px] text-slate-500">{c.description}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* 회의록 */}
      {MEETING_NOTES.map((mtg) => (
        <ChartCard key={mtg.id} title={`회의록: ${mtg.title}`} subtitle={`${mtg.date} · 기록: ${mtg.recorder} · 참석: ${mtg.attendees.join(", ")}`}>
          <div className="space-y-4">
            {mtg.agendas.map((ag, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4">
                <h4 className="text-[13px] font-semibold text-slate-800 mb-2">{i + 1}. {ag.topic}</h4>
                <ul className="space-y-1">
                  {ag.details.map((d, j) => (
                    <li key={j} className="text-[12px] text-slate-600 flex gap-2">
                      <span className="text-slate-300 shrink-0">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                {ag.notes && <p className="mt-2 text-[11px] text-amber-600 bg-amber-50 rounded px-2 py-1">비고: {ag.notes}</p>}
              </div>
            ))}
            {mtg.actionItems.length > 0 && (
              <div className="border-t border-slate-200 pt-3">
                <h4 className="text-[13px] font-semibold text-slate-800 mb-2">Action Items</h4>
                <div className="space-y-1.5">
                  {mtg.actionItems.map((ai, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px]">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${ai.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"}`}>
                        {ai.done && "✓"}
                      </span>
                      <span className={`${ai.done ? "line-through text-slate-400" : "text-slate-700"}`}>{ai.task}</span>
                      <span className="ml-auto shrink-0 text-[11px] text-slate-400">{ai.assignee} · {ai.deadline}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ChartCard>
      ))}
    </>
  );
}

// ─────────────────────────────────────────
// 카테고리 상세 탭
// ─────────────────────────────────────────
function CategorySection({ category }: { category: Category }) {
  const cat = CATEGORIES[category];
  const projects = getProjectsByCategory(category);
  const tracks = TRACKS.filter((t) => t.category === category);
  const milestones = MILESTONES.filter((m) => m.category === category);

  return (
    <>
      {/* 카테고리 헤더 */}
      <div className={`border rounded-2xl p-5 ${cat.bgColor}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cat.icon}</span>
          <div>
            <h2 className={`text-xl font-bold ${cat.color}`}>{cat.label}</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">
              프로젝트 {projects.length}개 · 트랙 {tracks.length}개 · 마일스톤 {milestones.length}개
            </p>
          </div>
        </div>
      </div>

      {/* 관련 트랙 */}
      {tracks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((t) => (
            <ChartCard key={t.id}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-[#556B2F] flex items-center justify-center text-white text-[12px] font-bold">{t.id}</span>
                <div>
                  <h4 className="text-[14px] font-semibold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.lead} ({t.leadOrg}) · {t.period}</p>
                </div>
                <Badge label={STATUS_MAP[t.status].label} color={STATUS_MAP[t.status].color} />
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed mb-3">{t.description}</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-slate-500">진행률</span>
                <span className="ml-auto text-[11px] font-semibold">{t.progress}%</span>
              </div>
              <ProgressBar value={t.progress} />
              <div className="mt-2 text-[11px] text-slate-400">핵심 산출물: {t.keyOutput}</div>
            </ChartCard>
          ))}
        </div>
      )}

      {/* 프로젝트 목록 */}
      <div className="space-y-4">
        {projects.map((p) => (
          <ChartCard key={p.id}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-[15px] font-semibold text-slate-900">{p.name}</h4>
                  <Badge label={STATUS_MAP[p.status].label} color={STATUS_MAP[p.status].color} />
                </div>
                <p className="text-[12px] text-slate-500 mt-0.5">고객: {p.customer} · 담당: {p.assignee}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[20px] font-bold text-slate-900">{p.progress}%</span>
              </div>
            </div>
            <p className="text-[13px] text-slate-600 mt-3 leading-relaxed">{p.description}</p>
            <div className="mt-3">
              <ProgressBar value={p.progress} />
            </div>
            {p.keyData && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {Object.entries(p.keyData).map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-2 text-[12px]">
                    <span className="text-slate-400 shrink-0">{k}</span>
                    <span className="border-b border-dotted border-slate-200 flex-1 min-w-[20px]" />
                    <span className="text-slate-800 font-medium shrink-0">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>
        ))}
      </div>

      {/* K-CLP 전용: 성능 비교표 */}
      {category === "k_clp" && (
        <ChartCard title="ABSOL K-CLP 성능 비교" subtitle="vs PL-SP(N사) vs RADCOLUBE">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">시험 항목</th>
                  <th className="text-center py-2.5 px-3 text-[11px] font-medium text-emerald-700 bg-emerald-50">ABSOL K-CLP</th>
                  <th className="text-center py-2.5 px-3 text-[11px] font-medium text-slate-500">PL-SP (N사)</th>
                  <th className="text-center py-2.5 px-3 text-[11px] font-medium text-slate-500">RADCOLUBE</th>
                </tr>
              </thead>
              <tbody>
                {KCLP_PERFORMANCE.map((row) => (
                  <tr key={row.metric} className="border-b border-slate-100">
                    <td className="py-2.5 px-3 text-[12px] font-medium text-slate-700">{row.metric}</td>
                    <td className="py-2.5 px-3 text-[12px] text-center font-bold text-emerald-700 bg-emerald-50/50">{row.kclp}</td>
                    <td className="py-2.5 px-3 text-[12px] text-center text-slate-600">{row.competitor1}</td>
                    <td className="py-2.5 px-3 text-[12px] text-center text-slate-600">{row.competitor2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {/* K-CLP 전용: 경쟁사 현황 */}
      {category === "k_clp" && (
        <ChartCard title="현재 군 강중유 공급사 현황" subtitle="K-CLP이 대체해야 할 경쟁사">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">업체명</th>
                  <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">제품</th>
                  <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">현황</th>
                  <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">비고</th>
                </tr>
              </thead>
              <tbody>
                {KCLP_COMPETITORS.map((c) => (
                  <tr key={c.name} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-[12px] font-semibold text-slate-800">{c.name}</td>
                    <td className="py-2.5 px-3 text-[12px] text-slate-600">{c.product}</td>
                    <td className="py-2.5 px-3"><Badge label={c.status} color="bg-amber-50 text-amber-700" /></td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {/* K-CLP 전용: CLP 시장 데이터 */}
      {category === "k_clp" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="국내 CLP 시장" subtitle={`시장규모 약 ${fmt(MARKET_DATA.domestic.totalMarketKrw / 100000000)}억원`}>
            <div className="space-y-2">
              <div className="text-[12px] text-slate-600">공급사 {MARKET_DATA.domestic.suppliers}개 · 조달 단가 {MARKET_DATA.domestic.avgPricePerCN}/CN</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {MARKET_DATA.domestic.mainCompetitors.map((c) => (
                  <Badge key={c} label={c} color="bg-slate-100 text-slate-600" />
                ))}
              </div>
            </div>
          </ChartCard>
          <ChartCard title="글로벌 CLP 시장" subtitle={`2025 ${MARKET_DATA.global.marketSize2025} → 2033 ${MARKET_DATA.global.marketSize2033}`}>
            <div className="space-y-2">
              <div className="text-[12px] text-slate-600">CAGR {MARKET_DATA.global.cagr}</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {MARKET_DATA.global.leaders.map((l) => (
                  <Badge key={l} label={l} color="bg-blue-50 text-blue-600" />
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {Object.entries(MARKET_DATA.global.regionShare).map(([region, pct]) => {
                  const labels: Record<string, string> = { northAmerica: "북미", europe: "유럽", asiaPacific: "아시아태평양", mena: "중동/아프리카" };
                  return (
                    <div key={region} className="text-[11px]">
                      <div className="flex justify-between text-slate-500 mb-0.5"><span>{labels[region]}</span><span>{pct}%</span></div>
                      <ProgressBar value={pct} color="from-blue-400 to-blue-600" />
                    </div>
                  );
                })}
              </div>
            </div>
          </ChartCard>
        </div>
      )}

      {/* 제독제 전용: 논문 레퍼런스 */}
      {category === "decontaminant" && (
        <ChartCard title="기술 레퍼런스" subtitle={`참고 논문 ${RESEARCH_REFS.length}건`}>
          <div className="space-y-3">
            {RESEARCH_REFS.map((r) => (
              <div key={r.id} className="border border-slate-100 rounded-lg p-3 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-medium text-slate-800">{r.title}</span>
                  <Badge label={r.relevance === "high" ? "핵심" : "참고"} color={r.relevance === "high" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{r.authors} · {r.source} · {r.year}</p>
                <p className="text-[12px] text-slate-600 mt-1">{r.summary}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* 기타 추진 전용: 항공세정유 보잉 시험 결과 */}
      {category === "etc_projects" && (
        <ChartCard title="항공세정유 Boeing BSS7432 화학 적합성 평가" subtitle="Master STAGES Task2 GF · SMI Inc. 시험 (2022.07.20)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Sandwich Corrosion Test", "Acrylic Crazing Test", "Paint Softening Test", "Hydrogen Embrittlement Test"].map((test) => (
              <div key={test} className="border border-emerald-200 rounded-xl p-3 bg-emerald-50 text-center">
                <div className="text-[11px] text-slate-600 mb-1">{test}</div>
                <div className="text-[14px] font-bold text-emerald-700">Conforms</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-100 rounded-lg p-3">
              <div className="text-[11px] font-medium text-slate-500 mb-1">P&W 항공엔진 제조업체 승인</div>
              <div className="text-[13px] font-semibold text-slate-900">PMC 1247 (Cleaner, Aqueous Non-Butyl)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Approved Manufacturer: Master Chemical Corp. · Trim Task 2</div>
              <div className="text-[11px] text-slate-500">적용: 스틸·스테인리스·니켈합금·코발트합금·알루미늄·마그네슘·티타늄</div>
            </div>
            <div className="border border-slate-100 rounded-lg p-3">
              <div className="text-[11px] font-medium text-slate-500 mb-1">제품 사양</div>
              <div className="text-[12px] text-slate-700 space-y-0.5">
                <div>pH: 10.0~10.5 (원액) / 9.1~10.1 (희석)</div>
                <div>인화점: &gt;214°F (&gt;101°C)</div>
                <div>희석비: 최대 100:1</div>
                <div>VOC: 1 lbs/gal (저VOC)</div>
                <div>생분해성: OECD Method 301D 인증</div>
              </div>
            </div>
          </div>
        </ChartCard>
      )}

      {/* 카테고리별 마일스톤 */}
      {milestones.length > 0 && (
        <ChartCard title={`${cat.label} 마일스톤`} subtitle={`${milestones.filter((m) => m.done).length}/${milestones.length} 완료`}>
          <div className="space-y-0">
            {milestones.map((ms, i) => {
              const isLast = i === milestones.length - 1;
              const isOverdue = ms.date < new Date().toISOString().slice(0, 10) && !ms.done;
              return (
                <div key={ms.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${ms.done ? "bg-emerald-500" : isOverdue ? "bg-red-400" : "bg-slate-300"}`} />
                    {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
                  </div>
                  <div className={`pb-4 ${ms.done ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge label={ms.track} color="bg-slate-100 text-slate-600" />
                      <span className={`text-[13px] font-medium ${ms.done ? "line-through text-slate-400" : "text-slate-900"}`}>{ms.title}</span>
                      {isOverdue && <Badge label="지연" color="bg-red-100 text-red-600" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ms.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      )}
    </>
  );
}
