const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

When("I see edit project inforation", async function () {
  await this.projectPage.expecteditProjectButtonVisible();
  await this.projectPage.elements.editProjectButton().click();
});

Then("I edit the project information", async function () {
  await this.projectPage.saveEditProjectButtonVisible();
  await this.projectPage.elements.editGroomNameProject().click();
  await this.projectPage.elements.editGroomNameProject().clear();
  this.groomName = `Yosu${Date.now()}`;
  await this.projectPage.elements.editGroomNameProject().fill(this.groomName);
  await this.projectPage.elements.saveEditProjectButton().click();
});

Then("I verify the project information changes", async function(){
  await this.projectPage.page.getByText('Project Updated');
  await this.projectPage.elements.confirmEditProjectButton().click();
  await expect(this.projectPage.elements.textGroomandBrideLabel()).toContainText(this.groomName);
});