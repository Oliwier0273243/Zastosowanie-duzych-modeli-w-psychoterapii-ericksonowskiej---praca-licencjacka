import { executeCrudFunction } from "../tools/crud/executeCrudFunctions.js";
import { queryLLM } from "../../utils/ai/queryLLM.js";
import { buildCrudPrompt } from "../../ai/prompts/crudPrompt.js";
import { handleToolCall } from "../tools/handleToolcall.js";

function initializeCrudAgentState() {
  return {
    history: [],
    iterations: 0,
    maxIterations: 30,
  };
}

function updateCrudAgentState(state, toolCall, result) {
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

const crudTools = {
  executeCrudFunction: executeCrudFunction,
};

export async function crudAgent(params, context) {
  const { prompt } = params;
  const { socket = null, userId = null, userRole = "therapist" } = context;

  if (socket) socket.emit("update", "CRUD Agent is processing the prompt");

  let state = initializeCrudAgentState();

  while (state.iterations < state.maxIterations) {
    state.iterations++;

    try {
      const systemPrompt = buildCrudPrompt(prompt, state);
      const response = await queryLLM(systemPrompt, {}, crudAgentFunctionSchemas);

      let toolCall;
      try {
        toolCall = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError.message);
        toolCall = {
          toolName: "parsing_error",
          params: { rawResponse: response, error: parseError.message },
        };
        state = updateCrudAgentState(state, toolCall, `Unable to parse JSON`);
        continue;
      }

      const toolName = toolCall.toolName;

      if (toolName === "response") {
        return {
          toolName: "crudAgent",
          title: toolCall.params?.title,
          response: toolCall.params?.response,
        };
      }

      let result;
      if (toolName === "think") {
        result = toolCall.params?.reasoning;
      } else {
        result = await handleToolCall(toolCall, crudTools, { socket, userId, userRole });
      }

      state = updateCrudAgentState(state, toolCall, result);
    } catch (e) {
      console.error("Error in crudAgent loop:", e);
      throw new Error(`Something went wrong with CRUD agent: ${e.message}`);
    }
  }

  return { result: "Max attempts reached without response", state };
}
