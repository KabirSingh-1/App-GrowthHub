import { Router, type IRouter } from "express";
import { SearchAppsQueryParams, SearchAppsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const MOCK_APPS = [
  { id: "com.duolingo.duolingo", name: "Duolingo", platform: "both" as const, bundleId: "com.duolingo.duolingo", iconUrl: null, category: "Education", developer: "Duolingo", rating: 4.7, reviewCount: 2100000, totalDownloads: 500000000 },
  { id: "com.instagram.android", name: "Instagram", platform: "both" as const, bundleId: "com.instagram.android", iconUrl: null, category: "Social Networking", developer: "Meta", rating: 4.5, reviewCount: 18000000, totalDownloads: 2000000000 },
  { id: "com.spotify.music", name: "Spotify", platform: "both" as const, bundleId: "com.spotify.music", iconUrl: null, category: "Music", developer: "Spotify AB", rating: 4.6, reviewCount: 9000000, totalDownloads: 1000000000 },
  { id: "com.notion.id", name: "Notion", platform: "both" as const, bundleId: "com.notion.id", iconUrl: null, category: "Productivity", developer: "Notion Labs", rating: 4.6, reviewCount: 420000, totalDownloads: 50000000 },
  { id: "com.robinhood.android", name: "Robinhood", platform: "both" as const, bundleId: "com.robinhood.android", iconUrl: null, category: "Finance", developer: "Robinhood Markets", rating: 4.2, reviewCount: 2800000, totalDownloads: 30000000 },
  { id: "com.strava.android", name: "Strava", platform: "both" as const, bundleId: "com.strava.android", iconUrl: null, category: "Health & Fitness", developer: "Strava", rating: 4.6, reviewCount: 1100000, totalDownloads: 80000000 },
  { id: "com.calm.android", name: "Calm", platform: "both" as const, bundleId: "com.calm.android", iconUrl: null, category: "Health & Fitness", developer: "Calm.com", rating: 4.8, reviewCount: 880000, totalDownloads: 40000000 },
  { id: "com.todoist.android", name: "Todoist", platform: "both" as const, bundleId: "com.todoist.android", iconUrl: null, category: "Productivity", developer: "Doist", rating: 4.7, reviewCount: 350000, totalDownloads: 20000000 },
  { id: "com.headspace.android", name: "Headspace", platform: "both" as const, bundleId: "com.headspace.android", iconUrl: null, category: "Health & Fitness", developer: "Headspace Inc.", rating: 4.7, reviewCount: 610000, totalDownloads: 30000000 },
  { id: "com.figma.android", name: "Figma", platform: "both" as const, bundleId: "com.figma.android", iconUrl: null, category: "Design", developer: "Figma Inc.", rating: 4.3, reviewCount: 90000, totalDownloads: 5000000 },
  { id: "com.airbnb.android", name: "Airbnb", platform: "both" as const, bundleId: "com.airbnb.android", iconUrl: null, category: "Travel", developer: "Airbnb", rating: 4.5, reviewCount: 3200000, totalDownloads: 150000000 },
  { id: "com.canva.android", name: "Canva", platform: "both" as const, bundleId: "com.canva.android", iconUrl: null, category: "Design", developer: "Canva Pty Ltd", rating: 4.8, reviewCount: 5100000, totalDownloads: 200000000 },
  { id: "com.linear.app", name: "Linear", platform: "both" as const, bundleId: "com.linear.app", iconUrl: null, category: "Productivity", developer: "Linear Orbit", rating: 4.8, reviewCount: 14000, totalDownloads: 500000 },
  { id: "com.brainly.android", name: "Brainly", platform: "both" as const, bundleId: "com.brainly.android", iconUrl: null, category: "Education", developer: "Brainly", rating: 4.4, reviewCount: 2800000, totalDownloads: 100000000 },
  { id: "com.revolut.android", name: "Revolut", platform: "both" as const, bundleId: "com.revolut.android", iconUrl: null, category: "Finance", developer: "Revolut Ltd", rating: 4.7, reviewCount: 2100000, totalDownloads: 30000000 },
];

router.get("/apps/search", async (req, res): Promise<void> => {
  const queryParams = SearchAppsQueryParams.safeParse(req.query);
  if (!queryParams.success) {
    res.status(400).json({ error: queryParams.error.message });
    return;
  }

  const q = queryParams.data.q.toLowerCase();
  const platform = queryParams.data.platform;

  let results = MOCK_APPS.filter(app =>
    app.name.toLowerCase().includes(q) ||
    app.developer.toLowerCase().includes(q) ||
    app.bundleId?.toLowerCase().includes(q) ||
    app.category.toLowerCase().includes(q)
  );

  if (platform && platform !== "both") {
    results = results.filter(app => app.platform === platform || app.platform === "both");
  }

  res.json(SearchAppsResponse.parse(results.slice(0, 8)));
});

export default router;
