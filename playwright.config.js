// @ts-check
import { defineConfig } from "@playwright/test";

// Load credentials from the local .env file (not committed)
process.loadEnvFile(".env");

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 40_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    browserName: "chromium",
    headless: false,
    actionTimeout: 10 * 1000,
  },

  reporter: "html",
});
