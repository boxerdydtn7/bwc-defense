"use client";

import { useEffect, useState } from "react";

type Notice = {
  id: string;
  title: string;
  agency: string;
  demand: string;
  posted: string;
  deadline: string;
  category: string;
  isDefense: boolean;
  url: string;
};
type Feed = { updatedAt: string; count: number; items: Notice[]; source?: string };

// "20260702150000" 또는 "2026-07-02 15:00" 같은 값 → Date
function parseDt(s: string): Date | null {
  if (!s) return null;
  const digits = s.replace(/\D/g, "");
  if (digits.length >= 8) {
    const y = +digits.slice(0, 4), mo = +digits.slice(4, 6) - 1, d = +digits.slice(6, 8);
    const h = +digits.slice(8, 10) || 0, mi = +digits.slice(10, 12) || 0;
    return new Date(y, mo, d, h, mi);
  }
  const t = new Date(s);
  return isNaN(t.getTime()) ? null : t;
}
function dday(deadline: string): number | null {
  const dl = parseDt(deadline);
  if (!dl) return null;
  return Math.ceil((dl.getTime() - Date.now()) / 86400000);
}
function isNew(posted: string): boolean {
  const p = parseDt(posted);
  return p ? Date.now() - p.getTime() < 2 * 86400000 : false; // 48시간 내
}

export default function NoticeAlerts() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 상대경로 — GitHub(/bwc-defense/)·Cloudflare(/) 양쪽에서 현재 경로 기준으로 해석됨
    fetch("notices.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Feed) => setFeed(d))
      .catch(() => setErr(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="border-2 border-blue-300 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-slate-50 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shadow-sm">🔔</span>
          <div>
            <h2 className="text-[17px] font-bold text-blue-900">입찰공고 자동 알람 — 나라장터</h2>
            <p className="text-[12px] text-blue-600 mt-0.5">
              매일 06:00 자동 수집 · 키워드: 윤활유·세정·방청·그리스·제독 등
            </p>
          </div>
        </div>
        {feed && (
          <div className="text-right">
            <div className="text-[22px] font-bold text-blue-700 leading-none">{feed.count}건</div>
            <div className="text-[10px] text-slate-400 mt-1">
              업데이트 {feed.updatedAt ? new Date(feed.updatedAt).toLocaleString("ko-KR") : "-"}
            </div>
          </div>
        )}
      </div>

      {loading && <div className="text-[13px] text-slate-400 py-6 text-center">불러오는 중…</div>}

      {err && (
        <div className="text-[13px] text-slate-500 bg-slate-50 rounded-xl p-4">
          아직 수집된 공고 파일이 없습니다. GitHub Actions의 &quot;Refresh notices &amp; deploy&quot;를 한 번 실행하면 채워집니다.
        </div>
      )}

      {feed && feed.items.length === 0 && !err && (
        <div className="text-[13px] text-slate-500 bg-slate-50 rounded-xl p-4">
          최근 10일간 키워드에 걸린 신규 공고가 없습니다.
        </div>
      )}

      {feed && feed.items.length > 0 && (
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {feed.items.map((n) => {
            const d = dday(n.deadline);
            const urgent = d !== null && d <= 3;
            return (
              <a
                key={n.id}
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-white border border-slate-200 rounded-xl p-3 hover:shadow-sm hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {n.isDefense && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#556B2F] text-white">군</span>
                      )}
                      {isNew(n.posted) && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">NEW</span>
                      )}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">{n.category}</span>
                    </div>
                    <div className="text-[13px] font-semibold text-slate-800 truncate">{n.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">{n.agency || n.demand}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    {d !== null ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${urgent ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-600"}`}>
                        {d >= 0 ? `마감 D-${d}` : "마감"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">마감일 미정</span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
