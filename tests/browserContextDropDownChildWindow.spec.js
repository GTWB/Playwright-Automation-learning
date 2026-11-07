// @ts-check
import { expect, test } from "@playwright/test";

test("Browser Context PlayWright test", async ({ browser }) => {
  //   Create a new browser context
  const context = await browser.newContext();
  // Create a new page inside the context(browser)
  const page = await context.newPage();
  const userName = page.locator("#username");
  const password = page.locator("#password");
  const signInBtn = page.locator("#signInBtn");
  //   Navigate to a specific page
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  // Select locators and fill fields
  await userName.fill("pippo");
  await password.fill("Learning@830$3mK2");
  await signInBtn.click();
  // get text of error message
  const errorMessage = await page
    .locator("[style='display: block;']")
    .textContent();
  // log the message on console
  console.log(errorMessage);

  await expect(page.locator("[style='display: block;']")).toContainText(
    `${errorMessage}`,
  );
  await userName.fill("");
  await userName.fill("rahulshettyacademy");
  await signInBtn.click();

  console.log(page.locator(".card-body a"));

  //   //   Close the context (browser) once is no longer needed
  //   await context.close();
});

test("handling static select dropdown options", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const userRadioButtton = page.locator("span.checkmark").last();
  const userName = page.locator("#username");
  const password = page.locator("#password");
  const signInBtn = page.locator("#signInBtn");
  const documentLink = page.locator(
    "a[href='https://rahulshettyacademy.com/documents-request']",
  );
  await password.fill("Learning@830$3mK2");
  await userName.fill("rahulshettyacademy");
  const dropdown = page.locator("select.form-control");
  await dropdown.selectOption("Consultant");

  await userRadioButtton.check();
  await page.locator("#okayBtn").click();
  // Assert radio button
  await expect(userRadioButtton).toBeChecked();

  const checkBox = page.locator("input[type='checkbox']");
  //check if the checkbox is checked. isChecked() return true or false
  console.log(await checkBox.isChecked());
  // assert that the checkbox is not checked
  expect(await checkBox.isChecked()).toBeFalsy();

  await checkBox.click({ timeout: 30000 });
  // assert that the checkBox isChecked
  await expect(checkBox).toBeChecked();

  await expect(documentLink).toHaveAttribute("class", "blinkingText");
  // await page.pause();
});

test("Child windows handling", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator("#username");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

  const documentLink = page.locator(
    "a[href='https://rahulshettyacademy.com/documents-request']",
  );

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    documentLink.click(),
  ]);

  const text = await newPage.locator(".red").textContent();
  const getEmail = text?.split(" ").at(4);
  await expect(newPage.locator("p.red")).toHaveText(`${text}`);

  await userName.fill(`${getEmail}`);
  console.log(await userName.inputValue());
  await expect(userName).toHaveValue(`${getEmail}`);
});

test("Opening New Tab", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://the-internet.herokuapp.com/windows");
  const newPagePromise = context.waitForEvent("page");
  await page.locator("a[href='/windows/new']").click();
  const newPage = await newPagePromise;

  const locator = newPage.locator("h3");
  await expect(locator).toHaveText("New Window");
});
