import { postPatientService } from "../../../services/patients/postPatientService.js";
import { deletePatientService } from "../../../services/patients/deletePatientService.js";
import { putPatientService } from "../../../services/patients/putPatientService.js";
import { patchPatientService } from "../../../services/patients/patchPatientService.js";
import { getPatientsService } from "../../../services/patients/getPatientsService.js";
import { getPatientService } from "../../../services/patients/getPatientService.js";

import { postNoteService } from "../../../services/notes/postNoteService.js";
import { deleteNoteService } from "../../../services/notes/deleteNoteService.js";
import { patchNoteService } from "../../../services/notes/patchNoteService.js";
import { putNoteService } from "../../../services/notes/putNoteService.js";
import { getNoteService } from "../../../services/notes/getNoteService.js";
import { getNotesService } from "../../../services/notes/getNotesService.js";

import { patchUserContextService } from "../../../services/userContext/patchUserContextService.js";

export const CRUD_FUNCTIONS_REGISTRY = {
  postPatient: postPatientService,
  getPatient: getPatientService,
  getPatients: getPatientsService,
  patchPatient: patchPatientService,
  putPatient: putPatientService,
  deletePatient: deletePatientService,

  postNote: postNoteService,
  getNote: getNoteService,
  getNotes: getNotesService,
  patchNote: patchNoteService,
  putNote: putNoteService,
  deleteNote: deleteNoteService,

  patchUserContext: patchUserContextService,
};
