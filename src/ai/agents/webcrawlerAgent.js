import { queryLLM } from "../../utils/ai/queryLLM.js";
import { buildWebcrawlerPrompt } from "../prompts/webcrawlerPrompt.js";
import { handleToolCall } from "../tools/handleToolcall.js";
import { scrapeBrowser } from "../tools/webcrawler/scrapeBrowser.js";
import { scrapeWebsite } from "../tools/webcrawler/scrapeWebsite.js";
import { webcrawlerFunctionsSchemas } from "./functionSchemas/webcrawlerFunctionSchemas.js";

function initializeWebCrawlerAgentState() {
  return {
    history: [],
    iterations: 0,
    maxIterations: 30,
  };
}

function updateWebCrawlerAgentState(state, toolCall, result) {
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

const webCrawlerTools = {
  scrapeBrowser: scrapeBrowser,
  scrapeWebsite: scrapeWebsite,
};

export async function webcrawlerAgent(params, context = {}) {
  const { prompt } = params;
  const { socket = null, userId = null, userRole = "therapist" } = context;

  if (socket) socket.emit("update", "Web Crawler Agent is processing the prompt");

  let state = initializeWebCrawlerAgentState();

  while (state.iterations < state.maxIterations) {
    state.iterations++;

    try {
      const systemPrompt = buildWebcrawlerPrompt(prompt, state);
      const response = await queryLLM(systemPrompt, {}, webcrawlerFunctionsSchemas);

      let toolCall;
      try {
        toolCall = JSON.parse(response);
      } catch (parseError) {
        toolCall = {
          toolName: "parsing_error",
          params: { rawResponse: response, error: parseError.message },
        };
        state = updateWebCrawlerAgentState(state, toolCall, `Unable to parse JSON`);
        continue;
      }

      const toolName = toolCall.toolName;
      if (toolName === "response") {
        return {
          toolName: "webCrawlerAgent",
          title: toolCall.params?.title,
          response: toolCall.params?.response,
        };
      }

      let result;
      if (toolName === "think") {
        result = toolCall.params?.reasoning;
      } else {
        result = await handleToolCall(toolCall, webCrawlerTools, { socket, userId, userRole });
      }

      state = updateWebCrawlerAgentState(state, toolCall, result);
    } catch (e) {
      throw new Error(`Something went wrong with Web Crawler Agent: ${e.message}`);
    }
  }

  return { result: "Max attempts reached without response", state };
}
