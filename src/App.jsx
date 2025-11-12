// Hidden Japan – Toyama (English & Japanese bilingual page)
// src/App.jsx

import { useState, useMemo } from "react";

/* ====== SPOT DATA ====== */
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
  },
  {
    id: "gokayama",
    title_en: "Gokayama (Gassho Villages)",
    title_ja: "五箇山（合掌造り集落）",
    cat: "culture",
    area: "Nanto",
    hero: "https://images.unsplash.com/photo-1572960360912-490f0b13c3bd?q=80&w=1600&auto=format&fit=crop",
    desc_en:
      "Quiet UNESCO-listed thatched villages, calmer than Shirakawa-go.",
    desc_ja:
      "世界遺産の合掌集落。白川郷より落ち着いた雰囲気でじっくり楽しめる。",
    map: "https://maps.google.com/?q=Gokayama",
  },
  {
    id: "ama",
    title_en: "Amaharashi Coast",
    title_ja: "雨晴海岸",
    cat: "nature",
    area: "Himi",
    hero: "https://images.unsplash.com/photo-1519682557860-56b48f0bbd9b?q=80&w=1600&auto=format&fit=crop",
    desc_en:
      "Rare view where the sea meets the 3,000m Tateyama mountains.",
    desc_ja: "海越しに立山連峰を望む絶景スポット。天気が良い日におすすめ。",
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
      "Local delicacy—try tempura or sashimi. Look for 'Shiro-ebi' signs.",
    desc_ja: "富山名物の白えび。天ぷらや刺身で味わうのが定番。",
    map: "https://maps.google.com/?q=Toyama+white+shrimp",
  },
];

/* ====== SIMPLE STYLES ====== */
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
  },
  hero: {
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #333",
  },
  heroImg: {
    width: "100%",
    height: 300,
    objectFit: "cover",
  },
  heroBody: { padding: 16 },
  grid: {
    marginTop: 20,
    display: "grid",
    gap: 14,
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  },
  card: {
    background: "#0f0f0f",
    border: "1px solid #333",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImg: {
    width: "100%",
    height: 160,
    objectFit: "cover",
  },
  cardBody: { padding: 12 },
  chip: {
    display: "inline-block",
    border: "1px solid #555",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 12,
    color: "#ccc",
    marginRight: 6,
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
    borderTop: "1px solid #333",
    paddingTop: 12,
    color: "#aaa",
    fontSize: 12,
  },
};

/* ====== TEXT ====== */
const T = {
  en: {
    title: "Hidden Japan – Toyama",
    tagline: "Explore authentic Toyama, Japan.",
    spots: "Featured Spots",
    switch: "日本語",
    openMap: "Open Map",
  },
  ja: {
    title: "Hidden Japan – 富山",
    tagline: "本物の日本、富山を探す旅へ。",
    spots: "おすすめスポット",
    switch: "EN",
    openMap: "地図で見る",
  },
};

export default function App() {
  const [lang, setLang] = useState("ja");
  const dict = T[lang];

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <header style={S.header}>
          <div style={S.logo}>{dict.title}</div>
          <button
            style={S.btn}
            onClick={() => setLang(lang === "en" ? "ja" : "en")}
          >
            {dict.switch}
          </button>
        </header>

        <section style={S.hero}>
          <img
            src="https://images.unsplash.com/photo-1544551763-7efc1de28f68?q=80&w=1600&auto=format&fit=crop"
            alt="Toyama"
            style={S.heroImg}
          />
          <div style={S.heroBody}>
            <h1 style={{ margin: 0 }}>{dict.tagline}</h1>
          </div>
        </section>

        <h2 style={{ marginTop: 24 }}>{dict.spots}</h2>

        <div style={S.grid}>
          {SPOTS.map((spot) => {
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
                        ? spot.cat.charAt(0).toUpperCase() + spot.cat.slice(1)
                        : spot.cat === "nature"
                        ? "自然"
                        : spot.cat === "culture"
                        ? "文化"
                        : "グルメ"}
                    </span>
                  </div>
                  <h3 style={{ margin: "8px 0 4px" }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "#ccc", margin: 0 }}>{desc}</p>
                  <div style={{ marginTop: 6 }}>
                    <a
                      href={spot.map}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 13,
                        textDecoration: "none",
                        color: "#0ea5e9",
                      }}
                    >
                      📍 {dict.openMap}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <footer style={S.footer}>
          © {new Date().getFullYear()} Hidden Japan – Toyama
        </footer>
      </div>
    </div>
  );
}
