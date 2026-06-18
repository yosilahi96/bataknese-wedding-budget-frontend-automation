const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      emailInput: () => this.page.getByPlaceholder("your@email.com"),
      passwordInput: () => this.page.getByPlaceholder("Enter your secure password"),
      signInButton: () => this.page.getByRole("button", { name: "Sign In to Dashboard" }),
      invalidLoginMessage: () => this.page.getByText("Invalid email or password", { exact: true })
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
