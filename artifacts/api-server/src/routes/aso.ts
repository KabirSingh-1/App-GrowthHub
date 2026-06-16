import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, asoKeywordsTable } from "@workspace/db";
import {
  ListAsoKeywordsQueryParams,
  ListAsoKeywordsResponse,
  CreateAsoKeywordBody,
  DeleteAsoKeywordParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/aso-keywords", async (req, res): Promise<void> => {
  const queryParams = ListAsoKeywordsQueryParams.safeParse(req.query);
  if (!queryParams.success) {
    res.status(400).json({ error: queryParams.error.message });
    return;
  }
  let query = db.select().from(asoKeywordsTable).$dynamic();
  if (queryParams.data.appId) {
    query = query.where(eq(asoKeywordsTable.appId, queryParams.data.appId));
  }
  const keywords = await query.orderBy(asoKeywordsTable.createdAt);
  res.json(ListAsoKeywordsResponse.parse(keywords));
});

router.post("/aso-keywords", async (req, res): Promise<void> => {
  const parsed = CreateAsoKeywordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [keyword] = await db.insert(asoKeywordsTable).values(parsed.data).returning();
  res.status(201).json(keyword);
});

router.delete("/aso-keywords/:keywordId", async (req, res): Promise<void> => {
  const params = DeleteAsoKeywordParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [keyword] = await db
    .delete(asoKeywordsTable)
    .where(eq(asoKeywordsTable.id, params.data.keywordId))
    .returning();
  if (!keyword) {
    res.status(404).json({ error: "Keyword not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
