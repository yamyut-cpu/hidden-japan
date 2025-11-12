export default function App() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#111,#1e1e1e)",
      color: "#fff",
      padding: "48px 24px"
    }}>
      <div style={{maxWidth: 900, margin: "0 auto"}}>
        <h1 style={{margin: 0, fontWeight: 900}}>Hidden Japan</h1>
        <p style={{marginTop: 8, color: "#cfcfcf"}}>最小セットで表示できました 🎉</p>

        <div style={{
          marginTop: 24,
          border: "1px solid #2a2a2a",
          borderRadius: 12,
          overflow: "hidden",
          background: "#0f0f0f"
        }}>
          <div style={{
            height: 220,
            background:
              "url(https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop) center/cover"
          }} />
          <div style={{padding: 16}}>
            <h2 style={{margin: 0}}>デモカード</h2>
            <p style={{marginTop: 8, color: "#bdbdbd"}}>ここにスポットの説明が入ります。</p>
          </div>
        </div>
      </div>
    </main>
  );
}
