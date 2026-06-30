// scripts/fetch-notices.mjs
// 나라장터(조달청) 입찰공고를 매일 자동 수집 → 우리 키워드만 골라 public/notices.json 저장
// GitHub Actions(notices.yml)에서 실행됨. Node 20 기준(내장 fetch 사용, 외부 패키지 0개).
//
// 필요한 것: 환경변수 DATA_GO_KR_KEY  (data.go.kr 에서 발급받은 "일반 인증키(Decoding)")
//
// ── 여기만 고치면 됨 ─────────────────────────────────────────────
const KEYWORDS = [
  "윤활유", "윤활제", "그리스", "세정", "세척", "방청", "방청유",
  "유압유", "작동유", "절삭유", "세정유", "제독", "부동액",
  "접점부활", "침투윤활", "WD-40", "WD40",
];
// 발주·수요기관 이름에 이게 들어가면 [군] 표시
const DEFENSE_MARKERS = [
  "육군", "해군", "공군", "국군", "방위사업청", "국방",
  "군수", "함대", "사령부", "정비창", "병참", "군단", "보급",
];
const DAYS_BACK = 10;       // 최근 며칠치 공고를 볼지
const MAX_ITEMS = 60;       // 대시보드에 저장할 최대 건수
// ────────────────────────────────────────────────────────────────

const KEY = process.env.DATA_GO_KR_KEY;
if (!KEY) {
  console.error("❌ DATA_GO_KR_KEY 환경변수가 없습니다. GitHub Secret을 확인하세요.");
  process.exit(1);
}

// 나라장터 입찰공고정보서비스. 만약 아래 주소가 404/오류면,
// data.go.kr 내 '활용신청' 상세페이지의 '요청주소'로 BASE만 바꾸면 됨.
const BASE = process.env.API_BASE || "https://apis.data.go.kr/1230000/ad/BidPublicInfoService";
const OPERATIONS = [
  { op: "getBidPblancListInfoThng", cat: "물품" }, // 윤활유·세정제 등은 보통 '물품'
  { op: "getBidPblancListInfoServc", cat: "용역" },
];

function fmt(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}`;
}

async function fetchPage(op, cat, pageNo) {
  const end = new Date();
  const begin = new Date(end.getTime() - DAYS_BACK * 86400000);
  const params = new URLSearchParams({
    serviceKey: KEY,
    inqryDiv: "1",                 // 1 = 공고게시일시 기준
    type: "json",
    inqryBgnDt: fmt(begin),
    inqryEndDt: fmt(end),
    pageNo: String(pageNo),
    numOfRows: "100",
  });
  const url = `${BASE}/${op}?${params.toString()}`;
  const res = await fetch(url);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); }
  catch {
    console.error(`⚠️ ${op}: JSON 아님(키/주소 의심). 응답 앞부분:`, text.slice(0, 300));
    return { items: [], total: 0 };
  }
  const body = json?.response?.body;
  const header = json?.response?.header;
  if (header && header.resultCode && header.resultCode !== "00") {
    console.error(`⚠️ ${op}: API 오류 ${header.resultCode} ${header.resultMsg}`);
    return { items: [], total: 0 };
  }
  let rows = body?.items ?? [];
  if (rows && !Array.isArray(rows)) rows = [rows];        // 1건일 때 객체로 옴
  return { items: rows.map((r) => ({ ...r, _cat: cat })), total: Number(body?.totalCount || 0) };
}

function isDefense(name = "") {
  return DEFENSE_MARKERS.some((m) => name.includes(m));
}
function matchKeyword(name = "") {
  return KEYWORDS.some((k) => name.toLowerCase().includes(k.toLowerCase()));
}

function normalize(r) {
  const title = r.bidNtceNm || "";
  const agency = r.ntceInsttNm || r.dminsttNm || "";
  const demand = r.dminsttNm || "";
  const deadline = r.bidClseDt || r.opengDt || r.bidNtceDt || "";
  const posted = r.bidNtceDt || "";
  const url = r.bidNtceDtlUrl || r.bidNtceUrl ||
    `https://www.g2b.go.kr/`; // 상세 링크 없으면 나라장터 메인
  return {
    id: `${r.bidNtceNo || ""}-${r.bidNtceOrd || ""}`,
    title,
    agency,
    demand,
    posted,
    deadline,
    category: r._cat,
    isDefense: isDefense(agency) || isDefense(demand) || isDefense(title),
    url,
  };
}

async function main() {
  const collected = [];
  for (const { op, cat } of OPERATIONS) {
    try {
      // 최대 3페이지(=300건)까지만. 키워드 매칭은 적으니 충분.
      for (let p = 1; p <= 3; p++) {
        const { items, total } = await fetchPage(op, cat, p);
        collected.push(...items);
        if (p * 100 >= total) break;
      }
    } catch (e) {
      console.error(`⚠️ ${op} 수집 실패:`, e.message);
    }
  }

  const seen = new Set();
  const filtered = collected
    .map(normalize)
    .filter((x) => x.title && matchKeyword(x.title))
    .filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)))
    .sort((a, b) => String(a.deadline).localeCompare(String(b.deadline)))
    .slice(0, MAX_ITEMS);

  const out = {
    updatedAt: new Date().toISOString(),
    source: "나라장터(조달청) 입찰공고정보서비스",
    keywords: KEYWORDS,
    count: filtered.length,
    items: filtered,
  };

  const fs = await import("node:fs");
  fs.mkdirSync("public", { recursive: true });
  fs.writeFileSync("public/notices.json", JSON.stringify(out, null, 2), "utf-8");
  console.log(`✅ 수집 완료: 전체 ${collected.length}건 중 키워드 매칭 ${filtered.length}건 저장`);
}

main().catch((e) => { console.error(e); process.exit(1); });
