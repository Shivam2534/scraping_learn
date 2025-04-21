const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: null,
    slowMo: 50,
  });

  const page = await browser.newPage();

  try {
    // Login
    await page.goto("https://www.linkedin.com/login", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.type("#username", "jeetippoint@gmail.com");
    await page.type("#password", "@Shivam111");
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForSelector('input[role="combobox"], .feed-shared-update-v2', {
        timeout: 15000,
      }), // wait for feed/home elements
    ]);
    console.log("✅ Logged in successfully");

    console.log("Waiting after login...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // ⚠️ Make sure you're navigating to a POST, not a PROFILE
    const postUrl =
      "https://www.linkedin.com/feed/update/urn:li:activity:7308146987315404801/";
    console.log("Navigating to post URL...");
    await page.goto(postUrl, { waitUntil: "networkidle2", timeout: 60000 });

    await page.screenshot({ path: "after-post-goto.png", fullPage: true });

    // Wait and click the likes count
    await page.waitForSelector(
      ".social-details-social-counts__reactions-count"
    );
    await page.click(".social-details-social-counts__reactions-count");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await page.screenshot({ path: "after-modal-opened.png", fullPage: true });

    // extracting main data
    const likers = await page.evaluate(() => {
      const elements = document.querySelectorAll(".artdeco-modal__content");
      return Array.from(elements)
        .map((el) => el.textContent.trim())
        .filter(Boolean);
    });
    console.log("likers-", likers);
  } catch (err) {
    console.error("❌ Error:", err);
    await page.screenshot({ path: "error.png" }); // helpful for debugging
  } finally {
    await browser.close();
  }
})();
