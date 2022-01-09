import { Router } from "express";

import ArticleRoute from "./routes/article.route";
import RootRoute from './routes/root.route';

const router = Router();

router.use('/', RootRoute);
router.use("/articles", ArticleRoute);

export default router;