import { getUserContextService } from "../../services/userContext/getUserContextService.js";
import { getPreviousMessagesContext } from "../../utils/agents/previousMessagesContext.js";
import { queryLLM } from "../../utils/ai/queryLLM.js";
import { orchestratorPrompt } from "../prompts/orchestratorPrompt.js";
import { handleToolCall } from "../tools/handleToolcall.js";

import { handoff } from "../tools/handoff.js";
import { parallelHandoff } from "../tools/orchestrator/parallelHandoffs.js";
import { functionSchemas } from "./functionSchemas/orchestratorFunctionSchemas.js";

function initializeOrchestratorAgentState() {
  return {
    history: [],
    iterations: 0,
    maxIterations: 30,
  };
}

function updateOrchestratorAgentState(state, toolCall, result) {
  const newState = { ...state };
  newState.history.push({
    number: newState.history.length + 1,
    action: toolCall?.toolName,
    params: toolCall?.params,
    result: result,
    timestamp: new Date().toISOString(),
  });
  return newState;
}

const orchestratorTools = {
  handoff: handoff,
  parallelHandoff: parallelHandoff,
};

export async function orchestratorAgent(
  userPrompt,
  socket = null,
  chatId,
  userId = null,
  userRole = "therapist"
) {
  if (socket) {
    socket.emit("update", "Orchestrator Agent is processing the prompt");
  }

  let state = initializeOrchestratorAgentState();

  const userContext = await getUserContextService(userId);

  const previousMessagesContext = await getPreviousMessagesContext(chatId, userId);

  while (state.iterations < state.maxIterations) {
    state.iterations++;

    try {
      const prompt = orchestratorPrompt(userContext, state, userPrompt, previousMessagesContext);

      const response = await queryLLM(prompt, {}, functionSchemas);

      let toolCall;

      try {
        toolCall = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError.message);

        toolCall = {
          toolName: "parsing_error",
          params: { rawResponse: response, error: parseError.message },
        };

        state = updateOrchestratorAgentState(
          state,
          toolCall,
          `Unable to parse JSON: ${parseError.message}`
        );
        continue;
      }

      const toolName = toolCall.toolName;

      if (toolName === "response") {
        return {
          toolName: "orchestratorAgent",
          title: toolCall.params?.title,
          response: toolCall.params?.response,
        };
      }

      let result;
      if (toolName === "think") {
        result = toolCall.params?.reasoning;
      } else {
        result = await handleToolCall(toolCall, orchestratorTools, {
          socket,
          userId,
          userRole,
        });
      }

      state = updateOrchestratorAgentState(state, toolCall, result);
    } catch (e) {
      console.error("Error in orchestrator loop:", e);
      throw new Error(`Something went wrong with orchestrator agent: ${e.message}`);
    }
  }

  return { result: "Max attempts reached without response", state };
}
