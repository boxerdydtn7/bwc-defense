"use client";

/*
 * 비밀번호 게이트 (2026-08-30 추가)
 * 정적 사이트(GitHub Pages) 특성상 클라이언트 검증이며 완전한 접근통제는 아님 —
 * 캐주얼한 외부 열람을 막는 용도. 비밀번호 변경은 아래 SITE_PASSWORD 수정 후 재배포.
 */

import { useEffect, useState } from "react";

const SITE_PASSWORD = "defense2026!";
const LS_KEY = "bwc-defense-auth";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null); // null = 확인 전(프리렌더 포함)
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      setOk(localStorage.getItem(LS_KEY) === "authenticated");
    } catch {
      setOk(false);
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === SITE_PASSWORD) {
      try { localStorage.setItem(LS_KEY, "authenticated"); } catch {}
      setOk(true);
    } else {
      setError(true);
      setPw("");
    }
  };

  if (ok) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {ok === null ? (
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <form
          onSubmit={submit}
          className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl"
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-600 flex items-center justify-center text-xl font-bold text-white">
            B
          </div>
          <h1 className="text-lg font-bold text-white">BWC Defense TF</h1>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            사내 전용 대시보드입니다. 비밀번호를 입력하세요.
          </p>
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(false); }}
            placeholder="비밀번호"
            autoFocus
            className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500"
          />
          {error && (
            <p className="text-xs text-red-400 mt-2">비밀번호가 올바르지 않습니다</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-semibold rounded-lg py-2.5"
          >
            입장
          </button>
        </form>
      )}
    </div>
  );
}
