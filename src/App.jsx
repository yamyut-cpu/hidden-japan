// Hidden Japan – Toyama (EN/JA, affiliate-ready, zero-cost assets)
// src/App.jsx

import { useState, useMemo } from "react";

/* ====== DATA: スポットの最小データ（後で増やせる） ====== */
/* 画像は無料CDN（Unsplash）。自分の写真がなくてもOK。 */
const SPOTS = [
  {
    id: "tateyama",
    title_en: "Tateyama Kurobe Alpine Route",
    title_ja: "立山黒部アルペンルート",
    cat: "nature",
    area: "Tateyama / Kurobe",
    hero: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600&auto=format&fit=crop",
    desc_en:
      "Snow walls, ropeways and stunning alpine views. Best from spring to autumn.",
    desc_ja:
      "雪の大谷、ロープウェイ、雄大な山岳景観。春〜秋がベストシーズン。",
    map: "https://maps.google.com/?q=Tateyama+Kurobe+Alpine+Route",
    hotel: "https://afili.example/hotels-toyama", // ← ここを自分のアフィリURLに差し替え
    ticket: "https://afili.example/tickets-kurobe", // ← ここも差し替え
  },
  {
    id: "shirakawa-gok",
    title_en: "Gokayama (Gassho Villages)",
    title_ja: "五箇山（合掌造り）",
    cat: "culture",
    area: "Nanto",
    hero: "https://images.unsplash.com/photo-1572960360912-490f0b13c3bd?q=80&w=1600&auto=format&fit=crop",
    desc_en:
      "Quiet UNESCO-listed thatched villages, calmer than Shirakawa-go.",
    desc_ja:
      "世界遺産の合掌集落。白川郷より落ち着いた雰囲気でじっくり楽しめる。",
    map: "https://maps.google.com/?q=Gokayama",
    tour: "https://afili.example/gokayama-tour",
  },
  {
    id: "amasu",
    title_en: "Amasu Coast & View of Tateyama Range",
    title_ja: "雨晴海岸と立山連峰の眺め",
    cat: "nature",
    area: "Himi/Takaoka",
    hero: "https://images.unsplash.com/photo-1519682557860-56b48f0bbd9b?q=80&w=1600&auto=format&fit=crop",
    desc_en:
      "Rare view where sea meets 3,000m-class mountains—when the air is clear.",
    desc_ja:
      "海越しに3000m級の山々を望む絶景。空気が澄む日に当たると最高。",
    map: "https://maps.google.com/?q=Amaharashi+Coast",
  },
  {
    id: "shiroebi",
    title_en: "Toyama Bay White Shrimp",
    title_ja: "富山湾の白えび",
    cat: "food",
    area: "Toyama City",
    hero: "https://images.unsplash.com/photo-1558036117-15d82a90b9b6?q=80&w=1600&auto=format&fit=crop",
    desc_en:
      "Local delicacy—try tempura or sashimi. Look for fresh ‘Shiro-ebi’ labels.",
    desc_ja:
      "地元名物。天ぷらや刺身で。鮮度表示や“白えび”の表記をチェック。",
    map: "https://maps.google.com/?q=Toyama+white+shrimp",
    food: "https://afili.example/restaurant-white-shrimp",
  },
];

/* ====== 見た目（簡易CSS） ====== */
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
    gap: 12,
    padding: "8px 0 16px",
    borderBottom: "1px solid #242424",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 900,
  },
  badge: {
    padding: "4px 8px",
    borderRadius: 999,
    background: "#0ea5e9",
    color: "#001018",
    fontSize: 12,
    fontWeight: 800,
  },
  btn: {
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    padding: "8px 12px",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  hero: {
    marginTop: 14,
    display: "grid",
    gap: 10,
    gridTemplateColumns: "1.2fr 1fr",
  },
  heroCard: {
    border: "1px solid #242424",
    borderRadius: 14,
    overflow: "hidden",
    background: "#0f0f0f",
  },
  heroImg: { height: 260, background: "#1a1a1a", objectFit: "cover", width: "100%" },
  heroBody: { padding: 16 },
  small: { color: "#c9c9c9", fontSize: 13 },
  grid: {
    marginTop: 16,
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
  },
  card: {
    border: "1px solid #242424",
    borderRadius: 14,
    overflow: "hidden",
    background: "#0f0f0f",
    display: "flex",
    flexDirection: "column",
  },
  cardImg: { height: 160, width: "100%", objectFit: "cover", background: "#1a1a1a" },
  cardBody: { padding: 12, display: "grid", gap: 6 },
  chip: {
    display: "inline-block",
    border: "1px solid #2f2f2f",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 12,
    color: "#cfcfcf",
  },
  footer: {
    margin: "24px 0 10px",
    borderTop: "1px solid #242424",
    paddingTop: 12,
    color: "#bdbdbd",
    fontSize: 12,
    textAlign: "center",
  },
  linkBtn: {
    display: "inline-block",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    padding: "6px 10px",
    textDecoration: "none",
    color: "#fff",
    background: "#111",
    fontSize: 13,
  },
};

/* ====== 文言（英語/日本語） ====== */
const T = {
  en: {
    toyama: "Toyama, Japan",
    tagline: "Hidden Japan – Deep Guide to Toyama",
    heroTitle: "Toyama: Sea, Mountains, and Crafts",
    heroDesc:
      "From Tateyama's alpine route to Gokayama's gassho villages—discover authentic Toyama.",
    spots: "Featured Spots",
    filterAll: "All",
    filterNature: "Nature",
    filterCulture: "Culture",
    filterFood: "Food",
    readMore: "Details",
    openMap: "Open Map",
    bookHotel: "Book Hotels",
    getTicket: "Get Tickets",
    whereToEat: "Where to Eat",
    lang: "日本語",
  },
  ja: {
    toyama: "富山県",
    tagline: "Hidden Japan – 富山を深掘りする旅ガイド",
    heroTitle: "海と山と手仕事の県、富山",
    heroDesc:
      "立山黒部から五箇山の合掌集落まで。静かな“本物の日本”に会いに行こう。",
    spots: "おすすめスポット",
    filterAll: "すべて",
    filterNature: "自然",
    filterCulture: "文化",
    filterFood: "グルメ",
    readMore: "詳しく",
    openMap: "地図で見る",
    bookHotel: "周辺の宿を予約",
    getTicket: "チケットを探す",
    whereToEat: "食べに行く",
    lang: "EN",
  },
};

const CAT_LABEL = {
  nature: { en: "Nature", ja: "自然" },
  culture: { en: "Culture", ja: "文化" },
  food: { en: "Food", ja: "グルメ" },
};

export default function App() {
  const [lang, setLang] = useState("ja"); // ← 初期表示は日本語（海外向けなら "en" に）
  const [filter, setFilter] = useState("all");

  const dict = T[lang];

  const filtered = useMemo(() => {
    if (filter === "all") return SPOTS;
    return SPOTS.filter((s) => s.cat === filter);
  }, [filter]);

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.logo}>
            <span style={S.badge}>HJ</span>
            <div>
              <div style={{ fontWeight: 900 }}>Hidden Japan – Toyama</div>
              <div style={{ fontSize: 12, color: "#c9c9c9" }}>{dict.tagline}</div>
            </div>
          </div>
          <button style={S.btn} onClick={() => setLang(lang === "en" ? "ja" : "en")}>
            {dict.lang}
          </button>
        </header>

        {/* Hero */}
        <section style={S.hero}>
          <div style={S.heroCard}>
            <img
              src="https://images.unsplash.com/photo-1544551763-7efc1de28f68?q=80&w=1600&auto=format&fit=crop"
              alt="Toyama"
              style={S.heroImg}
            />
            <div style={S.heroBody}>
              <h1 style={{ margin: 0 }}>{dict.heroTitle}</h1>
              <p style={S.small}>{dict.heroDesc}</p>
            </div>
          </div>

          <div style={S.heroCard}>
            <div style={S.heroBody}>
              <div style={{ fontSize: 12, color: "#9dd7ff" }}>INFO</div>
              <h3 style={{ margin: "6px 0 8px" }}>{dict.toyama}</h3>
              <ul style={{ margin: 0, paddingLeft: 16, color: "#cfcfcf", lineHeight: 1.6 }}>
                <li>Access: Hokuriku Shinkansen via Toyama / Shin-Takaoka.</li>
                <li>Best seasons: Spring–Autumn for mountains, all year for food & crafts.</li>
                <li>Budget tips: Buy Tateyama combo-tickets and book hotels early.</li>
              </ul>

              {/* Filters */}
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { k: "all", l: dict.filterAll },
                  { k: "nature", l: dict.filterNature },
                  { k: "culture", l: dict.filterCulture },
                  { k: "food", l: dict.filterFood },
                ].map((f) => (
                  <button
                    key={f.k}
                    style={{
                      ...S.btn,
                      background: filter === f.k ? "#0ea5e9" : "#111",
                      color: filter === f.k ? "#001018" : "#fff",
                    }}
                    onClick={() => setFilter(f.k)}
                  >
                    {f.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Spots */}
        <section style={{ marginTop: 18 }}>
          <h2 style={{ margin: "0 0 8px" }}>{dict.spots}</h2>
          <div style={S.grid}>
            {filtered.map((s) => {
              const title = lang === "en" ? s.title_en : s.title_ja;
              const desc = lang === "en" ? s.desc_en : s.desc_ja;
              const cat = CAT_LABEL[s.cat]?.[lang] || s.cat;
              return (
                <article key={s.id} style={S.card}>
                  <img src={s.hero} alt={title} style={S.cardImg} />
                  <div style={S.cardBody}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={S.chip}>{cat}</span>
                      <span style={{ ...S.chip, opacity: 0.8 }}>{s.area}</span>
                    </div>
                    <h3 style={{ margin: "2px 0 0", fontSize: 18 }}>{title}</h3>
                    <p style={{ ...S.small, margin: 0 }}>{desc}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                      {s.map && (
                        <a style={S.linkBtn} href={s.map} target="_blank" rel="noreferrer">
                          📍 {dict.openMap}
                        </a>
                      )}
                      {s.hotel && (
                        <a style={S.linkBtn} href={s.hotel} target="_blank" rel="noreferrer">
                          🏨 {dict.bookHotel}
                        </a>
                      )}
                      {s.ticket && (
                        <a style={S.linkBtn} href={s.ticket} target="_blank" rel="noreferrer">
                          🎫 {dict.getTicket}
                        </a>
                      )}
                      {s.food && (
                        <a style={S.linkBtn} href={s.food} target="_blank" rel="noreferrer">
                          🍣 {dict.whereToEat}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer style={S.footer}>
          © {new Date().getFullYear()} Hidden Japan – Toyama / Built with Vite + React
        </footer>
      </div>
    </div>
  );
}
