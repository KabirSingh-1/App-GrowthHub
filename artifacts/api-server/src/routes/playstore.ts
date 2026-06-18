import { Router, type IRouter } from "express";
// @ts-ignore – google-play-scraper is a CommonJS package
import gplay from "google-play-scraper";
// @ts-ignore – app-store-scraper is a CommonJS package
import store from "app-store-scraper";

const router: IRouter = Router();

// ─── GET /api/playstore/search ────────────────────────────────────────────────

router.get("/playstore/search", async (req, res): Promise<void> => {
  const q = (req.query.q as string | undefined)?.trim();
  const country = ((req.query.country as string | undefined) || "in").toLowerCase();

  if (!q) {
    res.status(400).json({ success: false, message: "Query parameter `q` is required." });
    return;
  }

  try {
    const results = await gplay.search({
      term: q,
      num: 20,
      country,
      lang: "en",
      throttle: 10,
    });

    const normalized = results.map((app: any) => ({
      name: app.title ?? "",
      store: "Play Store",
      developer: app.developer ?? "",
      rating: typeof app.score === "number" ? Math.round(app.score * 10) / 10 : null,
      icon: app.icon ?? null,
      appId: app.appId ?? "",
      url: app.url ?? `https://play.google.com/store/apps/details?id=${app.appId}`,
    }));

    res.json({ success: true, keyword: q, results: normalized });
  } catch (err: any) {
    console.error("[playstore/search] Error:", err?.message ?? err);
    res.status(500).json({ success: false, message: "Failed to fetch Play Store results.", error: err?.message });
  }
});

// ─── GET /api/appstore/search ─────────────────────────────────────────────────

router.get("/appstore/search", async (req, res): Promise<void> => {
  const q = (req.query.q as string | undefined)?.trim();
  const country = ((req.query.country as string | undefined) || "in").toLowerCase();

  if (!q) {
    res.status(400).json({ success: false, message: "Query parameter `q` is required." });
    return;
  }

  try {
    const results = await store.search({
      term: q,
      num: 20,
      country,
      lang: "en-us",
    });

    const normalized = results.map((app: any) => ({
      name: app.title ?? "",
      store: "App Store",
      developer: app.developer ?? app.artistName ?? "",
      rating: typeof app.score === "number" ? Math.round(app.score * 10) / 10 : null,
      icon: app.icon ?? app.artworkUrl100 ?? null,
      appId: String(app.id ?? app.appId ?? ""),
      url: app.url ?? `https://apps.apple.com/app/id${app.id}`,
    }));

    res.json({ success: true, keyword: q, results: normalized });
  } catch (err: any) {
    console.error("[appstore/search] Error:", err?.message ?? err);
    res.status(500).json({ success: false, message: "Failed to fetch App Store results.", error: err?.message });
  }
});

// ─── GET /api/discover/search — both stores in parallel ───────────────────────

router.get("/discover/search", async (req, res): Promise<void> => {
  const q = (req.query.q as string | undefined)?.trim();
  const country = ((req.query.country as string | undefined) || "in").toLowerCase();
  const platform = (req.query.platform as string | undefined) || "both";

  if (!q) {
    res.status(400).json({ success: false, message: "Query parameter `q` is required." });
    return;
  }

  const fetchPlayStore = async () => {
    if (platform === "ios") return [];
    try {
      const results = await gplay.search({ term: q, num: 20, country, lang: "en", throttle: 10 });
      return results.map((app: any) => ({
        name: app.title ?? "",
        store: "Play Store",
        developer: app.developer ?? "",
        rating: typeof app.score === "number" ? Math.round(app.score * 10) / 10 : null,
        icon: app.icon ?? null,
        appId: app.appId ?? "",
        url: app.url ?? `https://play.google.com/store/apps/details?id=${app.appId}`,
      }));
    } catch { return []; }
  };

  const fetchAppStore = async () => {
    if (platform === "android") return [];
    try {
      const results = await store.search({ term: q, num: 20, country, lang: "en-us" });
      return results.map((app: any) => ({
        name: app.title ?? "",
        store: "App Store",
        developer: app.developer ?? app.artistName ?? "",
        rating: typeof app.score === "number" ? Math.round(app.score * 10) / 10 : null,
        icon: app.icon ?? app.artworkUrl100 ?? null,
        appId: String(app.id ?? app.appId ?? ""),
        url: app.url ?? `https://apps.apple.com/app/id${app.id}`,
      }));
    } catch { return []; }
  };

  const [playResults, iosResults] = await Promise.all([fetchPlayStore(), fetchAppStore()]);
  const all = [...iosResults, ...playResults];

  // Sort by rating desc (nulls last)
  all.sort((a, b) => {
    if (a.rating === null && b.rating === null) return 0;
    if (a.rating === null) return 1;
    if (b.rating === null) return -1;
    return b.rating - a.rating;
  });

  if (all.length === 0) {
    res.json({ success: false, message: "No applications found for the provided keyword." });
    return;
  }

  res.json({ success: true, keyword: q, results: all });
});

export default router;
