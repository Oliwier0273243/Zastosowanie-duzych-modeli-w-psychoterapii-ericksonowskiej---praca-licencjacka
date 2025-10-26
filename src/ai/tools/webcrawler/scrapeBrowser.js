import playwright from "playwright";

export async function scrapeBrowser(params = {}) {
  const { query, kRange = [0, 5] } = params;

  if (!query) {
    return { error: "Query is required" };
  }

  const browser = await playwright["chromium"].launch({
    headless: false,
    args: ["--no-sandbox"],
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`);

    await page.waitForSelector('ol.react-results--main [data-testid="result-title-a"]', {
      timeout: 10000,
    });

    const results = await page.$$('ol.react-results--main [data-testid="result-title-a"]');

    let links = [];

    for (let i = kRange[0]; i <= kRange[1] && i < results.length; i++) {
      const item = results[i];
      links.push({
        linkTitle: await item.innerText(),
        link: await item.getAttribute("href"),
      });
    }

    await browser.close();

    return {
      query,
      urls: links,
      success: true,
    };
  } catch (err) {
    await browser.close();
    console.error("Browser scraping failed:", err.message);
    return {
      query,
      urls: [],
      error: err.message,
      success: false,
    };
  }
}
