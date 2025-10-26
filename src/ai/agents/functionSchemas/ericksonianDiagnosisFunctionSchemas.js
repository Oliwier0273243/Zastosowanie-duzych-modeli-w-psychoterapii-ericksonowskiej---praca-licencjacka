export const ericksonianDiagnosisFunctionsSchemas = [
  {
    type: "function",
    function: {
      name: "think",
      description:
        "Internal reasoning for Ericksonian diagnostic interpretation. Think before forming the diagnosis.",
      parameters: {
        type: "object",
        properties: {
          reasoning: {
            type: "string",
            description:
              "Your internal thought process when analyzing the patient's psychological structure, patterns, and therapeutic direction.",
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
        "Provide a clear final summary or insight for the diagnosis process to the user.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the response." },
          response: {
            type: "string",
            description:
              "Detailed diagnostic insight or interpretation to communicate to the user.",
          },
        },
        required: ["title", "response"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "diagnosis",
      description:
        "Generates a structured Ericksonian-style psychological diagnosis based on patient context.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Title for the diagnosis document.",
          },
          content: {
            type: "string",
            description:
              "Full diagnostic interpretation or formulation using Ericksonian principles.",
          },
          patient: {
            type: "object",
            description: "Optional patient information for personalization.",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              age: { type: "number" },
              problem: { type: "string" },
              condition: { type: "string" },
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
