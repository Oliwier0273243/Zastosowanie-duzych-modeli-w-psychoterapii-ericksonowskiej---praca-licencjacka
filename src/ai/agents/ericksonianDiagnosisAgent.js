import { queryLLM } from "../../utils/ai/queryLLM.js";
import { handleToolCall } from "../tools/handleToolcall.js";
import { ericksonianDiagnosisFunctionsSchemas } from "./functionSchemas/ericksonianDiagnosisFunctionSchemas.js";
import { buildEricksonianDiagnosisPrompt } from "../prompts/ericksonianDiagnosisPrompt.js";
import { emitDiagnosis } from "../tools/ericksonianDiagnosis/emitDiagnosis.js";

function initializeEricksonianDiagnosisAgentState() {
  return { history: [], iterations: 0, maxIterations: 30 };
}

function updateEricksonianDiagnosisAgentState(state, toolCall, result) {
  return {
    ...state,
    history: [
      ...state.history,
      {
        number: state.history.length + 1,
        action: toolCall?.toolName,
        params: toolCall?.params,
        result,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

const ericksonianDiagnosisTools = {
  emitDiagnosis: emitDiagnosis,
};

export async function ericksonianDiagnosisAgent(params, context = {}) {
  const { prompt } = params;
  const { socket = null, userId = null, userRole = "therapist" } = context;

  if (socket) socket.emit("update", "Ericksonian Diagnosis Agent is processing the prompt");

  let state = initializeEricksonianDiagnosisAgentState();

  while (state.iterations < state.maxIterations) {
    state.iterations++;

    try {
      const systemPrompt = buildEricksonianDiagnosisPrompt(prompt, state);
      const response = await queryLLM(systemPrompt, {}, ericksonianDiagnosisFunctionsSchemas);

      let toolCall;
      try {
        toolCall = JSON.parse(response);
      } catch (parseError) {
        toolCall = {
          toolName: "parsing_error",
          params: { rawResponse: response, error: parseError.message },
        };
        state = updateEricksonianDiagnosisAgentState(state, toolCall, "Unable to parse JSON");
        continue;
      }

      const toolName = toolCall.toolName;
      let result;

      if (toolName === "response") {
        return {
          toolName: "ericksonianDiagnosisAgent",
          title: toolCall.params?.title,
          response: toolCall.params?.response,
        };
      } else if (toolName === "think") {
        result = toolCall.params?.reasoning;
      } else {
        result = await handleToolCall(toolCall, ericksonianDiagnosisTools, {
          socket,
          userId,
          userRole,
        });
      }

      state = updateEricksonianDiagnosisAgentState(state, toolCall, result);
    } catch (e) {
      throw new Error(`Something went wrong with Ericksonian Diagnosis Agent: ${e.message}`);
    }
  }

  return { result: "Max attempts reached without response", state };
}
