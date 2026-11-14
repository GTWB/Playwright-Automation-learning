import { expect, test } from "@playwright/test";
import { login } from "./utils/crossUserBookingAccessDeniedUtils";
import { CrossUserBookingAccessDenied } from "./utils/crossUserBookingAccessDeniedUtils";

let eventID;

const loginDataPayload = {
  email: "emailTest@yahoo.com",
  password: "3xnJ$cw8r2XDc!M",
};

test("Cross-User Booking Access Denied", async ({ page }) => {
  // Login as Yahoo user Via API
  const utils = new CrossUserBookingAccessDenied(loginDataPayload);

  //   Fetch events via API to get a valid eventID
  eventID = await utils.getValidEventID();

  const eventBookingPayload = {
    customerName: "yahoo User",
    customerEmail: "emailTest@yahoo.com",
    customerPhone: "+447955890169",
    quantity: 1,
    eventId: eventID,
  };
  //   Create a booking via API as Yahoo user
  const yahooUserBookingId =
    await utils.createBookingAndGetID(eventBookingPayload);

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
