import { Router } from "express";
import { NotFoundError } from "../errors/NotFound";

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns Back-end Challenge 2021 🏅 - Space Flight News
 *     responses:
 *       200:
 *         description: Returns Back-end Challenge 2021 🏅 - Space Flight News
*/
router.get('/', (_req, res) => {
  res.send("Back-end Challenge 2021 🏅 - Space Flight News");
})

router.use('*', (_req, _res, next) => {
  next(new NotFoundError());
})

export default router;