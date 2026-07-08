const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class VendorPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      detailsvendorButton: () => this.page.locator('button.btn.btn-outline.btn-sm', { exact: true }).first(),
      closevendordetailsButton: () => this.page.getByText("Close"),
      alltypesDropdown: () => this.page.locator(".filter-bar select").first(),
      venueDropdown: () => this.page.locator('.filter-bar select option[value="VENUE"]'),
      cateringDropdown: () => this.page.locator('.filter-bar select option[value="CATERING"]'),
      gondangDropdown: () => this.page.locator('.filter-bar select option[value="GONDANG"]'),
      vendorcategoryLabel: () => this.page.locator('span.vendor-type-badge', { exact: true }).first()
    };
  }

  async expectdetailsvendorButtonVisible() {
    await expect(this.elements.detailsvendorButton()).toBeVisible();
  }

  async expectclosevendordetailsButtonVisible() {
    await expect(this.elements.closevendordetailsButton()).toBeVisible();
  }

  async expectalltypesDropdownVisible(){
    await expect(this.elements.alltypesDropdown()).toBeVisible();
  }

  async expectvenueDropdownVisible(){
    await expect(this.elements.venueDropdown()).toHaveCount(1);
  }
  
  async expectcateringDropdownVisible(){
    await expect(this.elements.cateringDropdown()).toHaveCount(1);
  }

  async expectgondangDropdownVisible(){
    await expect(this.elements.gondangDropdown()).toHaveCount(1);
  } 

  async expectvendorcategoryLabelVisible(){
    await expect(this.elements.vendorcategoryLabel()).toBeVisible();
  }

  async selectVendorType(value) {
    await expect(this.elements.alltypesDropdown()).toBeVisible();
    await this.elements.alltypesDropdown().selectOption(value);
  }
}
module.exports = VendorPage;
