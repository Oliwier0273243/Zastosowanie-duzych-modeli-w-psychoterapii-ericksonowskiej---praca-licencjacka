export const functionSchemas = [
  {
    type: "function",
    function: {
      name: "handoff",
      description: "Transfer the conversation to a specific agent to handle specialized tasks",
      parameters: {
        type: "object",
        properties: {
          agentName: {
            type: "string",
            description: "Name of the agent to transfer to",
            enum: [
              "crudAgent",
              "ericksonianDiagnosisAgent",
              "ericksonianExercisesAgent",
              "ericksonianHypnosisAgent",
              "humanInTheLoopAgent",
              "ragAgent",
              "webcrawlerAgent",
            ],
          },
          prompt: {
            type: "string",
            description: "The prompt/message to send to the target agent",
          },
        },
        required: ["agentName", "prompt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "parallelHandoff",
      description: "Execute multiple agent handoffs simultaneously for parallel processing",
      parameters: {
        type: "object",
        properties: {
          handoffs: {
            type: "array",
            description: "Array of handoff tasks to execute in parallel",
            items: {
              type: "object",
              properties: {
                agentName: {
                  type: "string",
                  description: "Name of the agent to transfer to",
                  enum: [
                    "calendarAgent",
                    "crudAgent",
                    "ericksonianDiagnosisAgent",
                    "ericksonianExercisesAgent",
                    "ericksonianHypnosisAgent",
                    "humanInTheLoopAgent",
                    "noteAgent",
                    "patientAgent",
                    "ragAgent",
                    "userContextAgent",
                    "webcrawlerAgent",
                  ],
                },
                prompt: {
                  type: "string",
                  description: "The prompt/message to send to this agent",
                },
              },
              required: ["agentName", "prompt"],
            },
          },
        },
        required: ["handoffs"],
      },
    },
  },
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
];
