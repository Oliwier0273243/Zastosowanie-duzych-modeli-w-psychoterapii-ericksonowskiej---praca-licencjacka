export const webcrawlerFunctionsSchemas = [
  {
    type: "function",
    function: {
      name: "think",
      description:
        "Use this tool to reason and analyze. This tool will not provide any new information, but is crucial in the ReAct workflow for internal reasoning",
      parameters: {
        type: "object",
        properties: {
          reasoning: {
            type: "string",
            description:
              "Your internal thought process, reasoning, and analysis of the current situation",
          },
        },
        required: ["reasoning"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "response",
      description:
        "Used to return the final response to the user after reasoning and tool interactions are complete",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Optional title for the response message",
          },
          response: {
            type: "string",
            description: "The final message/response to send to the user",
          },
        },
        required: ["title", "response"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "scrapeBrowser",
      description:
        "Performs a web search using DuckDuckGo and returns a list of top URLs related to the query.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query for finding relevant web pages.",
          },
          kRange: {
            type: "array",
            description:
              "The range of result indices to retrieve (inclusive). Example: [0, 5] returns up to 6 results.",
            items: { type: "integer" },
            default: [0, 5],
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "scrapeWebsite",
      description:
        "Scrapes a given webpage and extracts readable text content by removing scripts, styles, and non-text elements.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The full URL of the website to scrape (must include http or https).",
          },
        },
        required: ["url"],
      },
    },
  },
];
