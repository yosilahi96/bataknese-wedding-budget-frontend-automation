const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      appName: () => this.page.getByText("BatakWedding", { exact: false }).first(),
      vendorsNavigation: () => this.page.getByText("Vendors", { exact: true }),
      logoutButton: () => this.page.getByRole("button", { name: "Logout" }),
      vendorlistLink: () => this.page.locator('a[href="/vendors"]')
    };
  }

  async expectDashboardVisible() {
    await expect(this.page).not.toHaveURL(/\/login/i, { timeout: 10000 });
    await expect(this.elements.appName()).toBeVisible();
    await expect(this.elements.vendorsNavigation()).toBeVisible();
    await expect(this.elements.logoutButton()).toBeVisible();
  }

  async expectvendorlistLinkVisible() {
    await expect(this.elements.vendorlistLink()).toBeVisible();
  }
}

module.exports = DashboardPage;
