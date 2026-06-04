// ── 범우연합 방산TF 대시보드 데이터 ──
// 제독제 · 세정유 · 윤활유 방산 진입 프로젝트 마스터 데이터

export type CertStatus = "not_started" | "in_progress" | "submitted" | "completed" | "blocked";
export type Phase = "research" | "development" | "testing" | "certification" | "bidding" | "supply";

export interface DefenseProduct {
  id: string;
  name: string;
  category: "decontaminant" | "cleaning_solvent" | "lubricant";
  milSpec: string;
  kdsSpec: string;
  description: string;
  currentPhase: Phase;
  progress: number;
  targetDate: string;
  assignee: string;
}

export interface CertificationItem {
  id: string;
  productId: string;
  name: string;
  type: "DQMS" | "QPL" | "KDS" | "KTR_TEST" | "MIL_TEST";
  status: CertStatus;
  estimatedCostKrw: number;
  actualCostKrw: number;
  startDate: string | null;
  targetDate: string;
  completedDate: string | null;
  notes: string;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  category: "certification" | "development" | "meeting" | "procurement" | "research";
  done: boolean;
}

export interface ResearchRef {
  id: string;
  title: string;
  authors: string;
  source: string;
  year: number;
  relevance: "high" | "medium" | "low";
  url: string;
  summary: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  planned: number;
  spent: number;
  remaining: number;
}

// ─────────────────────────────────────────
// 제품 포트폴리오
// ─────────────────────────────────────────
export const DEFENSE_PRODUCTS: DefenseProduct[] = [
  {
    id: "prod-001",
    name: "BWC-D100 수용성 제독제",
    category: "decontaminant",
    milSpec: "KDS 자체규격 (신규)",
    kdsSpec: "TBD",
    description: "화학작용제(HD/GD/VX) 대응 수용성 제독제. 항공기·장비 표면 제독용. 기존 세정유 기술 기반.",
    currentPhase: "research",
    progress: 15,
    targetDate: "2027-06",
    assignee: "마케팅팀 / R&D",
  },
  {
    id: "prod-002",
    name: "BWC-CS680 항공 세정유",
    category: "cleaning_solvent",
    milSpec: "MIL-PRF-680C",
    kdsSpec: "TBD",
    description: "탈지 세정유 Type II/III. 항공기 부품 세정·군수품 정비용. 기존 D-5000 계열 기술 활용.",
    currentPhase: "development",
    progress: 35,
    targetDate: "2027-03",
    assignee: "마케팅팀 / 생산팀",
  },
  {
    id: "prod-003",
    name: "BWC-LB32 방청윤활유",
    category: "lubricant",
    milSpec: "MIL-PRF-32033",
    kdsSpec: "TBD",
    description: "수분치환형 방청윤활유. 무기체계·차량 정비용. NATO O-190 호환 목표.",
    currentPhase: "research",
    progress: 10,
    targetDate: "2027-09",
    assignee: "마케팅팀 / R&D",
  },
];

// ─────────────────────────────────────────
// 인증 현황
// ─────────────────────────────────────────
export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "cert-001",
    productId: "common",
    name: "DQMS 국방품질경영시스템 인증",
    type: "DQMS",
    status: "not_started",
    estimatedCostKrw: 5_000_000,
    actualCostKrw: 0,
    startDate: null,
    targetDate: "2026-12",
    completedDate: null,
    notes: "ISO 9001 보유 시 통합심사 가능. 심사비 약 140만 원 + 컨설팅비 포함.",
  },
  {
    id: "cert-002",
    productId: "prod-002",
    name: "MIL-PRF-680C QPL 시험 (세정유)",
    type: "MIL_TEST",
    status: "not_started",
    estimatedCostKrw: 25_000_000,
    actualCostKrw: 0,
    startDate: null,
    targetDate: "2027-01",
    completedDate: null,
    notes: "시험항목 15개 (인화점, 증류, 부식 등). SPL Labs 또는 KTR 의뢰.",
  },
  {
    id: "cert-003",
    productId: "prod-002",
    name: "KTR 국내 시험성적서 (세정유)",
    type: "KTR_TEST",
    status: "not_started",
    estimatedCostKrw: 8_000_000,
    actualCostKrw: 0,
    startDate: null,
    targetDate: "2026-12",
    completedDate: null,
    notes: "국내 공인시험기관 성적서. 나라장터 입찰 시 필요.",
  },
  {
    id: "cert-004",
    productId: "prod-003",
    name: "MIL-PRF-32033 QPL 시험 (윤활유)",
    type: "MIL_TEST",
    status: "not_started",
    estimatedCostKrw: 50_000_000,
    actualCostKrw: 0,
    startDate: null,
    targetDate: "2027-06",
    completedDate: null,
    notes: "시험항목 25~40개. 산화안정성·저온점도·마모시험 포함. 고비용.",
  },
  {
    id: "cert-005",
    productId: "prod-001",
    name: "KDS 규격화 신청 (제독제)",
    type: "KDS",
    status: "not_started",
    estimatedCostKrw: 3_000_000,
    actualCostKrw: 0,
    startDate: null,
    targetDate: "2027-03",
    completedDate: null,
    notes: "기존 KDS 규격 없을 경우 신규 규격화 필요. 방사청/기품원 경유.",
  },
  {
    id: "cert-006",
    productId: "prod-001",
    name: "제독 성능 시험 (화학작용제 모사체)",
    type: "KTR_TEST",
    status: "not_started",
    estimatedCostKrw: 15_000_000,
    actualCostKrw: 0,
    startDate: null,
    targetDate: "2027-04",
    completedDate: null,
    notes: "CEPS, DFP, 디메토에이트 등 모사체 기반 제독 효율 시험.",
  },
];

// ─────────────────────────────────────────
// 마일스톤
// ─────────────────────────────────────────
export const MILESTONES: Milestone[] = [
  { id: "ms-001", date: "2026-06-10", title: "방산TF 킥오프 미팅", category: "meeting", done: false },
  { id: "ms-002", date: "2026-06-20", title: "KDSIS 규격 검색 및 매핑 완료", category: "research", done: false },
  { id: "ms-003", date: "2026-07-15", title: "DQMS 인증 컨설팅 업체 선정", category: "certification", done: false },
  { id: "ms-004", date: "2026-08-01", title: "BWC-CS680 시제품 배합 완료", category: "development", done: false },
  { id: "ms-005", date: "2026-09-01", title: "민군기술협력사업 공모 지원", category: "procurement", done: false },
  { id: "ms-006", date: "2026-10-01", title: "DQMS 1단계 심사", category: "certification", done: false },
  { id: "ms-007", date: "2026-11-01", title: "DQMS 2단계 심사 완료", category: "certification", done: false },
  { id: "ms-008", date: "2026-12-15", title: "KTR 시험성적서 접수 (세정유)", category: "certification", done: false },
  { id: "ms-009", date: "2027-01-15", title: "MIL-PRF-680 QPL 시험 시료 발송", category: "certification", done: false },
  { id: "ms-010", date: "2027-03-01", title: "BWC-CS680 QPL 등재 목표", category: "certification", done: false },
  { id: "ms-011", date: "2027-04-01", title: "나라장터 최초 입찰 참여", category: "procurement", done: false },
  { id: "ms-012", date: "2027-06-01", title: "제독제 프로토타입 완성", category: "development", done: false },
];

// ─────────────────────────────────────────
// 논문 레퍼런스
// ─────────────────────────────────────────
export const RESEARCH_REFS: ResearchRef[] = [
  {
    id: "ref-001",
    title: "과산화수소 증기를 이용한 유사화학작용제의 제독",
    authors: "한국화학공학회",
    source: "Korean Chemical Engineering Research (KCI)",
    year: 2014,
    relevance: "high",
    url: "https://kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001877479",
    summary: "H2O2 증기 + NH3 가스로 HD/GD/VX 모사체 완전 제독. CEPS 60분, DFP 30분 제독 달성.",
  },
  {
    id: "ref-002",
    title: "SEM/EDS 분석을 통한 수용성 제독제의 오염 항공기 적용 가능성 연구",
    authors: "한국군사과학기술학회",
    source: "KIMST Journal (KCI)",
    year: 2013,
    relevance: "high",
    url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001293686",
    summary: "수용성 제독제가 시판 세제 대비 제독 능력 50%+ 향상. 부식 위험 낮음. 항공기 적용 가능.",
  },
  {
    id: "ref-003",
    title: "생물 반응 시스템을 활용한 세균 포자 제독 시험",
    authors: "한국군사과학기술학회",
    source: "KIMST Journal",
    year: 2022,
    relevance: "medium",
    url: "https://jkimst.org/journal/view.php?number=2263",
    summary: "H2O2, DF-200, NaDCC, 퍼라세이프 4종 비교. 퍼라세이프 1.0%/5분 최적.",
  },
  {
    id: "ref-004",
    title: "키토산 처리 면직물의 군사용 화학작용제 모사체 분해 연구",
    authors: "한국섬유공학회",
    source: "KCI",
    year: 2020,
    relevance: "medium",
    url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002572622",
    summary: "키토산 코팅 직물의 화학작용제 자체 분해. 다기능 방호복 소재 연구.",
  },
  {
    id: "ref-005",
    title: "신경작용제 해독 기술 동향",
    authors: "한국군사과학기술학회",
    source: "KIMST Journal (KCI)",
    year: 2023,
    relevance: "medium",
    url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003141801",
    summary: "G계열/V계열 신경작용제 해독 기술 최신 동향 리뷰.",
  },
  {
    id: "ref-006",
    title: "화생방체계 기술수준 분석 및 발전방안 도출 연구",
    authors: "한국군사과학기술학회",
    source: "KIMST Journal (KCI)",
    year: 2023,
    relevance: "high",
    url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003104220",
    summary: "한국 CBRN 방호체계 기술수준 분석. 제독 분야 기술 갭 및 발전방향 제시.",
  },
];

// ─────────────────────────────────────────
// 예산
// ─────────────────────────────────────────
export const BUDGET: BudgetItem[] = [
  { id: "bgt-001", category: "DQMS 인증", planned: 5_000_000, spent: 0, remaining: 5_000_000 },
  { id: "bgt-002", category: "MIL-PRF-680 QPL (세정유)", planned: 25_000_000, spent: 0, remaining: 25_000_000 },
  { id: "bgt-003", category: "KTR 국내 시험 (세정유)", planned: 8_000_000, spent: 0, remaining: 8_000_000 },
  { id: "bgt-004", category: "MIL-PRF-32033 QPL (윤활유)", planned: 50_000_000, spent: 0, remaining: 50_000_000 },
  { id: "bgt-005", category: "제독제 규격화 + 시험", planned: 18_000_000, spent: 0, remaining: 18_000_000 },
  { id: "bgt-006", category: "시제품 개발 (원료·배합)", planned: 15_000_000, spent: 0, remaining: 15_000_000 },
  { id: "bgt-007", category: "컨설팅·출장·기타", planned: 10_000_000, spent: 0, remaining: 10_000_000 },
];

// ─────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────
export const PHASE_LABELS: Record<Phase, string> = {
  research: "리서치", development: "개발", testing: "시험",
  certification: "인증", bidding: "입찰", supply: "납품",
};
export const PHASE_COLORS: Record<Phase, string> = {
  research: "bg-purple-100 text-purple-700", development: "bg-blue-100 text-blue-700",
  testing: "bg-amber-100 text-amber-700", certification: "bg-emerald-100 text-emerald-700",
  bidding: "bg-orange-100 text-orange-700", supply: "bg-green-100 text-green-700",
};
export const STATUS_LABELS: Record<CertStatus, string> = {
  not_started: "미착수", in_progress: "진행 중", submitted: "심사 중",
  completed: "완료", blocked: "보류",
};
export const STATUS_COLORS: Record<CertStatus, string> = {
  not_started: "bg-slate-100 text-slate-600", in_progress: "bg-blue-100 text-blue-700",
  submitted: "bg-amber-100 text-amber-700", completed: "bg-emerald-100 text-emerald-700",
  blocked: "bg-red-100 text-red-700",
};
export const CATEGORY_LABELS: Record<DefenseProduct["category"], string> = {
  decontaminant: "제독제", cleaning_solvent: "세정유", lubricant: "윤활유",
};
export const CATEGORY_ICONS: Record<DefenseProduct["category"], string> = {
  decontaminant: "☢", cleaning_solvent: "🧴", lubricant: "🛢",
};
export const MS_ICONS: Record<Milestone["category"], string> = {
  certification: "📋", development: "🔬", meeting: "🤝", procurement: "🏛", research: "📚",
};

export function getTotalBudget() {
  const planned = BUDGET.reduce((s, b) => s + b.planned, 0);
  const spent = BUDGET.reduce((s, b) => s + b.spent, 0);
  return { planned, spent, remaining: planned - spent, rate: planned > 0 ? (spent / planned) * 100 : 0 };
}

export function getCertsForProduct(pid: string) {
  return CERTIFICATIONS.filter((c) => c.productId === pid || c.productId === "common");
}
