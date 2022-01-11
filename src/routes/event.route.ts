import { Router } from "express";

import EventController from "../controllers/event/event.controller";
import { handleValidatorErrors } from "../middlewares/handle-validator-errors.middleware";

const router = Router();

router.get(
  "/",
  EventController.list
);

router.post(
  "/",
  EventController.validation.insert,
  handleValidatorErrors,
  EventController.create
);

router.get(
  "/:eventId",
  EventController.get
);

router.put(
  "/:eventId",
  EventController.validation.insert,
  handleValidatorErrors,
  EventController.update
);

router.delete("/:eventId", EventController.delete);

export default router;