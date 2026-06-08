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
  KCLP_PROCESS_PHASES, KCLP_SCHEDULE_HISTORY, KCLP_ACTION_ITEMS, KCLP_DOC_CHECKLIST,
  KIP_SUBMISSION_DOCS, REFERENCE_LINKS,
  CLP_SUPPLIERS, PROCUREMENT_HISTORY, REVENUE_SCENARIOS, REVENUE_ASSUMPTIONS,
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
  const criticalActions = KCLP_ACTION_ITEMS.filter((a) => a.urgency === "critical" && a.status !== "done");
  const doneDocCount = KCLP_DOC_CHECKLIST.filter((d) => d.status === "done").length;

  return (
    <>
      {/* 🚨 긴급 액션플랜 — 우수상용품 시범사용 */}
      <div className="border-2 border-red-300 rounded-2xl bg-gradient-to-br from-red-50 via-white to-amber-50 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white text-lg font-bold shadow-sm animate-pulse">!</span>
          <div>
            <h2 className="text-[17px] font-bold text-red-800">K-CLP 우수상용품 시범사용 — 접수 마감 7/31 확정</h2>
            <p className="text-[12px] text-red-600 mt-0.5">
              하반기 접수 마감: <span className="font-bold text-red-700">2026년 7월 31일 (확정)</span> · 공고일: 2026-06-04 ·
              <span className="font-bold"> D-{Math.max(0, Math.ceil((new Date("2026-07-31").getTime() - Date.now()) / 86400000))}</span>
            </p>
          </div>
        </div>

        {/* 일정 개요 */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
          <h3 className="text-[13px] font-bold text-emerald-800 mb-2">📋 핵심 일정 (확정)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[12px]">
            <div className="bg-white rounded-lg p-3 border border-emerald-100">
              <div className="text-emerald-600 font-semibold mb-1">접수 마감</div>
              <div className="text-slate-900 font-bold text-[14px]">7월 31일</div>
              <div className="text-slate-500 text-[10px]">KIP 공고 확인 완료</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-emerald-100">
              <div className="text-emerald-600 font-semibold mb-1">시험성적서 완료</div>
              <div className="text-slate-900 font-bold text-[14px]">7월 말 예정</div>
              <div className="text-slate-500 text-[10px]">3종 (저온유동성·염수분무·윤활성)</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-amber-100">
              <div className="text-amber-600 font-semibold mb-1">서류심사</div>
              <div className="text-slate-700 font-bold">8~9월</div>
              <div className="text-slate-500 text-[10px]">접수 마감 후 약 1개월</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-amber-100">
              <div className="text-amber-600 font-semibold mb-1">대면평가</div>
              <div className="text-slate-700 font-bold">10~11월</div>
              <div className="text-slate-500 text-[10px]">60점 이상 통과 (최고·최저 제외)</div>
            </div>
          </div>
        </div>

        {/* 리스크 경고 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <h3 className="text-[13px] font-bold text-amber-800 mb-2">⚠ 리스크 요인</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
            <div className="bg-white rounded-lg p-3 border border-amber-100">
              <div className="text-amber-600 font-semibold mb-1">시험성적서 vs 마감일</div>
              <div className="text-slate-700">시험성적서 7월말 완료 vs 접수 7/31 → <span className="font-bold text-amber-600">동시 완료 필요</span></div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-amber-100">
              <div className="text-amber-600 font-semibold mb-1">서류 6종 준비</div>
              <div className="text-slate-700">신청서·제안서·엑셀양식·디렉토리북·품질관리계획서 등 <span className="font-bold">6종 동시 진행</span></div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-100">
              <div className="text-red-600 font-semibold mb-1">놓치면?</div>
              <div className="text-slate-700">2027년 상반기(12월) → <span className="font-bold text-red-600">6개월 공백</span></div>
            </div>
          </div>
        </div>

        {/* 긴급 액션 (이번 주) */}
        <h3 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          이번 주 즉시 실행 (6/9~6/13)
        </h3>
        <div className="space-y-2 mb-5">
          {criticalActions.filter((a) => a.phase.includes("이번 주")).map((a) => {
            const statusIcon = a.status === "done" ? "✅" : a.status === "in_progress" ? "🔄" : "⬜";
            return (
              <div key={a.id} className="flex items-start gap-3 bg-white border border-red-200 rounded-xl p-3 hover:shadow-sm transition-shadow">
                <span className="text-[16px] mt-0.5 shrink-0">{statusIcon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-bold text-slate-900">{a.task}</span>
                    <Badge label="긴급" color="bg-red-100 text-red-700" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">담당: {a.assignee} · 마감: {a.deadline}</div>
                  {a.note && <p className="text-[11px] text-red-600 mt-1 bg-red-50 rounded px-2 py-0.5">{a.note}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* 전체 액션플랜 타임라인 */}
        <details className="group mb-5">
          <summary className="cursor-pointer text-[13px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform text-slate-400">▶</span>
            전체 액션플랜 ({KCLP_ACTION_ITEMS.length}개 항목)
          </summary>
          <div className="mt-3 space-y-2">
            {KCLP_ACTION_ITEMS.map((a) => {
              const urgColor = a.urgency === "critical" ? "border-red-200 bg-red-50/30" : a.urgency === "urgent" ? "border-amber-200 bg-amber-50/30" : "border-slate-200";
              const statusIcon = a.status === "done" ? "✅" : a.status === "in_progress" ? "🔄" : a.status === "blocked" ? "🚫" : "⬜";
              const urgLabel = a.urgency === "critical" ? "긴급" : a.urgency === "urgent" ? "중요" : "일반";
              const urgBadge = a.urgency === "critical" ? "bg-red-100 text-red-700" : a.urgency === "urgent" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600";
              return (
                <div key={a.id} className={`flex items-start gap-3 border rounded-lg p-3 ${urgColor}`}>
                  <span className="text-[14px] mt-0.5 shrink-0">{statusIcon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-semibold text-slate-800">{a.task}</span>
                      <Badge label={urgLabel} color={urgBadge} />
                      <Badge label={a.phase} color="bg-slate-100 text-slate-600" />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">담당: {a.assignee} · 마감: {a.deadline}</div>
                    {a.note && <p className="text-[11px] text-slate-500 mt-0.5">{a.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </details>

        {/* 제출 서류 체크리스트 */}
        <details className="group mb-5">
          <summary className="cursor-pointer text-[13px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform text-slate-400">▶</span>
            제출 서류 체크리스트 ({doneDocCount}/{KCLP_DOC_CHECKLIST.length} 완료)
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-center py-2 px-2 text-[11px] font-medium text-slate-500 w-8">상태</th>
                  <th className="text-left py-2 px-3 text-[11px] font-medium text-slate-500">서류명</th>
                  <th className="text-left py-2 px-3 text-[11px] font-medium text-slate-500">담당</th>
                  <th className="text-left py-2 px-3 text-[11px] font-medium text-slate-500">비고</th>
                </tr>
              </thead>
              <tbody>
                {KCLP_DOC_CHECKLIST.map((d) => {
                  const icon = d.status === "done" ? "✅" : d.status === "in_progress" ? "🔄" : "⬜";
                  return (
                    <tr key={d.name} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-2 px-2 text-center text-[14px]">{icon}</td>
                      <td className="py-2 px-3 text-[12px] text-slate-800">
                        {d.name}
                        {d.kolasMark && <span className="ml-1 text-[10px] text-blue-600 font-semibold">[KOLAS]</span>}
                      </td>
                      <td className="py-2 px-3 text-[12px] text-slate-600">{d.assignee}</td>
                      <td className="py-2 px-3 text-[11px] text-slate-400">{d.note || ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>

        {/* KIP 제출서류 R&R (붙임 1~6) */}
        <details className="group mb-5" open>
          <summary className="cursor-pointer text-[13px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform text-slate-400">▶</span>
            KIP 제출서류 R&R — 붙임 1~6 ({KIP_SUBMISSION_DOCS.filter((d) => d.status === "done").length}/{KIP_SUBMISSION_DOCS.length} 완료)
          </summary>
          <div className="mt-3 space-y-3">
            {KIP_SUBMISSION_DOCS.map((doc) => {
              const statusIcon = doc.status === "done" ? "✅" : doc.status === "in_progress" ? "🔄" : "⬜";
              const borderColor = doc.status === "done" ? "border-emerald-200 bg-emerald-50/30" : doc.status === "in_progress" ? "border-blue-200 bg-blue-50/30" : "border-slate-200";
              const fmtBadge = doc.format === "XLSX" ? "bg-emerald-100 text-emerald-700" : doc.format === "PDF" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";
              return (
                <div key={doc.id} className={`border rounded-xl p-4 ${borderColor}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-[16px] mt-0.5 shrink-0">{statusIcon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge label={doc.attachment} color="bg-slate-200 text-slate-700" />
                        <Badge label={doc.format} color={fmtBadge} />
                        <span className="text-[13px] font-bold text-slate-900">{doc.title}</span>
                      </div>
                      <p className="text-[12px] text-slate-600 mt-1">{doc.description}</p>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div><span className="text-slate-400">담당:</span> <span className="font-semibold text-slate-800">{doc.assignee}</span></div>
                        <div><span className="text-slate-400">지원:</span> <span className="text-slate-600">{doc.supporter}</span></div>
                        <div><span className="text-slate-400">마감:</span> <span className="font-semibold text-red-600">{doc.deadline}</span></div>
                      </div>
                      {doc.fields && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {doc.fields.map((f, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{f}</span>
                          ))}
                        </div>
                      )}
                      {doc.note && <p className="mt-1.5 text-[11px] text-amber-600 bg-amber-50 rounded px-2 py-0.5">{doc.note}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </details>

        {/* 참조 링크 */}
        <details className="group mb-5">
          <summary className="cursor-pointer text-[13px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform text-slate-400">▶</span>
            참조 링크 ({REFERENCE_LINKS.length}개)
          </summary>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REFERENCE_LINKS.map((link) => {
              const catColor = link.category === "공고" ? "bg-red-100 text-red-700" : link.category === "법규" ? "bg-purple-100 text-purple-700" : link.category === "대시보드" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600";
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
                  className="border border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-sm transition-all block">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={link.category} color={catColor} />
                    <span className="text-[13px] font-semibold text-blue-700">{link.label}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">↗</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{link.description}</p>
                </a>
              );
            })}
          </div>
        </details>

        {/* 절차 로드맵 */}
        <details className="group">
          <summary className="cursor-pointer text-[13px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform text-slate-400">▶</span>
            우수상용품 시범사용 전체 절차 (7단계)
          </summary>
          <div className="mt-3 space-y-0">
            {KCLP_PROCESS_PHASES.map((p, i) => {
              const isLast = i === KCLP_PROCESS_PHASES.length - 1;
              const stepColor = p.step <= 2 ? "bg-red-500" : p.step <= 4 ? "bg-amber-500" : "bg-slate-400";
              return (
                <div key={p.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${stepColor}`}>{p.step}</div>
                    {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold text-slate-900">{p.title}</span>
                      <span className="text-[11px] text-slate-400">{p.period}</span>
                    </div>
                    <p className="text-[12px] text-slate-600 mt-0.5">{p.description}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.details.map((d, j) => (
                        <span key={j} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 과거 접수 일정 패턴 */}
          <div className="mt-4 border-t border-slate-200 pt-3">
            <h4 className="text-[12px] font-semibold text-slate-600 mb-2">과거 접수 패턴 (일정 추정 근거)</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-1.5 px-2 text-[10px] font-medium text-slate-500">연도</th>
                    <th className="text-left py-1.5 px-2 text-[10px] font-medium text-slate-500">차수</th>
                    <th className="text-left py-1.5 px-2 text-[10px] font-medium text-slate-500">접수 시작</th>
                    <th className="text-left py-1.5 px-2 text-[10px] font-medium text-slate-500">접수 마감</th>
                    <th className="text-left py-1.5 px-2 text-[10px] font-medium text-slate-500">서류심사</th>
                    <th className="text-left py-1.5 px-2 text-[10px] font-medium text-slate-500">대면평가</th>
                  </tr>
                </thead>
                <tbody>
                  {KCLP_SCHEDULE_HISTORY.map((h, i) => {
                    const isCurrent = h.year === 2026 && h.half === "하반기";
                    return (
                      <tr key={i} className={`border-b border-slate-100 ${isCurrent ? "bg-red-50 font-semibold" : ""}`}>
                        <td className="py-1.5 px-2 text-[11px] text-slate-700">{h.year}</td>
                        <td className="py-1.5 px-2 text-[11px] text-slate-700">{h.half}</td>
                        <td className="py-1.5 px-2 text-[11px] text-slate-600">{h.open}</td>
                        <td className={`py-1.5 px-2 text-[11px] ${isCurrent ? "text-red-700 font-bold" : "text-slate-600"}`}>{h.close}</td>
                        <td className="py-1.5 px-2 text-[11px] text-slate-600">{h.docReview}</td>
                        <td className="py-1.5 px-2 text-[11px] text-slate-600">{h.faceEval}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              출처: <a href="https://www.kip.re.kr/kip/national" className="text-blue-500 underline" target="_blank" rel="noreferrer">한국조달연구원</a> ·
              <a href="https://www.bizinfo.go.kr" className="text-blue-500 underline ml-1" target="_blank" rel="noreferrer">기업마당</a> ·
              ☎ 02-796-8234 (물자분야 내선603)
            </p>
          </div>
        </details>
      </div>

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

      {/* 매출 시나리오 시뮬레이션 */}
      <ChartCard title="매출 시나리오 시뮬레이션" subtitle="K-CLP 군 채택 후 5개년 매출 추정 (단위: 만원)">
        {/* 시나리오 차트 */}
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={REVENUE_SCENARIOS[1].years} margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey="year" {...AXIS_STYLE} />
            <YAxis {...AXIS_STYLE} tickFormatter={(v) => `${(v / 10000).toFixed(1)}억`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, name) => {
              const labels: Record<string, string> = { clp: "강중유(CLP)", rust: "방청유", clean: "세정유", defense: "방산OEM" };
              const n = Number(v) || 0;
              return [`${fmt(n * 10000)}원 (${(n / 10000).toFixed(1)}억)`, labels[String(name)] || String(name)];
            }} />
            <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v) => {
              const labels: Record<string, string> = { clp: "강중유(CLP)", rust: "방청유", clean: "세정유", defense: "방산OEM" };
              return labels[v] || v;
            }} />
            <Bar dataKey="clp" stackId="a" fill="#556B2F" radius={[0, 0, 0, 0]} />
            <Bar dataKey="rust" stackId="a" fill="#8B9A6B" />
            <Bar dataKey="clean" stackId="a" fill="#3B82F6" />
            <Bar dataKey="defense" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* 3개 시나리오 비교 */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVENUE_SCENARIOS.map((s) => (
            <div key={s.name} className="border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[14px] font-bold text-slate-900">{s.name} 시나리오</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">{s.description}</p>
              <div className="space-y-1.5">
                {s.years.map((y) => (
                  <div key={y.year} className="flex items-center gap-2 text-[12px]">
                    <span className="text-slate-500 w-16 shrink-0">{y.year}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${Math.min((y.total / (s.name === "낙관" ? 1100 : s.name === "중립" ? 550 : 220)) * 100, 100)}%`,
                        backgroundColor: s.color,
                      }} />
                    </div>
                    <span className="font-semibold text-slate-800 w-14 text-right shrink-0">{(y.total / 10000).toFixed(1)}억</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 산정 근거 */}
        <details className="mt-4 group">
          <summary className="cursor-pointer text-[12px] font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform text-slate-400">▶</span>
            매출 산정 근거 (조달 실적 + Bottom-up)
          </summary>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(REVENUE_ASSUMPTIONS).map(([key, val]) => (
              <div key={key} className="border border-slate-100 rounded-lg p-3 text-[11px]">
                <div className="font-semibold text-slate-800 mb-1.5">{val.label}</div>
                {Object.entries(val).filter(([k]) => k !== "label").map(([k, v]) => (
                  <div key={k} className="flex gap-1 text-slate-500 mb-0.5">
                    <span className="text-slate-400 shrink-0">·</span>
                    <span><span className="text-slate-600 font-medium">{k}:</span> {String(v)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </details>
      </ChartCard>

      {/* 조달 실적 + 공급사 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 조달 실적 */}
        <ChartCard title="군 강중유 조달 실적" subtitle="나라장터 + D2B 공개 데이터">
          <div className="space-y-3">
            {PROCUREMENT_HISTORY.map((p, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge label={String(p.year)} color="bg-blue-100 text-blue-700" />
                  <span className="text-[13px] font-semibold text-slate-900">{p.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-400">예산:</span> <span className="font-bold text-emerald-700">{fmt(p.budget)}원</span></div>
                  {p.quantity && <div><span className="text-slate-400">수량:</span> <span className="font-semibold">{fmt(p.quantity)} CN</span></div>}
                  <div><span className="text-slate-400">발주처:</span> <span className="text-slate-600">{p.agency}</span></div>
                  <div><span className="text-slate-400">방식:</span> <span className="text-slate-600">{p.method}</span></div>
                </div>
                {p.note && <p className="mt-2 text-[10px] text-slate-400">{p.note}</p>}
              </div>
            ))}
            <p className="text-[10px] text-slate-400">출처: bidpro.co.kr, kjebi.com, jungi.net · 낙찰업체 정보는 나라장터 로그인 필요</p>
          </div>
        </ChartCard>

        {/* 공급사 분석 */}
        <ChartCard title="현 강중유 공급사 분석" subtitle={`${CLP_SUPPLIERS.length}개사 상세 (매출·규모·강약점)`}>
          <div className="space-y-2">
            {CLP_SUPPLIERS.map((s) => (
              <details key={s.name} className="border border-slate-200 rounded-xl overflow-hidden group">
                <summary className="px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors flex items-center gap-3">
                  <span className="text-[13px] font-bold text-slate-900">{s.name}</span>
                  <Badge label={s.totalRevenue} color="bg-emerald-50 text-emerald-700" />
                  <Badge label={s.employees} color="bg-slate-100 text-slate-600" />
                  <span className="ml-auto text-slate-400 group-open:rotate-90 transition-transform text-[12px]">▶</span>
                </summary>
                <div className="px-4 pb-3 border-t border-slate-100 pt-2 text-[11px] space-y-1.5">
                  <div><span className="text-slate-400">소재지:</span> {s.location}</div>
                  <div><span className="text-slate-400">설립:</span> {s.established}</div>
                  <div><span className="text-slate-400">제품:</span> {s.products}</div>
                  <div><span className="text-slate-400">군 관련:</span> <span className="text-blue-700">{s.militaryNote}</span></div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-emerald-50 rounded-lg p-2">
                      <div className="text-[10px] font-semibold text-emerald-700 mb-0.5">강점</div>
                      <div className="text-slate-600">{s.strength}</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <div className="text-[10px] font-semibold text-red-700 mb-0.5">약점</div>
                      <div className="text-slate-600">{s.weakness}</div>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
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
          <ChartCard title="국내 군용 CLP 시장" subtitle={`강중유 ~${fmt(MARKET_DATA.domestic.totalMarketKrw / 100000000)}억 / TAM ~${fmt(MARKET_DATA.domestic.tamKrw / 100000000)}억`}>
            <div className="space-y-2">
              <div className="text-[12px] text-slate-600">{MARKET_DATA.domestic.totalMarketNote}</div>
              <div className="text-[12px] text-blue-700 font-medium mt-1">{MARKET_DATA.domestic.tamNote}</div>
              <div className="text-[12px] text-slate-600 mt-1">조달단가: {MARKET_DATA.domestic.avgPricePerCN}</div>
              <div className="text-[11px] text-slate-500">연간 물량: {MARKET_DATA.domestic.annualQuantity}</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {MARKET_DATA.domestic.mainCompetitors.map((c) => (
                  <Badge key={c} label={c} color="bg-slate-100 text-slate-600" />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{MARKET_DATA.domestic.competitorNote}</p>
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
