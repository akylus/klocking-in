require("dotenv").config();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
class Keka {
  constructor() {
    this.URL = `https://${process.env.COMPANY_NAME}.keka.com/#/me/attendance/logs`;
  }
  getText(linkText) {
    linkText = linkText.replace(/\r\n|\r/g, "\n");
    linkText = linkText.replace(/\ +/g, " ");

    // Replace &nbsp; with a space
    var nbspPattern = new RegExp(String.fromCharCode(160), "g");
    return linkText.replace(nbspPattern, " ");
  }

  async fetchTargetElement(links, buttonText) {
    let targetElement = null;
    for (const element of links) {
      let valueHandle = await element.getProperty("innerText");
      let linkText = await valueHandle.jsonValue();
      const text = this.getText(linkText);
      if (text === buttonText) {
        targetElement = element;
        break;
      }
    }
    return targetElement;
  }

  async start(isClockOut = false) {
    console.log("starting");
    const clockIn = "Remote Clock-In";
    const clockOut = "Remote Clock-out";
    const clockOutConfirm = "Clock-out";
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.EXECUTABLE_PATH,
      userDataDir: process.env.USER_DATA_DIR,
      disableNotifications: true,
    });
    console.log("browser launched");
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(`https://${process.env.COMPANY_NAME}.keka.com`, [
      "geolocation",
    ]);
    const page = await browser.newPage();
    try {
      await Promise.all([
        page.goto(this.URL, {
          waitUntil: "load",
          // waitUntil: "networkidle0",
        }),
        page.waitForSelector(".keka-logo", { hidden: true }),
        page.waitForSelector(".loader", { hidden: true }),
        page.waitForSelector(".card-body", { visible: true }),
      ]);
    } catch (e) {
      console.log("error", e);
    }
    await page.waitForTimeout(1000);
    console.log("page loaded");
    const buttonType = isClockOut ? "button" : "a";
    const buttonText = isClockOut ? clockOut : clockIn;
    const links = await page.$$(buttonType);
    const targetElement = await this.fetchTargetElement(links, buttonText);

    if (!targetElement) {
      console.log("loggedout");
      await browser.close();
      return -1;
    }
    console.log("clocking...");
    await targetElement.click();
    await page.waitForTimeout(2000);
    if (isClockOut) {
      const links = await page.$$(buttonType);
      const confirmElement = await this.fetchTargetElement(
        links,
        clockOutConfirm
      );
      await confirmElement.click();
    }
    await page.waitForTimeout(5000);
    const buttons = await page.$$("button");
    const confirmElement = await this.fetchTargetElement(buttons, "Confirm");
    await confirmElement.click();
    await page.waitForTimeout(3000);
    console.log("clocked");
    await browser.close();
    return;
  }
}

(async () => {
  const keka = new Keka();
  const isClockOut = process.argv[2] === "out";
  await keka.start(isClockOut);
})();
