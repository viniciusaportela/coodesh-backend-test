import { Router } from "express";
import { PAGINATION_VALIDATION_CHAIN } from "../constants/paginationValidation";

import ArticleController from "../controllers/article/article.controller";
import { handleValidatorErrors } from "../middlewares/handle-validator-errors.middleware";

const router = Router();

router.get("/",
  PAGINATION_VALIDATION_CHAIN,
  handleValidatorErrors,
  ArticleController.list
);

router.get("/:articleId", 
  ArticleController.validation.paramVerification,
  handleValidatorErrors,
  ArticleController.get
);

router.post(
  "/",
  ArticleController.validation.insert,
  handleValidatorErrors,
  ArticleController.create
);

router.put(
  "/:articleId",
  ArticleController.validation.paramVerification,
  ArticleController.validation.insert,
  handleValidatorErrors,
  ArticleController.update
);

router.delete("/:articleId", 
  ArticleController.validation.paramVerification, 
  handleValidatorErrors, 
  ArticleController.delete
);

export default router;