// ── 범우연합 방산TF 대시보드 ──
// 4개 카테고리: K-CLP | 제독제 | 국방벤처사업 | 기타 추진
// 킥오프: 2026.06.04 (양산공장 3F)

export type Category = "k_clp" | "decontaminant" | "defense_venture" | "etc_projects";
export type Status = "not_started" | "planning" | "in_progress" | "submitted" | "completed" | "blocked";
export type TrackId = "T1" | "T2" | "T3" | "T4";

// ─────────────────────────────────────────
// 카테고리 메타
// ─────────────────────────────────────────
export const CATEGORIES: Record<Category, { label: string; icon: string; color: string; bgColor: string }> = {
  k_clp: { label: "K-CLP", icon: "🔫", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" },
  decontaminant: { label: "제독제", icon: "☢", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200" },
  defense_venture: { label: "국방벤처사업", icon: "🚀", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  etc_projects: { label: "기타 추진", icon: "✈", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
};

export const STATUS_MAP: Record<Status, { label: string; color: string }> = {
  not_started: { label: "미착수", color: "bg-slate-100 text-slate-600" },
  planning: { label: "기획", color: "bg-violet-100 text-violet-700" },
  in_progress: { label: "진행 중", color: "bg-blue-100 text-blue-700" },
  submitted: { label: "심사/대기", color: "bg-amber-100 text-amber-700" },
  completed: { label: "완료", color: "bg-emerald-100 text-emerald-700" },
  blocked: { label: "보류", color: "bg-red-100 text-red-700" },
};

// ─────────────────────────────────────────
// TF 구성원 (9명)
// ─────────────────────────────────────────
export interface TFMember {
  name: string;
  org: string;
  role: string;
  region: string;
  primary: string;
  secondary: string;
  tracks: TrackId[];
  strength: string;
}

export const TF_MEMBERS: TFMember[] = [
  { name: "김승만", org: "BWC", role: "PM", region: "전체 총괄", primary: "사업 총괄 / 사장단 보고 / 대군영업", secondary: "체계업체(한화·로템) 1차 접촉", tracks: ["T1","T2","T3","T4"], strength: "현장 경험·관리 / 방산 프로세스 이해" },
  { name: "이정호", org: "BIT", role: "R&D", region: "-", primary: "방청유 R&D + 군 관련 인증 총괄", secondary: "우수상용품 신청서 기술 파트", tracks: ["T1","T2"], strength: "방청유 개발·연구 과제 특화" },
  { name: "박성호", org: "BIT", role: "R&D", region: "-", primary: "세정유 R&D, 민간업체 적용 평가", secondary: "제독제 추진, 세정제 출시", tracks: ["T2","T4"], strength: "세정유 개발·연구 과제 특화" },
  { name: "김태형", org: "BIT", role: "R&D", region: "-", primary: "윤활유 R&D, K-CLP 시험성적서 마감", secondary: "OEM 윤활유·그리스 외주 평가", tracks: ["T1","T2"], strength: "윤활유 개발·연구 과제 특화" },
  { name: "신용수", org: "BEX", role: "영업", region: "수도권", primary: "수도권 영업, 시범부대·민간업체 발굴", secondary: "그룹 차원 정책·사업 발굴, 로드맵 전개", tracks: ["T1","T4"], strength: "전략 관리, 전체 로드맵 기획" },
  { name: "배성재", org: "KCC", role: "영업", region: "경남", primary: "시범사용 총괄, 軍 컴플라이언스 자문", secondary: "군 의사결정자 사전 정보 수집", tracks: ["T1","T3"], strength: "軍 장교 출신·군 이해도" },
  { name: "정창기", org: "BW", role: "영업", region: "전남", primary: "우수상용품 신청서 / G2B·D2B 등록", secondary: "MRO 프로세스 SCM 설계", tracks: ["T1","T4"], strength: "MRO 업체 출신·프로세스 이해" },
  { name: "이종률", org: "BWC", role: "영업", region: "전남", primary: "전남 영업, 특수장비 정비 자문", secondary: "정비창 운용 데이터 수집", tracks: ["T3","T4"], strength: "특수장비과 정비 이해도" },
  { name: "최은진", org: "BWC", role: "영업", region: "경북", primary: "정부 시스템·서류 등록 전체 총괄", secondary: "DAPA 행정 백업 (벤더등록 등)", tracks: ["T1","T3"], strength: "軍 부사관 출신·업무 이해도" },
];

// ─────────────────────────────────────────
// 4개 트랙
// ─────────────────────────────────────────
export interface Track {
  id: TrackId;
  category: Category;
  name: string;
  lead: string;
  leadOrg: string;
  period: string;
  keyOutput: string;
  status: Status;
  progress: number;
  description: string;
}

export const TRACKS: Track[] = [
  {
    id: "T1", category: "k_clp",
    name: "K-CLP 우수상용품 시범사용",
    lead: "배성재", leadOrg: "KCC",
    period: "6~12개월", keyOutput: "신청서 + 시험성적서 + 시범부대",
    status: "in_progress", progress: 20,
    description: "방위사업청 우수상용품 시범사용 하반기 차수 타깃. BW/KCC/BIT 명의 신청.",
  },
  {
    id: "T2", category: "defense_venture",
    name: "신규 1종 R&D (국방벤처)",
    lead: "BIT PI 1명 (미정)", leadOrg: "BIT",
    period: "2~3년", keyOutput: "R&D 과제 + 체계기업 확약서",
    status: "planning", progress: 10,
    description: "국방벤처 일반(3억) 또는 혁신기술(20억, 75% 정부부담). 2027년 3월 혁신기술 과제 신청 목표.",
  },
  {
    id: "T3", category: "defense_venture",
    name: "체계업체 영업 (한화·로템 등)",
    lead: "김승만", leadOrg: "BWC",
    period: "상시", keyOutput: "MOU + 공동개발 + 지역 영업망",
    status: "planning", progress: 5,
    description: "전 트랙의 전제조건. 체계업체 채택 없이는 T1·T2 모두 진행 불가.",
  },
  {
    id: "T4", category: "etc_projects",
    name: "신사업 — 군부대·민간 케미컬",
    lead: "신용수", leadOrg: "BEX",
    period: "상시", keyOutput: "실증 데이터 + 국방부 협업",
    status: "in_progress", progress: 15,
    description: "버스회사(중앙고속) 정비공장 접촉 중. 재향군인회 100% 지분. 민간 실증→군 연계.",
  },
];

// ─────────────────────────────────────────
// 카테고리별 프로젝트/아이템
// ─────────────────────────────────────────
export interface ProjectItem {
  id: string;
  category: Category;
  name: string;
  customer: string;
  status: Status;
  progress: number;
  description: string;
  assignee: string;
  keyData?: Record<string, string>;
}

export const PROJECTS: ProjectItem[] = [
  // ── K-CLP ──
  {
    id: "p-clp-01", category: "k_clp",
    name: "ABSOL K-CLP 우수상용품 등록",
    customer: "방위사업청 / 군부대",
    status: "in_progress", progress: 25,
    description: "유일하게 완성된 제품. 우수상용품 시범사용 하반기 차수 신청 목표. BW/KCC/BIT 명의.",
    assignee: "배성재(KCC) + 김태형(BIT)",
    keyData: {
      "내마모성": "0.41mm (최우수)",
      "염수분무": "60시간 A급 (경쟁사 4~10h)",
      "습윤상": "252시간 A급 (경쟁사 24~156h)",
      "유동점": "-54°C 이하 (경쟁사 -30°C)",
      "유효성분": "5종 (경쟁사 대비 최다)",
      "독자성분": "3종, PAO 합성유 자체수급",
    },
  },
  {
    id: "p-clp-02", category: "k_clp",
    name: "K-CLP 시험성적서 3종 마감",
    customer: "KTR / FITI",
    status: "in_progress", progress: 40,
    description: "저온유동성·염수분무·윤활성 3종 시험성적서. 7월말 완료 목표.",
    assignee: "김태형(BIT)",
  },
  {
    id: "p-clp-03", category: "k_clp",
    name: "K-CLP 시범부대 발굴",
    customer: "육해공 부대",
    status: "planning", progress: 10,
    description: "수도권 시범부대 발굴(신용수), 경남 군 컴플라이언스(배성재). 킥오프 후 전사 인맥 조사.",
    assignee: "신용수(BEX) + 배성재(KCC)",
  },
  {
    id: "p-clp-04", category: "k_clp",
    name: "G2B 업체 등록",
    customer: "나라장터",
    status: "in_progress", progress: 30,
    description: "BW 명의 G2B 등록 착수. 6/9까지 확인 목표.",
    assignee: "정창기(BW) + 최은진(BWC)",
  },

  {
    id: "p-clp-05", category: "k_clp",
    name: "K-CLP 용기 디자인 및 패키징",
    customer: "내부 (마케팅/생산)",
    status: "planning", progress: 5,
    description: "PP/ABS 용기, 에어로졸·스프레이 형태, 주사기 타입 검토. 국방색 기반 K 강조 디자인. 팜플렛·브로셔 제작.",
    assignee: "마케팅팀",
    keyData: {
      "용기 소재": "PP, ABS",
      "형태": "에어로졸, 스프레이, 주사기 타입",
      "디자인 컨셉": "국방색 / K 강조",
      "제작물": "팜플렛, 브로셔, 제품 스펙시트",
    },
  },
  {
    id: "p-clp-06", category: "k_clp",
    name: "해병대교육훈련장(포항) WD-40 기부",
    customer: "해병대교육훈련장 (포항)",
    status: "planning", progress: 10,
    description: "WD-40 만개 기부를 통한 군 관계 구축 및 K-CLP 시범사용 기회 확보. 기부 후 K-CLP 전환 제안.",
    assignee: "신용수(BEX) + 배성재(KCC)",
  },

  // ── 제독제 ──
  {
    id: "p-dec-01", category: "decontaminant",
    name: "장비제독제 개발 (수용성/분말형)",
    customer: "화생방 분야 군부대",
    status: "planning", progress: 5,
    description: "국방벤처 T2 후보 제품. 장비제독제용액 접근 (강알칼리). DS-2(한국루베) 대체. SDI 전량수입 시장. KRIT 벤처사업 선정 기업 정보 수집 중.",
    assignee: "박성호(BIT)",
    keyData: {
      "대응 작용제": "HD/GD/VX 모사체",
      "기존 제품": "DS-2(한국루베) — 장비제독제, KD-1(개인용)",
      "접근 방식": "장비제독제용액 (강알칼리), 수용성·분말형",
      "현 시장": "SDI 전량 수입 / KRIT 벤처사업 선정 기업 존재",
      "기술 기반": "H2O2 증기 + 수용성 제독",
      "MSDS 확인": "제독제 구성 물질 수집 진행",
      "목표 규격": "KDS 신규 규격화",
      "예상 시험비": "약 1,500만원",
    },
  },

  // ── 국방벤처사업 ──
  {
    id: "p-ven-01", category: "defense_venture",
    name: "국방벤처 과제 신청 (일반 3억)",
    customer: "방위사업청",
    status: "planning", progress: 10,
    description: "BIT 명의 신청. 후보: 세정유 / 제독제 / EP그리스. 6월 합동 검증 회의에서 1종 결정.",
    assignee: "BIT 3인 + 김승만(PM)",
    keyData: {
      "일반 과제": "3억원 규모",
      "혁신기술 과제": "20억원 (75% 정부부담)",
      "필수 게이트": "체계기업 확약서",
      "신청 목표": "2027년 3월",
    },
  },
  {
    id: "p-ven-02", category: "defense_venture",
    name: "체계업체 MOU 확보",
    customer: "한화·현대로템·LIG넥스원",
    status: "not_started", progress: 0,
    description: "T2 R&D 과제의 필수 게이트. 확약서 없으면 과제 통과 불가. 연말까지 1개사 목표.",
    assignee: "김승만(PM) + 배성재(KCC)",
    keyData: {
      "1순위": "현대로템 (K2전차·K9자주포, EP그리스)",
      "2순위": "한화에어로스페이스 (탄약·항공·드론)",
      "3순위": "LIG넥스원 (정밀유도·전자전·해상)",
      "접촉 방식": "1차 김승만 → 2차 BIT 기술미팅 → 3차 MOU",
    },
  },

  // ── 기타 추진 ──
  {
    id: "p-etc-01", category: "etc_projects",
    name: "항공세정유 (Master STAGES Task2 GF)",
    customer: "대한항공",
    status: "in_progress", progress: 45,
    description: "마스터케미칼 한국지사장·아시아 영업이사 미팅 완료. Boeing BSS7432 전항목 Conforms.",
    assignee: "신용수(BEX)",
    keyData: {
      "제품": "Master STAGES Task2 GF (Grime Fighter)",
      "제조사": "Master Fluid Solutions (미국 오하이오)",
      "P&W 승인": "PMC 1247 (Aqueous Non-Butyl Cleaner)",
      "Boeing 평가": "BSS7432 전항목 Conforms (부식·도장·수소취성)",
      "매입가": "460$/DM + 에이엠텍 마진 ≈ 90~100만원/DM",
      "특징": "Non-Butyl, 수용성, OECD 생분해성 인증, 100:1 희석 가능",
      "적용 금속": "스틸·스테인리스·니켈합금·코발트합금·알루미늄·마그네슘·티타늄",
    },
  },
  {
    id: "p-etc-02", category: "etc_projects",
    name: "수입차 윤활유 시장 진입",
    customer: "BMW·벤츠·볼보 서비스센터",
    status: "in_progress", progress: 30,
    description: "수입승용 307만대, 엔진오일 연간 1,683만L 시장. 벤츠 Mobil 40% 인상요청으로 대체공급 탐색중.",
    assignee: "마케팅팀",
    keyData: {
      "시장 규모": "수입승용 엔진오일 1,683만L/년 + 미션오일 349만L/년",
      "벤츠 기회": "Mobil 40% 인상요청 → 대체공급 탐색 중",
      "BMW 공급사": "Shell (연간 418만L)",
      "진입장벽": "OEM 승인규격(최고난도), 순정품 코드등록, 중앙구매 구조",
    },
  },
  {
    id: "p-etc-03", category: "etc_projects",
    name: "버스·공업소 케미컬 사업",
    customer: "중앙고속 정비공장",
    status: "planning", progress: 10,
    description: "재향군인회 100% 지분 중앙고속. 정비공장 방문 후 본사 미팅 요청 예정. 민간 실증→군 연계.",
    assignee: "신용수(BEX)",
  },
  {
    id: "p-etc-04", category: "etc_projects",
    name: "다산기공 ABSOL K-CLP 납품",
    customer: "다산기공 (총기부품 방산업체)",
    status: "in_progress", progress: 35,
    description: "국내 방산업체(총기부품류). K-CLP 소개 및 성능 시연 완료(2026.03.24).",
    assignee: "영업팀",
  },
  {
    id: "p-etc-05", category: "etc_projects",
    name: "창원 종합정비창 엔진오일",
    customer: "창원 종합정비창",
    status: "planning", progress: 5,
    description: "종합정비소, 현재 현대에 독점 납품 엔진오일(발보린). 대체 공급 기회 탐색.",
    assignee: "이종률(BWC)",
  },
  {
    id: "p-etc-06", category: "etc_projects",
    name: "포신 자동세척 장비 개발",
    customer: "육군 / 방산업체",
    status: "not_started", progress: 0,
    description: "포신 내부 자동 세척 장비 개발. K-CLP 또는 세정유 연계 가능. 신규 아이템.",
    assignee: "TBD",
  },
  {
    id: "p-etc-07", category: "etc_projects",
    name: "군용요소수 (상용차량용)",
    customer: "군 상용차량 운용부대",
    status: "planning", progress: 5,
    description: "군용 상용차량용 요소수. 가격 경쟁 시장. 진입 가능성 검토 중.",
    assignee: "TBD",
  },
];

// ─────────────────────────────────────────
// 마일스톤 타임라인
// ─────────────────────────────────────────
export interface Milestone {
  id: string;
  date: string;
  title: string;
  track: TrackId | "ALL";
  category: Category;
  done: boolean;
}

export const MILESTONES: Milestone[] = [
  { id: "ms-01", date: "2026-06-04", title: "방산TF 킥오프 미팅 (양산공장 3F)", track: "ALL", category: "k_clp", done: true },
  { id: "ms-02", date: "2026-06-09", title: "BW 명의 G2B 등록 착수 확인", track: "T1", category: "k_clp", done: false },
  { id: "ms-03", date: "2026-06-30", title: "합동 검증 회의 — 국방벤처 제품 1종 결정", track: "T2", category: "defense_venture", done: false },
  { id: "ms-04", date: "2026-06-30", title: "군부대·방산기업 인맥 조사 (전사)", track: "T3", category: "defense_venture", done: false },
  { id: "ms-11", date: "2026-07-03", title: "전체 자료 취합 완료 (마켓조사·디자인·판매처·온라인)", track: "T1", category: "k_clp", done: false },
  { id: "ms-12", date: "2026-07-03", title: "배성재 팀장 B2B 조사 완료", track: "T1", category: "k_clp", done: false },
  { id: "ms-05", date: "2026-07-31", title: "K-CLP 시험성적서 3종 완료", track: "T1", category: "k_clp", done: false },
  { id: "ms-06", date: "2026-09-30", title: "한화·로템 등 체계업체 1차 접촉", track: "T3", category: "defense_venture", done: false },
  { id: "ms-13", date: "2026-06-13", title: "⚠ KIP 전화 — 하반기 접수 마감일 확인 (긴급)", track: "T1", category: "k_clp", done: false },
  { id: "ms-14", date: "2026-06-13", title: "⚠ 시험성적서 3종 최단 완료일 확인 (긴급)", track: "T1", category: "k_clp", done: false },
  { id: "ms-15", date: "2026-06-27", title: "제품설명서·품질관리계획서 초안 완료", track: "T1", category: "k_clp", done: false },
  { id: "ms-07", date: "2026-07-04", title: "⚠ 우수상용품 하반기 온라인 접수 (추정 마감)", track: "T1", category: "k_clp", done: false },
  { id: "ms-08", date: "2026-09-30", title: "대면평가 발표자료 준비 완료", track: "T1", category: "k_clp", done: false },
  { id: "ms-09", date: "2026-12-31", title: "체계업체 1개사 공동개발 MOU 가능 여부 확인", track: "T3", category: "defense_venture", done: false },
  { id: "ms-10", date: "2027-03-31", title: "혁신기술 과제 신청", track: "T2", category: "defense_venture", done: false },
];

// ─────────────────────────────────────────
// K-CLP 성능 비교
// ─────────────────────────────────────────
export interface PerformanceData {
  metric: string;
  unit: string;
  kclp: string;
  competitor1: string;
  competitor1Name: string;
  competitor2: string;
  competitor2Name: string;
  kclpBest: boolean;
}

export const KCLP_PERFORMANCE: PerformanceData[] = [
  { metric: "내마모성", unit: "mm", kclp: "0.41", competitor1: "0.57", competitor1Name: "PL-SP(N사)", competitor2: "0.55", competitor2Name: "RADCOLUBE", kclpBest: true },
  { metric: "염수분무", unit: "시간/등급", kclp: "60h A급", competitor1: "4h", competitor1Name: "PL-SP(N사)", competitor2: "12h", competitor2Name: "RADCOLUBE", kclpBest: true },
  { metric: "습윤상", unit: "시간/등급", kclp: "252h A급", competitor1: "24h", competitor1Name: "PL-SP(N사)", competitor2: "156h", competitor2Name: "RADCOLUBE", kclpBest: true },
  { metric: "유동점", unit: "°C", kclp: "-54 이하", competitor1: "-30 이하", competitor1Name: "PL-SP(N사)", competitor2: "-", competitor2Name: "RADCOLUBE", kclpBest: true },
  { metric: "열안정성 산값증가", unit: "mgKOH/g", kclp: "0.93", competitor1: "-", competitor1Name: "PL-SP(N사)", competitor2: "-", competitor2Name: "RADCOLUBE", kclpBest: true },
  { metric: "한계시험(84h)", unit: "등급", kclp: "B급(1~10%녹)", competitor1: "E급(51~100%)", competitor1Name: "PL-SP(N사)", competitor2: "D급(26~50%)", competitor2Name: "RADCOLUBE", kclpBest: true },
];

// ─────────────────────────────────────────
// 트랙 간 자산 흐름
// ─────────────────────────────────────────
export interface AssetFlow {
  asset: string;
  from: TrackId;
  to: TrackId[];
  effect: string;
}

export const ASSET_FLOWS: AssetFlow[] = [
  { asset: "K-CLP 시범사용 통과", from: "T1", to: ["T2"], effect: "신청서 '기업 역량' +10점 가점" },
  { asset: "체계기업 MOU", from: "T3", to: ["T2"], effect: "R&D 과제 확약서 (필수 게이트)" },
  { asset: "민간 실증 데이터", from: "T4", to: ["T1"], effect: "시범사용 통과율 상승" },
  { asset: "R&D 과제 진행 이력", from: "T2", to: ["T1","T3","T4"], effect: "기술력 입증 (신뢰도 +1.5%)" },
  { asset: "지역 영업 데이터", from: "T3", to: ["T1","T4"], effect: "시범부대 발굴 / 민간 진입 가속" },
];

// ─────────────────────────────────────────
// CLP 시장 데이터
// ─────────────────────────────────────────
export const MARKET_DATA = {
  domestic: {
    totalMarketKrw: 2_000_000_000,
    suppliers: 6,
    mainCompetitors: ["고려케미칼", "동진케미칼", "대성화학", "미유테크", "그린바이오켐", "비우켐", "한국하우톤"],
    avgPricePerCN: "5,314~5,920원",
  },
  global: {
    marketSize2025: "$121.6M~$138M",
    marketSize2033: "$157.6M",
    cagr: "3.06%",
    leaders: ["Break-Free(12.5%)", "Ballistol(9.8%)", "Hoppe's(8.6%)", "Otis(7.9%)"],
    regionShare: { northAmerica: 46, europe: 26, asiaPacific: 18, mena: 10 },
  },
  defenseCompanies: {
    total: 84,
    major: 59,
    general: 25,
    byField: [
      { field: "기동", count: 14 }, { field: "통신전자", count: 15 },
      { field: "항공유도", count: 14 }, { field: "화력", count: 10 },
      { field: "기타", count: 10 }, { field: "탄약", count: 8 },
      { field: "함정", count: 7 }, { field: "화생방", count: 5 }, { field: "광학", count: 1 },
    ],
  },
};

// ─────────────────────────────────────────
// 논문 레퍼런스
// ─────────────────────────────────────────
export interface ResearchRef {
  id: string;
  title: string;
  authors: string;
  source: string;
  year: number;
  relevance: "high" | "medium" | "low";
  summary: string;
}

export const RESEARCH_REFS: ResearchRef[] = [
  { id: "ref-01", title: "과산화수소 증기를 이용한 유사화학작용제의 제독", authors: "한국화학공학회", source: "KCI", year: 2014, relevance: "high", summary: "H2O2 증기 + NH3 가스로 HD/GD/VX 모사체 완전 제독. CEPS 60분, DFP 30분." },
  { id: "ref-02", title: "SEM/EDS 분석을 통한 수용성 제독제의 항공기 적용 가능성", authors: "한국군사과학기술학회", source: "KIMST", year: 2013, relevance: "high", summary: "수용성 제독제 세제 대비 50%+ 향상. 부식 위험 낮음. 항공기 적용 가능." },
  { id: "ref-03", title: "화생방체계 기술수준 분석 및 발전방안", authors: "한국군사과학기술학회", source: "KIMST", year: 2023, relevance: "high", summary: "한국 CBRN 방호체계 기술수준 분석. 제독 분야 기술 갭 및 발전방향." },
  { id: "ref-04", title: "생물 반응 시스템을 활용한 세균 포자 제독 시험", authors: "한국군사과학기술학회", source: "KIMST", year: 2022, relevance: "medium", summary: "H2O2, DF-200, NaDCC, 퍼라세이프 비교. 퍼라세이프 1.0%/5분 최적." },
  { id: "ref-05", title: "신경작용제 해독 기술 동향", authors: "한국군사과학기술학회", source: "KIMST", year: 2023, relevance: "medium", summary: "G계열/V계열 신경작용제 해독 기술 최신 동향 리뷰." },
];

// ─────────────────────────────────────────
// 군 대체 가능 제품 매핑
// ─────────────────────────────────────────
export interface MilitaryReplacement {
  id: string;
  militaryItem: string;
  currentSupplier: string;
  milSpec: string;
  bwcProduct: string;
  bwcCategory: string;
  productCount: number;
  feasibility: 1 | 2 | 3; // 1=장기, 2=유망, 3=즉시가능
  priority: "최우선" | "핵심" | "유망" | "검토" | "장기";
  targetCustomer: string;
  action: string;
  notes: string;
}

export const MILITARY_REPLACEMENTS: MilitaryReplacement[] = [
  {
    id: "mr-01", militaryItem: "강중유 (CLP)", currentSupplier: "그린바이오캠, 한국하우톤",
    milSpec: "MIL-PRF-63460", bwcProduct: "ABSOL K-CLP", bwcCategory: "유통소비재(BEX)",
    productCount: 1, feasibility: 3, priority: "최우선",
    targetCustomer: "전 군 부대 (육해공 정비반)",
    action: "우수상용품 시범사용 신청 → 시험성적서 3종 → 시범부대 운용",
    notes: "유일하게 완성된 제품. 성능 경쟁사 압도. T1 트랙 집중.",
  },
  {
    id: "mr-02", militaryItem: "탈지세정유 (Degreaser)", currentSupplier: "외산(쉘/모빌), 국내 중소",
    milSpec: "MIL-PRF-680 Type II/III", bwcProduct: "BW CLEAN 시리즈 (NW/W 계열)", bwcCategory: "세정유",
    productCount: 147, feasibility: 3, priority: "핵심",
    targetCustomer: "각 군 정비창, 방산업체 세척라인",
    action: "KTR 시험성적서 → 나라장터 등록 → 정비창 시범 납품",
    notes: "BW CLEAN NW(비수용성 탈지), BW CLEAN W(수용성 세정) 모두 보유. 창원/대구/인천 정비창 타깃.",
  },
  {
    id: "mr-03", militaryItem: "방청유 (장비·탄약 보관)", currentSupplier: "한국하우톤(PL-SP), 수입품",
    milSpec: "MIL-PRF-3150 / MIL-C-16173", bwcProduct: "BW RUSTOP 시리즈 (P/AP/VP/M)", bwcCategory: "방청유",
    productCount: 205, feasibility: 3, priority: "핵심",
    targetCustomer: "탄약정비창, 장비보관부대, 방산업체",
    action: "기존 PL-SP 대비 성능 비교 데이터 확보 → 정비창 시범 → 조달 등록",
    notes: "BW RUSTOP P(석유계), AP(수용성), VP(기화성 방청), M(유중막형) 전 라인 보유. K-CLP로 이미 하우톤 성능 압도 입증.",
  },
  {
    id: "mr-04", militaryItem: "방청왁스/코팅 (장기보관)", currentSupplier: "수입품",
    milSpec: "MIL-C-11796 / MIL-PRF-16173E", bwcProduct: "BW COAT 시리즈 (M/C/E/CA)", bwcCategory: "방청왁스/코팅제",
    productCount: 65, feasibility: 2, priority: "유망",
    targetCustomer: "야전 예비품 보관, 장기저장 장비",
    action: "군 보관 규격 매핑 → 기존 코팅제 대비 성능시험 → 조달 등록",
    notes: "BW COAT M(용제형), C(핫멜트), E(수용성), CA(연질왁스). 장기보관 물자에 적합.",
  },
  {
    id: "mr-05", militaryItem: "절삭유 (방산업체 가공라인)", currentSupplier: "다수 (경쟁 치열)",
    milSpec: "업체 자체규격", bwcProduct: "BW COOL (수용성) + BW CUT (비수용성)", bwcCategory: "절삭유",
    productCount: 685, feasibility: 3, priority: "핵심",
    targetCustomer: "현대로템, 한화, LIG넥스원 등 체계업체 가공라인",
    action: "T3 체계업체 영업 시 절삭유 동반 제안 → 가공라인 시험 → 연간 공급계약",
    notes: "범우의 본업이자 최대 강점. 685종 풀라인업. 체계업체 진입 시 가장 현실적인 무기.",
  },
  {
    id: "mr-06", militaryItem: "소성가공유 (탄피성형/장갑판)", currentSupplier: "수입품",
    milSpec: "업체 자체규격", bwcProduct: "BW FINEPRESS/FORM/DRAW", bwcCategory: "소성유",
    productCount: 232, feasibility: 2, priority: "유망",
    targetCustomer: "풍산(탄약), 한화(탄약/장갑), 부품 프레스 업체",
    action: "풍산·한화 탄약 라인 소성유 현황 파악 → 시험 제안",
    notes: "탄피 드로잉, 장갑판 프레스 등에 BW FINEPRESS/FINEDRAW 적용 가능.",
  },
  {
    id: "mr-07", militaryItem: "열처리유 (방산부품)", currentSupplier: "수입품",
    milSpec: "업체 자체규격", bwcProduct: "BW 열처리유 시리즈", bwcCategory: "열처리유",
    productCount: 44, feasibility: 2, priority: "유망",
    targetCustomer: "방산 열처리 업체, 체계업체 열처리 라인",
    action: "방산 부품 열처리 현황 조사 → 기존 유종 대비 시험",
    notes: "총기부품, 전차부품 등 열처리 공정에 적용.",
  },
  {
    id: "mr-08", militaryItem: "다용도 방청윤활제", currentSupplier: "WD-40(수입)",
    milSpec: "-", bwcProduct: "WD-40 (자체 유통) + ABSOL K-CLP", bwcCategory: "유통소비재(BEX)",
    productCount: 36, feasibility: 3, priority: "최우선",
    targetCustomer: "전 군 부대 일반 정비",
    action: "해병대 WD-40 기부 → K-CLP 전환 제안 / 조달 등록",
    notes: "WD-40 한국 유통을 범우가 하고 있으므로 군 채널 즉시 활용 가능. K-CLP으로 업그레이드 전환.",
  },
  {
    id: "mr-09", militaryItem: "항공세정유", currentSupplier: "외산",
    milSpec: "Boeing BSS7432 / P&W PMC 1247", bwcProduct: "Master STAGES Task2 GF (수입)", bwcCategory: "세정유",
    productCount: 1, feasibility: 2, priority: "유망",
    targetCustomer: "대한항공, 공군 정비창",
    action: "대한항공 납품 → 공군 항공정비창 확장",
    notes: "Boeing/P&W 승인 완료. 매입 460$/DM. 대한항공 미팅 진행 중.",
  },
  {
    id: "mr-10", militaryItem: "제독제 (CBRN)", currentSupplier: "DS-2(한국루베), SDI(수입)",
    milSpec: "KDS 신규", bwcProduct: "개발 예정 (수용성/분말형)", bwcCategory: "신규개발",
    productCount: 0, feasibility: 1, priority: "장기",
    targetCustomer: "화생방 부대",
    action: "국방벤처 과제 → R&D → 규격화",
    notes: "2~3년 장기 프로젝트. T2 트랙.",
  },
];

// ─────────────────────────────────────────
// R&R 상세 지시사항
// ─────────────────────────────────────────
export interface RRDetail {
  name: string;
  org: string;
  weeklyTasks: string[];
  monthlyTasks: string[];
  kpiMetrics: string[];
  reportTo: string;
  deadlines: { task: string; date: string }[];
}

export const RR_DETAILS: RRDetail[] = [
  {
    name: "김승만 (PM)", org: "BWC",
    weeklyTasks: [
      "전 트랙 진행현황 취합 및 주간보고 작성",
      "체계업체(한화·로템·LIG) 접촉 스케줄 관리",
      "사장단 보고 자료 준비 (월 1회)",
    ],
    monthlyTasks: [
      "방산TF 월례회의 주관 (전원 참석)",
      "체계업체 미팅 1건 이상 진행",
      "MOU/NDA 법무검토 진행 현황 확인",
    ],
    kpiMetrics: ["체계업체 접촉 건수", "MOU 진행률", "월례보고 적시 제출"],
    reportTo: "박태준 사장",
    deadlines: [
      { task: "인원별 R&R 분배 확정", date: "2026-06-30" },
      { task: "한화 or 로템 1차 접촉", date: "2026-09-30" },
      { task: "MOU 1개사 가능 여부 확인", date: "2026-12-31" },
    ],
  },
  {
    name: "이정호 (R&D 방청유)", org: "BIT",
    weeklyTasks: [
      "K-CLP 관련 시험성적서 기술 지원",
      "방청유 MIL-PRF-3150 규격 매핑 작업",
      "BW RUSTOP 시리즈 군 적합성 자체 평가",
    ],
    monthlyTasks: [
      "우수상용품 신청서 §3 기술 파트 작성",
      "방청유 군 규격 대비 성능 시험 계획 수립",
      "국방벤처 후보 제품 기술 검토 의견서",
    ],
    kpiMetrics: ["시험성적서 기술 파트 완성도", "규격 매핑 건수", "자체 평가 보고서"],
    reportTo: "김승만 PM",
    deadlines: [
      { task: "BW RUSTOP vs PL-SP 성능비교 데이터", date: "2026-08-31" },
      { task: "우수상용품 신청서 기술파트 초안", date: "2026-09-15" },
    ],
  },
  {
    name: "박성호 (R&D 세정유)", org: "BIT",
    weeklyTasks: [
      "BW CLEAN 시리즈 중 군 적합 제품 선별",
      "MIL-PRF-680 규격 대비 자체 성능 평가",
      "제독제 구성물질 MSDS 수집·분석",
    ],
    monthlyTasks: [
      "세정유 군 시장 진입 기술 보고서",
      "제독제 개발 로드맵 업데이트",
      "민간(버스·공업소) 적용 평가 결과 정리",
    ],
    kpiMetrics: ["BW CLEAN 군 적합 제품 선별 건수", "MIL-PRF-680 자체시험 항목 수", "제독제 MSDS 수집률"],
    reportTo: "김승만 PM",
    deadlines: [
      { task: "BW CLEAN 군 적합 TOP 5 제품 선정", date: "2026-07-31" },
      { task: "MIL-PRF-680 자체 예비시험 완료", date: "2026-09-30" },
    ],
  },
  {
    name: "김태형 (R&D 윤활유)", org: "BIT",
    weeklyTasks: [
      "K-CLP 시험성적서 3종 진행 관리 (저온유동성·염수분무·윤활성)",
      "산업용윤활유 군 규격 매핑",
      "OEM 그리스 외주 가능 업체 조사",
    ],
    monthlyTasks: [
      "시험성적서 진행률 보고",
      "윤활유 군 규격(MIL-PRF-2105 등) 대비 자체 평가",
      "EP그리스 체계업체 연계 기술 자료 준비",
    ],
    kpiMetrics: ["시험성적서 3종 완료율", "군 규격 매핑 건수", "그리스 외주 업체 선정"],
    reportTo: "김승만 PM",
    deadlines: [
      { task: "시험성적서 3종 완료", date: "2026-07-31" },
      { task: "EP그리스 기술자료 초안", date: "2026-08-31" },
    ],
  },
  {
    name: "신용수 (전략/수도권)", org: "BEX",
    weeklyTasks: [
      "수도권 군부대·방산업체 접촉 리스트 관리",
      "대시보드 데이터 업데이트·전체 로드맵 관리",
      "항공세정유(대한항공) 미팅 후속 관리",
    ],
    monthlyTasks: [
      "마케팅팀 명의 사업 보고서 작성",
      "대시보드 월간 업데이트·사장단 보고 자료",
      "WD-40 기부 + K-CLP 전환 전략 실행",
      "버스·공업소(중앙고속) 접촉 진행",
    ],
    kpiMetrics: ["수도권 접촉 건수", "시범부대 발굴 건수", "대한항공 진행률", "대시보드 업데이트율"],
    reportTo: "김승만 PM / 임건 이사",
    deadlines: [
      { task: "해병대 WD-40 기부 실행", date: "2026-07-31" },
      { task: "수도권 시범부대 1곳 확보", date: "2026-10-31" },
      { task: "대한항공 샘플 테스트 진입", date: "2026-09-30" },
    ],
  },
  {
    name: "배성재 (경남/軍 자문)", org: "KCC",
    weeklyTasks: [
      "경남 군부대 접촉 및 시범사용 후보 발굴",
      "軍 컴플라이언스 자문 (입찰 요건, 군 의사결정 구조)",
      "B2B 조사 (방산업체 케미컬 현 사용량·품목 파악)",
    ],
    monthlyTasks: [
      "우수상용품 시범사용 신청 총괄 관리",
      "군 의사결정자 사전 정보 수집 보고",
      "경남 지역 방산업체 절삭유·세정유 현황 조사",
    ],
    kpiMetrics: ["시범부대 후보 발굴 건수", "B2B 조사 완료율", "군 키맨 접촉 건수"],
    reportTo: "김승만 PM",
    deadlines: [
      { task: "B2B 조사 완료", date: "2026-07-03" },
      { task: "시범부대 후보 3곳 리스트", date: "2026-08-31" },
      { task: "우수상용품 신청서 제출", date: "2026-09-30" },
    ],
  },
  {
    name: "정창기 (전남/MRO)", org: "BW",
    weeklyTasks: [
      "G2B·D2B 등록 절차 진행",
      "우수상용품 신청서 작성 (행정 파트)",
      "MRO 프로세스 SCM 설계 검토",
    ],
    monthlyTasks: [
      "나라장터 등록 현황 보고",
      "MRO 업체 대상 BW CLEAN·RUSTOP 샘플 배포",
      "전남 지역 군부대·정비창 방문",
    ],
    kpiMetrics: ["G2B 등록 진행률", "신청서 행정파트 완성도", "MRO 업체 접촉 건수"],
    reportTo: "김승만 PM",
    deadlines: [
      { task: "G2B 등록 완료", date: "2026-06-30" },
      { task: "신청서 행정파트 초안", date: "2026-08-31" },
    ],
  },
  {
    name: "이종률 (전남/정비자문)", org: "BWC",
    weeklyTasks: [
      "전남 군부대 영업 접촉",
      "특수장비 정비 현장 케미컬 사용 현황 조사",
      "정비창 운용 데이터 수집 (사용량·품목·주기)",
    ],
    monthlyTasks: [
      "정비창 케미컬 현황 보고서 (어떤 제품을 얼마나 쓰는지)",
      "BW 제품 대체 가능성 현장 의견 수집",
      "전남 지역 방산업체 방문",
    ],
    kpiMetrics: ["정비창 조사 건수", "케미컬 사용량 데이터 수집률", "대체제안 건수"],
    reportTo: "김승만 PM",
    deadlines: [
      { task: "정비창 3곳 케미컬 현황 조사", date: "2026-08-31" },
      { task: "BW 제품 대체 가능 리스트 작성", date: "2026-09-30" },
    ],
  },
  {
    name: "최은진 (경북/서류총괄)", org: "BWC",
    weeklyTasks: [
      "정부 시스템 등록 서류 진행 관리",
      "DAPA 벤더등록 절차 확인",
      "각종 서류(인증서·성적서·사업자등록 등) 취합",
    ],
    monthlyTasks: [
      "서류 등록 현황 월간 보고",
      "사장단 보고 자료 서류 백업",
      "경북 지역 군부대 방문 및 영업",
    ],
    kpiMetrics: ["서류 등록 완료 건수", "DAPA 등록 진행률", "경북 영업 접촉 건수"],
    reportTo: "김승만 PM",
    deadlines: [
      { task: "DAPA 벤더등록 서류 준비 완료", date: "2026-07-31" },
      { task: "우수상용품 필요 서류 체크리스트 완성", date: "2026-07-15" },
    ],
  },
];

// ─────────────────────────────────────────
// 군수 체계 구분
// ─────────────────────────────────────────
export const MILITARY_LOGISTICS = {
  categories: [
    { code: "ㄱ", name: "구매", description: "군수품 구매·조달 (나라장터, G2B, D2B)" },
    { code: "ㄴ", name: "물자", description: "물자 관리·보급·재고 운용" },
    { code: "ㄷ", name: "관리", description: "장비 정비·수명주기·폐기 관리" },
  ],
};

// ─────────────────────────────────────────
// K-CLP 경쟁사 현황 (현재 군 납품사)
// ─────────────────────────────────────────
export interface Competitor {
  name: string;
  product: string;
  status: string;
  note: string;
}

export const KCLP_COMPETITORS: Competitor[] = [
  { name: "그린바이오캠", product: "강중유 (세정·윤활·방청)", status: "현재 군 공급", note: "조달 낙찰가 1,760~5,920원/CN" },
  { name: "한국하우톤", product: "PL-SP 용제 희석형 방청유 (강중유)", status: "현재 군 사용 중", note: "LSA/PL-SP 25,575원/CN. K-CLP 대비 성능 열위 (염수분무 4h)" },
  { name: "고려케미칼", product: "강중유", status: "현재 군 공급", note: "조달 낙찰가 5,314~5,420원/CN" },
  { name: "동진케미칼", product: "강중유", status: "현재 군 공급", note: "광주 소재, 매출 35억" },
  { name: "대성화학", product: "강중유", status: "현재 군 공급", note: "광주 소재, 매출 35억" },
  { name: "미유테크", product: "강중유/윤활유", status: "현재 군 공급", note: "경기 안산, 매출 180억" },
];

// ─────────────────────────────────────────
// 회의록
// ─────────────────────────────────────────
export interface MeetingNote {
  id: string;
  date: string;
  title: string;
  attendees: string[];
  recorder: string;
  agendas: { topic: string; details: string[]; notes?: string }[];
  actionItems: { task: string; assignee: string; deadline: string; done: boolean }[];
}

export const MEETING_NOTES: MeetingNote[] = [
  {
    id: "mtg-01",
    date: "2026-06-04",
    title: "26년도 방산 TF Kick-Off",
    attendees: ["김승만", "배성재", "정창기", "이종률", "최은진", "신용수", "김제관"],
    recorder: "신용수",
    agendas: [
      {
        topic: "개인별 방산 관련 이해도 및 연관성 점검",
        details: ["TF 구성원 각자의 방산 경험·인맥·전문성 공유"],
      },
      {
        topic: "제독제 상품 설명 및 진행",
        details: [
          "DS-2(한국루베): 장비제독제, 개인용제독제 KD-1",
          "장비제독제용액 접근 — 강알칼리",
          "수용성 제독제, 분말형 제독제 검토",
          "제독제 구성 물질 수집: MSDS 확인",
          "SDI 전량 수입 / 벤처사업 선정 KRIT 정보 수집",
        ],
      },
      {
        topic: "군용요소수",
        details: ["군용 상용차량용 요소수 — 가격 경쟁 시장"],
      },
      {
        topic: "창원 종합정비창",
        details: ["종합정비소, 현대에 독점 납품 엔진오일(발보린)"],
      },
      {
        topic: "K-CLP 확판 전략 / R&R 수립",
        details: [
          "용기 디자인·스펙 선정 (PP, ABS, 국방색, K 강조)",
          "에어로졸·스프레이 형태, 주사기 타입",
          "팜플렛·브로셔 제작",
          "온라인 판매 채널 조사",
          "인증검사·인증기관·인증비용 조사",
        ],
        notes: "리스트 작성 후 시작 / 용기 업체·제작·충진 확인",
      },
    ],
    actionItems: [
      { task: "전체 자료 취합 (마켓조사·디자인·판매처·온라인)", assignee: "전원", deadline: "2026-07-03", done: false },
      { task: "B2B 조사", assignee: "배성재", deadline: "2026-07-03", done: false },
      { task: "권역별 담당 조사 및 확인", assignee: "전원", deadline: "2026-07-03", done: false },
      { task: "판매가능 확인 및 판매처 확인", assignee: "전원", deadline: "2026-07-03", done: false },
      { task: "인원별 R&R 분배 명확화", assignee: "김승만(PM)", deadline: "2026-06-30", done: false },
    ],
  },
];

// ─────────────────────────────────────────
// 우수상용품 시범사용 — 긴급 액션플랜
// ─────────────────────────────────────────
export type ActionUrgency = "critical" | "urgent" | "normal";
export type ActionStatus = "not_started" | "in_progress" | "done" | "blocked";

export interface ActionItem {
  id: string;
  phase: string;
  task: string;
  assignee: string;
  deadline: string;
  urgency: ActionUrgency;
  status: ActionStatus;
  note?: string;
  reference?: string;
}

export interface KCLPPhase {
  id: string;
  step: number;
  title: string;
  period: string;
  description: string;
  status: ActionStatus;
  details: string[];
}

// 우수상용품 시범사용 전체 절차 (연 2회: 상·하반기)
export const KCLP_PROCESS_PHASES: KCLPPhase[] = [
  {
    id: "phase-01", step: 1,
    title: "접수 (온라인 신청)",
    period: "하반기: 5월~7월초 (추정)",
    description: "한국조달연구원(KIP) 홈페이지에서 온라인 접수. 수시 접수 가능하나 평가는 연 2회.",
    status: "not_started",
    details: [
      "신청서 (별지 제12호 서식)",
      "제품설명서",
      "시험성적서 (KOLAS 인정기관 발급 필수)",
      "서약서",
      "사업자등록증 사본",
      "공공기관 제출용 신용평가등급확인서",
      "품질관리계획서",
      "제품설명책자 (디렉토리북)",
    ],
  },
  {
    id: "phase-02", step: 2,
    title: "서류심사",
    period: "접수 마감 후 약 1개월",
    description: "제출 서류 기반 1차 심사. 시험성적서·인증서류 완비 여부 확인.",
    status: "not_started",
    details: ["신청서 완비 여부 확인", "KOLAS 시험성적서 유효성 검증", "기업 자격 요건 심사"],
  },
  {
    id: "phase-03", step: 3,
    title: "대면평가",
    period: "서류심사 통과 후 약 1개월",
    description: "평가위원 앞에서 제품 설명 및 시연. 군 적합성·기술품질성·시장혁신성 3개 분야 평가. 최고·최저 점수 제외 평균 60점 이상 통과.",
    status: "not_started",
    details: [
      "평가 분야: 군 적합성 / 기술·품질성 / 시장·혁신성",
      "BB등급 이상: 2개 분야 탁월 → 추천품목 선정",
      "B등급: 1개 분야 탁월 → 추천품목",
      "합격선: 평균 60점 이상 (최고·최저 제외)",
    ],
  },
  {
    id: "phase-04", step: 4,
    title: "현장실사",
    period: "대면평가 통과 후 1~2개월",
    description: "업체 방문 현장 검증. 생산설비·품질관리 체계 확인.",
    status: "not_started",
    details: ["생산설비 확인", "품질관리체계 검증", "납품 능력 평가"],
  },
  {
    id: "phase-05", step: 5,
    title: "제품설명회",
    period: "현장실사 후",
    description: "군 수요부대 대상 제품 설명 및 홍보. 시범사용 부대 매칭.",
    status: "not_started",
    details: ["군 수요부대 대상 발표", "제품 시연", "시범사용 부대 매칭"],
  },
  {
    id: "phase-06", step: 6,
    title: "시범사용 품목 선정 (국방부 위원회)",
    period: "설명회 후 1~2개월",
    description: "각 군 소요종합 후 국방부 주관 위원회에서 최종 선정. 소량 구매 → 시범부대 사용.",
    status: "not_started",
    details: ["각 군 소요 종합", "국방부 위원회 심의", "시범사용 부대 지정", "소량 구매 집행"],
  },
  {
    id: "phase-07", step: 7,
    title: "운용적합성 평가 → 군수품 채택",
    period: "시범사용 후 6~12개월",
    description: "시범부대 운용 후 적합성 평가. 통과 시 정식 군수품 채택, 국방장관 명의 지정서 수여.",
    status: "not_started",
    details: [
      "시범부대 운용 결과 평가",
      "국방장관 명의 지정서 수여",
      "조달청 국방상용물자 전용몰 등록",
      "조달청 벤처나라 추천",
      "군 수요 발생 시 우선구매",
    ],
  },
];

// 과거 접수 패턴 (일정 추정용)
export const KCLP_SCHEDULE_HISTORY = [
  { year: 2024, half: "상반기", open: "2023-12", close: "2024-02 초", docReview: "2024-03", faceEval: "2024-04", siteInspect: "2024-04~05", selection: "2024-06~07" },
  { year: 2024, half: "하반기", open: "2024-05", close: "2024-07 초", docReview: "2024-08", faceEval: "2024-09~10", siteInspect: "2024-10~11", selection: "2024-12~01" },
  { year: 2025, half: "상반기", open: "2024-12-11", close: "2025-02-03", docReview: "2025-03 초", faceEval: "2025-04 초", siteInspect: "2025-04~05", selection: "2025-06~07" },
  { year: 2025, half: "하반기", open: "2025-05-12", close: "2025-07-04", docReview: "2025-08", faceEval: "2025-09~10", siteInspect: "2025-10~11", selection: "2025-12~01" },
  { year: 2026, half: "상반기", open: "2025-12-16", close: "2026-02 초 (추정)", docReview: "2026-03", faceEval: "2026-04", siteInspect: "2026-04~05", selection: "2026-06~07" },
  { year: 2026, half: "하반기", open: "2026-05~06 (추정)", close: "2026-07 초 (추정)", docReview: "2026-08 (추정)", faceEval: "2026-09~10 (추정)", siteInspect: "2026-10~11 (추정)", selection: "2026-12~01 (추정)" },
];

// 긴급 액션 아이템
export const KCLP_ACTION_ITEMS: ActionItem[] = [
  {
    id: "act-01", phase: "즉시 (이번 주)",
    task: "한국조달연구원 전화 → 2026 하반기 접수 마감일 확인",
    assignee: "정창기 / 최은진",
    deadline: "2026-06-13",
    urgency: "critical",
    status: "not_started",
    note: "☎ 02-796-8234 (물자분야 내선603). 접수 마감이 7월초면 시험성적서 일정과 충돌!",
    reference: "https://www.kip.re.kr/kip/national",
  },
  {
    id: "act-02", phase: "즉시 (이번 주)",
    task: "시험성적서 3종 최단 완료일 확인 (7월말→당길 수 있는지)",
    assignee: "김태형 (BIT)",
    deadline: "2026-06-13",
    urgency: "critical",
    status: "not_started",
    note: "저온유동성·염수분무·윤활성 중 완료된 항목 파악. KTR/FITI 시험 소요기간 재확인.",
  },
  {
    id: "act-03", phase: "즉시 (이번 주)",
    task: "시험성적서 미완 상태에서 접수 가능 여부 확인 (보완 접수)",
    assignee: "정창기",
    deadline: "2026-06-13",
    urgency: "critical",
    status: "not_started",
    note: "KIP에 문의: 접수 먼저 하고 서류심사 전까지 시험성적서 보완 제출 가능한지",
  },
  {
    id: "act-04", phase: "1주차 (6/9~6/13)",
    task: "신청서 양식 다운로드 및 작성 착수 (별지 제12호)",
    assignee: "정창기",
    deadline: "2026-06-20",
    urgency: "urgent",
    status: "not_started",
    reference: "https://law.go.kr/flDownload.do?flSeq=56133459",
  },
  {
    id: "act-05", phase: "1주차 (6/9~6/13)",
    task: "공공기관 제출용 신용평가등급확인서 발급 신청",
    assignee: "최은진",
    deadline: "2026-06-20",
    urgency: "urgent",
    status: "not_started",
    note: "발급에 1~2주 소요 가능. BW/KCC/BIT 중 신청 명의 결정 필요.",
  },
  {
    id: "act-06", phase: "2주차 (6/16~6/20)",
    task: "제품설명서 초안 작성 (K-CLP 성능 데이터 기반)",
    assignee: "이정호 + 김태형 (BIT)",
    deadline: "2026-06-27",
    urgency: "urgent",
    status: "not_started",
    note: "내마모성 0.41mm, 염수분무 60h A급, 습윤상 252h A급 등 핵심 데이터 포함",
  },
  {
    id: "act-07", phase: "2주차 (6/16~6/20)",
    task: "품질관리계획서 작성",
    assignee: "이정호 (BIT)",
    deadline: "2026-06-27",
    urgency: "urgent",
    status: "not_started",
  },
  {
    id: "act-08", phase: "2주차 (6/16~6/20)",
    task: "제품설명책자 (디렉토리북) 디자인 착수",
    assignee: "신용수 (마케팅)",
    deadline: "2026-06-30",
    urgency: "urgent",
    status: "not_started",
    note: "KIP 양식 확인 후 제작. 국방색 기반 K 강조 디자인.",
  },
  {
    id: "act-09", phase: "3주차 (6/23~6/27)",
    task: "서약서 + 사업자등록증 사본 준비",
    assignee: "최은진",
    deadline: "2026-06-27",
    urgency: "normal",
    status: "not_started",
    note: "BW/KCC/BIT 명의 확정 후 해당 법인 사업자등록증",
  },
  {
    id: "act-10", phase: "3주차 (6/23~6/27)",
    task: "신청서 최종 검토 및 온라인 접수",
    assignee: "정창기 + 최은진",
    deadline: "2026-07-04",
    urgency: "critical",
    status: "not_started",
    note: "접수 마감 추정일 기준. KIP 확인 후 실제 마감일로 조정 필요.",
    reference: "https://www.kip.re.kr/kip/national",
  },
  {
    id: "act-11", phase: "대면평가 준비 (8~9월)",
    task: "대면평가 발표자료 + 제품 시연 준비",
    assignee: "배성재 + 이정호",
    deadline: "2026-09-15",
    urgency: "normal",
    status: "not_started",
    note: "군 적합성·기술품질성·시장혁신성 3개 분야 준비. 60점 이상(최고·최저 제외) 통과 기준.",
  },
  {
    id: "act-12", phase: "대면평가 준비 (8~9월)",
    task: "현장실사 대비 생산라인 정비 (양산공장)",
    assignee: "김승만 PM",
    deadline: "2026-09-30",
    urgency: "normal",
    status: "not_started",
    note: "생산설비·품질관리체계 현장 검증 대비",
  },
];

// 제출 서류 체크리스트
export interface DocChecklist {
  name: string;
  assignee: string;
  status: ActionStatus;
  note?: string;
  kolasMark?: boolean;
}

export const KCLP_DOC_CHECKLIST: DocChecklist[] = [
  { name: "신청서 (별지 제12호 서식)", assignee: "정창기", status: "not_started" },
  { name: "제품설명서", assignee: "이정호 + 김태형", status: "not_started" },
  { name: "시험성적서 — 저온유동성", assignee: "김태형", status: "in_progress", kolasMark: true, note: "KOLAS 인정기관 발급 필수" },
  { name: "시험성적서 — 염수분무", assignee: "김태형", status: "in_progress", kolasMark: true, note: "KOLAS 인정기관 발급 필수" },
  { name: "시험성적서 — 윤활성", assignee: "김태형", status: "in_progress", kolasMark: true, note: "KOLAS 인정기관 발급 필수" },
  { name: "서약서", assignee: "정창기", status: "not_started" },
  { name: "사업자등록증 사본", assignee: "최은진", status: "done" },
  { name: "신용평가등급확인서", assignee: "최은진", status: "not_started", note: "발급 1~2주 소요" },
  { name: "품질관리계획서", assignee: "이정호", status: "not_started" },
  { name: "제품설명책자 (디렉토리북)", assignee: "신용수", status: "not_started", note: "KIP 양식 확인 필요" },
];

// ─────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────
export function getProjectsByCategory(cat: Category) {
  return PROJECTS.filter((p) => p.category === cat);
}
export function getTracksByCategory(cat: Category) {
  return TRACKS.filter((t) => t.category === cat);
}
export function getMilestonesByCategory(cat: Category) {
  return MILESTONES.filter((m) => m.category === cat);
}
export function getUpcomingMilestones(limit = 8) {
  const today = new Date().toISOString().slice(0, 10);
  return MILESTONES.filter((m) => !m.done && m.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, limit);
}
export function getOverdueMilestones() {
  const today = new Date().toISOString().slice(0, 10);
  return MILESTONES.filter((m) => !m.done && m.date < today);
}
