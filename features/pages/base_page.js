const { expect } = require("@playwright/test");

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async expectTitleContains(text) {
    await expect(this.page).toHaveTitle(new RegExp(text, "i"));
  }

  async expectTextVisible(text) {
    await expect(this.page.getByText(text, { exact: false }).first()).toBeVisible();
  }

  async clickByRole(role, name) {
    await this.page.getByRole(role, { name }).click();
  }

  async clickByText(text) {
    await this.page.getByText(text, { exact: true }).click();
  }

  async fillByLabel(label, value) {
    await this.page.getByLabel(label).fill(value);
  }

  async selectByLabel(label, value) {
    await this.page.getByLabel(label).selectOption(value);
  }

  async checkByLabel(label) {
    await this.page.getByLabel(label).check();
  }

  async expectUrlContains(text) {
    await expect(this.page).toHaveURL(new RegExp(text));
  }

  async expectTextHidden(text) {
    await expect(this.page.getByText(text, { exact: false }).first()).toBeHidden();
  }

  async waitForPageReady() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle").catch(() => undefined);
  }
}

module.exports = BasePage;
