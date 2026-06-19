const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

When("I able to access vendor page", async function () {
  await this.dashboardPage.expectvendorlistLinkVisible();
  await this.dashboardPage.elements.vendorlistLink().click();
});

Then("I should see list of vendor", async function () {
  await this.vendorPage.expectdetailsvendorButtonVisible();
});

Then("I should see vendor details", async function () {
  await this.vendorPage.elements.detailsvendorButton().click();
  await this.vendorPage.expectclosevendordetailsButtonVisible();
});

Then("I should able to filter vendor by {string}", async function (result){
  await this.vendorPage.expectalltypesDropdownVisible();
  if(result === "venue"){
    await this.vendorPage.expectvenueDropdownVisible();
    await this.vendorPage.selectVendorType("VENUE");
    await this.vendorPage.expectvendorcategoryLabelVisible();
    await expect(this.vendorPage.elements.vendorcategoryLabel()).toHaveText(/VENUE/i);
    return;
  }
  if(result === "catering"){
    await this.vendorPage.expectcateringDropdownVisible();
    await this.vendorPage.selectVendorType("CATERING");
    await this.vendorPage.expectvendorcategoryLabelVisible();
    await expect(this.vendorPage.elements.vendorcategoryLabel()).toHaveText(/CATERING/i);
    return;
  }
  if(result === "gondang"){
    await this.vendorPage.expectgondangDropdownVisible();
    await this.vendorPage.selectVendorType("GONDANG");
    await this.vendorPage.expectvendorcategoryLabelVisible();
    await expect(this.vendorPage.elements.vendorcategoryLabel()).toHaveText(/GONDANG/i);
    return;
  }
});
