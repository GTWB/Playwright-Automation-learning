export class Home {
  constructor(page) {
    this.productsTitle = page.locator(".card-body h5 b");
    this.addToCartButton = page.getByRole("button", { name: " Add To Cart" });
    this.viewProductButton = page.getByRole("button", { name: " View" });
  }

  async addProductToCart(productName) {
    console.log(this.productsTitle);
    await this.productsTitle.first().waitFor();
    const selectedProduct = await this.productsTitle.filter({
      hasText: `${productName}`,
    });

    console.log(await selectedProduct.textContent());
  }

  async viewProduct(productName) {
    const selectedProduct = await this.productsTitle.filter({
      hasText: productName,
    });
    await selectedProduct.viewProduct.click();
  }
}
