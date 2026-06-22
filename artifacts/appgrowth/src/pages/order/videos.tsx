import React, { useState, useMemo } from "react";

import { AppLayout } from "@/components/layout/app-layout";

/**
 * UGCVideos — buy AI / creator UGC video ads, priced live.
 * Drop into any React app:  <UGCVideos />
 * Self-contained: injects Plus Jakarta Sans + keyframes itself, no external CSS.
 */

const PURPLE = "#7c3aed";
const money = (n: number) => "$" + n.toLocaleString();

const TYPES = [
  { key: "ai", label: "AI UGC", price: 10, sub: "Script-to-video, AI actor & voiceover" },
  { key: "human", label: "Creator UGC", price: 30, sub: "Real creator, real face, real trust" },
];
const DESTS = [
  { key: "meta", icon: "📣", label: "Meta Ads", note: "Optimized for Meta — 9:16 Reels + 1:1 Feed cuts, exported ready to drop into Ads Manager." },
  { key: "tiktok", icon: "🎵", label: "TikTok", note: "Native 9:16 vertical with trend-style hooks built to pass as organic." },
  { key: "appstore", icon: "📱", label: "App Store", note: "App-preview cuts in 9:16 and 16:9, sized to App Store and Play Store specs." },
  { key: "search", icon: "🔎", label: "Search Ads", note: "Tight 1:1 and 9:16 cuts tuned for Apple Search Ads discovery placements." },
];
const HOOKS = [1, 3, 5];
const ADDONS = [
  { key: "rush", label: "24-hour rush delivery", desc: "Skip the queue — videos back within a day", price: 8, per: false },
  { key: "multi", label: "Multi-format pack", desc: "Every aspect ratio: 9:16 · 1:1 · 4:5 · 16:9", price: 6, per: true },
];

const PORTFOLIO = [
  { title: "Fitness App Launch — 3-Hook Series", grad: "linear-gradient(150deg,#8b5cf6,#7c1fd6)", tag: "AI UGC", tagBg: "#f3eefe", tagColor: "#7c3aed" },
  { title: "Finance App — Trust & Credibility", grad: "linear-gradient(150deg,#10b981,#0f766e)", tag: "Creator UGC", tagBg: "#e9f9f1", tagColor: "#0f9d63" },
  { title: "Productivity Tool — Problem/Solution", grad: "linear-gradient(150deg,#fb923c,#f97316)", tag: "AI UGC", tagBg: "#f3eefe", tagColor: "#7c3aed" },
];

const sectionLabel: React.CSSProperties = { padding: "18px 12px 8px", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: "#a39fae" };
const eyebrow: React.CSSProperties = { fontSize: 13, fontWeight: 700, letterSpacing: 1.4, color: "#9b96a6" };
const stepTitle: React.CSSProperties = { fontWeight: 700, fontSize: 16, marginBottom: 12 };

export default function UGCVideos() {
  const [type, setType] = useState("ai");
  const [dest, setDest] = useState("meta");
  const [qty, setQty] = useState(3);
  const [hooks, setHooks] = useState(3);
  const [rush, setRush] = useState(true);
  const [multi, setMulti] = useState(false);
  const [placed, setPlaced] = useState(false);

  // any config change clears a placed order
  const change = (fn: (...args: any[]) => void) => (...a: any[]) => { setPlaced(false); fn(...a); };

  const order = useMemo(() => {
    const base = type === "ai" ? 10 : 30;
    const hookSurcharge = hooks === 5 ? 4 : 0;
    const multiPer = multi ? 6 : 0;
    const videosCost = base * qty;
    const typeName = type === "ai" ? "AI UGC video" : "Creator UGC video";

    const lineItems = [{ label: `${typeName} × ${qty}`, amount: money(videosCost) }];
    if (hookSurcharge) lineItems.push({ label: `5 hook variations × ${qty}`, amount: money(hookSurcharge * qty) });
    if (multi) lineItems.push({ label: `Multi-format pack × ${qty}`, amount: money(multiPer * qty) });
    if (rush) lineItems.push({ label: "24-hour rush delivery", amount: money(8) });

    const total = videosCost + hookSurcharge * qty + multiPer * qty + (rush ? 8 : 0);

    let deliveryText;
    if (type === "ai") deliveryText = rush ? "24 hours" : "48 hours";
    else deliveryText = rush ? "2–3 days" : "5–7 days";

    const destLabel = (DESTS.find((d) => d.key === dest) || DESTS[0]).label;
    return { lineItems, total, deliveryText, summarySub: `${typeName}s for ${destLabel}` };
  }, [type, dest, qty, hooks, rush, multi]);

  const destNote = (DESTS.find((d) => d.key === dest) || DESTS[0]).note;

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ugc-root *, .ugc-root *::before, .ugc-root *::after { box-sizing: border-box; }
        @keyframes ugcPop { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div className="ugc-root" style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans',-apple-system,sans-serif", background: "#f6f5f8", color: "#1a1523" }}>
        {/* Main */}
        <main style={{ flex: 1, padding: "48px 52px 72px", maxWidth: 1280 }}>
          <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>UGC Videos</h1>
          <p style={{ margin: "10px 0 0", fontSize: 17, color: "#6b6577" }}>Order scroll-stopping AI video ads — built and exported for the channel you run them on.</p>

          {/* Portfolio */}
          <div style={{ marginTop: 38, ...eyebrow }}>PORTFOLIO</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginTop: 16 }}>
            {PORTFOLIO.map((p) => (
              <div key={p.title} style={{ background: "#fff", border: "1px solid #ececf1", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
                <div style={{ height: 184, background: p.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22 }}>▶</div>
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 15.5 }}>{p.title}</div>
                  <span style={{ display: "inline-block", marginTop: 10, padding: "4px 10px", borderRadius: 7, background: p.tagBg, color: p.tagColor, fontSize: 11.5, fontWeight: 700 }}>{p.tag}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order builder */}
          <div style={{ marginTop: 44, ...eyebrow }}>ORDER YOUR VIDEOS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, marginTop: 16, alignItems: "start" }}>

            {/* Config */}
            <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              {/* Type */}
              <div>
                <div style={stepTitle}>1 · Choose your video type</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {TYPES.map((t) => {
                    const on = type === t.key;
                    return (
                      <div key={t.key} onClick={change(() => setType(t.key))} style={{
                        borderRadius: 14, padding: 18, cursor: "pointer", transition: "all .15s ease",
                        border: `1.5px solid ${on ? PURPLE : "#e8e6ee"}`,
                        background: on ? "#f6f1fe" : "#fff",
                        boxShadow: on ? "0 6px 18px rgba(124,58,237,.16)" : "none",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: 700, fontSize: 16 }}>{t.label}</span>
                          <span style={{ fontSize: 20, fontWeight: 800, color: PURPLE }}>{money(t.price)}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "#6b6577", marginTop: 6 }}>{t.sub}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Destination */}
              <div>
                <div style={stepTitle}>2 · Where will you run it?</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                  {DESTS.map((d) => {
                    const on = dest === d.key;
                    return (
                      <div key={d.key} onClick={change(() => setDest(d.key))} style={{
                        borderRadius: 12, padding: "14px 10px", textAlign: "center", cursor: "pointer", transition: "all .15s ease",
                        border: `1.5px solid ${on ? PURPLE : "#e8e6ee"}`,
                        background: on ? "#f6f1fe" : "#fff",
                        color: on ? "#5b21b6" : "#3a3343",
                      }}>
                        <div style={{ fontSize: 22 }}>{d.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>{d.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "flex-start", gap: 9, padding: "13px 15px", borderRadius: 11, background: "#f3eefe", color: "#5b21b6", fontSize: 13.5, lineHeight: 1.45, fontWeight: 500 }}>
                  <span style={{ fontSize: 15 }}>✦</span><span>{destNote}</span>
                </div>
              </div>

              {/* Quantity + hooks */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <div style={stepTitle}>3 · How many videos?</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 16px", border: "1.5px solid #e8e6ee", borderRadius: 12, background: "#fff", width: "fit-content" }}>
                    <div onClick={change(() => setQty((q) => Math.max(1, q - 1)))} style={{ width: 32, height: 32, borderRadius: 8, background: "#f4f2f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#5b21b6", cursor: "pointer", userSelect: "none" }}>−</div>
                    <span style={{ fontSize: 22, fontWeight: 800, minWidth: 28, textAlign: "center" }}>{qty}</span>
                    <div onClick={change(() => setQty((q) => Math.min(20, q + 1)))} style={{ width: 32, height: 32, borderRadius: 8, background: "#f4f2f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#5b21b6", cursor: "pointer", userSelect: "none" }}>+</div>
                  </div>
                </div>
                <div>
                  <div style={stepTitle}>4 · Hook variations</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {HOOKS.map((n) => {
                      const on = hooks === n;
                      return (
                        <div key={n} onClick={change(() => setHooks(n))} style={{
                          padding: "11px 0", flex: 1, textAlign: "center", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all .15s ease",
                          border: `1.5px solid ${on ? PURPLE : "#e8e6ee"}`,
                          background: on ? "#f6f1fe" : "#fff",
                          color: on ? "#5b21b6" : "#3a3343",
                        }}>{n}{n === 1 ? " hook" : " hooks"}</div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <div style={stepTitle}>5 · Add-ons</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ADDONS.map((a) => {
                    const on = a.key === "rush" ? rush : multi;
                    const toggle = a.key === "rush" ? () => setRush((v) => !v) : () => setMulti((v) => !v);
                    return (
                      <div key={a.key} onClick={change(toggle)} style={{
                        display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", borderRadius: 12, cursor: "pointer", transition: "all .15s ease",
                        border: `1.5px solid ${on ? PURPLE : "#e8e6ee"}`,
                        background: on ? "#f6f1fe" : "#fff",
                      }}>
                        <div style={on
                          ? { width: 24, height: 24, flex: "none", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, background: PURPLE, color: "#fff" }
                          : { width: 24, height: 24, flex: "none", borderRadius: 7, border: "1.5px solid #d6d2de", background: "#fff" }}>{on ? "✓" : ""}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{a.label}</div>
                          <div style={{ fontSize: 12.5, color: "#6b6577", marginTop: 2 }}>{a.desc}</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14.5, color: "#3a3343" }}>+{money(a.price)}{a.per ? "/video" : ""}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ position: "sticky", top: 24, background: "#fff", border: "1px solid #ececf1", borderRadius: 18, boxShadow: "0 10px 30px rgba(26,21,35,.07)", overflow: "hidden" }}>
              <div style={{ padding: "22px 22px 18px", borderBottom: "1px solid #f1eff4" }}>
                <div style={{ fontWeight: 800, fontSize: 17 }}>Order summary</div>
                <div style={{ fontSize: 13, color: "#6b6577", marginTop: 3 }}>{order.summarySub}</div>
              </div>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {order.lineItems.map((li, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14 }}>
                      <span style={{ color: "#4a4453" }}>{li.label}</span>
                      <span style={{ fontWeight: 700 }}>{li.amount}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: "#f1eff4", margin: "18px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: 28, color: PURPLE }}>{money(order.total)}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#8a8595", marginTop: 6 }}>Delivered in {order.deliveryText}</div>

                {placed ? (
                  <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#eefaf2", border: "1px solid #c9efd8", textAlign: "center", animation: "ugcPop .3s ease both" }}>
                    <div style={{ fontSize: 26 }}>✓</div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 4, color: "#0f7a45" }}>Order placed</div>
                    <div style={{ fontSize: 12.5, color: "#3f8a62", marginTop: 3 }}>We'll email your videos when they're ready.</div>
                    <div onClick={() => setPlaced(false)} style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: PURPLE, cursor: "pointer" }}>Start another order</div>
                  </div>
                ) : (
                  <>
                    <div onClick={() => setPlaced(true)} style={{ marginTop: 18, width: "100%", padding: 15, borderRadius: 12, background: PURPLE, color: "#fff", fontWeight: 700, fontSize: 16, textAlign: "center", cursor: "pointer", boxShadow: "0 10px 24px rgba(124,58,237,.32)" }}>
                      Buy {qty}{qty === 1 ? " video" : " videos"} · {money(order.total)}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#a39fae", textAlign: "center", marginTop: 10 }}>Secure checkout · Revisions included</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
