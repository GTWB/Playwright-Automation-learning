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

  let seatsBeforeBooking;
  for (const event of eventCards) {
    const title = await event.locator("h3").textContent();
    if (title === eventTitle) {
      const text = await event.locator("span").last().textContent();
      seatsBeforeBooking = parseInt(text.split(" ")[0]);
      // Step 4 - Start Booking
      await event.getByRole("link", { name: "Book Now" }).click();
    }
  }
  // Step 5 - Fill booking form
  await expect(page.locator("#ticket-count")).toHaveText("1");
  await page.getByLabel("Full Name").fill(process.env.FULL_NAME);
  await page.getByLabel("Email").fill(process.env.EVENTHUB_USER_EMAIL);
  await page.getByPlaceholder("+91 98765 43210").fill("+91 98765 43210");
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  // Step 6 - Verify Booking Confirmation
  await expect(page.locator(".booking-ref")).toBeVisible();
  let bookingRef = await page.locator(".booking-ref").textContent();
  bookingRef = bookingRef.trim();

  // Step 7 - Verify in my Bookings page
  const myBookingsPage = page
    .locator("nav a")
    .filter({ hasText: "My Bookings" });
  await myBookingsPage.click();
  await expect(page).toHaveURL(`${process.env.EVENTHUB_URL}bookings`);
  await expect(page.locator("#booking-card").first()).toBeVisible();

  const matchedBookingCard = page
    .locator("#booking-card")
    .filter({ hasText: `${bookingRef}` });
  await expect(matchedBookingCard).toBeVisible();
  await expect(matchedBookingCard).toContainText(eventTitle);

  // Step 8 - Verify seat reduction

  await eventMenuButton.click();
  await expect(page.getByText(eventTitle)).toBeVisible();
  const filteredEventCard = page
    .locator("#event-card")
    .filter({ hasText: `${eventTitle}` });
  await expect(filteredEventCard).toBeVisible();
  let seatsAfterBooking;

  await expect(filteredEventCard.locator("span").last()).toContainText(
    `${seatsBeforeBooking - 1}`,
  );

  const seatsText = await filteredEventCard
    .locator("span")
    .last()
    .textContent();
  seatsAfterBooking = parseInt(seatsText.split(" ")[0]);
  console.log(seatsAfterBooking);
  console.log(seatsBeforeBooking);
  expect(seatsAfterBooking === seatsBeforeBooking - 1).toBeTruthy();
});
