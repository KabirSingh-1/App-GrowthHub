import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import {
  ListOrdersQueryParams,
  ListOrdersResponse,
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
  UpdateOrderParams,
  UpdateOrderBody,
  UpdateOrderResponse,
  DeleteOrderParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/orders", async (req, res): Promise<void> => {
  const queryParams = ListOrdersQueryParams.safeParse(req.query);
  if (!queryParams.success) {
    res.status(400).json({ error: queryParams.error.message });
    return;
  }
  let query = db.select().from(ordersTable).$dynamic();
  if (queryParams.data.appId) {
    query = query.where(eq(ordersTable.appId, queryParams.data.appId));
  }
  const orders = await query.orderBy(ordersTable.createdAt);
  res.json(ListOrdersResponse.parse(orders.map(o => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }))));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [order] = await db.insert(ordersTable).values(parsed.data).returning();
  res.status(201).json(GetOrderResponse.parse({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));
});

router.get("/orders/:orderId", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.orderId));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(GetOrderResponse.parse({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));
});

router.patch("/orders/:orderId", async (req, res): Promise<void> => {
  const params = UpdateOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [order] = await db
    .update(ordersTable)
    .set(parsed.data)
    .where(eq(ordersTable.id, params.data.orderId))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(UpdateOrderResponse.parse({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));
});

router.delete("/orders/:orderId", async (req, res): Promise<void> => {
  const params = DeleteOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [order] = await db.delete(ordersTable).where(eq(ordersTable.id, params.data.orderId)).returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
