import { queryLLM } from "../../utils/ai/queryLLM.js";
import { handleToolCall } from "../tools/handleToolcall.js";
import { ericksonianExercisesFunctionsSchemas } from "./functionSchemas/ericksonianExercisesFunctionSchemas.js";
import { buildEricksonianExercisesPrompt } from "../prompts/ericksonianExercisesPrompt.js";
import { emitExercises } from "../tools/ericksonianExercises/emitExercises.js";

function initializeEricksonianExercisesAgentState() {
  return { history: [], iterations: 0, maxIterations: 30 };
}

function updateEricksonianExercisesAgentState(state, toolCall, result) {
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

const ericksonianExercisesTools = {
  emitExercises: emitExercises,
};

export async function ericksonianExercisesAgent(params, context = {}) {
  const { prompt } = params;
  const { socket = null, userId = null, userRole = "therapist" } = context;

  if (socket) socket.emit("update", "Ericksonian Exercises Agent is processing the prompt");

  let state = initializeEricksonianExercisesAgentState();

  while (state.iterations < state.maxIterations) {
    state.iterations++;

    try {
      const systemPrompt = buildEricksonianExercisesPrompt(prompt, state);
      const response = await queryLLM(systemPrompt, {}, ericksonianExercisesFunctionsSchemas);

      let toolCall;
      try {
        toolCall = JSON.parse(response);
      } catch (parseError) {
        toolCall = {
          toolName: "parsing_error",
          params: { rawResponse: response, error: parseError.message },
        };
        state = updateEricksonianExercisesAgentState(state, toolCall, "Unable to parse JSON");
        continue;
      }

      const toolName = toolCall.toolName;
      let result;

      if (toolName === "response") {
        return {
          toolName: "ericksonianExercisesAgent",
          title: toolCall.params?.title,
          response: toolCall.params?.response,
        };
      } else if (toolName === "think") {
        result = toolCall.params?.reasoning;
      } else {
        result = await handleToolCall(toolCall, ericksonianExercisesTools, {
          socket,
          userId,
          userRole,
        });
      }

      state = updateEricksonianExercisesAgentState(state, toolCall, result);
    } catch (e) {
      throw new Error(`Something went wrong with Ericksonian Exercises Agent: ${e.message}`);
    }
  }

  return { result: "Max attempts reached without response", state };
}
