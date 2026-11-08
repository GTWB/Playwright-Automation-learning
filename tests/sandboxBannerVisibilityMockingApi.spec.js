import { expect, test } from "@playwright/test";
import { SIX_EVENTS_RESPONSE } from "./utils/eventHubDataMockResponse";
import { FOUR_EVENTS_RESPONSE } from "./utils/eventHubDataMockResponse";

let loginToken;

const requestPayload = {
  email: "giuseppes90@gmail.com",
  password: "d8PPgKbk5Hu4aj#",
};

// Reusable Function mockAPI
async function mockAPI(page, fakeDataResponse) {
  await page.route("**/api/events*", async (route) => {
    // get the response
    const response = await route.fetch();
    // send back the response with fake data
    await route.fulfill({
      response: response,
      body: JSON.stringify(fakeDataResponse),
    });
  });
}

test.beforeAll(async () => {
  const response = await fetch(
    "https://api.eventhub.rahulshettyacademy.com/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();
  loginToken = data.token;
});

test("Banner IS visible when 6 events are returned", async ({ page }) => {
  // Inject the toke to log the user
  await page.addInitScript((token) => {
    localStorage.setItem("eventhub_token", token);
  }, loginToken);

  //   go to the main url
  await page.goto(process.env.EVENTHUB_URL);
  // intercept request
  await mockAPI(page, SIX_EVENTS_RESPONSE);

  //   go to the events page to see the fake data
  await page.locator("#nav-events").click();
  //  Get all the event cards
  const eventCards = page.locator("#event-card");
  //   Verify cards loaded from mock
  await expect(eventCards.first()).toBeVisible();
  await expect(eventCards).toHaveCount(6);

  //   verify the banner is visible
  await expect(page.locator("div.text-amber-800")).toBeVisible();
});

test("Banner is NOT visible when 4 events are returned", async ({ page }) => {
  // Inject the toke to log the user
  await page.addInitScript((token) => {
    localStorage.setItem("eventhub_token", token);
  }, loginToken);

  //   go to the main url
  await page.goto(process.env.EVENTHUB_URL);
  // intercept request
  await mockAPI(page, FOUR_EVENTS_RESPONSE);

  //   go to the events page to see the fake data
  await page.locator("#nav-events").click();
  await page.pause();
  //  Get all the event cards
  const eventCards = page.locator("#event-card");
  //   Verify cards loaded from mock
  await expect(eventCards.first()).toBeVisible();
  await expect(eventCards).toHaveCount(4);

  //   verify the banner is not visible
  await expect(page.locator("div.text-amber-800")).not.toBeVisible();
});
