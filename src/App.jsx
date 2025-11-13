// Hidden Japan – Toyama (EN/JA, filters + search + detail modal + image fallback)
// src/App.jsx

// ===== ⚙️ IMPORTS =====
import { useState, useMemo, useEffect } from "react";

// ===== 🖼 フォールバック画像（画像取得に失敗した時の保険） =====
const fallbackImg = (seed, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

// ===== 📍 SPOTSデータ（観光地の情報はココに追加・編集） =====
const SPOTS = [
  {
    id: "tateyama",
    title_en: "Tateyama Kurobe Alpine Route",
    title_ja: "立山黒部アルペンルート",
    cat: "nature",
    area: "Tateyama / Kurobe",
    // 固定IDの安定画像
    hero: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600&auto=format&fit=crop",
    desc_en:
      "Snow walls, ropeways and stunning alpine views. Best from spring to autumn.",
    desc_ja:
      "雪の大谷、ロープウェイ、雄大な山岳景観。春〜秋がベストシーズン。",
    map: "https://maps.google.com/?q=Tateyama+Kurobe+Alpine+Route"
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
    map: "https://maps.google.com/?q=Gokayama"
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
    map: "https://maps.google.com/?q=Amaharashi+Coast"
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
    map: "https://maps.google.com/?q=Toyama+white+shrimp"
  }
];

// ===== 🎨 デザイン（スタイル） =====
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0b0b0b,#161616)",
    color: "#fff",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Noto Sans JP, sans-serif"
  },
  wrap: { maxWidth: 1080, margin: "0 auto", padding: "20px" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 0 16px", borderBottom: "1px solid #333"
  },
  logo: { fontWeight: 900, fontSize: 18 },
  btn: {
    border: "1px solid #444", borderRadius: 8, padding: "6px 10px",
    background: "#111", color: "#fff", cursor: "pointer", fontSize: 13
  },
  hero: {
    marginTop: 20, borderRadius: 12, overflow: "hidden", border: "1px solid #333"
  },
  heroImg: { width: "100%", height: 300, objectFit: "cover" },
  heroBody: { padding: 16 },
  filters: { marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" },
  input: {
    marginTop: 10, width: "100%", padding: "8px 10px",
    borderRadius: 10, border: "1px solid #333", background: "#0f0f0f",
    color: "#fff", fontSize: 14
  },
  grid: {
    marginTop: 20, display: "grid", gap: 14,
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))"
  },
  card: {
    background: "#0f0f0f", border: "1px solid #333",
    borderRadius: 12, overflow: "hidden", cursor: "pointer"
  },
  cardImg: { width: "100%", height: 160, objectFit: "cover" },
  cardBody: { padding: 12 },
  chip: {
    display: "inline-block", border: "1px solid #555", borderRadius: 999,
    padding: "2px 8px", fontSize: 12, color: "#ccc", marginRight: 6
  },
  footer: {
    textAlign: "center", marginTop: 24, borderTop: "1px solid #333",
    paddingTop: 12, color: "#aaa", fontSize: 12
  },
  // modal
  modalBg: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16
  },
  modal: {
    width: "100%", maxWidth: 720, background: "#0f0f0f", border: "1px solid #333",
    borderRadius: 12, overflow: "hidden", display: "grid", gridTemplateRows: "auto 1fr"
  },
  modalImg: { width: "100%", height: 280, objectFit: "cover" },
  modalBody: { padding: 16, display: "grid", gap: 10 },
  linkBtn: {
    display: "inline-block", border: "1px solid #2a2a2a", borderRadius: 10,
    padding: "6px 10px", textDecoration: "none", color: "#fff", background: "#111", fontSize: 13
  },
  close: {
    position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)",
    color: "#fff", border: "1px solid #333", borderRadius: 8, padding: "4px 10px", cursor: "pointer"
  }
};

// ===== 💬 表示テキスト（翻訳） =====
const T = {
  en: {
    title: "Hidden Japan – Toyama",
    tagline: "Explore authentic Toyama, Japan.",
    spots: "Featured Spots",
    switch: "日本語",
    openMap: "Open Map",
    bookHotel: "Book Hotels",
    getTicket: "Get Tickets",
    whereToEat: "Where to Eat",
    searchPlaceholder: "Search by title or area…",
    filters: { all: "All", nature: "Nature", culture: "Culture", food: "Food" }
  },
  ja: {
    title: "Hidden Japan – 富山",
    tagline: "本物の日本、富山を探す旅へ。",
    spots: "おすすめスポット",
    switch: "EN",
    openMap: "地図で見る",
    bookHotel: "周辺の宿を予約",
    getTicket: "チケットを探す",
    whereToEat: "食べに行く",
    searchPlaceholder: "タイトル・エリアで検索…",
    filters: { all: "すべて", nature: "自然", culture: "文化", food: "グルメ" }
  }
};

// ===== 🧱 ページ本体 =====
export default function App() {
  // 言語はローカル保存（次回も維持）
  const [lang, setLang] = useState("ja");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hj_lang");
      if (saved) setLang(saved);
    } catch {}
  }, []);
  const toggleLang = () => {
    const next = lang === "en" ? "ja" : "en";
    setLang(next);
    try {
      localStorage.setItem("hj_lang", next);
    } catch {}
  };

  const dict = T[lang];

  // カテゴリ & 検索
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SPOTS.filter((s) => {
      const matchCat = filter === "all" ? true : s.cat === filter;
      if (!q) return matchCat;
      const title = (lang === "en" ? s.title_en : s.title_ja).toLowerCase();
      const area = (s.area || "").toLowerCase();
      const desc = (lang === "en" ? s.desc_en : s.desc_ja).toLowerCase();
      const matchText = title.includes(q) || area.includes(q) || desc.includes(q);
      return matchCat && matchText;
    });
  }, [filter, query, lang]);

  // 詳細モーダル
  const [open, setOpen] = useState(null);

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* ===== 👑 ヘッダー ===== */}
        <header style={S.header}>
          <div style={S.logo}>{dict.title}</div>
          <button style={S.btn} onClick={toggleLang}>{dict.switch}</button>
        </header>

        {/* ===== 🌄 ヒーロー ===== */}
        <section style={S.hero}>
          <img
            // 固定IDの富山イメージ
            src="https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop"
            alt="Toyama"
            style={S.heroImg}
            onError={(e) => { e.currentTarget.src = fallbackImg("toyama-hero", 1600, 900); }}
          />
          <div style={S.heroBody}>
            <h1 style={{ margin: 0 }}>{dict.tagline}</h1>

            {/* 検索ボックス */}
            <input
              style={S.input}
              placeholder={dict.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* フィルター */}
            <div style={S.filters}>
              {["all","nature","culture","food"].map(k => (
                <button
                  key={k}
                  style={{
                    ...S.btn,
                    background: filter === k ? "#0ea5e9" : "#111",
                    color: filter === k ? "#001018" : "#fff"
                  }}
                  onClick={() => setFilter(k)}
                >
                  {dict.filters[k]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 🖼️ スポット一覧 ===== */}
        <h2 style={{ marginTop: 24 }}>{dict.spots}</h2>

        <div style={S.grid}>
          {filtered.map((spot) => {
            const title = lang === "en" ? spot.title_en : spot.title_ja;
            const desc = lang === "en" ? spot.desc_en : spot.desc_ja;
            return (
              <article key={spot.id} style={S.card} onClick={() => setOpen(spot)}>
                <img
                  src={spot.hero}
                  alt={title}
                  style={S.cardImg}
                  onError={(e) => { e.currentTarget.src = fallbackImg(spot.id); }}
                />
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
                </div>
              </article>
            );
          })}
        </div>

        {/* ===== 🦶 フッター ===== */}
        <footer style={S.footer}>
          © {new Date().getFullYear()} Hidden Japan – Toyama
        </footer>
      </div>

      {/* ===== 🪟 詳細モーダル（カードをクリックで開く） ===== */}
      {open && (
        <div style={S.modalBg} onClick={() => setOpen(null)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: "relative" }}>
              <img
                src={open.hero}
                alt="detail"
                style={S.modalImg}
                onError={(e) => { e.currentTarget.src = fallbackImg(open.id, 1200, 800); }}
              />
              <button style={S.close} onClick={() => setOpen(null)}>✕</button>
            </div>
            <div style={S.modalBody}>
              <h2 style={{ margin: 0 }}>
                {lang === "en" ? open.title_en : open.title_ja}
              </h2>
              <div>
                <span style={S.chip}>{open.area}</span>
                <span style={S.chip}>
                  {lang === "en"
                    ? open.cat.charAt(0).toUpperCase() + open.cat.slice(1)
                    : open.cat === "nature"
                    ? "自然"
                    : open.cat === "culture"
                    ? "文化"
                    : "グルメ"}
                </span>
              </div>
              <p style={{ margin: 0, color: "#ccc" }}>
                {lang === "en" ? open.desc_en : open.desc_ja}
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {open.map && (
                  <a href={open.map} target="_blank" rel="noreferrer" style={S.linkBtn}>
                    📍 {dict.openMap}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
