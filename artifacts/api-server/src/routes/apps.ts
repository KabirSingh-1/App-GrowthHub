import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, appsTable } from "@workspace/db";
import {
  ListAppsResponse,
  CreateAppBody,
  GetAppParams,
  GetAppResponse,
  UpdateAppParams,
  UpdateAppBody,
  UpdateAppResponse,
  DeleteAppParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/apps", async (_req, res): Promise<void> => {
  const apps = await db.select().from(appsTable).orderBy(appsTable.createdAt);
  res.json(ListAppsResponse.parse(apps));
});

router.post("/apps", async (req, res): Promise<void> => {
  const parsed = CreateAppBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [app] = await db.insert(appsTable).values(parsed.data).returning();
  res.status(201).json(GetAppResponse.parse(app));
});

router.get("/apps/:appId", async (req, res): Promise<void> => {
  const params = GetAppParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [app] = await db.select().from(appsTable).where(eq(appsTable.id, params.data.appId));
  if (!app) {
    res.status(404).json({ error: "App not found" });
    return;
  }
  res.json(GetAppResponse.parse(app));
});

router.patch("/apps/:appId", async (req, res): Promise<void> => {
  const params = UpdateAppParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateAppBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [app] = await db
    .update(appsTable)
    .set(parsed.data)
    .where(eq(appsTable.id, params.data.appId))
    .returning();
  if (!app) {
    res.status(404).json({ error: "App not found" });
    return;
  }
  res.json(UpdateAppResponse.parse(app));
});

router.delete("/apps/:appId", async (req, res): Promise<void> => {
  const params = DeleteAppParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [app] = await db.delete(appsTable).where(eq(appsTable.id, params.data.appId)).returning();
  if (!app) {
    res.status(404).json({ error: "App not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
