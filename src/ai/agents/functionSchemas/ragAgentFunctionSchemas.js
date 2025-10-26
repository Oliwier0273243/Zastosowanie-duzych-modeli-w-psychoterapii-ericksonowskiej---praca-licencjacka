export const ragAgentFunctionSchemas = [
  {
    type: "function",
    function: {
      name: "think",
      description:
        "Use this tool to reason and analyze. This tool will not provide any new information, but is crucial in the ReAct workflow for internal reasoning.",
      parameters: {
        type: "object",
        properties: {
          reasoning: {
            type: "string",
            description:
              "Your internal thought process, reasoning, and analysis of the current situation.",
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
        "Used to return the final response to the user after reasoning and tool interactions are complete.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Optional title for the response message.",
          },
          response: {
            type: "string",
            description: "The final message/response to send to the user.",
          },
        },
        required: ["title", "response"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "vectorSearch",
      description:
        "Performs a semantic vector search on a Pinecone index using a query vector and optional filters.",
      parameters: {
        type: "object",
        properties: {
          indexName: {
            type: "string",
            description: "Name of the Pinecone index to search in (must exist in Pinecone).",
          },
          queryVector: {
            type: "array",
            description: "The embedding vector representing the query to search for.",
            items: { type: "number" },
          },
          options: {
            type: "object",
            description: "Optional configuration for vector search behavior.",
            properties: {
              additionalFilters: {
                type: "object",
                description: "Custom metadata filters to refine the search.",
              },
              topK: {
                type: "number",
                description: "Number of top matches to return (default: 5).",
              },
              includeMetadata: {
                type: "boolean",
                description: "Whether to include metadata in search results (default: true).",
              },
              includeValues: {
                type: "boolean",
                description: "Whether to include vector values in search results (default: false).",
              },
            },
          },
        },
        required: ["indexName", "queryVector"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "handoff",
      description:
        "Hands off a user request to a specific registered AI agent for handling a specialized task.",
      parameters: {
        type: "object",
        properties: {
          params: {
            type: "object",
            description: "Handoff parameters to specify agent and prompt.",
            properties: {
              agentName: {
                type: "string",
                description: "Name of the agent to transfer to",
                enum: ["crudAgent", "humanInTheLoopAgent", "webcrawlerAgent"],
              },
              prompt: {
                type: "string",
                description: "The user query or instruction for the target agent.",
              },
            },
            required: ["agentName", "prompt"],
          },
        },
        required: ["params"],
      },
    },
  },
];
