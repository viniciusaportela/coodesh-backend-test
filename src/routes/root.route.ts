import { Router } from "express";

const router = Router();

router.get('/', (_, res) => {
  res.send("Back-end Challenge 2021 🏅 - Space Flight News");
})

export default router;