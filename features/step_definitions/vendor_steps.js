const { Given, When, Then } = require("@cucumber/cucumber");

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