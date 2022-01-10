import { Router } from "express";

import ArticleController from "../controllers/article/article.controller";
import { handleValidatorErrors } from "../middlewares/handle-validator-errors.middleware";

const router = Router();

/** 
 * @swagger
 * /articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get a list of articles
 *     responses:
 *       200:
 *             description: A list of articles
 *             content:
 *               application/json:
 *                 schema:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 0
 *                       featured:
 *                         type: boolean
 *                         example: false
 *                       title:
 *                         type: string
 *                         example: "title"
 *                       url:
 *                         type: string
 *                         example: "https://example.com"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com"
 *                       newsSite:
 *                         type: string
 *                         example: "newsSite"
 *                       summary:
 *                         type: string
 *                         example: "summary summary"
 *                       publishedAt:
 *                         type: string
 *                         example: "2022-01-09T22:13:10.000Z"
*/
router.get("/", ArticleController.list);

/** 
 * @swagger
 * /articles/{articleId}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get an article by Id
 *     responses:
 *       200:
 *             description: An article
 *             content:
 *               application/json:
 *                 schema:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 0
 *                       featured:
 *                         type: boolean
 *                         example: false
 *                       title:
 *                         type: string
 *                         example: "title"
 *                       url:
 *                         type: string
 *                         example: "https://example.com"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com"
 *                       newsSite:
 *                         type: string
 *                         example: "newsSite"
 *                       summary:
 *                         type: string
 *                         example: "summary summary"
 *                       publishedAt:
 *                         type: string
 *                         example: "2022-01-09T22:13:10.000Z"
*/
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