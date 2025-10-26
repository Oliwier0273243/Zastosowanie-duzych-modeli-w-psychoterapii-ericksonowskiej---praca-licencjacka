export const humanAgentFunctionsSchemas = [
  {
    type: "function",
    function: {
      name: "think",
      description:
        "Use this tool to reason and analyze internally. This does not send any output to the user, but helps the agent plan or reflect before acting.",
      parameters: {
        type: "object",
        properties: {
          reasoning: {
            type: "string",
            description:
              "Your internal reasoning, step-by-step analysis, or decision-making process for the current task.",
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
        "Used to return the final response to the user after reasoning or interaction is complete.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Optional title for the response message.",
          },
          response: {
            type: "string",
            description: "The final message or answer to send back to the user.",
          },
        },
        required: ["title", "response"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "sendToHuman",
      description:
        "Escalates or forwards a message directly to a human operator through a WebSocket channel. Use this when human review, approval, or manual intervention is needed.",
      parameters: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "The message or request to send directly to the human operator.",
          },
          context: {
            type: "object",
            description:
              "Optional context or metadata about the situation, such as conversation state, user data, or reasoning.",
            properties: {
              topic: {
                type: "string",
                description: "Optional short topic or category for this message.",
              },
              urgency: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "Optional urgency level for prioritization.",
              },
            },
          },
        },
        required: ["message"],
      },
    },
  },
];
