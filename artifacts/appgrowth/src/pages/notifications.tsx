import React from "react";
import { AppLayout } from "@/components/layout/app-layout";

/**
 * AppStorysPitch — in-dashboard pitch page for AppStorys.
 * Drop into any React app:  <AppStorysPitch />
 * Self-contained: no external CSS needed (loads Plus Jakarta Sans + a tiny <style> for animations/reset).
 */

const ORANGE = "#f97316";
const ORANGE_DK = "#ea580c";
const TINT = "#ffeede";

const card = {
  background: "#fff",
  border: "1px solid #eeece8",
  borderRadius: 18,
};

const chip = {
  padding: "6px 12px",
  borderRadius: 8,
  background: "#faf8f5",
  border: "1px solid #eeece8",
  fontSize: 12.5,
  fontWeight: 600,
  color: "#5d574e",
};

interface FeatureCardProps {
  img: string;
  alt: string;
  title: string;
  body: string;
  stats: { value: string; label: string }[];
}

function FeatureCard({ img, alt, title, body, stats }: FeatureCardProps) {
  return (
    <div style={{ ...card, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 188, background: "#faf8f5", borderBottom: "1px solid #f1efe9" }}>
        <img src={img} alt={alt} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: 22 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>{title}</h3>
        <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.5, color: "#5d574e" }}>{body}</p>
        <div style={{ display: "flex", gap: 18 }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 20, fontWeight: 800, color: ORANGE }}>{s.value}</div>
              <div style={{ fontSize: 11.5, color: "#8a847a", lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface WhyCardProps {
  icon: string;
  title: string;
  body: string;
}

function WhyCard({ icon, title, body }: WhyCardProps) {
  return (
    <div style={{ ...card, borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontWeight: 700, marginTop: 10, fontSize: 15 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#8a847a", lineHeight: 1.45, marginTop: 4 }}>{body}</div>
    </div>
  );
}

export default function Notifications() {
  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .as-root *, .as-root *::before, .as-root *::after { box-sizing: border-box; }
        @keyframes asFloatUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div
        className="as-root"
        style={{
          fontFamily: "'Plus Jakarta Sans',-apple-system,sans-serif",
          color: "#1c1815",
          padding: "10px 0 40px",
        }}
      >
        {/* Main content from template */}
        <div style={{ maxWidth: 1240 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              borderRadius: 999,
              background: TINT,
              color: ORANGE_DK,
              fontWeight: 700,
              fontSize: 12.5,
              letterSpacing: 0.3,
              animation: "asFloatUp .5s ease both",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: ORANGE, display: "inline-block" }} />
            LIMITED ROLLOUT FOR APPVERSAL CUSTOMERS
          </div>

          <h1
            style={{
              margin: "20px 0 0",
              fontSize: 46,
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: -1.2,
              maxWidth: 760,
              animation: "asFloatUp .5s ease .05s both",
            }}
          >
            Leading <span style={{ color: ORANGE }}>In-App Engagement</span> Platform
          </h1>

          <p
            style={{
              margin: "18px 0 0",
              fontSize: 18,
              lineHeight: 1.55,
              color: "#5d574e",
              maxWidth: 620,
              animation: "asFloatUp .5s ease .1s both",
            }}
          >
            Now unlock the full stack — interactive in-app messaging, a
            built-in CDP, and off-app channels — <strong style={{ color: "#1c1815" }}>free for up to 10,000 users.</strong>
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30, animation: "asFloatUp .5s ease .15s both" }}>
            <a
              href="https://appstorys.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "15px 28px",
                borderRadius: 12,
                background: ORANGE,
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                boxShadow: "0 12px 28px rgba(249,115,22,0.34)",
              }}
            >
              Claim your free plan <span style={{ fontSize: 17 }}>→</span>
            </a>
            <a
              href="https://appstorys.com/bookademo"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "15px 22px",
                borderRadius: 12,
                background: "#fff",
                border: "1px solid #e6e2db",
                color: "#1c1815",
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
              }}
            >
              Book a demo
            </a>
          </div>

          {/* Demo video */}
          <div style={{ marginTop: 48, animation: "asFloatUp .5s ease .2s both" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>See it in 90 seconds</h2>
              <span style={{ color: "#8a847a", fontSize: 15 }}>
                Watch how teams ship in-app experiences without an app update.
              </span>
            </div>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 880,
                aspectRatio: "16/9",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 18px 44px rgba(28,24,21,0.16)",
                border: "1px solid #eeece8",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/IUH_k_5CTFQ"
                title="AppStorys Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Core features */}
          <div style={{ marginTop: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: ORANGE_DK }}>CORE FEATURES</div>
            <h2 style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 800, letterSpacing: -0.8 }}>
              Incredible in-app user experiences
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 26 }}>
              <FeatureCard
                img="https://appstorys.com/_next/static/media/sc1-1.65c48f0e.gif"
                alt="Stories"
                title="Stories"
                body="Short, tappable brand stories that leave a lasting impression — right inside your app."
                stats={[
                  { value: "50%", label: "Feature adoption" },
                  { value: "37%", label: "More page views" },
                ]}
              />
              <FeatureCard
                img="https://appstorys.com/_next/static/media/sc2.0c16c1d5.png"
                alt="PiP Videos"
                title="PiP Videos"
                body="Picture-in-picture videos that deliver updates without disrupting the user's flow."
                stats={[
                  { value: "60%", label: "Feature adoption" },
                  { value: "10%", label: "7-day retention" },
                ]}
              />
              <FeatureCard
                img="https://appstorys.com/_next/static/media/sc3.596b9ff1.png"
                alt="Reels"
                title="Reels"
                body="Eye-catching short videos that get your message across in seconds and drive interaction."
                stats={[
                  { value: "35%", label: "Engagement rate" },
                  { value: "60%", label: "More page views" },
                ]}
              />
            </div>
          </div>

          {/* CDP + Off-app channels */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
            <div style={{ ...card, padding: 28 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: TINT,
                  color: ORANGE_DK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                ⚡
              </div>
              <h3 style={{ margin: "18px 0 8px", fontSize: 20, fontWeight: 700 }}>Built-in CDP &amp; cohorts</h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "#5d574e" }}>
                Connect your CDP to fetch user segments by activity, behavior or preference — then show personalized
                stories, videos and banners to each group automatically, with zero engineering work.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                {["CleverTap", "MoEngage", "Mixpanel", "Amplitude", "Braze"].map((p) => (
                  <span key={p} style={chip}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ ...card, padding: 28, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: TINT,
                  color: ORANGE_DK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                📡
              </div>
              <h3 style={{ margin: "18px 0 8px", fontSize: 20, fontWeight: 700 }}>Off-app channels</h3>
              <p style={{ margin: "0 0 18px", fontSize: 14.5, lineHeight: 1.55, color: "#5d574e" }}>
                Engage users everywhere — orchestrate Push, Email, SMS and WhatsApp from one flow.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: "auto" }}>
                {[
                  { icon: "🔔", label: "Push" },
                  { icon: "✉️", label: "Email" },
                  { icon: "💬", label: "SMS" },
                  { icon: "🟢", label: "WhatsApp" },
                ].map((c) => (
                  <div
                    key={c.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 14px",
                      borderRadius: 10,
                      background: "#faf8f5",
                      border: "1px solid #eeece8",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {c.icon} {c.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Studio */}
          <div style={{ ...card, marginTop: 24, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: 36 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: ORANGE_DK }}>APPSTORYS AI STUDIO</div>
              <h3 style={{ margin: "10px 0 12px", fontSize: 26, fontWeight: 800, letterSpacing: -0.6 }}>
                Design campaigns with AI, ship them yourself
              </h3>
              <p style={{ margin: "0 0 18px", fontSize: 15, lineHeight: 1.6, color: "#5d574e" }}>
                Generate campaigns instantly, then refine in a powerful drag-and-drop editor. Product teams take the lead
                — no engineering effort, no app release.
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "A/B testing with AI Auto-Pilot",
                  "Frequency, scheduling & trigger rules",
                  "Goal tracking tied to real in-app events",
                ].map((t) => (
                  <li key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, color: "#3a352e" }}>
                    <span style={{ color: ORANGE, fontWeight: 800 }}>✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                background: "#faf8f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                borderLeft: "1px solid #f1efe9",
              }}
            >
              <img
                src="https://appstorys.com/_next/static/media/studio_page_2.0062695d.png"
                alt="AppStorys AI Studio"
                style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 10, boxShadow: "0 10px 28px rgba(28,24,21,0.12)" }}
              />
            </div>
          </div>

          {/* Why us strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 24 }}>
            <WhyCard icon="🔒" title="SOC 2 Type 2" body="AWS infra with AES-256 encryption." />
            <WhyCard icon="📊" title="Real-time analytics" body="Data flows the moment you go live." />
            <WhyCard icon="⚙️" title="30-min SDK setup" body="iOS, Android, RN, Flutter & web." />
            <WhyCard icon="🎯" title="Tailored campaigns" body="Powerful per-user segmentation." />
          </div>

          {/* Free banner strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              marginTop: 24,
              padding: "26px 32px",
              borderRadius: 18,
              background: "linear-gradient(100deg,#ea580c,#f97316 55%,#fb923c)",
              color: "#fff",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.6, opacity: 0.9 }}>
                FREE UP TO 10,000 USERS
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing: -0.4 }}>
                The complete platform, not a trial. No credit card.
              </div>
            </div>
            <a
              href="https://appstorys.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 26px",
                borderRadius: 11,
                background: "#fff",
                color: ORANGE_DK,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Get started free →
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
