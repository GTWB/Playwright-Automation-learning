import { test as base, expect } from "@playwright/test";

export const customTest = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto(process.env.EVENTHUB_URL);
    await page
      .getByPlaceholder("you@email.com")
      .fill(process.env.EVENTHUB_YAHOO_USER_TEST_EMAIL);
    await page
      .locator("#password")
      .fill(process.env.EVENTHUB_YAHOO_USER_TEST_PSW);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Browse Events →")).toBeVisible();
    await use(page);
  },

  createEvent: async ({ request }, use) => {
    const createEventPayload = {
      title: `test event ${Date.now()}`,
      description: "test",
      category: "Conference",
      venue: "erh",
      city: "LONDON",
      eventDate: "2026-11-15T17:03:00.000Z",
      price: 20,
      totalSeats: 200,
    };
    const createEventResponse = await request.post(
      "https://api.eventhub.rahulshettyacademy.com/api/events",
      {
        data: JSON.stringify(createEventPayload),
        headers: {
          "content-type": "application/json",
          authorization: process.env.EVENTHUB_AUTH_TOKEN,
        },
      },
    );

    expect(createEventResponse.ok()).toBeTruthy();
    const data = await createEventResponse.json();
    console.log(data);
    await use(data);
  },
});
