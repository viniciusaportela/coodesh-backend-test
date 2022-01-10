import { Router } from "express";

import LaunchController from "../controllers/launch/launch.controller";
import { handleValidatorErrors } from "../middlewares/handleValidatorErrors.middleware";

const router = Router();

router.post(
  "/",
  LaunchController.validation.insert,
  handleValidatorErrors,
  LaunchController.create
);

router.put(
  "/:launchId",
  LaunchController.validation.insert,
  handleValidatorErrors,
  LaunchController.update
);

router.delete("/:launchId", LaunchController.delete);

export default router;