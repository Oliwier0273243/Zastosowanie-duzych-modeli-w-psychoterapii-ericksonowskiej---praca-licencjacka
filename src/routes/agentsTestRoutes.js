import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { orchestratorAgent } from "../ai/agents/orchestratorAgent.js";

const agentsTestRouter = express.Router();

agentsTestRouter.post("/test-orchestrator-agent", authMiddleware, async (req, res) => {
  const { prompt, chatId } = req.body;

  try {
    const result = await orchestratorAgent(prompt, null, chatId, req.userId, req.userRole);

    res.json({
      success: true,
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
});
// agentsTestRouter.post("/test-webcrawler-agent", )
// agentsTestRouter.post("/test-user-context-agent", )
// agentsTestRouter.post("/test-rag-agent", )
// agentsTestRouter.post("/test-patient-agent", )
// agentsTestRouter.post("/test-note-agent", )
// agentsTestRouter.post("/test-human-in-the-loop-agent", )
// agentsTestRouter.post("/test-ericksonian-hypnosis-agent", )
// agentsTestRouter.post("/test-ericksonian-exercises-agent", )
// agentsTestRouter.post("/test-erickosonian-diagnosis-agent", )
// agentsTestRouter.post("/test-crud-agent", )
// agentsTestRouter.post("/test-calendar-agent", )

export default agentsTestRouter;
