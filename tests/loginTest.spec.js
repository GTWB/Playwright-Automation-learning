import { expect, test } from "@playwright/test";

test("Login Test and get the first title", async ({ page }) => {
  const productName = "ZARA COAT 3";
  let productFound = false;
  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
  const userEmail = page.locator("#userEmail");
  const password = page.locator("#userPassword");
  const products = page.locator(".card-body");
  await userEmail.fill(process.env.USER_EMAIL);
  await password.fill(process.env.USER_PASSWORD);
  //   Method 1 to check all the title of products

  // //   Start waiting for response of all products
  //   const resPromise = page.waitForResponse("**/get-all-products");
  // //   Click login button
  //   await page.locator("#login").click();
  // //   Once logged in we've got the response because the web site automatically request to get all products
  //   const response = await resPromise;
  // //   Convert the response to Json and get the data
  //   const data = await response.json();
  //   console.log(data.data);
  // //   Selecting the locator where the title lives and we want to check
  //   const productTitle = page.locator(".card-body h5 b");
  // //   Extract all the products Title we're interested in using map
  //   const productName = data.data.map((productObj) => {
  //     return productObj.productName;
  //   });
  // // using assertion to check if te titles match the elements of the productName data(array)
  //   await expect(productTitle).toHaveText(productName);

  // Method 2
  await page.locator("#login").click();
  //   selecting first locator. Playwright has ha method that wait for the firts or last element is present in the DOM
  await page.locator(".card-body h5 b").first().waitFor();
  //   get all textContets. Text content does not wait automatically, this is the reason why we waited first for the first element in the row above
  const allProductsTitle = await page
    .locator(".card-body h5 b")
    .allTextContents();
  //  Assert the content
  await expect(page.locator(".card-body h5 b")).toHaveText(allProductsTitle);

  // Select a product
  const productsArray = await products.all();
  // console.log(await products.count());

  for (const product of productsArray) {
    // console.log(product);
    if ((await product.locator("b").textContent()) === productName) {
      //Add to cart
      await product.locator("text=  Add To Cart").click();
      productFound = true;
      break;
    }
  }

  await page.locator("[routerlink='/dashboard/cart']").click();

  await page.locator("div li").first().waitFor();
  const isVisible = await page
    .locator('h3:has-text("ZARA COAT 3")')
    .isVisible();
  expect(isVisible).toBeTruthy();
  expect(productFound).toBeTruthy();

  await page.locator('button:has-text("Checkout")').click();

  await page
    .locator("[value='4542 9931 9292 2293']")
    .fill("1234 5679 1234 5678");
  const firstDropDown = page.locator(".input.ddl").first();
  const lastDropDown = page.locator(".input.ddl").last();
  await firstDropDown.selectOption("12");
  await lastDropDown.selectOption("25");
  const cvvCode = page.locator("div .form__cc > div .field > input").nth(1);
  await cvvCode.fill("456");

  await page
    .locator("[placeholder='Select Country']")
    .pressSequentially("united");

  await page.locator(".ta-results").waitFor();

  const countryArr = await page.locator(".ta-results button").all();

  for (const country of countryArr) {
    const textContent = await country.textContent();
    // console.log(textContent);
    if (textContent === " United Kingdom") {
      await country.click();
      break;
    }
  }

  await page.locator(".actions .action__submit").click();
  await expect(page.locator(".hero-primary")).toHaveText(
    " Thankyou for the order. ",
  );
  const orderId = await page
    .locator("td label[class='ng-star-inserted']")
    .textContent();

  const correctOrderId = orderId.split(" ")[2].trim();

  await page.locator("button[routerlink='/dashboard/myorders']").click();
  await page.locator("tbody tr").first().waitFor();
  const orderIdArray = await page.locator("tbody th[scope='row']").all();

  for (const [key, value] of orderIdArray.entries()) {
    const id = await value.textContent();
    if (id === correctOrderId) {
      await page.locator("tbody tr td button[tabindex='0']").nth(key).click();
      break;
    }
  }

  await expect(page.locator(".col-text")).toHaveText(correctOrderId);
});
