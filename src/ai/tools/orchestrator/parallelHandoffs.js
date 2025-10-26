import { handoff } from "../handoff.js";

export async function parallelHandoff(
  params,
  socket = null,
  userId = null,
  userRole = "therapist"
) {
  const { handoffs } = params;

  try {
    const results = await Promise.allSettled(
      handoffs.map((task) =>
        handoff({ agentName: task.agentName, prompt: task.prompt }, socket, userId, userRole)
      )
    );

    return {
      result: {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      },
      success: true,
    };
  } catch (e) {
    return {
      result: {
        content: [
          {
            type: "text",
            text: `Error: ${e.message}`,
          },
        ],
      },
      success: false,
    };
  }
}
