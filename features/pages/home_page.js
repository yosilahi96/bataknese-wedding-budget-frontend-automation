const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      bodyText: (text) => this.page.getByText(text, { exact: false }).first()
    };
  }

  async open(url) {
    await this.goto(url);
  }

  async expectTitleContains(text) {
    await expect(this.page).toHaveTitle(new RegExp(text, "i"));
  }

  async expectBodyTextVisible(text) {
    await expect(this.elements.bodyText(text)).toBeVisible();
  }
}

module.exports = HomePage;
