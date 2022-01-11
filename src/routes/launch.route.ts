import { Router } from "express";
import { PAGINATION_VALIDATION_CHAIN } from "../constants/paginationValidation";

import LaunchController from "../controllers/launch/launch.controller";
import { handleValidatorErrors } from "../middlewares/handle-validator-errors.middleware";

const router = Router();

router.get(
  "/",
  PAGINATION_VALIDATION_CHAIN,
  handleValidatorErrors,
  LaunchController.list
);

router.post(
  "/",
  LaunchController.validation.insert,
  handleValidatorErrors,
  LaunchController.create
);

router.get(
  "/:launchId",
  LaunchController.validation.paramVerification,
  handleValidatorErrors,
  LaunchController.get
);

router.put(
  "/:launchId",
  LaunchController.validation.paramVerification,
  LaunchController.validation.insert,
  handleValidatorErrors,
  LaunchController.update
);

router.delete(
  "/:launchId",
  LaunchController.validation.paramVerification,
  handleValidatorErrors, 
  LaunchController.delete
);

export default router;