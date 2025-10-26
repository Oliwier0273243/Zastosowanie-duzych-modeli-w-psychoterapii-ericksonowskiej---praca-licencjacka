import { bookPageModel } from "../../../models/bookSchema.js";
import { queryLLM } from "../../../utils/ai/queryLLM.js";

export async function translateBookPage({ bookId, pageNumber, targetLanguage }) {
  if (!bookId || !pageNumber || !targetLanguage) {
    throw new Error("Missing required parameters: bookId, pageNumber, targetLanguage");
  }

  const page = await bookPageModel.findOne({ bookId, pageNumber });
  if (!page) {
    throw new Error("Page not found");
  }

  const prompt = `
    You are a professional translator. Translate the text accurately while maintaining the original meaning and formatting.
    Translate the following book page content to ${targetLanguage}.
    Respond ONLY with a JSON object in this exact format:
    {
      "translatedContent": "..." // return transaltedContent in markdown formatting
    }

    Text to translate:
    ${page.content}
  `;

  const result = await queryLLM(prompt, {
    temperature: 0.5,
  });

  const parsed = JSON.parse(result);

  return parsed.translatedContent;
}
