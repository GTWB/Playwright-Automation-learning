import { expect, test } from "@playwright/test";

test("Playwright Special locators", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/angularpractice/");
  await page.getByLabel("Check me out if you Love IceCreams!").click();
  await page.getByLabel("Gender").selectOption("Female");
  await page.getByPlaceholder("Password").fill("test");
  await page.getByRole("button", { name: "Submit" }).click();
  await page
    .getByText("Success! The Form has been submitted successfully!.")
    .isVisible();
  await page.getByRole("link", { name: "Shop" }).click();

  // Selecting element from a list using loops
  await page.locator("app-card").first().waitFor(); //Wait the element to be displayed in the DOM
  const cardsArray = await page.locator("app-card").all(); // Get all the elements into an array
  let productFound = false;
  for (const card of cardsArray) {
    if ((await card.locator("h4 a").textContent()) === "Nokia Edge") {
      await card.locator("button").click();
      productFound = true;
      break;
    }
  }

  expect(productFound).toBeTruthy();

  const checkOutBtn = page.locator("#navbarResponsive a");
  await checkOutBtn.click();
  await page.locator("tbody").waitFor();
  const tableRowsArr = await page.locator("tbody tr").all();
  productFound = false;
  for (const tableRows of tableRowsArr) {
    const howMany = await tableRows.locator("td h4 a").count();
    if (howMany === 0) {
      continue;
    }

    const productName = await tableRows.locator("td h4 a").textContent();
    if (productName === "Nokia Edge") {
      productFound = true;
      break;
    }
  }

  expect(productFound).toBeTruthy();

  await page.getByRole("link", { name: "Shop" }).click();

  //Selecting element using and chaining Playwright locators

  await page.locator("app-card").first().waitFor();

  await page
    .locator("app-card")
    .filter({ hasText: "Samsung Note 8" })
    .getByRole("button", { name: "Add" })
    .click();

  await checkOutBtn.click();
  await page.locator("table").waitFor();

  await expect(
    page.locator("tbody tr").filter({ hasText: "Samsung Note 8" }),
  ).toBeVisible();
});

test.only("Customize timeout at Step level", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/angularpractice/");
  //  Configure timeout at step level
  await expect(page.getByText("Protractor Tutorial")).toBeVisible({
    timeout: 8000,
  });
});

test("Customize timeout at Test level", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/angularpractice/");
  // Configure Timeout at test level
  const customTimeOut = expect.configure({ timeout: 8000 }); // Configure assertion with custom Timeout and store it in a variable

  // Using customTimeout variable to assert elements within the test
  await customTimeOut(page.getByText("Protractor Tutorial")).toBeVisible();
});
