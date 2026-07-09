const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

When("I see edit project information", async function () {
  await this.projectPage.expecteditProjectButtonVisible();
  await this.projectPage.elements.editProjectButton().click();
});

Then("I edit the project information", async function () {
  await this.projectPage.saveEditProjectButtonVisible();
  await this.projectPage.editGroomNameProjectVisible();
  await this.projectPage.elements.editGroomNameProject().click();
  await this.projectPage.elements.editGroomNameProject().clear();
  this.groomName = `Yosu${Date.now()}`;
  await this.projectPage.editGroomNameProjectVisible();
  await this.projectPage.elements.editGroomNameProject().fill(this.groomName);
  await this.projectPage.saveEditProjectButtonVisible();
  await this.projectPage.elements.saveEditProjectButton().click();
});

Then("I verify the project information changes", async function(){
  await expect(this.projectPage.page.getByText('Project Updated')).toBeVisible();
  await expect(this.projectPage.elements.confirmEditProjectButton()).toBeVisible();
  await this.projectPage.elements.confirmEditProjectButton().click();
  await this.projectPage.textGroomandBrideLabelVisible();
  await expect(this.projectPage.elements.textGroomandBrideLabel()).toContainText(this.groomName);
});

When("I add a category with the required field", async function () {
  this.categoryName = `Automation Category ${Date.now()}`;
  await this.projectPage.addRequiredCategory(this.categoryName);
});

Then("I verify the category was made on the list", async function () {
  await this.projectPage.expectCategoryVisible(this.categoryName);
});

When("I search vendor recommendation {string}", async function (vendorName) {
  this.vendorRecommendationName = vendorName;
  await this.projectPage.searchVendorRecommendation(vendorName);
});

Then("I verify the vendor recommendation search result matched", async function () {
  await this.projectPage.expectVendorRecommendationSearchResult(this.vendorRecommendationName);
});

When("I filter vendor recommendations by each available area", async function () {
  await this.projectPage.filterVendorRecommendationsByEveryArea();
});

Then("I verify each vendor recommendation area filter result matched", async function () {
  await this.projectPage.expectEveryAreaFilterWasVerified();
});

When("I filter vendor recommendations by area {string}", async function (area) {
  await this.projectPage.filterVendorRecommendationsByArea(area);
});

Then("I verify vendor recommendation area filter result matched for {string}", async function (area) {
  await this.projectPage.expectVendorRecommendationsFilteredByAreaName(area);
});

When("I filter vendor recommendations by each available price", async function () {
  await this.projectPage.filterVendorRecommendationsByEveryPrice();
});

Then("I verify each vendor recommendation price filter result matched", async function () {
  await this.projectPage.expectEveryPriceFilterWasVerified();
});

When("I filter vendor recommendations by price {string}", async function (price) {
  await this.projectPage.filterVendorRecommendationsByPrice(price);
});

Then("I verify vendor recommendation price filter result matched for {string}", async function (price) {
  await this.projectPage.expectVendorRecommendationsFilteredByPriceName(price);
});

When("I sort vendor recommendations by price {string}", async function (direction) {
  await this.projectPage.sortVendorRecommendationsByPrice(direction);
});

Then("I verify vendor recommendations are sorted by price {string}", async function (direction) {
  await this.projectPage.expectVendorRecommendationsSortedByPrice(direction);
});

When("I filter vendor recommendations by each available capacity", async function () {
  await this.projectPage.filterVendorRecommendationsByEveryCapacity();
});

Then("I verify each vendor recommendation capacity filter result matched", async function () {
  await this.projectPage.expectEveryCapacityFilterWasVerified();
});

When("I filter vendor recommendations by capacity {string}", async function (capacity) {
  await this.projectPage.filterVendorRecommendationsByCapacity(capacity);
});

Then("I verify vendor recommendation capacity filter result matched for {string}", async function (capacity) {
  await this.projectPage.expectVendorRecommendationsFilteredByCapacityName(capacity);
});

When("I select a vendor recommendation", async function () {
  await this.projectPage.selectFirstAvailableVendorRecommendation();
});

Then("I verify the vendor has been selected", async function () {
  await this.projectPage.expectSelectedVendorVisible();
});

When("I remove the selected vendor", async function () {
  await this.projectPage.removeSelectedVendor();
});

Then("I verify the selected vendor has been removed", async function () {
  await this.projectPage.expectSelectedVendorRemoved();
});
