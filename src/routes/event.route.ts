import { Router } from "express";
import { PAGINATION_VALIDATION_CHAIN } from "../constants/paginationValidation";

import EventController from "../controllers/event/event.controller";
import { handleValidatorErrors } from "../middlewares/handle-validator-errors.middleware";

const router = Router();

router.get(
  "/",
  PAGINATION_VALIDATION_CHAIN,
  handleValidatorErrors,
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
  EventController.validation.paramVerification,
  handleValidatorErrors,
  EventController.get
);

router.put(
  "/:eventId",
  EventController.validation.paramVerification,
  EventController.validation.insert,
  handleValidatorErrors,
  EventController.update
);

router.delete(
  "/:eventId",
  EventController.validation.paramVerification,
  handleValidatorErrors,
  EventController.delete
);

export default router;