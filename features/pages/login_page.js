const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      emailInput: () => this.page.locator('input[type="email"]'),
      passwordInput: () => this.page.locator('input[type="password"]'),
      signInButton: () => this.page.locator('button[type="submit"].login-submit'),
      invalidLoginMessage: () => this.page.locator('div.login-error-banner', { exact: true })
    };
  }

  async open(url) {
    await this.goto(url);
  }

  async login(email, password) {
    await this.elements.emailInput().fill(email);
    await this.elements.passwordInput().fill(password);
    await this.elements.signInButton().click();
  }

  async expectInvalidLoginMessageVisible() {
    await expect(this.page).toHaveURL(/\/login/i);
    await expect(this.elements.invalidLoginMessage()).toBeVisible();
  }
}

module.exports = LoginPage;
