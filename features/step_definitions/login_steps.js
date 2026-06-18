const { Given, When, Then } = require("@cucumber/cucumber");

Given("I open the Bataknese wedding login page", async function () {
  await this.loginPage.open(this.frontendUrl("/login"));
});

When("I login with email {string} and password {string}", async function (email, password) {
  await this.loginPage.login(email, password);
});

Then("I should see the dashboard", async function () {
  await this.dashboardPage.expectDashboardVisible();
});
