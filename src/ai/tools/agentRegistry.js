import { crudAgent } from "../agents/crudAgent.js";
import { ericksonianDiagnosisAgent } from "../agents/ericksonianDiagnosisAgent.js";
import { ericksonianExercisesAgent } from "../agents/ericksonianExercisesAgent.js";
import { ericksonianHypnosisAgent } from "../agents/ericksonianHypnosisAgent.js";
import { humanInTheLoopAgent } from "../agents/humanInTheLoopAgent.js";
import { ragAgent } from "../agents/ragAgent.js";
import { webcrawlerAgent } from "../agents/webcrawlerAgent.js";

export const AGENT_REGISTRY = {
  crudAgent: crudAgent,
  ericksonianDiagnosisAgent: ericksonianDiagnosisAgent,
  ericksonianExercisesAgent: ericksonianExercisesAgent,
  ericksonianHypnosisAgent: ericksonianHypnosisAgent,
  humanInTheLoopAgent: humanInTheLoopAgent,
  ragAgent: ragAgent,
  webcrawlerAgent: webcrawlerAgent,
};
