import { OpenAI } from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function queryLLM(
  prompt,
  { temperature = 0.7, streaming = false, onToken, model = "gpt-4o-mini", json = false } = {},
  tools = null
) {
  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt must be a non-empty string.");
    }

    if (streaming) {
      if (typeof onToken !== "function") {
        throw new Error("For streaming mode, onToken callback function must be provided.");
      }

      const stream = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        tools: tools,
        tool_choice: tools ? "auto" : undefined,
        temperature,
        stream: true,
        ...(json && { response_format: { type: "json_object" } }),
      });

      let content = "";
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        content += delta;
        if (onToken && delta) {
          onToken(delta);
        }
      }

      return content;
    } else {
      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        tools: tools,
        tool_choice: tools ? "auto" : undefined,
        temperature,
        ...(json && { response_format: { type: "json_object" } }),
      });

      if (completion.choices[0].message.tool_calls) {
        const toolCall = completion.choices[0].message.tool_calls[0];
        return JSON.stringify({
          toolName: toolCall.function.name,
          params: JSON.parse(toolCall.function.arguments),
        });
      }

      return completion.choices[0].message.content;
    }
  } catch (error) {
    console.error("OpenAI API call failed:", {
      model,
      prompt: prompt.substring(0, 100) + "...",
      error: error.message,
    });

    throw {
      message: error.message,
      type: "api_error",
    };
  }
}
