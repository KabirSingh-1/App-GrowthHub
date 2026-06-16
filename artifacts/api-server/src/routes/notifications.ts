import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, notificationsTable } from "@workspace/db";
import {
  ListNotificationsQueryParams,
  ListNotificationsResponse,
  CreateNotificationBody,
  UpdateNotificationParams,
  UpdateNotificationBody,
  UpdateNotificationResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/notifications", async (req, res): Promise<void> => {
  const queryParams = ListNotificationsQueryParams.safeParse(req.query);
  if (!queryParams.success) {
    res.status(400).json({ error: queryParams.error.message });
    return;
  }
  let query = db.select().from(notificationsTable).$dynamic();
  if (queryParams.data.appId) {
    query = query.where(eq(notificationsTable.appId, queryParams.data.appId));
  }
  const notifications = await query.orderBy(notificationsTable.createdAt);
  res.json(ListNotificationsResponse.parse(notifications));
});

router.post("/notifications", async (req, res): Promise<void> => {
  const parsed = CreateNotificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [notification] = await db.insert(notificationsTable).values(parsed.data).returning();
  res.status(201).json(notification);
});

router.patch("/notifications/:notificationId", async (req, res): Promise<void> => {
  const params = UpdateNotificationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateNotificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [notification] = await db
    .update(notificationsTable)
    .set(parsed.data)
    .where(eq(notificationsTable.id, params.data.notificationId))
    .returning();
  if (!notification) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  res.json(UpdateNotificationResponse.parse(notification));
});

export default router;
