import { Router } from "express";
import { NotFoundError } from "../errors/NotFound";

const router = Router();

router.get('/', (_req, res) => {
  res.send("Back-end Challenge 2021 🏅 - Space Flight News");
})

router.use('*', (_req, _res, next) => {
  next(new NotFoundError());
})

export default router;