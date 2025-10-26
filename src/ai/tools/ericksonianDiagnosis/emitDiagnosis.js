export async function emitDiagnosis({ title, content, patientId }, socket) {
  if (!socket) {
    console.error("No active WebSocket connection for diagnosis emit");
    return { success: false, error: "No WebSocket connection" };
  }

  const payload = {
    type: "diagnosis",
    title,
    content,
    patientId: patientId || null,
    timestamp: new Date().toISOString(),
  };

  socket.emit("ericksonian:diagnosis", payload);
  console.log(`Emitted diagnosis: ${title}`);

  return { success: true, delivered: true };
}
