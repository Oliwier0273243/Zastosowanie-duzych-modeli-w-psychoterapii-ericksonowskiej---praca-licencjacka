export async function handleToolCall(toolCall, availableTools, context = {}) {
  const { toolName, params } = toolCall;

  try {
    if (!availableTools[toolName]) {
      const availableToolNames = Object.keys(availableTools).join(", ");
      throw new Error(`Unknown tool: ${toolName}. Available tools: ${availableToolNames}`);
    }

    if (context.socket) {
      context.socket.emit("update", `Executing tool: ${toolName}`);
    }

    const toolFunction = availableTools[toolName];

    const result = await toolFunction(params, context);

    if (context.socket) {
      context.socket.emit("update", `Tool ${toolName} completed successfully`);
    }

    return result;
  } catch (error) {
    if (context.socket) {
      context.socket.emit("error", `Tool ${toolName} failed: ${error.message}`);
    }

    return {
      success: false,
      error: true,
      message: error.message,
      toolName: toolName,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
}
