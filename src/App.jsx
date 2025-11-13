// Hidden Japan – Toyama (EN/JA, simple version with Toyama-like photos)
// src/App.jsx

import { useState, useMemo } from "react";

/* =========================
   📸 画像URL（上部ヒーロー）
   ========================= */
const HERO_IMG =
  "https://source.unsplash.com/1600x900/?toyama,japan,mountains";

/* =========================
   📍 SPOT データ
   （写真を変えたいときは hero のURLを入れ替える）
   ========================= */
const SPOTS = [
  {
    id: "tateyama",
    title_en: "Tateyama Kurobe Alpine Route",
    title_ja: "立山黒部アルペンルート",
    cat: "nature",
    area: "Tateyama / Kurobe",
    // ★ 立山黒部アルペンルートっぽい写真
    hero:
      "https://source.unsplash.com/800x600/?tateyama,kurobe,alpine,route,snow,japan",
    desc_en:
      "Snow walls, ropeways and stunning alpine views. Best from spring to autumn.",
    desc_ja:
      "雪の大谷、ロープウェイ、雄大な山岳景観。春〜秋がベストシーズン。",
    map: "https://maps.google.com/?q=Tateyama+Kurobe+Alpine+Route",
  },
  {
    id: "gokayama",
    title_en: "Gokayama (Gassho Villages)",
    title_ja: "五箇山（合掌造り集落）",
    cat: "culture",
    area: "Nanto",
    // ★ 五箇山の合掌造りっぽい写真
    hero:
      "https://source.unsplash.com/800x600/?gokayama,gassho,village,snow,toyama,japan",
    desc_en:
      "Quiet UNESCO-listed thatched villages, calmer than Shirakawa-go.",
    desc_ja:
      "世界遺産の合掌集落。白川郷より落ち着いた雰囲気でじっくり楽しめる。",
    map: "https://maps.google.com/?q=Gokayama+Toyama",
  },
  {
    id: "ama",
    title_en: "Amaharashi Coast",
    title_ja: "雨晴海岸",
    cat: "nature",
    area: "Himi",
    // ★ 雨晴海岸っぽい海と立山連峰
    hero:
      "https://source.unsplash.com/800x600/?amaharashi,coast,toyama,sea,mountains,japan",
    desc_en:
      "Rare view where the sea meets the 3,000m Tateyama mountains.",
    desc_ja: "海越しに立山連峰を望む絶景スポット。天気が良い日におすすめ。",
    map: "https://maps.google.com/?q=Amaharashi+Coast+Toyama",
  },
  {
    id: "shiroebi",
    title_en: "Toyama Bay White Shrimp",
    title_ja: "富山湾の白えび",
    cat: "food",
    area: "Toyama City",
    // ★ 白えび・富山の海鮮っぽい写真
    hero:
      "https://source.unsplash.com/800x600/?shiroebi,white,shrimp,toyama,seafood,japan",
    desc_en:
      "Local delicacy—try tempura or sashimi. Look for 'Shiro-ebi' signs.",
    desc_ja: "富山名物の白えび。天ぷらや刺身で味わうのが定番。",
    map: "https://maps.google.com/?q=Toyama+white+shrimp",
  },
];

/* =========================
   ラベル類
   ========================= */
const CATS = [
  { key: "all", label_en: "All", label_ja: "すべて" },
  { key: "nature", label_en: "Nature", label_ja: "自然" },
  { key: "culture", label_en: "Culture", label_ja: "文化" },
  { key: "food", label_en: "Food", label_ja: "グルメ" },
];

const T = {
  en: {
    title: "Hidden Japan – Toyama",
    tagline: "Explore authentic Toyama, Japan.",
    spots: "Featured Spots",
    switch: "日本語",
    openMap: "Open Map",
    filterLabel: "Filter",
    detail: "Details",
    close: "Close",
  },
  ja: {
    title: "Hidden Japan – 富山",
    tagline: "本物の日本、富山を探す旅へ。",
    spots: "おすすめスポット",
    switch: "EN",
    openMap: "地図で見る",
    filterLabel: "絞り込み",
    detail: "詳しく見る",
    close: "閉じる",
  },
};

/* =========================
   スタイル（インラインCSS）
   ========================= */
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0b0b0b,#161616)",
    color: "#fff",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Noto Sans JP, sans-serif",
  },
  wrap: { maxWidth: 1080, margin: "0 auto", padding: "20px" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0 16px",
    borderBottom: "1px solid #333",
  },
  logo: { fontWeight: 900, fontSize: 18 },
  btn: {
    border: "1px solid #444",
    borderRadius: 8,
    padding: "6px 10px",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  hero: {
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #333",
  },
  heroImg: {
    width: "100%",
    height: 260,
    objectFit: "cover",
  },
  heroBody: { padding: 16 },
  filterRow: {
    marginTop: 18,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  pillRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  pill: (active) => ({
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid #444",
    background: active ? "#fbbf24" : "#111",
    color: active ? "#111" : "#eee",
    fontSize: 12,
    cursor: "pointer",
  }),
  grid: {
    marginTop: 16,
    display: "grid",
    gap: 14,
    gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
  },
  card: {
    background: "#0f0f0f",
    border: "1px solid #333",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  cardImg: { width: "100%", height: 140, objectFit: "cover" },
  cardBody: { padding: 12, flex: 1, display: "flex", flexDirection: "column" },
  chip: {
    display: "inline-block",
    border: "1px solid #555",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 11,
    color: "#ccc",
    marginRight: 6,
  },
  detailBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderRadius: 8,
    padding: "4px 10px",
    border: "1px solid #444",
    background: "#111",
    color: "#fff",
    fontSize: 12,
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
    borderTop: "1px solid #333",
    paddingTop: 12,
    color: "#aaa",
    fontSize: 12,
  },
  // モーダル
  modalBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  modal: {
    width: "95%",
    maxWidth: 640,
    maxHeight: "90vh",
    background: "#0b0b0b",
    borderRadius: 12,
    border: "1px solid #444",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  modalImg: { width: "100%", height: 220, objectFit: "cover" },
  modalBody: { padding: 16, overflowY: "auto" },
  modalCloseRow: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "8px 12px",
    borderTop: "1px solid #333",
  },
  modalCloseBtn: {
    borderRadius: 8,
    border: "1px solid #444",
    padding: "4px 12px",
    background: "#111",
    color: "#fff",
    fontSize: 12,
    cursor: "pointer",
  },
};

/* =========================
   詳細モーダル
   ========================= */
function DetailModal({ spot, lang, onClose }) {
  if (!spot) return null;
  const dict = T[lang];
  const title = lang === "en" ? spot.title_en : spot.title_ja;
  const desc = lang === "en" ? spot.desc_en : spot.desc_ja;

  return (
    <div style={S.modalBg} onClick={onClose}>
      <div style={S.modal} onClick={(e) => e.stopPropagation()}>
        <img src={spot.hero} alt={title} style={S.modalImg} />
        <div style={S.modalBody}>
          <h2 style={{ marginTop: 0 }}>{title}</h2>
          <p style={{ margin: "4px 0 6px", fontSize: 13, color: "#ccc" }}>
            {spot.area}
          </p>
          <p style={{ fontSize: 14 }}>{desc}</p>
          <p style={{ marginTop: 10 }}>
            <a
              href={spot.map}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#38bdf8", fontSize: 13 }}
            >
              📍 {dict.openMap}
            </a>
          </p>
        </div>
        <div style={S.modalCloseRow}>
          <button style={S.modalCloseBtn} onClick={onClose}>
            {dict.close}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   メインコンポーネント
   ========================= */
export default function App() {
  const [lang, setLang] = useState("ja");
  const [cat, setCat] = useState("all");
  const [active, setActive] = useState(null);

  const dict = T[lang];

  const filtered = useMemo(() => {
    return SPOTS.filter((s) => (cat === "all" ? true : s.cat === cat));
  }, [cat]);

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* ヘッダー */}
        <header style={S.header}>
          <div style={S.logo}>{dict.title}</div>
          <button
            style={S.btn}
            onClick={() => setLang(lang === "en" ? "ja" : "en")}
          >
            {dict.switch}
          </button>
        </header>

        {/* ヒーローエリア */}
        <section style={S.hero}>
          <img src={HERO_IMG} alt="Toyama" style={S.heroImg} />
          <div style={S.heroBody}>
            <h1 style={{ margin: 0, fontSize: 22 }}>{dict.tagline}</h1>
          </div>
        </section>

        {/* フィルター */}
        <section style={S.filterRow}>
          <span style={{ fontSize: 13, color: "#ccc" }}>{dict.filterLabel}</span>
          <div style={S.pillRow}>
            {CATS.map((c) => (
              <button
                key={c.key}
                style={S.pill(cat === c.key)}
                onClick={() => setCat(c.key)}
              >
                {lang === "en" ? c.label_en : c.label_ja}
              </button>
            ))}
          </div>
        </section>

        {/* スポット一覧 */}
        <h2 style={{ marginTop: 22 }}>{dict.spots}</h2>
        <div style={S.grid}>
          {filtered.map((spot) => {
            const title = lang === "en" ? spot.title_en : spot.title_ja;
            const desc = lang === "en" ? spot.desc_en : spot.desc_ja;
            return (
              <article key={spot.id} style={S.card}>
                <img src={spot.hero} alt={title} style={S.cardImg} />
                <div style={S.cardBody}>
                  <div>
                    <span style={S.chip}>{spot.area}</span>
                    <span style={S.chip}>
                      {lang === "en"
                        ? spot.cat === "nature"
                          ? "Nature"
                          : spot.cat === "culture"
                          ? "Culture"
                          : "Food"
                        : spot.cat === "nature"
                        ? "自然"
                        : spot.cat === "culture"
                        ? "文化"
                        : "グルメ"}
                    </span>
                  </div>
                  <h3 style={{ margin: "8px 0 4px", fontSize: 15 }}>{title}</h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#ccc",
                      margin: 0,
                      minHeight: 40,
                    }}
                  >
                    {desc}
                  </p>
                  <button
                    style={S.detailBtn}
                    onClick={() => setActive(spot)}
                  >
                    {dict.detail}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* フッター */}
        <footer style={S.footer}>
          © {new Date().getFullYear()} Hidden Japan – Toyama
        </footer>
      </div>

      {/* 詳細モーダル */}
      <DetailModal spot={active} lang={lang} onClose={() => setActive(null)} />
    </div>
  );
}
