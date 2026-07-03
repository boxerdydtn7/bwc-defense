"use client";

import { useState } from "react";
import { MEETINGS, type MnCell, type MnTable } from "@/data/meetings";

function Cell({ v }: { v: MnCell }) {
  if (typeof v === "object" && v && "badge" in v) {
    return <span className={`mn-badge mn-b-${v.badge}`}>{v.text}</span>;
  }
  return <>{String(v ?? "")}</>;
}

function Table({ cols, rows }: { cols: string[]; rows: MnCell[][] }) {
  return (
    <div className="mn-tblwrap">
      <table className="mn-tbl">
        <thead>
          <tr>{cols.map((c, i) => <th key={i}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}><Cell v={c} /></td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ table }: { table: MnTable }) {
  return (
    <div className="mn-sec">
      <h3>{table.heading}</h3>
      <Table cols={table.cols} rows={table.rows} />
    </div>
  );
}

export default function MeetingMinutes() {
  const [activeId, setActiveId] = useState(MEETINGS[0]?.id);
  const m = MEETINGS.find((x) => x.id === activeId) || MEETINGS[0];
  if (!m) return null;

  return (
    <div className="mn-wrap">
      <div className="mn-head">
        <h2>📋 방산TF 회의록</h2>
        <div className="mn-selector">
          {MEETINGS.map((mt) => (
            <button
              key={mt.id}
              className={`mn-sel-btn${mt.id === m.id ? " active" : ""}`}
              onClick={() => setActiveId(mt.id)}
            >
              {mt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mn-card">
        <p className="mn-title">{m.title}</p>
        <div className="mn-meta">
          <b>일시</b> {m.date} · <b>장소</b> {m.place} · <b>기록</b> {m.recorder}<br />
          <b>참석</b> {m.attendees}<br />
          <b>주제</b> {m.topic}<br />
          <b>다음 회의</b> {m.next}
        </div>

        {m.agendas.map((a, i) => <Section key={i} table={a} />)}

        {m.actions && <Section table={m.actions} />}

        {m.appendix && (
          <div className="mn-sec">
            <details className="mn-collapse">
              <summary>▸ {m.appendix.title}</summary>
              <p style={{ fontSize: ".8rem", color: "#888", margin: "6px 0 10px" }}>{m.appendix.note}</p>
              <Table cols={m.appendix.cols} rows={m.appendix.rows} />
              <h3 style={{ marginTop: "16px" }}>접근 우선순위 요약 · 영업 액션 플랜</h3>
              <Table cols={m.appendix.priority.cols} rows={m.appendix.priority.rows} />
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
