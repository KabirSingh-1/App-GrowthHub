import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";

/**
 * Dashboard — AppVersal app-growth command center.
 * Self-contained: injects Plus Jakarta Sans + keyframes itself.
 */

const PURPLE = "#7c3aed";

interface Service {
  icon: string;
  accent: string;
  tint: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}

const services: Service[] = [
  { icon: "★", accent: "#f59e0b", tint: "#fef3e2", title: "Ratings & Reviews", body: "Earn authentic 5-star reviews and lift your store rating fast.", cta: "Open service →", href: "/ratings" },
  { icon: "💬", accent: "#7c3aed", tint: "#f3eefe", title: "AI Reply to Reviews", body: "Respond to every review at scale and protect your reputation.", cta: "Open service →", href: "/order/reply-to-reviews" },
  { icon: "⌕", accent: "#3b82f6", tint: "#e8f1fe", title: "ASO Installs", body: "Rank for high-volume keywords with targeted, real installs.", cta: "Open service →", href: "/order/aso-installs" },
  { icon: "▷", accent: "#ec4899", tint: "#fdeaf4", title: "UGC Videos", body: "Scroll-stopping AI video ads, built for Meta, TikTok & more.", cta: "Open service →", href: "/order/videos" },
  { icon: "📣", accent: "#14b8a6", tint: "#e3f7f3", title: "Meta Ads", body: "Performance creative and fully managed install campaigns.", cta: "Open service →", href: "/marketing" },
  { icon: "⌕", accent: "#6366f1", tint: "#eaeafe", title: "Apple Search Ads", body: "Capture high-intent App Store searches at the moment of intent.", cta: "Open service →", href: "/order/apple-search-ads" },
];


interface ServiceCardProps {
  s: Service;
  delay: number;
}

function ServiceCard({ s, delay }: ServiceCardProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hover ? s.accent : "#ececf1"}`,
        borderRadius: 18, padding: 24, cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
        transform: hover ? "translateY(-5px)" : "none",
        boxShadow: hover ? `0 16px 34px ${s.accent}2e` : "none",
        animation: `dashFloatUp .5s ease ${delay}s both`,
      }}
    >
      <div>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: s.tint, color: s.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
        <h3 style={{ margin: "16px 0 6px", fontSize: 18, fontWeight: 700 }}>{s.title}</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#6b6577" }}>{s.body}</p>
      </div>
      <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: s.accent }}>{s.cta}</div>
    </div>
  );
}

export default function Dashboard() {
  const [appStorysHover, setAppStorysHover] = useState(false);

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dash-root *, .dash-root *::before, .dash-root *::after { box-sizing: border-box; }
        @keyframes dashFloatUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dashDrift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.12); } }
        @keyframes dashDrift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,24px) scale(1.18); } }
        @keyframes dashShimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      `}</style>

      <div className="dash-root" style={{ fontFamily: "'Plus Jakarta Sans',-apple-system,sans-serif", color: "#1a1523", padding: "10px 0 40px" }}>
        {/* Main */}
        <div style={{ maxWidth: 1320 }} className="w-full">

          {/* Services */}
          <div id="services" style={{ marginTop: 42 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.6 }}>Your growth toolkit</h2>
              <span style={{ color: "#8a8595", fontSize: 15 }} className="hidden sm:inline">Pick a service and we'll handle the heavy lifting.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px] mt-[18px]">
              <Link href={services[0].href}>
                <ServiceCard s={services[0]} delay={0.05} />
              </Link>
              <Link href={services[1].href}>
                <ServiceCard s={services[1]} delay={0.1} />
              </Link>
              <Link href={services[2].href}>
                <ServiceCard s={services[2]} delay={0.15} />
              </Link>
              <Link href={services[3].href}>
                <ServiceCard s={services[3]} delay={0.2} />
              </Link>

              {/* AppStorys feature card */}
              <Link href="/notifications">
                <div
                  onMouseEnter={() => setAppStorysHover(true)}
                  onMouseLeave={() => setAppStorysHover(false)}
                  style={{
                    height: "100%",
                    position: "relative",
                    background: "linear-gradient(140deg,#fff,#fff7f0)",
                    border: `1px solid ${appStorysHover ? "#f97316" : "#f7d9bf"}`,
                    borderRadius: 18,
                    padding: 24,
                    cursor: "pointer",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
                    transform: appStorysHover ? "translateY(-5px)" : "none",
                    boxShadow: appStorysHover ? "0 16px 34px rgba(249,115,22,0.18)" : "none",
                    animation: "dashFloatUp .5s ease .25s both"
                  }}
                >
                  <div style={{ position: "absolute", top: 14, right: 14, padding: "4px 10px", borderRadius: 999, background: "#f97316", color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: 0.3 }}>FREE TO 10K</div>
                  <div>
                    <div style={{ width: 48, height: 48, borderRadius: 13, background: "#ffe9d6", color: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚡</div>
                    <h3 style={{ margin: "16px 0 6px", fontSize: 18, fontWeight: 700 }}>Get AppStorys</h3>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#6b6577" }}>Full in-app messaging, CDP & off-app channels — free up to 10K users.</p>
                  </div>
                  <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: "#f97316" }}>Claim free plan →</div>
                </div>
              </Link>

              <Link href={services[4].href}>
                <ServiceCard s={services[4]} delay={0.3} />
              </Link>
              <Link href={services[5].href}>
                <ServiceCard s={services[5]} delay={0.35} />
              </Link>

              {/* Growth plan banner */}
              <div
                className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                style={{
                  background: "linear-gradient(110deg,#1c1726,#2d2440)",
                  color: "#fff",
                  borderRadius: 18,
                  padding: "26px 28px",
                  animation: "dashFloatUp .5s ease .4s both"
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>Not sure where to start?</h3>
                  <p style={{ margin: "6px 0 0", fontSize: 14, color: "rgba(255,255,255,.7)" }}>Get a free growth audit and a tailored plan for your app.</p>
                </div>
                <Link href="/ratings" className="w-full sm:w-auto text-center flex-none" style={{ padding: "13px 24px", borderRadius: 12, background: "linear-gradient(90deg,#a855f7,#7c3aed,#a855f7)", backgroundSize: "200% auto", animation: "dashShimmer 3s linear infinite", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Get my growth plan →</Link>
              </div>
            </div>
          </div>

          {/* Recommended */}
          <div style={{ marginTop: 42 }}>
            <h2 style={{ margin: "0 0 18px", fontSize: 24, fontWeight: 800, letterSpacing: -0.6 }}>Recommended for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
              <Link href="/aso" style={{ display: "block", textDecoration: "none" }}>
                <div style={{ background: "#fff", border: "1px solid #ececf1", borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s", height: "100%" }} className="hover-elevate">
                  <div style={{ height: 6, background: "linear-gradient(90deg,#7c3aed,#a855f7)" }} />
                  <div style={{ padding: 24 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1523" }}>Improve ASO Keywords</h3>
                    <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "#6b6577" }}>Your app 'Zen Meditation' is missing out on high-volume keywords like 'sleep sounds'.</p>
                    <div style={{ marginTop: 16, fontSize: 14.5, fontWeight: 700, color: "#7c3aed" }}>View ASO Tools →</div>
                  </div>
                </div>
              </Link>
              <Link href="/ratings" style={{ display: "block", textDecoration: "none" }}>
                <div style={{ background: "#fff", border: "1px solid #ececf1", borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s", height: "100%" }} className="hover-elevate">
                  <div style={{ height: 6, background: "linear-gradient(90deg,#f97316,#fb923c)" }} />
                  <div style={{ padding: 24 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1523" }}>Boost Ratings</h3>
                    <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "#6b6577" }}>Recent updates dropped your average rating to 4.1. Consider a review campaign.</p>
                    <div style={{ marginTop: 16, fontSize: 14.5, fontWeight: 700, color: "#f97316" }}>Order Ratings →</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
