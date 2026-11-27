export class LoginPage {
  constructor(page) {
    this.page = page;
    this.userEmail = page.locator("#userEmail");
    this.password = page.locator("#userPassword");
    this.loginButton = page.locator("#login");
    this.forgotPasswordLink = page.locator("a.forgot-password-link");
    this.incorrectMailOrPasswordLocator = page.locator('[role="alert"]');
  }

  async openWebSite(url) {
    await this.page.goto(url);
  }

  async login(email, passsword) {
    await this.userEmail.fill(email);
    await this.password.fill(passsword);
    await this.loginButton.click();
  }
}
