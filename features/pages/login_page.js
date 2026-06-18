const BasePage = require("./base_page");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      emailInput: () => this.page.getByPlaceholder("your@email.com"),
      passwordInput: () => this.page.getByPlaceholder("Enter your secure password"),
      signInButton: () => this.page.getByRole("button", { name: "Sign In to Dashboard" })
    };
  }

  async open(url) {
    await this.goto(url);
  }

  async login(email, password) {
    await this.elements.emailInput().fill(email);
    await this.elements.passwordInput().fill(password);
    await Promise.all([
      this.page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 }).catch(() => undefined),
      this.elements.signInButton().click()
    ]);
  }
}

module.exports = LoginPage;
