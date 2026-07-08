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
    await expect(this.elements.emailInput()).toBeVisible();
    await this.elements.emailInput().fill(email);
    await expect(this.elements.passwordInput()).toBeVisible();
    await this.elements.passwordInput().fill(password);
    await expect(this.elements.signInButton()).toBeVisible();
    await this.elements.signInButton().click();
  }

  async expectInvalidLoginMessageVisible() {
    await expect(this.page).toHaveURL(/\/login/i);
    await expect(this.elements.invalidLoginMessage()).toBeVisible();
  }
}

module.exports = LoginPage;
