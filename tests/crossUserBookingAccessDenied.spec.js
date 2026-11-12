import { expect, test } from "@playwright/test";
let loginToken;
let eventID;

const loginDataPayload = {
  email: "emailTest@yahoo.com",
  password: "3xnJ$cw8r2XDc!M",
};

test("Cross-User Booking Access Denied", async () => {
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
  console.log(loginToken);

  console.log(eventBookingResponse.status);
  expect(eventBookingResponse.ok).toBeTruthy();
  const createBooking = await eventBookingResponse.json();
  console.log(createBooking.id);
});
