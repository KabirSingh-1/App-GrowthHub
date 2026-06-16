import { Router, type IRouter } from "express";
import healthRouter from "./health";
import appsRouter from "./apps";
import reviewsRouter from "./reviews";
import campaignsRouter from "./campaigns";
import asoRouter from "./aso";
import notificationsRouter from "./notifications";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(appsRouter);
router.use(reviewsRouter);
router.use(campaignsRouter);
router.use(asoRouter);
router.use(notificationsRouter);
router.use(dashboardRouter);

export default router;
