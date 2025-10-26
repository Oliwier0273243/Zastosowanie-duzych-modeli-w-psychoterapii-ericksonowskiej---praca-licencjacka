import { AGENT_REGISTRY } from "./agentRegistry.js";

export async function handoff(params, socket = null, userId = null, userRole = "therapist") {
  const { agentName, prompt } = params;

  try {
    const agent = AGENT_REGISTRY[agentName];
    if (!agent) throw new Error(`Agent not available: ${agentName}`);

    const result = await agent(prompt, socket, userId, userRole);

    return result;
  } catch (error) {
    return {
      result: `Error: ${error.message}`,
      success: false,
    };
  }
}
