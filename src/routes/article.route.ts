import { Router } from "express";

import ArticleController from "../controllers/article/article.controller";
import { handleValidatorErrors } from "../middlewares/handleValidatorErrors.middleware";

const router = Router();

router.get("/", ArticleController.list);

router.post(
  "/",
  ArticleController.validation.insert,
  handleValidatorErrors,
  ArticleController.create
);

router.put(
  "/:article",
  ArticleController.validation.insert,
  handleValidatorErrors,
  ArticleController.update
);

router.delete("/:article", ArticleController.delete);

export default router;