const { setWorldConstructor, setDefaultTimeout } = require("@cucumber/cucumber");
const config = require("./env");
const BasePage = require("../pages/base_page");
const HomePage = require("../pages/home_page");
const LoginPage = require("../pages/login_page");
const DashboardPage = require("../pages/dashboard_page");

class FrontendWorld {
  constructor({ attach, log }) {
    this.attach = attach;
    this.log = log;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.basePage = null;
    this.homePage = null;
    this.loginPage = null;
    this.dashboardPage = null;
    this.pages = {};
    this.artifactsDir = null;
    this.scenarioName = null;
  }

  setPage(page) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.pages = {
      base: this.basePage,
      home: this.homePage,
      login: this.loginPage,
      dashboard: this.dashboardPage
    };
  }

  frontendUrl(path = "/") {
    return new URL(path, config.baseFeUrl()).toString();
  }
}

setDefaultTimeout(config.defaultTimeout);
setWorldConstructor(FrontendWorld);
