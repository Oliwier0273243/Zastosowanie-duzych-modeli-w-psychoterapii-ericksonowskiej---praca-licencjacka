export const ericksonianExercisesFunctionsSchemas = [
  {
    type: "function",
    function: {
      name: "think",
      description:
        "Internal reasoning process to design appropriate Ericksonian therapeutic exercises.",
      parameters: {
        type: "object",
        properties: {
          reasoning: {
            type: "string",
            description:
              "Your internal reasoning about the type of exercises, metaphors, and behavioral patterns relevant for the patient.",
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
        "Final explanation or summary message describing the exercise plan for the user.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          response: {
            type: "string",
            description: "Descriptive explanation or instructions regarding the exercises.",
          },
        },
        required: ["title", "response"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "exercises",
      description:
        "Generates a structured set of Ericksonian exercises for the patient, focusing on behavioral and perceptual change.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Title of the exercise set.",
          },
          content: {
            type: "string",
            description: "Detailed text with exercises, metaphors, or experiential tasks.",
          },
          patient: {
            type: "object",
            description: "Optional patient information for personalization.",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              problem: { type: "string" },
              goal: { type: "string" },
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
