import { orchestratorAgent } from "./src/ai/agents/orchestratorAgent.js";
import { postChatService } from "./src/services/chats/postChatService.js";
import { getChatService } from "./src/services/chats/getChatService.js";
import { postMessageService } from "./src/services/chats/messages/postMessageService.js";
import { getMessagesService } from "./src/services/chats/messages/getMessagesService.js";

export function initializeChatSocket(io) {
  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_chat", async ({ chatId, userId, userRole }) => {
      try {
        if (!userId) {
          socket.emit("error_message", { message: "userId is required" });
          return;
        }

        let chat;
        if (!chatId) {
          chat = await postChatService(userId, {
            title: "New Chat Session",
            createdAt: new Date(),
          });
          chatId = chat._id.toString();
        } else {
          chat = await getChatService(chatId, userId);
        }

        socket.join(chatId);
        socket.emit("chat_joined", { chatId });

        const recentMessagesData = await getMessagesService(userId, chatId, "", 1, 10);
        const recentMessages = recentMessagesData.messages || [];
        if (recentMessages.length) socket.emit("recent_messages", recentMessages);
      } catch (err) {
        console.error("Error joining chat:", err);
        socket.emit("error_message", { message: err.message });
      }
    });

    socket.on("send_message", async ({ chatId, userId, userRole, content }) => {
      try {
        if (!chatId || !userId || !content) {
          socket.emit("error_message", { message: "chatId, userId and content are required" });
          return;
        }

        const chat = await getChatService(chatId, userId);

        const userMessage = await postMessageService(
          {
            chatId,
            userId,
            sender: "user",
            content,
            timestamp: new Date(),
            payload: { text: content },
          },
          userId
        );

        io.to(chatId).emit("new_message", userMessage);

        socket.emit("update", "Orchestrator processing message...");

        const agentResponse = await orchestratorAgent(content, socket, chatId, userId, userRole);

        if (agentResponse?.response) {
          const aiMessage = await postMessageService(
            {
              chatId,
              userId,
              sender: "agent",
              content: agentResponse.response,
              title: agentResponse.title || "AI Response",
              timestamp: new Date(),
              payload: { text: agentResponse.response },
            },
            userId
          );

          io.to(chatId).emit("new_message", aiMessage);
        }
      } catch (err) {
        console.error("Error in send_message:", err);
        socket.emit("error_message", { message: err.message });
      }
    });

    socket.on("human_message", ({ message, context }) => {
      console.log("Human message received:", message);
      io.emit("human_notification", { message, context });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
