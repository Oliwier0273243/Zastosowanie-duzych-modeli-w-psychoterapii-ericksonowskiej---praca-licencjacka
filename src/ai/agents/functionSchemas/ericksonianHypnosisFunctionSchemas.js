export const ericksonianHypnosisFunctionsSchemas = [
  {
    type: "function",
    function: {
      name: "think",
      description:
        "Internal reasoning for constructing an Ericksonian hypnosis session. Used for planning tone, pacing, and metaphor.",
      parameters: {
        type: "object",
        properties: {
          reasoning: {
            type: "string",
            description:
              "Internal thought process when forming the hypnotic flow and suggestions for the patient.",
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
      description: "Final user-facing summary after generating the hypnosis session script.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          response: {
            type: "string",
            description: "Summary or session introduction that can be shown to the user.",
          },
        },
        required: ["title", "response"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "hypnosis",
      description:
        "Creates a personalized Ericksonian hypnosis session text or script for the patient.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Title of the hypnosis session.",
          },
          content: {
            type: "string",
            description: "Full hypnosis script or therapeutic induction text.",
          },
          patient: {
            type: "object",
            description: "Optional patient context for personalization.",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              problem: { type: "string" },
              goal: { type: "string" },
              emotionalState: { type: "string" },
              summary: { type: "string" },
            },
          },
        },
        required: ["title", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "handoff",
      description:
        "Transfer control to the CRUD agent to fetch patient or note data for contextual diagnosis.",
      parameters: {
        type: "object",
        properties: {
          agentName: {
            type: "string",
            description:
              "The only allowed agent handoff target is the CRUD Agent for data retrieval.",
            enum: ["crudAgent"],
          },
          prompt: {
            type: "string",
            description:
              "A request or instruction for the CRUD Agent to fetch patient data, get therapeutic notes.",
          },
        },
        required: ["agentName", "prompt"],
      },
    },
  },
];
