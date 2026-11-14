import { expect } from "@playwright/test";
import { customTest } from "./utils/customFixtures";

customTest(
  "Test Custom Fixture",
  async ({ authenticatedPage, createEvent }) => {
    await authenticatedPage.goto(`${process.env.EVENTHUB_URL}/events`);

    await expect(
      authenticatedPage.getByText(createEvent.data.title),
    ).toBeVisible();
  },
);
