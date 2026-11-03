import { expect, test } from "@playwright/test";

const dataPyload = {
  userEmail: process.env.USER_EMAIL,
  userPassword: process.env.USER_PASSWORD,
};
const createOrderPayload = {
  orders: [
    { country: "United Kingdom", productOrderedId: "6960eac0c941646b7a8b3e68" },
  ],
};

let token;
let orderId;
test.beforeAll(async () => {
  const response = await fetch(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      method: "POST",
      body: JSON.stringify(dataPyload),
      headers: {
        "Content-type": "application/json",
      },
    },
  );

  expect(response.ok).toBeTruthy();

  const data = await response.json();
  token = data.token;

  const responseCreateOrder = await fetch(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
      method: "POST",
      body: JSON.stringify(createOrderPayload),
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    },
  );
  const createOrderData = await responseCreateOrder.json();
  orderId = createOrderData.orders[0];
  console.log(createOrderData);
});

test("check order summary page", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client/");
  await page.getByRole("button", { name: "orders" }).click();

  await page.locator("tr.ng-star-inserted").first().waitFor();
  const allOrdersId = await page.locator("tr.ng-star-inserted").all();

  await page.pause();
  for (const orderId of allOrdersId) {
    if ((await orderId.locator("th").textContent()) === orderId) {
      await page.getByRole("button", { name: "View" }).click();
      break;
    }
  }
});
