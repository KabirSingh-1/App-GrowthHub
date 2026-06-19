import React, { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";

const APPS = [
  { id: "fittrack", name: "FitTrack — Workout Log", initials: "FT", color: "#22a06b" },
  { id: "snapbudget", name: "SnapBudget", initials: "SB", color: "#2a6fdb" },
  { id: "mindful", name: "Mindful Minutes", initials: "MM", color: "#c4581f" },
];

const POS_PRESETS = [
  { id: "p1", text: "Thank you so much for the awesome review — it genuinely makes our small team's day!" },
  { id: "p2", text: "So glad you're loving the app! We've got some great updates on the way." },
  { id: "p3", text: "Reviews like yours keep us going. Thanks for being part of the community!" },
];

const NEG_PRESETS = [
  { id: "n1", text: "We're sorry the app fell short. Email us at support@appversal.io and we'll make it right." },
  { id: "n2", text: "Thanks for flagging this — a fix is already in the works. Hang tight, and reach out anytime." },
  { id: "n3", text: "This isn't the experience we want for you. We'd love a second chance to help — we're listening." },
];

const FONT = "'Schibsted Grotesk', -apple-system, system-ui, sans-serif";

function Divider() {
  return <div style={{ height: 1, background: "#f1efed" }} />;
}

interface SampleChipProps {
  text: string;
  selected: boolean;
  onToggle: () => void;
}

function SampleChip({ text, selected, onToggle }: SampleChipProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        textAlign: "left",
        width: "100%",
        padding: "14px 16px",
        borderRadius: 14,
        cursor: "pointer",
        font: "inherit",
        fontSize: 14,
        lineHeight: 1.45,
        color: "#3a3741",
        background: selected ? "#f6ecfe" : "#faf8f6",
        border: `1.5px solid ${selected ? "#8b30e8" : "#ececea"}`,
        transition: "background .15s, border-color .15s",
      }}
    >
      <span
        style={{
          flex: "none",
          width: 20,
          height: 20,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
          fontSize: 12,
          color: "#fff",
          background: selected ? "#8b30e8" : "#fff",
          border: `1.5px solid ${selected ? "#8b30e8" : "#d4d2d6"}`,
        }}
      >
        {selected ? "✓" : ""}
      </span>
      <span>{text}</span>
    </button>
  );
}

export default function ReplyToReviews() {
  const [appId, setAppId] = useState<string>("");
  const [appOpen, setAppOpen] = useState<boolean>(false);
  const [pos, setPos] = useState<Record<string, boolean>>({});
  const [neg, setNeg] = useState<Record<string, boolean>>({});
  const [customPos, setCustomPos] = useState<string>("");
  const [customNeg, setCustomNeg] = useState<string>("");
  const [keyFile, setKeyFile] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  const app = useMemo(() => APPS.find((a) => a.id === appId), [appId]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => (id: string) =>
    setter((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  const togglePos = toggle(setPos);
  const toggleNeg = toggle(setNeg);

  const posCount = Object.keys(pos).length + (customPos.trim() ? 1 : 0);
  const negCount = Object.keys(neg).length + (customNeg.trim() ? 1 : 0);
  const canStart = !!appId && posCount > 0 && negCount > 0 && !!keyFile;

  const reset = () => {
    setAppId("");
    setPos({});
    setNeg({});
    setCustomPos("");
    setCustomNeg("");
    setKeyFile("");
    setDone(false);
    setAppOpen(false);
  };

  const textareaStyle = {
    width: "100%",
    padding: "13px 15px",
    borderRadius: 13,
    border: "1.5px solid #ececea",
    background: "#faf8f6",
    fontSize: 14,
    color: "#3a3741",
    lineHeight: 1.45,
    fontFamily: "inherit",
    resize: "none" as const,
    boxSizing: "border-box" as const,
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 880, margin: "0 auto", paddingBottom: "40px", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 30 }}>
          <div>
            <h1 style={{ margin: "0 0 8px", fontSize: 31, fontWeight: 700, letterSpacing: "-.7px" }}>AI Reply to Reviews</h1>
            <p style={{ margin: 0, fontSize: 15.5, color: "#7d7a83", maxWidth: 520, lineHeight: 1.5 }}>
              Let the AppVersal team reply to your store reviews for you — using your tone, on autopilot.
            </p>
          </div>
          <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8, background: "#f0e6fc", color: "#7a23cf", border: "1px solid #e3d2fa", padding: "9px 15px", borderRadius: 999, fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 18 }}>$5</span>
            <span style={{ opacity: 0.7, fontSize: 13 }}>/ month</span>
          </div>
        </div>

        {done ? (
          /* SUCCESS */
          <div style={{ background: "#fff", border: "1px solid #ededeb", borderRadius: 18, padding: "54px 44px", textAlign: "center", boxShadow: "0 1px 3px rgba(20,18,26,.04)" }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", background: "#eafaf1", border: "1px solid #cdeedd", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22a06b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>
            </div>
            <h2 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 700, letterSpacing: "-.4px" }}>You're all set</h2>
            <p style={{ margin: "0 auto 28px", fontSize: 15.5, color: "#7d7a83", maxWidth: 420, lineHeight: 1.55 }}>
              We'll start replying to reviews for <b style={{ color: "#17151a" }}>{app ? app.name : "your app"}</b> within 24 hours. You can edit your reply samples anytime from My Orders.
            </p>
            <button onClick={reset} style={{ background: "#17151a", color: "#fff", border: "none", padding: "13px 26px", borderRadius: 12, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}>Set up another app</button>
          </div>
        ) : (
          /* FORM */
          <div style={{ background: "#fff", border: "1px solid #ededeb", borderRadius: 18, boxShadow: "0 1px 3px rgba(20,18,26,.04)" }}>
            {/* APP ROW */}
            <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "26px 30px" }}>
              <div style={{ flex: "none", width: 150 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>App</div>
                <div style={{ fontSize: 12.5, color: "#a3a0a8", marginTop: 2 }}>Pick the app to manage</div>
              </div>
              <div style={{ flex: 1, position: "relative" }}>
                <button onClick={() => setAppOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#f7f4f0", border: "1px solid #ebe7e2", borderRadius: 13, padding: "13px 16px", cursor: "pointer", fontSize: 14.5, color: "#17151a", textAlign: "left", fontFamily: "inherit" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    {app && (
                      <span style={{ flex: "none", width: 26, height: 26, borderRadius: 7, background: app.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{app.initials}</span>
                    )}
                    <span style={{ color: app ? "#17151a" : "#a8a5ad" }}>{app ? app.name : "Select an app"}</span>
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a97a0" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {appOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#fff", border: "1px solid #ececea", borderRadius: 14, boxShadow: "0 14px 38px rgba(20,18,26,.13)", padding: 7, zIndex: 20 }}>
                    {APPS.map((a) => (
                      <button key={a.id} onClick={() => { setAppId(a.id); setAppOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "10px 11px", border: "none", background: "transparent", borderRadius: 10, cursor: "pointer", fontSize: 14.5, color: "#17151a", textAlign: "left", fontFamily: "inherit" }}>
                        <span style={{ flex: "none", width: 28, height: 28, borderRadius: 8, background: a.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{a.initials}</span>
                        {a.name}
                      </button>
                    ))}
                    <div style={{ height: 1, background: "#f0eeec", margin: "5px 6px" }} />
                    <button onClick={() => { setAppId("fittrack"); setAppOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "10px 11px", border: "none", background: "transparent", borderRadius: 10, cursor: "pointer", fontSize: 14.5, color: "#7a23cf", fontWeight: 600, textAlign: "left", fontFamily: "inherit" }}>
                      <span style={{ flex: "none", width: 28, height: 28, borderRadius: 8, border: "1.5px dashed #d8c6f2", color: "#7a23cf", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>+</span>
                      Add a new app
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {/* POSITIVE */}
            <div style={{ padding: "26px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22a06b" }} />
                <span style={{ fontSize: 15, fontWeight: 600 }}>Replies for positive reviews</span>
              </div>
              <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#a3a0a8" }}>Choose one or more samples. We'll vary the wording so replies feel human.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {POS_PRESETS.map((s) => (
                  <SampleChip key={s.id} text={s.text} selected={!!pos[s.id]} onToggle={() => togglePos(s.id)} />
                ))}
                <textarea value={customPos} onChange={(e) => setCustomPos(e.target.value)} placeholder="Or write your own reply sample…" rows={2} style={textareaStyle} />
              </div>
            </div>

            <Divider />

            {/* NEGATIVE */}
            <div style={{ padding: "26px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#e0823a" }} />
                <span style={{ fontSize: 15, fontWeight: 600 }}>Replies for negative reviews</span>
              </div>
              <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#a3a0a8" }}>How we'll respond to 1–3 star reviews. Empathetic, on-brand, never defensive.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {NEG_PRESETS.map((s) => (
                  <SampleChip key={s.id} text={s.text} selected={!!neg[s.id]} onToggle={() => toggleNeg(s.id)} />
                ))}
                <textarea value={customNeg} onChange={(e) => setCustomNeg(e.target.value)} placeholder="Or write your own reply sample…" rows={2} style={textareaStyle} />
              </div>
            </div>

            <Divider />

            {/* KEY UPLOAD */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24, padding: "26px 30px" }}>
              <div style={{ flex: "none", width: 150 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Play Store key</div>
                <div style={{ fontSize: 12.5, color: "#a3a0a8", marginTop: 2, lineHeight: 1.4 }}>Service-account JSON from Play Console</div>
              </div>
              <div style={{ flex: 1 }}>
                {!keyFile ? (
                  <label style={{ display: "flex", alignItems: "center", gap: 14, padding: 18, border: "1.5px dashed #ddd9d3", borderRadius: 14, background: "#faf8f6", cursor: "pointer" }}>
                    <span style={{ flex: "none", width: 40, height: 40, borderRadius: 11, background: "#f0e6fc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a23cf" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
                    </span>
                    <span>
                      <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: "#17151a" }}>Upload service-account key</span>
                      <span style={{ display: "block", fontSize: 13, color: "#a3a0a8", marginTop: 2 }}>.json file · used only to post replies on your behalf</span>
                    </span>
                    <input type="file" accept=".json,application/json" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) setKeyFile(f.name); }} style={{ display: "none" }} />
                  </label>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 17px", border: "1.5px solid #cdeedd", borderRadius: 14, background: "#f3fbf6" }}>
                    <span style={{ flex: "none", width: 38, height: 38, borderRadius: 10, background: "#eafaf1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#22a06b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#17151a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{keyFile}</span>
                      <span style={{ display: "block", fontSize: 12.5, color: "#5fa17e" }}>Verified · ready to connect</span>
                    </span>
                    <button onClick={() => setKeyFile("")} style={{ flex: "none", background: "none", border: "none", color: "#9a97a0", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "6px 8px", fontFamily: "inherit" }}>Remove</button>
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {/* FOOTER */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "24px 30px" }}>
              <div>
                <div style={{ fontSize: 13, color: "#a3a0a8" }}>Plan</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.5px" }}>$5</span>
                  <span style={{ fontSize: 14, color: "#7d7a83" }}>/ month per app · cancel anytime</span>
                </div>
              </div>
              <button
                onClick={() => { if (canStart) setDone(true); }}
                disabled={!canStart}
                style={{
                  border: "none",
                  padding: "14px 30px",
                  borderRadius: 13,
                  fontSize: 15,
                  fontWeight: 600,
                  transition: "all .15s",
                  fontFamily: "inherit",
                  background: canStart ? "#8b30e8" : "#e7d8f7",
                  color: "#fff",
                  cursor: canStart ? "pointer" : "not-allowed",
                  boxShadow: canStart ? "0 8px 20px rgba(139,48,232,.3)" : "none",
                }}
              >
                {canStart ? "Get Started — $5/mo" : "Get Started"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
