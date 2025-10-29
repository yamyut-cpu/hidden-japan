// hidden-japan/src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

/** ←← ここが君の公開CSVリンク（そのままでOK） */
const DATA_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR1OFOVO2y0oBf9PiFUHnq-b3qyiVTtos7e1T-4L0qlQQlFHZPkgLMPg0dZu9OyKA/pub?gid=2082827175&single=true&output=csv";

/* =========================================================
   依存なしCSVパーサ（クォート対応）
   ========================================================= */
function parseCSV(text) {
  const rows = [];
  let i = 0,
    field = "",
    row = [],
    inQuotes = false;
  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    rows.push(row);
    row = [];
  };
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      } else {
        field += c;
        i++;
        continue;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (c === ",") {
        pushField();
        i++;
        continue;
      }
      if (c === "\n") {
        pushField();
        pushRow();
        i++;
        continue;
      }
      if (c === "\r") {
        i++;
        continue;
      }
      field += c;
      i++;
    }
  }
  if (field.length || row.length) {
    pushField();
    pushRow();
  }
  return rows;
}
function rowsToObjects(rows) {
  if (!rows || !rows.length) return [];
  const headers = rows[0].map((h) => (h || "").trim());
  return rows
    .slice(1)
    .filter((r) => r.some((v) => (v || "").trim().length))
    .map((r) => {
      const o = {};
      r.forEach((v, idx) => (o[headers[idx] || `col_${idx}`] = (v || "").trim()));
      return o;
    });
}

/* =========================================================
   スタイル（シンプルなインラインCSS）
   ========================================================= */
const S = {
  page: {
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, sans-serif",
    background: "#0b0b0b",
    color: "#fff",
    minHeight: "100vh",
  },
  container: { maxWidth: 1100, margin: "0 auto", padding: "16px" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #222",
    position: "sticky",
    top: 0,
    background: "#0b0b0bcc",
    backdropFilter: "blur(6px)",
    zIndex: 10,
  },
  titleWrap: { display: "flex", alignItems: "center", gap: 10 },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 999,
    background: "#10b981",
    color: "#000",
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
    fontSize: 14,
  },
  sub: { color: "#bbb", fontSize: 12, marginTop: 2 },
  btn: {
    background: "#222",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 10,
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: 13,
  },
  hero: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    background:
      "url(https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop) center/cover no-repeat",
  },
  heroInner: {
    background: "rgba(0,0,0,0.45)",
    padding: 18,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #333",
    background: "#0f0f0f",
    color: "#fff",
    fontSize: 14,
  },
  pills: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 },
  pill: (active) => ({
    padding: "6px 10px",
    borderRadius: 999,
    background: active ? "#10b981" : "#1a1a1a",
    color: active ? "#000" : "#fff",
    fontSize: 12,
    cursor: "pointer",
    border: "1px solid #262626",
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
    gap: 12,
    marginTop: 16,
  },
  card: {
    border: "1px solid #222",
    background: "#0f0f0f",
    borderRadius: 14,
    overflow: "hidden",
  },
  heroImgWrap: { height: 160, background: "#1a1a1a", position: "relative" },
  badgeWrap: { position: "absolute", top: 8, left: 8, display: "flex", gap: 6 },
  badge: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.6)",
    border: "1px solid #333",
  },
  saveBtn: (saved) => ({
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 999,
    background: saved ? "#facc15" : "rgba(0,0,0,0.6)",
    color: saved ? "#111" : "#fff",
    border: "1px solid #333",
    cursor: "pointer",
  }),
  cardBody: { padding: 12 },
  small: { color: "#bbb", fontSize: 12 },
  link: { color: "#93c5fd", textDecoration: "underline", fontSize: 12 },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  btnSm: {
    padding: "6px 10px",
    borderRadius: 10,
    background: "#1f2937",
    border: "1px solid #2a2a2a",
    color: "#fff",
    cursor: "pointer",
    fontSize: 12,
  },
  drawerBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
  },
  drawer: {
    marginLeft: "auto",
    height: "100%",
    width: "100%",
    maxWidth: 560,
    background: "#0b0b0b",
    borderLeft: "1px solid #222",
    display: "flex",
    flexDirection: "column",
  },
  drawerHead: { position: "relative", height: 180, background: "#1a1a1a" },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 8,
    padding: "4px 10px",
    cursor: "pointer",
  },
  drawerBody: { padding: 16, overflow: "auto" },
  infoRow: { display: "flex", gap: 10, fontSize: 14, marginBottom: 6 },
  footer: {
    marginTop: 24,
    padding: "16px 0",
    borderTop: "1px solid #222",
    color: "#bbb",
    fontSize: 12,
    textAlign: "center",
  },
};

/* =========================================================
   i18n
   ========================================================= */
const t = {
  en: {
    title: "Hidden Japan",
    subtitle: "Explore Local Japan",
    searchPlaceholder: "Search spots, regions…",
    categories: "Categories",
    readMore: "Read more",
    nearbyStay: "Book nearby stay",
    localSnack: "Try local snacks",
    openMap: "Open in Google Maps",
    area: "Region",
    access: "Access",
    budget: "Budget",
    highlights: "Highlights",
    all: "All",
    language: "EN",
    saved: "Saved",
    save: "Save",
    live: "Data source: Google Sheets CSV (live)",
    demo: "Using demo data (set DATA_CSV_URL to go live)",
    loading: "Loading data…",
    none: "No spots yet. Try another filter or add more.",
  },
  ja: {
    title: "Hidden Japan",
    subtitle: "日本のローカルを発見しよう",
    searchPlaceholder: "スポット名・地域で検索…",
    categories: "カテゴリ",
    readMore: "詳しく見る",
    nearbyStay: "近くの宿を予約",
    localSnack: "ご当地おやつを見る",
    openMap: "Googleマップで開く",
    area: "エリア",
    access: "アクセス",
    budget: "予算",
    highlights: "ハイライト",
    all: "すべて",
    language: "日",
    saved: "保存済み",
    save: "保存",
    live: "データソース: GoogleスプレッドシートCSV（ライブ）",
    demo: "デモデータ表示中（DATA_CSV_URL を設定するとライブ表示）",
    loading: "読み込み中…",
    none: "スポットがありません。条件を変えてみてください。",
  },
};

/* =========================================================
   フック
   ========================================================= */
function useLang() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    try {
      const s = localStorage.getItem("hj_lang");
      if (s) setLang(s);
    } catch {}
  }, []);
  const toggle = () => {
    const next = lang === "en" ? "ja" : "en";
    setLang(next);
    try {
      localStorage.setItem("hj_lang", next);
    } catch {}
  };
  return { lang, dict: t[lang], toggle };
}
function useSaved() {
  const [saved, setSaved] = useState([]);
  useEffect(() => {
    try {
      const s = localStorage.getItem("hj_saved");
      if (s) setSaved(JSON.parse(s));
    } catch {}
  }, []);
  const toggle = (id) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("hj_saved", JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  return { saved, toggle };
}

/* =========================================================
   データ読込（CSV → オブジェクト配列）
   ========================================================= */
function useSpotsFromCSV() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(DATA_CSV_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const rows = rowsToObjects(parseCSV(text));
        const mapped = rows.map((r, idx) => ({
          id: `${(r.Name_EN || r.Name_JA || "spot").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${idx}`,
          name_en: r.Name_EN || "",
          name_ja: r.Name_JA || "",
          category: (r.Category || "").trim(),
          region: r.Region || "",
          hero: r.Hero_Image_URL || "",
          highlights_en: [r.Highlight1_EN, r.Highlight2_EN, r.Highlight3_EN].filter(Boolean),
          highlights_ja: [r.Highlight1_JA, r.Highlight2_JA, r.Highlight3_JA].filter(Boolean),
          access_en: r.Access_EN || "",
          access_ja: r.Access_JA || "",
          budget_en: r.Budget_EN || "",
          budget_ja: r.Budget_JA || "",
          maps: r.Map_URL || "",
          ctaStay: r.Stay_Link || "",
          ctaSnack: r.Snack_Link || "",
        }));
        if (!cancel) setSpots(mapped);
      } catch (e) {
        if (!cancel) setError(String(e));
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);
  return { spots, loading, error };
}

/* =========================================================
   UI部品
   ========================================================= */
const CATEGORIES = [
  { key: "onsen", label_en: "Hot Springs", label_ja: "温泉" },
  { key: "michinoeki", label_en: "Roadside Stations", label_ja: "道の駅" },
  { key: "food", label_en: "Local Food", label_ja: "グルメ" },
  { key: "shopping_street", label_en: "Shopping Streets", label_ja: "商店街" },
  { key: "hidden", label_en: "Hidden Spots", label_ja: "秘境" },
  { key: "outdoor", label_en: "Camping & Outdoor", label_ja: "キャンプ・アウトドア" },
  { key: "supermarket", label_en: "Local Supermarkets", label_ja: "ローカルスーパー" },
  { key: "festivals", label_en: "Festivals & Events", label_ja: "祭り・イベント" },
];

function CategoryPills({ lang, active, setActive }) {
  return (
    <div style={S.pills}>
      <span style={S.pill(active === "all")} onClick={() => setActive("all")}>
        {t[lang].all}
      </span>
      {CATEGORIES.map((c) => (
        <span
          key={c.key}
          style={S.pill(active === c.key)}
          onClick={() => setActive(c.key)}
          title={c.key}
        >
          {lang === "en" ? c.label_en : c.label_ja}
        </span>
      ))}
    </div>
  );
}

function SpotCard({ spot, lang, onOpen, savedIds, onToggleSave }) {
  const title = lang === "en" ? spot.name_en || spot.name_ja : spot.name_ja || spot.name_en;
  const highlights = lang === "en" ? spot.highlights_en : spot.highlights_ja;
  const saved = savedIds.includes(spot.id);

  return (
    <div style={S.card}>
      <div style={S.heroImgWrap}>
        {spot.hero ? (
          <img
            src={spot.hero}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#777" }}>
            No Image
          </div>
        )}
        <div style={S.badgeWrap}>
          <span style={S.badge}>{spot.category || "—"}</span>
          <span style={{ ...S.badge, background: "#065f46" }}>{spot.region || "—"}</span>
        </div>
        <button
          style={S.saveBtn(saved)}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(spot.id);
          }}
          title={saved ? t[lang].saved : t[lang].save}
        >
          ★
        </button>
      </div>
      <div style={S.cardBody}>
        <div style={S.row}>
          <div>
            <div style={{ fontWeight: 700 }}>{title || "Untitled spot"}</div>
            <div style={S.small}>📍 {spot.region || "—"}</div>
          </div>
          <button style={S.btnSm} onClick={() => onOpen(spot)}>
            {t[lang].readMore}
          </button>
        </div>
        {highlights?.length ? (
          <ul style={{ margin: "10px 0 0 16px", color: "#ddd", fontSize: 14 }}>
            {highlights.slice(0, 3).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        ) : null}
        <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
          {spot.maps ? (
            <a href={spot.maps} target="_blank" rel="noreferrer" style={S.link}>
              🔗 {t[lang].openMap}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DetailDrawer({ spot, lang, onClose }) {
  if (!spot) return null;
  const d = t[lang];
  const title = lang === "en" ? spot.name_en || spot.name_ja : spot.name_ja || spot.name_en;
  const highlights = lang === "en" ? spot.highlights_en : spot.highlights_ja;
  const access = lang === "en" ? spot.access_en || spot.access_ja : spot.access_ja || spot.access_en;
  const budget = lang === "en" ? spot.budget_en || spot.budget_ja : spot.budget_ja || spot.budget_en;

  return (
    <div style={S.drawerBg} onClick={onClose}>
      <div style={S.drawer} onClick={(e) => e.stopPropagation()}>
        <div style={S.drawerHead}>
          {spot.hero ? (
            <img
              src={spot.hero}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#777" }}>
              No Image
            </div>
          )}
          <button style={S.close} onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={S.drawerBody}>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>{title || "Untitled spot"}</h2>
          <div style={{ display: "flex", gap: 6, margin: "8px 0 12px 0" }}>
            <span style={S.badge}>{spot.category || "—"}</span>
            <span style={{ ...S.badge, background: "#065f46" }}>{spot.region || "—"}</span>
          </div>

          <div style={S.infoRow}>📍 {d.area}: {spot.region || "—"}</div>
          <div style={S.infoRow}>🚗 {d.access}: {access || "—"}</div>
          <div style={S.infoRow}>💴 {d.budget}: {budget || "—"}</div>

          {highlights?.length ? (
            <>
              <h3 style={{ marginTop: 10 }}>{d.highlights}</h3>
              <ul style={{ margin: "6px 0 0 18px" }}>
                {highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </>
          ) : null}

          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            {spot.ctaStay ? (
              <a href={spot.ctaStay} target="_blank" rel="noreferrer" style={S.btn}>
                🏨 {d.nearbyStay}
              </a>
            ) : null}
            {spot.ctaSnack ? (
              <a href={spot.ctaSnack} target="_blank" rel="noreferrer" style={S.btn}>
                🛍️ {d.localSnack}
              </a>
            ) : null}
            {spot.maps ? (
              <a href={spot.maps} target="_blank" rel="noreferrer" style={S.btn}>
                🗺️ {d.openMap}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   メインアプリ
   ========================================================= */
function App() {
  const { lang, dict, toggle } = useLang();
  const { saved, toggle: toggleSave } = useSaved();
  const { spots, loading, error } = useSpotsFromCSV();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return (spots || []).filter(
      (s) =>
        (cat === "all" || s.category === cat) &&
        ((s.name_en || "").toLowerCase().includes(q) ||
          (s.name_ja || "").includes(query) ||
          (s.region || "").toLowerCase().includes(q))
    );
  }, [spots, query, cat]);

  return (
    <div style={S.page}>
      <div style={{ ...S.container, ...S.header }}>
        <div style={S.titleWrap}>
          <div style={S.logo}>HJ</div>
          <div>
            <div style={{ fontWeight: 800 }}>Hidden Japan</div>
            <div style={S.sub}>{dict.subtitle}</div>
          </div>
        </div>
        <button style={S.btn} onClick={toggle}>
          {t[lang].language}
        </button>
      </div>

      <div style={S.container}>
        <div style={{ ...S.hero, marginBottom: 10 }}>
          <div style={S.heroInner}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>{dict.subtitle}</h2>
            <p style={{ color: "#ddd", fontSize: 14, margin: "8px 0 10px" }}>
              Hidden spots, local food, hot springs, and everyday Japan — curated for travelers.
            </p>
            <input
              style={S.input}
              placeholder={dict.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: DATA_CSV_URL ? "#7ef5c3" : "#facc15" }}>
              {DATA_CSV_URL ? dict.live : dict.demo}
              {error ? ` / error: ${error}` : ""}
            </div>
          </div>
        </div>

        <div>
          <div style={{ color: "#bbb", fontSize: 12, marginBottom: 6 }}>{dict.categories}</div>
          <CategoryPills lang={lang} active={cat} setActive={setCat} />
        </div>

        {loading ? (
          <div style={{ marginTop: 14, color: "#bbb", fontSize: 14 }}>{dict.loading}</div>
        ) : (
          <div style={S.grid}>
            {filtered.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                lang={lang}
                onOpen={setOpen}
                savedIds={saved}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 ? (
          <div style={{ marginTop: 12, color: "#bbb", fontSize: 14 }}>{dict.none}</div>
        ) : null}

        <div style={S.footer}>© {new Date().getFullYear()} Hidden Japan</div>
      </div>

      <DetailDrawer spot={open} lang={lang} onClose={() => setOpen(null)} />
    </div>
  );
}

/* =========================================================
   マウント
   ========================================================= */
const root = createRoot(document.getElementById("root"));
root.render(<App />);

/* =========================================================
   簡易テスト（開発者ツールのコンソールに表示）
   ========================================================= */
(function smoke() {
  try {
    console.assert(typeof DATA_CSV_URL === "string" && DATA_CSV_URL.includes("output=csv"), "CSV URL looks valid");
    console.log("✅ App boot OK");
  } catch (e) {
    console.warn("⚠️ Smoke test failed", e);
  }
})();
