import { queryLLM } from "../../utils/ai/queryLLM.js";
import { handleToolCall } from "../tools/handleToolcall.js";
import { ericksonianHypnosisFunctionsSchemas } from "./functionSchemas/ericksonianHypnosisFunctionSchemas.js";
import { buildEricksonianHypnosisPrompt } from "../prompts/ericksonianHypnosisPrompt.js";
import { emitHypnosis } from "../tools/ericksonianHypnosis/emitHypnosis.js";

function initializeEricksonianHypnosisAgentState() {
  return {
    history: [],
    iterations: 0,
    maxIterations: 30,
  };
}

function updateEricksonianHypnosisAgentState(state, toolCall, result) {
  const newState = { ...state };
  newState.history.push({
    number: newState.history.length + 1,
    action: toolCall?.toolName,
    params: toolCall?.params,
    result,
    timestamp: new Date().toISOString(),
  });
  return newState;
}

const ericksonianHypnosisTools = {
  emitHypnosis: emitHypnosis,
};

export async function ericksonianHypnosisAgent(params, context) {
  const { prompt } = params;
  const { socket = null, userId = null, userRole = "therapist" } = context;

  if (socket) socket.emit("update", "Ericksonian Hypnosis Agent is processing the prompt");

  let state = initializeEricksonianHypnosisAgentState();

  while (state.iterations < state.maxIterations) {
    state.iterations++;

    try {
      const systemPrompt = buildEricksonianHypnosisPrompt(prompt, state);
      const response = await queryLLM(systemPrompt, {}, ericksonianHypnosisFunctionsSchemas);

      let toolCall;
      try {
        toolCall = JSON.parse(response);
      } catch (parseError) {
        toolCall = {
          toolName: "parsing_error",
          params: { rawResponse: response, error: parseError.message },
        };
        state = updateEricksonianHypnosisAgentState(state, toolCall, `Unable to parse JSON`);
        continue;
      }

      const toolName = toolCall.toolName;

      if (toolName === "response") {
        return {
          toolName: "ericksonianHypnosisAgent",
          title: toolCall.params?.title,
          response: toolCall.params?.response,
        };
      }

      let result;
      if (toolName === "think") {
        result = toolCall.params?.reasoning;
      } else {
        result = await handleToolCall(toolCall, ericksonianHypnosisTools, {
          socket,
          userId,
          userRole,
        });
      }

      state = updateEricksonianHypnosisAgentState(state, toolCall, result);
    } catch (e) {
      throw new Error(`Something went wrong with Ericksonian Hypnosis Agent: ${e.message}`);
    }
  }

  return { result: "Max attempts reached without response", state };
}
