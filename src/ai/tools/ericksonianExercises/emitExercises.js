export async function emitExercises({ title, content, patientId }, socket) {
  if (!socket) {
    console.error("No active WebSocket connection for exercises emit");
    return { success: false, error: "No WebSocket connection" };
  }

  const payload = {
    type: "exercise",
    title,
    content,
    patientId: patientId || null,
    timestamp: new Date().toISOString(),
  };

  socket.emit("ericksonian:exercises", payload);
  console.log(`Emitted exercise: ${title}`);

  return { success: true, delivered: true };
}
