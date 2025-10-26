import { queryLLM } from "../../utils/ai/queryLLM.js";
import { vectorSearch } from "../../utils/pinecone/vectorSearch.js";
import { buildRagPrompt } from "../prompts/ragPrompt.js";
import { handleToolCall } from "../tools/handleToolcall.js";
import { ragAgentFunctionSchemas } from "./functionSchemas/ragAgentFunctionSchemas.js";

function initializeRagAgentState() {
  return {
    history: [],
    iterations: 0,
    maxIterations: 30,
  };
}

function updateRagAgentState(state, toolCall, result) {
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

const ragTools = {
  vectorSearch: vectorSearch,
};

export async function ragAgent(params, context = {}) {
  const { prompt } = params;
  const { socket = null, userId = null, userRole = "therapist" } = context;

  if (socket) socket.emit("update", "RAG Agent is processing the prompt");

  let state = initializeRagAgentState();

  while (state.iterations < state.maxIterations) {
    state.iterations++;

    try {
      const systemPrompt = buildRagPrompt(prompt, state);
      const response = await queryLLM(systemPrompt, {}, ragAgentFunctionSchemas);

      let toolCall;
      try {
        toolCall = JSON.parse(response);
      } catch (parseError) {
        toolCall = {
          toolName: "parsing_error",
          params: { rawResponse: response, error: parseError.message },
        };
        state = updateRagAgentState(state, toolCall, `Unable to parse JSON`);
        continue;
      }

      const toolName = toolCall.toolName;
      if (toolName === "response") {
        return {
          toolName: "ragAgent",
          title: toolCall.params?.title,
          response: toolCall.params?.response,
        };
      }

      let result;
      if (toolName === "think") {
        result = toolCall.params?.reasoning;
      } else {
        result = await handleToolCall(toolCall, ragTools, { socket, userId, userRole });
      }

      state = updateRagAgentState(state, toolCall, result);
    } catch (e) {
      throw new Error(`Something went wrong with RAG Agent: ${e.message}`);
    }
  }

  return { result: "Max attempts reached without response", state };
}
