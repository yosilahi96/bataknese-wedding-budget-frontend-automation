const { Given, When, Then } = require("@cucumber/cucumber");
const { getUser } = require("../support/credentials");

async function loginToDashboard(world, credentialsFile) {
  const user = getUser("validUser", credentialsFile);

  await world.loginPage.open(world.frontendUrl("/login"));
  await world.loginPage.login(user.email, user.password);
  await world.dashboardPage.expectDashboardVisible();
}

async function openConfiguredProjectDetail(world) {
  const projectDetailPath = process.env.PROJECT_DETAIL_PATH;

  if (projectDetailPath) {
    await world.basePage.goto(world.frontendUrl(projectDetailPath));
  } else {
    await world.projectPage.openExistingInProgressProject();
  }

  await world.projectPage.textGroomandBrideLabelVisible();
}

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

Given("I am logged in using {string}", async function (credentialsFile) {
  await loginToDashboard(this, credentialsFile);
});

Given("I am on project overview using {string}", async function (credentialsFile) {
  await loginToDashboard(this, credentialsFile);
  await this.projectPage.openExistingInProgressProject();
});

Given("I am on the project detail page using {string}", async function (credentialsFile) {
  const projectDetailPath = process.env.PROJECT_DETAIL_PATH;

  await loginToDashboard(this, credentialsFile);

  if (projectDetailPath) {
    await this.basePage.goto(this.frontendUrl(projectDetailPath));
  } else {
    await this.projectPage.openExistingInProgressProject();
  }

  await this.projectPage.textGroomandBrideLabelVisible();
});

Given("I am on a new project detail page using {string}", async function (credentialsFile) {
  await loginToDashboard(this, credentialsFile);
  await this.projectPage.createAndOpenNewInProgressProject();
  await this.projectPage.textGroomandBrideLabelVisible();
});

Given("I am on an existing project detail page using {string}", async function (credentialsFile) {
  await loginToDashboard(this, credentialsFile);
  await openConfiguredProjectDetail(this);
});

Then("I should see the dashboard", async function () {
  await this.dashboardPage.expectDashboardVisible();
});

Then("I should see login failed message", async function () {
  await this.loginPage.expectInvalidLoginMessageVisible();
});

Then("I able to logout", async function () {
  await this.dashboardPage.expectDashboardVisible();
  await this.dashboardPage.elements.logoutButton().click();
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
