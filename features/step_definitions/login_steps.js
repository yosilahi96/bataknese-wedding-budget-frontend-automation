const { Given, When, Then } = require("@cucumber/cucumber");
const { getUser } = require("../support/credentials");

Given("I open the Bataknese wedding login page", async function () {
  await this.loginPage.open(this.frontendUrl("/login"));
});

When("I login with email {string} and password {string}", async function (email, password) {
  await this.loginPage.login(email, password);
});

When("I login with {string} credentials", async function (userKey) {
  const user = getUser(userKey);
  await this.loginPage.login(user.email, user.password);
});

When("I login using {string}", async function (credentialsFile) {
  const user = getUser("validUser", credentialsFile);
  await this.loginPage.login(user.email, user.password);
});

Then("I should see the dashboard", async function () {
  await this.dashboardPage.expectDashboardVisible();
});

Then("I should see login failed message", async function () {
  await this.loginPage.expectInvalidLoginMessageVisible();
});

Then("I should see {string}", async function (result) {
  if (result === "dashboard") {
    await this.dashboardPage.expectDashboardVisible();
    return;
  }

  if (result === "login failed message") {
    await this.loginPage.expectInvalidLoginMessageVisible();
    return;
  }

  throw new Error(`Unsupported login result "${result}". Use "dashboard" or "login failed message".`);
});
