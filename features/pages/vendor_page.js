const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class VendorPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      detailsvendorButton: () => this.page.locator('button.btn.btn-outline.btn-sm', { exact: true }).first(),
      closevendordetailsButton: () => this.page.getByText("Close"),
      alltypesDropdown: () => this.page.locator(".filter-bar select").first(),
      batakSpecialistCheckbox: () => this.page.locator('.filter-bar input[type="checkbox"]'),
      batakSpecialistBadge: () => this.page.locator(".vendor-card .batak-badge"),
      venueDropdown: () => this.page.locator('.filter-bar select option[value="VENUE"]'),
      cateringDropdown: () => this.page.locator('.filter-bar select option[value="CATERING"]'),
      gondangDropdown: () => this.page.locator('.filter-bar select option[value="GONDANG"]'),
      vendorCards: () => this.page.locator(".vendor-card"),
      visibleVendorCards: () => this.page.locator(".vendor-card:visible"),
      visibleBatakSpecialistBadge: () => this.page.locator(".vendor-card:visible .batak-badge:visible"),
      vendorcategoryLabel: () => this.page.locator("span.vendor-type-badge", { exact: true }).first()
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

  async open(url) {
    await this.goto(url);
    await this.waitUntilVendorDirectoryLoaded();
  }

  async waitUntilVendorDirectoryLoaded() {
    await expect(this.page).toHaveURL(/\/vendors/i);
    await this.waitForPageReady();
    await expect(this.elements.alltypesDropdown()).toBeVisible();
    await expect(this.elements.batakSpecialistCheckbox()).toBeVisible();
    await expect(this.elements.vendorCards().first()).toBeVisible();
    await expect
      .poll(async () => this.elements.visibleVendorCards().count())
      .toBeGreaterThan(0);
  }

  async expectBatakSpecialistCheckboxVisible() {
    await expect(this.elements.batakSpecialistCheckbox()).toBeVisible();
  }

  async checkBatakSpecialistOnly() {
    await this.waitUntilVendorDirectoryLoaded();
    await this.expectBatakSpecialistCheckboxVisible();
    await this.elements.batakSpecialistCheckbox().check();
    await expect(this.elements.batakSpecialistCheckbox()).toBeChecked();
  }

  async waitUntilBatakSpecialistFiltered() {
    await expect(this.elements.visibleVendorCards().first()).toBeVisible();
    await expect
      .poll(async () => {
        const cardCount = await this.elements.visibleVendorCards().count();
        const badgeCount = await this.elements.visibleBatakSpecialistBadge().count();

        return cardCount > 0 && cardCount === badgeCount;
      })
      .toBe(true);
  }

  async expectOnlyBatakSpecialistVendorsVisible() {
    await this.waitUntilBatakSpecialistFiltered();

    const cardCount = await this.elements.visibleVendorCards().count();
    await expect(this.elements.visibleBatakSpecialistBadge()).toHaveCount(cardCount);

    for (let index = 0; index < cardCount; index += 1) {
      const vendorCard = this.elements.visibleVendorCards().nth(index);

      await expect(vendorCard).toBeVisible();
      await expect(vendorCard.locator(".batak-badge")).toBeVisible();
      await expect(vendorCard.locator(".batak-badge")).toHaveText(/Batak Specialist/i);
    }
  }
}
module.exports = VendorPage;
