import { Router } from "express";

import ArticleRoute from "./routes/article.route";
import RootRoute from './routes/root.route';

const router = Router();

router.use("/articles", ArticleRoute);
router.use('/', RootRoute);

export default router;