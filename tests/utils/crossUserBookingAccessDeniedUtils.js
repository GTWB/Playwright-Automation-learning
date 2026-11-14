import { expect } from "@playwright/test";

export async function login(page, url) {
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

export class CrossUserBookingAccessDenied {
  constructor(loginDataPayload) {
    this.loginDataPayload = loginDataPayload;
    this.tokenPromise = this.loginTroughAPIandGetToken();
  }

  async loginTroughAPIandGetToken() {
    // Login as Yahoo user Via API
    const loginResponse = await fetch(
      "https://api.eventhub.rahulshettyacademy.com/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(this.loginDataPayload),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(loginResponse.ok).toBeTruthy();
    const data = await loginResponse.json();
    return data["token"];
  }

  async getValidEventID() {
    //   Fetch events via API to get a valid eventID
    const eventsResponse = await fetch(
      "https://api.eventhub.rahulshettyacademy.com/api/events?*",
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${await this.tokenPromise}`,
        },
      },
    );

    expect(eventsResponse.ok).toBeTruthy();
    const events = await eventsResponse.json();

    return events.data[0].id;
  }

  async createBookingAndGetID(createBookingPayload) {
    //   Create a booking via API as Yahoo user
    const eventBookingResponse = await fetch(
      "https://api.eventhub.rahulshettyacademy.com/api/bookings",
      {
        method: "POST",
        body: JSON.stringify(createBookingPayload),
        headers: {
          authorization: `Bearer ${await this.tokenPromise}`,
          "content-type": "application/json",
        },
      },
    );

    expect(eventBookingResponse.ok).toBeTruthy();
    const createBooking = await eventBookingResponse.json();

    return createBooking.data.id;
  }
}
