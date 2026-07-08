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
    const element = this.page.getByRole(role, { name });
    await expect(element).toBeVisible();
    await element.click();
  }

  async clickByText(text) {
    const element = this.page.getByText(text, { exact: true });
    await expect(element).toBeVisible();
    await element.click();
  }

  async fillByLabel(label, value) {
    const element = this.page.getByLabel(label);
    await expect(element).toBeVisible();
    await element.fill(value);
  }

  async selectByLabel(label, value) {
    const element = this.page.getByLabel(label);
    await expect(element).toBeVisible();
    await element.selectOption(value);
  }

  async checkByLabel(label) {
    const element = this.page.getByLabel(label);
    await expect(element).toBeVisible();
    await element.check();
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
