export async function emitHypnosis({ title, content, patientId }, socket) {
  if (!socket) {
    console.error("No active WebSocket connection for hypnosis emit");
    return { success: false, error: "No WebSocket connection" };
  }

  const payload = {
    type: "hypnosis",
    title,
    content,
    patientId: patientId || null,
    timestamp: new Date().toISOString(),
  };

  socket.emit("ericksonian:hypnosis", payload);
  console.log(`Emitted hypnosis: ${title}`);

  return { success: true, delivered: true };
}
