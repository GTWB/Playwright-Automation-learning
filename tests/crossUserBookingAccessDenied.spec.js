import { expect, test } from "@playwright/test";
import { url } from "node:inspector";
let loginToken;
let eventID;

async function login(page, url) {
  await page.goto(url);
  await page
    .getByPlaceholder("you@email.com")
    .fill(process.env.EVENTHUB_GMAIL_USER_TEST_EMAIL);
  await page
    .locator("#password")
    .fill(process.env.EVENTHUB_GMAIL_USER_TEST_PSW);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText("Browse Events →")).toBeVisible();
}

const loginDataPayload = {
  email: "emailTest@yahoo.com",
  password: "3xnJ$cw8r2XDc!M",
};

test("Cross-User Booking Access Denied", async ({ page }) => {
  // Login as Yahoo user Via API
  const loginResponse = await fetch(
    "https://api.eventhub.rahulshettyacademy.com/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(loginDataPayload),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  expect(loginResponse.ok).toBeTruthy();
  const data = await loginResponse.json();
  loginToken = data["token"];

  //   Fetch events via API to get a valid eventID
  const eventsResponse = await fetch(
    "https://api.eventhub.rahulshettyacademy.com/api/events?*",
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${loginToken}`,
      },
    },
  );

  expect(eventsResponse.ok).toBeTruthy();
  const events = await eventsResponse.json();

  eventID = events.data[0].id;
  console.log(eventID);

  const eventBookingPayload = {
    customerName: "yahoo User",
    customerEmail: "emailTest@yahoo.com",
    customerPhone: "+447955890169",
    quantity: 1,
    eventId: eventID,
  };

  //   Create a booking via API as Yahoo user
  const eventBookingResponse = await fetch(
    "https://api.eventhub.rahulshettyacademy.com/api/bookings",
    {
      method: "POST",
      body: JSON.stringify(eventBookingPayload),
      headers: {
        authorization: "Bearer " + loginToken,
        "content-type": "application/json",
      },
    },
  );

  expect(eventBookingResponse.ok).toBeTruthy();
  const createBooking = await eventBookingResponse.json();

  const yahooUserBookingId = createBooking.data.id;
  console.log(yahooUserBookingId);

  // Login as Gmail user via browser UI
  await login(page, process.env.EVENTHUB_URL);
  await page.goto(
    `https://eventhub.rahulshettyacademy.com/bookings/${yahooUserBookingId}`,
  );

  await expect(page.locator("h3").first()).toHaveText("Access Denied");
  await expect(page.locator("p").first()).toHaveText(
    "You are not authorized to view this booking.",
  );
});
