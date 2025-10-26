export async function sendToHuman({ message, context }, socket) {
  if (!socket) {
    console.error("No active WebSocket connection for human handoff");
    return { success: false, error: "No WebSocket connection" };
  }

  socket.emit("human_message", {
    message,
    context,
    timestamp: new Date().toISOString(),
  });

  return { success: true, delivered: true };
}
