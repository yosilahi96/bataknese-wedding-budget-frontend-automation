const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class VendorPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      detailsvendorButton: () => this.page.getByText("View Details", { exact: true }).first(),
      closevendordetailsButton: () => this.page.getByText("Close")
    };
  }

  async expectdetailsvendorButtonVisible() {
    await expect(this.elements.detailsvendorButton()).toBeVisible();
  }

  async expectclosevendordetailsButtonVisible() {
    await expect(this.elements.closevendordetailsButton()).toBeVisible();
  }
}
module.exports = VendorPage;
