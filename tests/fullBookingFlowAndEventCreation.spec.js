import { expect, test } from "@playwright/test";

async function login(pageTest, url) {
  await pageTest.goto(url);
  await pageTest
    .getByPlaceholder("you@email.com")
    .fill(process.env.EVENTHUB_USER_EMAIL);
  await pageTest.locator("#password").fill(process.env.EVENTHUB_PASSWORD);
  await pageTest.getByRole("button", { name: "Sign In" }).click();
  await expect(pageTest.getByText("Browse Events →")).toBeVisible();
}

test.only("Create new Event", async ({ page }) => {
  const eventTitle = `Test Event ${Date.now()}`;
  // Future Date function Helper
  function futureDateValue() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const index = date.toJSON().lastIndexOf(":");
    return date.toJSON().slice(0, index);
  }

  // Step 1 - login
  await login(page, process.env.EVENTHUB_URL);
  // Step 2 - Create new event
  const eventMenuButton = page.locator("nav a").filter({ hasText: "Events" });

  await eventMenuButton.click();
  await page.getByRole("button", { name: "Add New Event" }).click();
  await page.getByLabel("Title").fill(eventTitle);
  await page.locator("#admin-event-form textarea").fill(eventTitle);
  await page.getByLabel("City").fill("London");
  await page.getByLabel("Venue").fill("London Venue");
  await page.getByLabel("Event Date & Time").fill(futureDateValue());
  await page.getByLabel("Price ($)").fill("100");
  await page.getByLabel("Total Seats").fill("50");
  await page.locator("#add-event-btn").click();
  await expect(page.getByText("Event created!")).toBeVisible();
  //   Step 3 - Find the Event card and capture seats

  // await page.getByTestId("nav-events").click();
  await eventMenuButton.click();

  await expect(page.locator("#event-card").last()).toBeVisible();

  await expect(page.getByText(eventTitle)).toBeVisible();

  const eventCards = await page.locator("#event-card").all();
  console.log(eventCards);
  for (const event of eventCards) {
    const title = await event.locator("h3").textContent();
    if (title === eventTitle) {
      const text = await event.locator("span").last().textContent();
      console.log(text);
    }
  }
});
