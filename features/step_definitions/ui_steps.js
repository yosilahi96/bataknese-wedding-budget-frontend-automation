const { Given, When, Then } = require("@cucumber/cucumber");

Given("I open the frontend home page", async function () {
  await this.homePage.open(this.frontendUrl("/"));
});

When("I visit {string}", async function (pathOrUrl) {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : this.frontendUrl(pathOrUrl);
  await this.basePage.goto(url);
});

When("I click the {string} button", async function (name) {
  await this.basePage.clickByRole("button", name);
});

When("I click the {string} link", async function (name) {
  await this.basePage.clickByRole("link", name);
});

When("I click text {string}", async function (text) {
  await this.basePage.clickByText(text);
});

When("I fill {string} with {string}", async function (label, value) {
  await this.basePage.fillByLabel(label, value);
});

When("I select {string} from {string}", async function (value, label) {
  await this.basePage.selectByLabel(label, value);
});

When("I check {string}", async function (label) {
  await this.basePage.checkByLabel(label);
});

When("I wait for the page to finish loading", async function () {
  await this.basePage.waitForPageReady();
});

Then("the page title should contain {string}", async function (text) {
  await this.basePage.expectTitleContains(text);
});

Then("the page url should contain {string}", async function (text) {
  await this.basePage.expectUrlContains(text);
});

Then("the page should contain {string}", async function (text) {
  await this.basePage.expectTextVisible(text);
});

Then("the page should not contain {string}", async function (text) {
  await this.basePage.expectTextHidden(text);
});
