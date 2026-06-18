const { Then } = require("@cucumber/cucumber");

Then("the home page title should contain {string}", async function (text) {
  await this.homePage.expectTitleContains(text);
});

Then("the home page should show {string}", async function (text) {
  await this.homePage.expectBodyTextVisible(text);
});
