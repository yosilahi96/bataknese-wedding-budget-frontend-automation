# Bataknese Wedding Budget - Frontend Automation

Playwright + Cucumber automation scaffold for testing the Bataknese Wedding Budget frontend.

## Setup

1. Install Node.js.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Install Playwright browsers:
   ```powershell
   npm run install:browsers
   ```
4. Create your local environment file:
   ```powershell
   Copy-Item .env.example .env
   ```
5. Run all scenarios:
   ```powershell
   npm test
   ```

### Execution Helpers (Scripts)
Alternatively, you can run the test suite using the included Batch files:
- `run_all.bat`: Runs all scenarios (`npm test`).
- `run_ui.bat`: Runs only `@ui` tagged scenarios (`npm run test:ui`).
- `run_headed.bat`: Runs tests with the browser visible (`npm run test:headed`).
- `run_debug.bat`: Runs tests in Playwright debug mode (`npm run test:debug`).

## Directory Structure

- `features/ui/`: Gherkin UI feature files.
  - `login.feature`: Scenarios testing the login flow with valid/invalid credentials.
  - `logout.feature`: Scenario for user logout.
  - `vendor.feature`: Scenarios for viewing vendor list and details.
- `features/step_definitions/`: Cucumber step implementations.
  - `home_steps.js`: Step definitions related to the landing page.
  - `login_steps.js`: Step definitions for login, logout, and dashboard verification.
  - `ui_steps.js`: Generic/reusable step definitions (visiting pages, clicking, filling forms, assertions).
  - `vendor_steps.js`: Step definitions for navigating and viewing vendors.
- `features/pages/`: Page Object Model (POM) classes.
  - `base_page.js`: Common utility actions and assertions (e.g., clicks, fills, checks, waits).
  - `home_page.js`: Selectors and methods for the Home page.
  - `login_page.js`: Selectors and methods for the Login page.
  - `dashboard_page.js`: Selectors and methods for the Dashboard page.
  - `vendor_page.js`: Selectors and methods for the Vendor list/details page.
- `features/support/`: Environment bootstrap and lifecycle configuration.
  - `env.js`: Reads environment variables from `.env` with fallback values.
  - `world.js`: Cucumber world constructor, instantiating the browser page and POMs.
  - `hooks.js`: `Before` and `After` hooks setting up Playwright contexts, tracing, and cleanup.
  - `artifacts.js`: Utility functions for managing test artifacts (screenshots, traces, videos).
  - `credentials.js`: Utility for loading JSON credentials dynamically.
- `config/`: JSON configuration files.
  - `credentials.example.json`: Schema example for user credentials.
  - `credentials_login_valid.json`: Valid user login credentials.
  - `credentials_login_invalid.json`: Invalid/incorrect credentials for testing failure scenarios.
- `reports/`: HTML and JSON Cucumber reports generated after a run.
- `test-results/`: Output folder for failure screenshots, videos, and trace files.
- `cucumber.js`: Cucumber configuration profiles.

## Environment Configuration

Copy `.env.example` to `.env` and configure the variables:

| Variable | Default | Description |
| --- | --- | --- |
| `BASE_FE_URL` | `https://example.com` | Application base URL. |
| `BROWSER` | `chromium` | Browser engine: `chromium`, `firefox`, or `webkit`. |
| `HEADLESS` | `true` | Set `false` to show the browser. |
| `DEFAULT_TIMEOUT` | `60000` | Playwright action/navigation timeout in milliseconds. |
| `VIEWPORT_WIDTH` | `1440` | Browser viewport width. |
| `VIEWPORT_HEIGHT` | `900` | Browser viewport height. |
| `SLOW_MO` | `0` | Slow Playwright actions by milliseconds. |
| `IGNORE_HTTPS_ERRORS` | `false` | Ignore invalid local/test SSL certificates. |
| `SCREENSHOT` | `only-on-failure` | Capture screenshots: `on`, `off`, `only-on-failure`. |
| `VIDEO` | `off` | Record browser video: `on`, `off`, `retain-on-failure`. |
| `TRACE` | `retain-on-failure` | Record Playwright traces: `on`, `off`, `retain-on-failure`. |

## Login Credentials

Instead of hardcoded login credentials or single-use environment variables, credentials can be loaded dynamically from JSON files inside the `config/` directory:

1. Under `config/`, you have files like `credentials_login_valid.json`:
   ```json
   {
     "validUser": {
       "email": "xxxx@gmail.com",
       "password": "xxx"
     }
   }
   ```
2. In Gherkin features, you can pass the file name directly:
   ```gherkin
   When I login using "credentials_login_valid.json"
   ```
   Or require a pre-authenticated session:
   ```gherkin
   Given I am logged in using "credentials_login_valid.json"
   ```

## Page Object Model (POM)

Page Object Models inherit from `BasePage` (defined in `features/pages/base_page.js`). Place element locators in the `this.elements` object as functions returning Playwright locators, and write semantic actions/assertions as methods.

Example:
```javascript
const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      emailInput: () => this.page.getByPlaceholder("your@email.com"),
      passwordInput: () => this.page.getByPlaceholder("Enter your secure password"),
      signInButton: () => this.page.getByRole("button", { name: "Sign In to Dashboard" }),
      invalidLoginMessage: () => this.page.getByText("Invalid email or password", { exact: true })
    };
  }

  async open(url) {
    await this.goto(url);
  }

  async login(email, password) {
    await this.elements.emailInput().fill(email);
    await this.elements.passwordInput().fill(password);
    await this.elements.signInButton().click();
  }

  async expectInvalidLoginMessageVisible() {
    await expect(this.page).toHaveURL(/\/login/i);
    await expect(this.elements.invalidLoginMessage()).toBeVisible();
  }
}

module.exports = LoginPage;
```

These POMs are registered and associated with the Cucumber context in `features/support/world.js`:
```javascript
setPage(page) {
  this.page = page;
  this.basePage = new BasePage(page);
  this.homePage = new HomePage(page);
  this.loginPage = new LoginPage(page);
  this.dashboardPage = new DashboardPage(page);
  this.vendorPage = new VendorPage(page);
  // ...
}
```

## Available Gherkin Steps

### Reusable UI Navigation & Form Steps (`features/step_definitions/ui_steps.js`)
- `Given I open the frontend home page`
- `When I visit {string}` (resolves paths relative to `BASE_FE_URL` unless starting with `http`)
- `When I click the {string} button` (locates by role `button`)
- `When I click the {string} link` (locates by role `link`)
- `When I click text {string}`
- `When I fill {string} with {string}` (locates input by label)
- `When I select {string} from {string}` (locates dropdown by label)
- `When I check {string}` (locates checkbox by label)
- `When I wait for the page to finish loading`
- `Then the page title should contain {string}`
- `Then the page url should contain {string}`
- `Then the page should contain {string}`
- `Then the page should not contain {string}`

### Login/Logout Steps (`features/step_definitions/login_steps.js`)
- `Given I open the Bataknese wedding login page`
- `When I login with email {string} and password {string}`
- `When I login with {string} credentials` (loads user key from default `credentials.json`)
- `When I login using {string}` (loads `validUser` from the specified JSON file in `config/`)
- `Given I am logged in using {string}` (performs login using specific credentials file and asserts dashboard visibility)
- `Then I should see the dashboard`
- `Then I should see login failed message`
- `Then I able to logout`
- `Then I should see {string}` (asserts `"dashboard"` or `"login failed message"`)

### Home Page Steps (`features/step_definitions/home_steps.js`)
- `Then the home page title should contain {string}`
- `Then the home page should show {string}`

### Vendor Page Steps (`features/step_definitions/vendor_steps.js`)
- `When I able to access vendor page`
- `Then I should see list of vendor`
- `Then I should see vendor details`
