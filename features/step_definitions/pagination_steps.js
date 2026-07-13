const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

Given("I am on the project list page", async function () {
  await this.basePage.goto(this.frontendUrl("/"));
  await this.dashboardPage.expectDashboardVisible();
});

Then("I verify the {string} pagination button is disabled", async function (buttonName) {
  let button;
  if (buttonName.toLowerCase() === "previous") {
    button = this.projectPage.elements.previousPageButton();
  } else if (buttonName.toLowerCase() === "next") {
    button = this.projectPage.elements.nextPageButton();
  } else {
    throw new Error(`Unsupported pagination button name: "${buttonName}"`);
  }

  // Always wait until element is visible before verifying
  await expect(button).toBeVisible();
  await expect(button).toBeDisabled();
});

When("I go to the latest page of the project list", async function () {
  await this.projectPage.goToLatestPage();
});
