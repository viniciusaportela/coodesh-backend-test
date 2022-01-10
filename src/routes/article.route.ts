import { Router } from "express";

import ArticleController from "../controllers/article/article.controller";
import { handleValidatorErrors } from "../middlewares/handle-validator-errors.middleware";

const router = Router();

router.get("/", ArticleController.list);

router.get("/:articleId", ArticleController.get);

router.post(
  "/",
  ArticleController.validation.insert,
  handleValidatorErrors,
  ArticleController.create
);

router.put(
  "/:articleId",
  ArticleController.validation.insert,
  handleValidatorErrors,
  ArticleController.update
);

router.delete("/:articleId", ArticleController.delete);

export default router;