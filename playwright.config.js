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
    headless: true,
    actionTimeout: 10 * 1000,
    trace: "retain-on-failure", // Generate trace only if a test will fail
    screenshot: "on",
  },

  reporter: "html",
});
