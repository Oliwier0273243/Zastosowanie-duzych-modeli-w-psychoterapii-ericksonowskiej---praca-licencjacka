import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validatePatientDataMiddleware } from "../middlewares/patients/validatePatienetDataMiddleware.js";
import { getPatientsController } from "../controllers/patients/getPatientsController.js";
import { getPatientController } from "../controllers/patients/getPatientController.js";
import { postPatientController } from "../controllers/patients/postPatientController.js";
import { patchPatientController } from "../controllers/patients/patchPatientController.js";
import { putPatientController } from "../controllers/patients/putPatientController.js";
import { deletePatientController } from "../controllers/patients/deletePatientController.js";
import { validatePatientPatchDataMiddleware } from "../middlewares/patients/validatePatientPatchDataMiddleware.js";

const patientsRouter = express.Router();

patientsRouter.get("/patients/", authMiddleware, getPatientsController);
patientsRouter.get("/patients/:patientId", authMiddleware, getPatientController);
patientsRouter.post(
  "/patients",
  authMiddleware,
  validatePatientDataMiddleware,
  postPatientController
);
patientsRouter.patch(
  "/patients/:patientId",
  authMiddleware,
  validatePatientPatchDataMiddleware,
  patchPatientController
);
patientsRouter.put(
  "/patients/:patientId",
  authMiddleware,
  validatePatientDataMiddleware,
  putPatientController
);
patientsRouter.delete("/patients/:patientId", authMiddleware, deletePatientController);

export default patientsRouter;
