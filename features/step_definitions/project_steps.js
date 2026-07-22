const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

When("I see edit project information", async function () {
  const editProjectButton = this.projectPage.elements.editProjectButton();

  await expect(editProjectButton).toBeVisible();
  await editProjectButton.click();
});

When("I open an existing project detail page", async function () {
  await this.projectPage.openExistingInProgressProject();
  await this.projectPage.textGroomandBrideLabelVisible();
});

Then("I edit the project information", async function () {
  const groomNameInput = this.projectPage.elements.editGroomNameProject();
  const saveEditProjectButton = this.projectPage.elements.saveEditProjectButton();

  await expect(saveEditProjectButton).toBeVisible();
  await expect(groomNameInput).toBeVisible();
  await groomNameInput.click();
  await groomNameInput.clear();
  this.groomName = `Yosu${Date.now()}`;
  await expect(groomNameInput).toBeVisible();
  await groomNameInput.fill(this.groomName);
  await expect(saveEditProjectButton).toBeVisible();
  await saveEditProjectButton.click();
});

Then("I verify the project information changes", async function(){
  const projectUpdatedText = this.projectPage.page.getByText("Project Updated");
  const confirmEditProjectButton = this.projectPage.elements.confirmEditProjectButton();
  const projectTitle = this.projectPage.elements.textGroomandBrideLabel();

  await expect(projectUpdatedText).toBeVisible();
  await expect(confirmEditProjectButton).toBeVisible();
  await confirmEditProjectButton.click();
  await expect(projectTitle).toBeVisible();
  await expect(projectTitle).toContainText(this.groomName);
});

When("I create a project with type {string}", async function (eventTypeLabel) {
  await this.projectPage.createProjectWithType(eventTypeLabel);
});

Then("I verify the project type is {string}", async function (eventTypeLabel) {
  await this.projectPage.expectProjectType(eventTypeLabel);
});

When("I create a project for deletion", async function () {
  await this.projectPage.createProjectForDeletion();
});

When("I delete the created project", async function () {
  await this.projectPage.deleteCreatedProject();
});

Then("I verify the created project is not found in the project list search", async function () {
  await this.projectPage.expectCreatedProjectNotFoundInSearch();
});

When("I create a project for finalization", async function () {
  await this.projectPage.createProjectForFinalization();
});

When("I finalize the created project", async function () {
  await this.projectPage.finalizeCreatedProject();
});

Then("I verify the created project status is finalized in the project list search", async function () {
  await this.projectPage.expectCreatedProjectFinalizedInSearch();
});

When("I add a category with the required field", async function () {
  this.categoryName = `Automation Category ${Date.now()}`;
  await this.projectPage.addRequiredCategory(this.categoryName);
});

Then("I verify the category was made on the list", async function () {
  await this.projectPage.expectCategoryVisible(this.categoryName);
});

When("I delete the created category", async function () {
  if (!this.categoryName) {
    throw new Error('Expected a category from "I add a category with the required field" before deleting.');
  }
  await this.projectPage.deleteCategory(this.categoryName);
});

Then("I verify the category has been deleted", async function () {
  if (!this.categoryName) {
    throw new Error("Expected a category name before verifying deletion.");
  }
  await this.projectPage.expectCategoryNotVisible(this.categoryName);
});

When(
  "I edit the created category with planned budget {string} and actual cost {string}",
  async function (plannedBudget, actualCost) {
    if (!this.categoryName) {
      throw new Error(
        'Expected a category from "I add a category with the required field" before editing.'
      );
    }
    await this.projectPage.editCategoryBudgets(
      this.categoryName,
      plannedBudget,
      actualCost
    );
  }
);

Then("I verify the category budget diff is correct", async function () {
  if (!this.categoryName) {
    throw new Error("Expected a category name before verifying budget diff.");
  }
  await this.projectPage.expectCategoryBudgetDiff(this.categoryName);
});

When(
  "I edit the created category with planned budget {string} and over-budget actual cost {string}",
  async function (plannedBudget, actualCost) {
    if (!this.categoryName) {
      throw new Error(
        'Expected a category from "I add a category with the required field" before editing.'
      );
    }
    await this.projectPage.editCategoryBudgetsOverBudget(
      this.categoryName,
      plannedBudget,
      actualCost
    );
  }
);

Then("I verify the category budget diff is negative", async function () {
  if (!this.categoryName) {
    throw new Error("Expected a category name before verifying budget diff.");
  }
  if (this.projectPage.categoryExpectedDiff === undefined || this.projectPage.categoryExpectedDiff >= 0) {
    throw new Error(
      `Expected a negative budget diff, but got ${this.projectPage.categoryExpectedDiff}. ` +
      "Use the over-budget edit step first."
    );
  }
  await this.projectPage.expectCategoryBudgetDiff(this.categoryName);
});

Then("the remaining amount should equal total budget minus total spent", async function () {
  await this.projectPage.expectRemainingAmountCorrect();
});

Then("I verify the total planned and actual price is calculated correctly", async function () {
  await this.projectPage.expectPlannedAndActualTotalsCorrect();
});

When("I delete the category named {string}", async function (categoryName) {
  const savedName = this.savedCategoryNames?.[categoryName] || categoryName;
  await this.projectPage.deleteCategory(savedName);
  delete this.savedCategoryNames?.[categoryName];
});

When(
  "I add category {string} with planned budget {string}",
  async function (categoryName, plannedBudget) {
    const uniqueName = `${categoryName} ${Date.now()}`;
    this.savedCategoryNames = this.savedCategoryNames || {};
    this.savedCategoryNames[categoryName] = uniqueName;
    this.savedCategoryName = uniqueName;
    await this.projectPage.addCategoryWithBudget(uniqueName, plannedBudget);
  }
);

When(
  "I edit category {string} with planned budget {string} and actual cost {string}",
  async function (categoryName, plannedBudget, actualCost) {
    const savedName = this.savedCategoryNames?.[categoryName] || this.savedCategoryName || categoryName;
    await this.projectPage.editCategoryBudgetsByName(
      savedName,
      plannedBudget,
      actualCost
    );
  }
);

When("I search vendor recommendation {string}", async function (vendorName) {
  this.vendorRecommendationName = vendorName;
  await this.projectPage.searchVendorRecommendation(vendorName);
});

Then("I verify the vendor recommendation search result matched", async function () {
  await this.projectPage.expectVendorRecommendationSearchResult(this.vendorRecommendationName);
});

When("I choose {int} vendor recommendations to compare", async function (vendorCount) {
  await this.projectPage.compareVendorRecommendations(vendorCount);
});

When("I try to choose another vendor recommendation to compare", async function () {
  await this.projectPage.tryToCompareOneMoreVendor(3);
});

Then("I verify only {int} vendor recommendations can be compared", async function (vendorCount) {
  await this.projectPage.expectVendorComparisonLimit(vendorCount);
});

When("I open the vendor comparison", async function () {
  await this.projectPage.openVendorComparison();
});

Then("I verify the vendor comparison shows {int} vendors", async function (vendorCount) {
  await this.projectPage.expectVendorComparisonModalShowsComparedVendors(vendorCount);
});

Then("I verify the most budget friendly vendor is green highlighted", async function () {
  await this.projectPage.expectMostBudgetFriendlyVendorHighlighted();
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

Then("I verify the selected vendor cannot be selected again", async function () {
  await this.projectPage.expectSelectedVendorCannotBeSelectedAgain();
});

When("I remove the selected vendor", async function () {
  await this.projectPage.removeSelectedVendor();
});

Then("I verify the selected vendor has been removed", async function () {
  await this.projectPage.expectSelectedVendorRemoved();
});

When("I export the project budget as {string}", async function (exportType) {
  await this.projectPage.downloadBudgetExport(exportType, this.artifactsDir);
});

Then("I verify the downloaded {string} budget file is correct", async function (exportType) {
  await this.projectPage.expectBudgetExportCorrect(exportType);
});

Given("I am on the project overview page", async function () {
  await this.dashboardPage.expectDashboardVisible();
});

When("I view the budget overview for {string}", async function (typeName) {
  this.budgetOverviewType = typeName;
  await this.projectPage.getBudgetOverviewTypePlannedSpent(new RegExp(typeName, "i"));
});

Then("the total planned and spent in the budget overview for {string} should match the sum of all {string} project budgets", async function (typePattern, typeText) {
  await this.projectPage.expectBudgetOverviewTotalsCorrectForType(
    new RegExp(typePattern, "i"),
    typeText
  );
});
