import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import {
  ListReviewsParams,
  ListReviewsResponse,
  ReplyToReviewParams,
  ReplyToReviewBody,
  ReplyToReviewResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/apps/:appId/reviews", async (req, res): Promise<void> => {
  const params = ListReviewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.appId, params.data.appId))
    .orderBy(reviewsTable.createdAt);
  res.json(ListReviewsResponse.parse(reviews));
});

router.patch("/apps/:appId/reviews/:reviewId/reply", async (req, res): Promise<void> => {
  const params = ReplyToReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = ReplyToReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [review] = await db
    .update(reviewsTable)
    .set({ replyText: parsed.data.replyText, replied: true })
    .where(
      and(
        eq(reviewsTable.id, params.data.reviewId),
        eq(reviewsTable.appId, params.data.appId)
      )
    )
    .returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(ReplyToReviewResponse.parse(review));
});

export default router;
