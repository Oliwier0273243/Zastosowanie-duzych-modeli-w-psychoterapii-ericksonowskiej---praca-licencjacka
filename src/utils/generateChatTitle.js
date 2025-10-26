export function generateChatTitle(messageText, maxLength = 50) {
  if (!messageText || typeof messageText !== "string") {
    return "";
  }

  const cleanText = messageText.trim().replace(/\s+/g, " ");

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const firstSentence = cleanText.match(/^[^.!?]+/);
  if (firstSentence && firstSentence[0].length <= maxLength) {
    return firstSentence[0].trim();
  }

  const words = cleanText.split(" ");
  let title = "";

  for (const word of words) {
    if ((title + " " + word).length <= maxLength) {
      title = title ? title + " " + word : word;
    } else {
      break;
    }
  }

  return title || cleanText.substring(0, maxLength - 3) + "...";
}
