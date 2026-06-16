import { Router, type IRouter } from "express";
import { eq, count, sum, avg } from "drizzle-orm";
import { db, appsTable, reviewsTable, campaignsTable } from "@workspace/db";
import {
  GetDashboardStatsResponse,
  GetRecommendationsQueryParams,
  GetRecommendationsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [appStats] = await db
    .select({
      totalApps: count(appsTable.id),
      totalDownloads: sum(appsTable.totalDownloads),
      avgRating: avg(appsTable.rating),
      totalReviews: sum(appsTable.reviewCount),
    })
    .from(appsTable);

  const [campaignStats] = await db
    .select({
      activeCampaigns: count(campaignsTable.id),
      totalSpend: sum(campaignsTable.spend),
      totalInstalls: sum(campaignsTable.installs),
    })
    .from(campaignsTable)
    .where(eq(campaignsTable.status, "active"));

  const [unrepliedCount] = await db
    .select({ count: count(reviewsTable.id) })
    .from(reviewsTable)
    .where(eq(reviewsTable.replied, false));

  const allApps = await db.select().from(appsTable).orderBy(appsTable.totalDownloads);
  const topApp = allApps.length > 0 ? allApps[allApps.length - 1] : null;

  const stats = {
    totalApps: Number(appStats?.totalApps ?? 0),
    totalDownloads: Number(appStats?.totalDownloads ?? 0),
    avgRating: parseFloat(Number(appStats?.avgRating ?? 0).toFixed(1)),
    totalReviews: Number(appStats?.totalReviews ?? 0),
    activeCampaigns: Number(campaignStats?.activeCampaigns ?? 0),
    totalSpend: Number(campaignStats?.totalSpend ?? 0),
    totalInstallsFromCampaigns: Number(campaignStats?.totalInstalls ?? 0),
    unrepliedReviews: Number(unrepliedCount?.count ?? 0),
    topApp: topApp ? { ...topApp, createdAt: topApp.createdAt.toISOString() } : undefined,
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

router.get("/dashboard/recommendations", async (req, res): Promise<void> => {
  const queryParams = GetRecommendationsQueryParams.safeParse(req.query);
  if (!queryParams.success) {
    res.status(400).json({ error: queryParams.error.message });
    return;
  }

  let totalDownloads = 0;

  if (queryParams.data.appId) {
    const [app] = await db
      .select()
      .from(appsTable)
      .where(eq(appsTable.id, queryParams.data.appId));
    totalDownloads = app?.totalDownloads ?? 0;
  } else {
    const [agg] = await db
      .select({ total: sum(appsTable.totalDownloads) })
      .from(appsTable);
    totalDownloads = Number(agg?.total ?? 0);
  }

  let stage: "launch" | "growth" | "scale" = "launch";
  if (totalDownloads >= 10000) {
    stage = "scale";
  } else if (totalDownloads >= 1000) {
    stage = "growth";
  }

  const allRecs = [
    {
      id: "aso-launch",
      service: "aso",
      title: "Get Found in the App Store",
      description: "Most new apps get zero organic traffic. Our ASO team optimizes your keywords, title, and description so you show up when users search.",
      priority: "high",
      stage: "launch",
      ctaLabel: "Start ASO",
    },
    {
      id: "ratings-launch",
      service: "ratings_reviews",
      title: "Build Your Rating from Day One",
      description: "A 4.5+ star rating is your #1 trust signal. We set up automated review prompts and help you respond to every review to keep your score high.",
      priority: "high",
      stage: "launch",
      ctaLabel: "Manage Reviews",
    },
    {
      id: "ua-growth",
      service: "user_acquisition",
      title: "Scale Your User Acquisition",
      description: "You've found product-market fit. Time to pour fuel on the fire. Our UA team runs paid campaigns across Google, Apple Search Ads, and more.",
      priority: "high",
      stage: "growth",
      ctaLabel: "Launch Campaign",
    },
    {
      id: "meta-ads-growth",
      service: "meta_ads",
      title: "Meta Ads Creative That Converts",
      description: "Stop burning budget on ads that don't work. Our creative team produces scroll-stopping video and static ads optimized for mobile app installs.",
      priority: "medium",
      stage: "growth",
      ctaLabel: "Order Creatives",
    },
    {
      id: "push-scale",
      service: "push_notifications",
      title: "Re-engage Your Existing Users",
      description: "At your scale, retention is growth. Our AppStories team crafts push notification sequences that bring users back and drive in-app conversions.",
      priority: "high",
      stage: "scale",
      ctaLabel: "Set Up Stories",
    },
    {
      id: "aso-scale",
      service: "aso",
      title: "Advanced ASO & Category Domination",
      description: "You're big enough to dominate your category. We do deep keyword research, competitor analysis, and A/B test your store listing.",
      priority: "medium",
      stage: "scale",
      ctaLabel: "Upgrade ASO",
    },
  ];

  const stageOrder = ["launch", "growth", "scale"];
  const currentIndex = stageOrder.indexOf(stage);
  const recs = allRecs.filter(
    (r) => stageOrder.indexOf(r.stage) <= currentIndex + 1
  );

  res.json(GetRecommendationsResponse.parse(recs));
});

export default router;
