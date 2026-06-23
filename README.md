# Bataknese Wedding Budget - Frontend Automation

Playwright + Cucumber automation for the Bataknese Wedding Budget frontend.

The suite currently covers UI scenarios for login, logout, vendor browsing and filtering, and project information editing.

## Tech Stack

- Node.js
- Cucumber.js with Gherkin feature files
- Playwright for browser automation and assertions
- Page Object Model classes under `features/pages/`
- Jenkins pipeline support through `Jenkinsfile`

## Setup

1. Install Node.js 20 or newer.
2. Install project dependencies:

   ```powershell
   npm install
   ```

3. Install Playwright browsers:

   ```powershell
   npm run install:browsers
   ```

4. Create a local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

5. Add local credential JSON files under `config/` if needed. The committed examples show the expected shape.

## Running Tests

Run all feature files:

```powershell
npm test
```

Run only UI-tagged scenarios:

```powershell
npm run test:ui
```

Run UI scenarios with a visible browser:

```powershell
npm run test:headed
```

Run UI scenarios in Playwright debug mode:

```powershell
npm run test:debug
```

The repository also includes Windows helpers:

- `run_all.bat` / `scripts/run_all.ps1`: runs `npm test`
- `run_ui.bat` / `scripts/run_ui.ps1`: runs `npm run test:ui`
- `run_headed.bat` / `scripts/run_headed.ps1`: runs `npm run test:headed`
- `run_debug.bat` / `scripts/run_debug.ps1`: runs `npm run test:debug`

## Test Coverage

Feature files live in `features/ui/`:

- `login.feature`: validates login behavior for valid and invalid credential files.
- `logout.feature`: validates logout from an authenticated session.
- `vendor.feature`: validates vendor page access, vendor detail viewing, and category filtering for venue, catering, and gondang.
- `project.feature`: validates editing project information and verifying the updated project title.

The UI profile in `cucumber.js` runs `features/ui/**/*.feature` with the `@ui` tag.

## Environment Configuration

Copy `.env.example` to `.env` and adjust values for local execution.

| Variable | Default in Code | Example Value | Description |
| --- | --- | --- | --- |
| `BASE_FE_URL` | `https://example.com` | `https://bataknese-wedding-budget.vercel.app` | Frontend base URL. |
| `BROWSER` | `chromium` | `chromium` | Browser engine: `chromium`, `firefox`, or `webkit`. |
| `HEADLESS` | `true` | `false` | Run browser headlessly when `true`. |
| `DEFAULT_TIMEOUT` | `60000` | `60000` | Playwright and Cucumber timeout in milliseconds. |
| `VIEWPORT_WIDTH` | `1440` | `1440` | Browser viewport width. |
| `VIEWPORT_HEIGHT` | `900` | `900` | Browser viewport height. |
| `SLOW_MO` | `0` | `0` | Slow Playwright actions by this many milliseconds. |
| `IGNORE_HTTPS_ERRORS` | `false` | `false` | Ignore invalid HTTPS certificates. |
| `SCREENSHOT` | `only-on-failure` | `only-on-failure` | Screenshot mode: `on`, `off`, or `only-on-failure`. |
| `VIDEO` | `off` | `off` | Video mode: `on`, `off`, or `retain-on-failure`. |
| `TRACE` | `retain-on-failure` | `retain-on-failure` | Trace mode: `on`, `off`, or `retain-on-failure`. |

## Credentials

Credentials are loaded from JSON files in `config/`.

Example:

```json
{
  "validUser": {
    "email": "user@example.com",
    "password": "password"
  }
}
```

Feature files pass credential file names directly:

```gherkin
When I login using "credentials_login_valid.json"
Given I am logged in using "credentials_login_valid.json"
Given I am on project overview using "credentials_login_valid.json"
```

`features/support/credentials.js` resolves credential files from `config/` and requires each user entry to include `email` and `password`.

## Project Structure

- `features/ui/`: Cucumber feature files for browser UI scenarios.
- `features/step_definitions/`: Step implementations used by the feature files.
- `features/pages/`: Page Object Model classes for home, login, dashboard, vendor, project, and shared base behavior.
- `features/support/`: Cucumber world, hooks, environment loading, credential loading, and artifact utilities.
- `config/`: Credential JSON files and examples.
- `reports/`: Generated Cucumber HTML and JSON reports.
- `test-results/`: Screenshots, traces, and videos produced by failed or configured runs.
- `scripts/`: PowerShell wrappers for common test commands.
- `cucumber.js`: Cucumber default and UI profiles.
- `Jenkinsfile`: CI pipeline for installing dependencies, installing Chromium, running UI tests, and publishing reports.

## Page Objects

Page objects are registered in `features/support/world.js`:

- `this.basePage`
- `this.homePage`
- `this.loginPage`
- `this.dashboardPage`
- `this.vendorPage`
- `this.projectPage`

Each page class exposes semantic methods and an `elements` object with Playwright locators. Step definitions should use these page objects instead of duplicating selectors.

## Available Steps

Reusable UI steps:

- `Given I open the frontend home page`
- `When I visit {string}`
- `When I click the {string} button`
- `When I click the {string} link`
- `When I click text {string}`
- `When I fill {string} with {string}`
- `When I select {string} from {string}`
- `When I check {string}`
- `When I wait for the page to finish loading`
- `Then the page title should contain {string}`
- `Then the page url should contain {string}`
- `Then the page should contain {string}`
- `Then the page should not contain {string}`

Login, logout, and authenticated navigation steps:

- `Given I open the Bataknese wedding login page`
- `When I login with email {string} and password {string}`
- `When I login with {string} credentials`
- `When I login using {string}`
- `Given I am logged in using {string}`
- `Given I am on project overview using {string}`
- `Then I should see the dashboard`
- `Then I should see login failed message`
- `Then I able to logout`
- `Then I should see {string}`

Home page steps:

- `Then the home page title should contain {string}`
- `Then the home page should show {string}`

Vendor page steps:

- `When I able to access vendor page`
- `Then I should see list of vendor`
- `Then I should see vendor details`
- `Then I should able to filter vendor by {string}`

Project page steps:

- `When I see edit project information`
- `Then I edit the project information`
- `Then I verify the project information changes`

## Reports and Artifacts

Cucumber writes reports to:

- `reports/cucumber-report.html`
- `reports/cucumber-report.json`

Playwright artifacts are stored under `test-results/`. Screenshots, videos, and traces are kept based on the `SCREENSHOT`, `VIDEO`, and `TRACE` environment settings.

## Jenkins

The Jenkins pipeline:

1. Uses the configured `NodeJS 20` tool.
2. Installs dependencies with `npm ci`.
3. Installs Chromium with `npx playwright install chromium`.
4. Runs `npm run test:ui`.
5. Archives `reports/**` and `test-results/**`.
6. Publishes `reports/cucumber-report.html` as the Cucumber Test Report.
