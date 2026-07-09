const { expect } = require("@playwright/test");
const BasePage = require("./base_page");
const config = require("../support/env");

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      appName: () => this.page.getByText("BatakWedding", { exact: false }).first(),
      vendorsNavigation: () => this.page.getByText("Vendors", { exact: true }),
      logoutButton: () => this.page.getByRole("button", { name: "Logout" }),
      vendorlistLink: () => this.page.locator('a[href="/vendors"]'),
      projectNavigation: () => this.page.locator('.card.card-hover'),
    };
  }

  async expectDashboardVisible() {
    await expect(this.page).not.toHaveURL(/\/login/i, { timeout: config.defaultTimeout });
    await expect(this.elements.appName()).toBeVisible();
    await expect(this.elements.vendorsNavigation()).toBeVisible();
    await expect(this.elements.logoutButton()).toBeVisible();
  }

  async expectvendorlistLinkVisible() {
    await expect(this.elements.vendorlistLink()).toBeVisible();
  }

  async expectprojectNavigationVisible() {
    await expect(this.elements.projectNavigation()).toBeVisible();
  }

}

module.exports = DashboardPage;
