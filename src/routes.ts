import { Router } from "express";

import ArticleRoute from "./routes/article.route";
import LaunchRoute from './routes/launch.route';
import EventRoute from './routes/event.route';
import RootRoute from './routes/root.route';

const router = Router();

router.use("/articles", ArticleRoute);
router.use("/launches", LaunchRoute);
router.use("/events", EventRoute);
router.use('/', RootRoute);

export default router;