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
