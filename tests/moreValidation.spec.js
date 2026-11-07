import { test, expect } from "@playwright/test";

test("Popup validation", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  await page.goto("https://www.google.com");
  await page.goBack(); //This method click on the back arrow of browser
  await page.goForward(); //This method click on the forward arrow of the browser
  await page.goBack();
  await expect(page.locator("#displayed-text")).toBeVisible(); // A specific element is visible.
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden(); //Ensures that Locator either does not resolve to any DOM node, or resolves to a non-visible one.

  //   Handling dialogs
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#alertbtn").click();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator("#confirmbtn").click();

  //   HOvering elements

  await page.locator("#mousehover").hover();
  await page.locator(".mouse-hover a").first().click();

  //   Handling iFrame or frameSet or external Frames
  const framePage = page.frameLocator("#courses-iframe");
  await framePage.locator('ul a[href="lifetime-access"]:visible').click();
  const textFrame = await framePage
    .locator("div[class='text'] h2")
    .textContent();
  console.log(textFrame.split(" ")[1]);
});
