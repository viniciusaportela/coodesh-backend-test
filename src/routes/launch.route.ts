import { Router } from "express";

import LaunchController from "../controllers/launch/launch.controller";
import { handleValidatorErrors } from "../middlewares/handle-validator-errors.middleware";

const router = Router();

router.get(
  "/",
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
  LaunchController.get
);

router.put(
  "/:launchId",
  LaunchController.validation.insert,
  handleValidatorErrors,
  LaunchController.update
);

router.delete("/:launchId", LaunchController.delete);

export default router;