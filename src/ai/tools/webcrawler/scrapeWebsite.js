import { chromium } from "playwright";
import * as cheerio from "cheerio";

export async function scrapeWebsite(url) {
  if (!url) {
    return { success: false, error: "URL is required" };
  }

  if (typeof url === "object" && url.href) {
    url = url.href;
  }

  if (typeof url !== "string") {
    return {
      success: false,
      error: `Invalid URL type: expected string, got ${typeof url}`,
    };
  }

  if (!/^https?:\/\//i.test(url)) {
    return {
      success: false,
      error: `Invalid URL format: must start with http:// or https://, got "${url}"`,
    };
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);

    $("script, style, noscript, iframe").remove();

    let textContent = "";
    $("h1, h2, h3, h4, h5, h6, p, li").each((_, el) => {
      const text = $(el).text().trim();
      if (text) textContent += text + "\n";
    });

    const cleanText = textContent.replace(/\s+/g, " ").trim();

    return {
      success: true,
      url,
      text: cleanText,
    };
  } catch (err) {
    console.error("Scraping failed:", err.message);
    await browser.close();

    return {
      success: false,
      url,
      text: "",
      error: err.message,
    };
  }
}
