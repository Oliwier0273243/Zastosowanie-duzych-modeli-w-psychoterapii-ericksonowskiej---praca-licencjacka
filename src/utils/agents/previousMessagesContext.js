import { getMessagesService } from "../../services/chats/messages/getMessagesService.js";

export async function getPreviousMessagesContext(chatId, userId) {
  try {
    const limit = 15;

    const messages = await getMessagesService(userId, chatId, "", 1, limit);

    if (!messages || !Array.isArray(messages)) {
      return { previouseMessages: [] };
    }

    const recent = messages.slice(0, 4);
    const older = messages.slice(4);

    const recentFiltered = recent.map((message) => ({
      index: message.messageIndex,
      role: message.role,
      title: message.payload?.title,
      message: message.payload?.text,
    }));

    const olderFiltered = older.map((message) => ({
      index: message.messageIndex,
      role: message.role,
      title: message.payload?.title,
    }));

    return {
      previouseMessages: [...recentFiltered, ...olderFiltered],
    };
  } catch (error) {
    console.error("Failed to get previous messages context:", {
      chatId,
      userId,
      error: error.message,
    });

    return {
      previouseMessages: [],
    };
  }
}
