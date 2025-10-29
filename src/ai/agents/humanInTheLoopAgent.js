import { sendToHuman } from "../tools/humanInTheLoop/sendMessageToHuman.js";
import { buildHumanInTheLoopPrompt } from "../prompts/humanInTheLoopPrompt.js";
import { queryLLM } from "../../utils/ai/queryLLM.js";
import { handleToolCall } from "../tools/handleToolcall.js";
import { humanAgentFunctionsSchemas } from "./functionSchemas/humanInTheLoopFunctionsSchemas.js";

function initializeHumanInTheLoopAgentState() {
  return {
    history: [],
    iterations: 0,
    maxIterations: 30,
  };
}

function updateHumanInTheLoopAgentState(state, toolCall, result) {
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

const humanInTheLoopTools = {
  sendToHuman: sendToHuman,
};

export async function humanInTheLoopAgent(params, context = {}) {
  const { prompt } = params;
  const { socket = null, userId = null, userRole = "therapist" } = context;

  if (socket) socket.emit("update", "Human In The Loop Agent is processing the prompt");

  let state = initializeHumanInTheLoopAgentState();

  while (state.iterations < state.maxIterations) {
    state.iterations++;

    try {
      const systemPrompt = buildHumanInTheLoopPrompt(prompt, state);
      const response = await queryLLM(systemPrompt, {}, humanAgentFunctionsSchemas);

      let toolCall;
      try {
        toolCall = JSON.parse(response);
      } catch (parseError) {
        toolCall = {
          toolName: "parsing_error",
          params: { rawResponse: response, error: parseError.message },
        };
        state = updateHumanInTheLoopAgentState(state, toolCall, `Unable to parse JSON`);
        continue;
      }

      const toolName = toolCall.toolName;
      if (toolName === "response") {
        return {
          toolName: "humanInTheLoopAgent",
          title: toolCall.params?.title,
          response: toolCall.params?.response,
        };
      }

      let result;
      if (toolName === "think") {
        result = toolCall.params?.reasoning;
      } else if (toolName === "sendToHuman") {
        result = await sendToHuman(toolCall.params, socket);
      } else {
        result = await handleToolCall(toolCall, humanInTheLoopTools, { socket, userId, userRole });
      }

      state = updateHumanInTheLoopAgentState(state, toolCall, result);
    } catch (e) {
      throw new Error(`Something went wrong with Human In The Loop Agent: ${e.message}`);
    }
  }

  return { result: "Max attempts reached without response", state };
}
