# Bataknese Wedding Budget - Frontend Automation

Playwright + Cucumber automation for the Bataknese Wedding Budget frontend.

The suite covers UI scenarios for authentication, vendor browsing/filtering, project lifecycle (edit, delete, finalize, export), categories, pagination, vendor recommendations (search, filters, sort), vendor comparison, and vendor selection.

## Tech Stack

- Node.js 20+
- Cucumber.js with Gherkin feature files
- Playwright for browser automation and assertions
- Page Object Model under `features/pages/`
- Jenkins pipeline support via `Jenkinsfile`

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

5. Add local credential JSON files under `config/` (see [Credentials](#credentials)). Use the committed example as the shape only.

## Running Tests

Run all feature files:

```powershell
npm test
```

Run only UI-tagged scenarios (`@ui`):

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

Clean report and artifact folders without running tests:

```powershell
npm run clean:results
```

Windows PowerShell helpers under `scripts/`:

| Script | Equivalent |
| --- | --- |
| `scripts/run_all.ps1` | `npm test` |
| `scripts/run_ui.ps1` | `npm run test:ui` |
| `scripts/run_headed.ps1` | `npm run test:headed` |
| `scripts/run_debug.ps1` | `npm run test:debug` |

Each test run clears `reports/` and `test-results/` first (`clean:results`).

## Test Coverage

Feature files live in `features/ui/`. The UI profile in `cucumber.js` runs `features/ui/**/*.feature` with the `@ui` tag.

| Feature file | Tags | Coverage |
| --- | --- | --- |
| `login.feature` | `@ui` `@login` | Login with valid and invalid credential files (Scenario Outline) |
| `logout.feature` | `@ui` `@logout` | Logout from an authenticated session |
| `vendor.feature` | `@ui` `@vendor_user` | Vendor list, vendor details, category filter, Batak specialist filter |
| `project.feature` | `@ui` `@project` | Edit project info; delete; finalize; export budget as PDF/Excel |
| `category.feature` | `@ui` `@project` `@category` | Add a project category |
| `project-pagination.feature` | `@ui` `@project_pagination` | Project list pagination button states |
| `vendor-recommendation.feature` | `@ui` `@project` `@vendor_recommendation` | Search vendor recommendations |
| `vendor-recommendation-area.feature` | `@ui` `@project` `@vendor_recommendation_filter` | Filter/sort recommendations by area, price, capacity |
| `project-vendor-comparison.feature` | `@ui` `@project` `@vendor-comparison` | Compare up to three vendor recommendations |
| `project-vendor-selection.feature` | `@ui` `@project` `@vendor-selection` | Select and remove a recommended vendor |

## Environment Configuration

Copy `.env.example` to `.env` and adjust values for local execution. Do not commit `.env` (it is gitignored).

| Variable | Default | Description |
| --- | --- | --- |
| `BASE_FE_URL` | `https://example.com` | Frontend base URL under test. |
| `PROJECT_DETAIL_PATH` | _(empty)_ | Optional relative path to a project detail page when a step needs a fixed project URL. |
| `BROWSER` | `chromium` | Browser engine: `chromium`, `firefox`, or `webkit`. |
| `HEADLESS` | `true` | Run browser headlessly when `true`. |
| `DEFAULT_TIMEOUT` | `60000` | Playwright and Cucumber timeout in milliseconds. |
| `VIEWPORT_WIDTH` | `1440` | Browser viewport width. |
| `VIEWPORT_HEIGHT` | `900` | Browser viewport height. |
| `SLOW_MO` | `0` | Slow Playwright actions by this many milliseconds. |
| `IGNORE_HTTPS_ERRORS` | `false` | Ignore invalid HTTPS certificates. |
| `SCREENSHOT` | `only-on-failure` | Screenshot mode: `on`, `off`, or `only-on-failure`. |
| `VIDEO` | `off` | Video mode: `on`, `off`, or `retain-on-failure`. |
| `TRACE` | `retain-on-failure` | Trace mode: `on`, `off`, or `retain-on-failure`. |

Configuration is loaded in `features/support/env.js` via `dotenv`.

## Credentials

Credentials are loaded from JSON files in `config/` by `features/support/credentials.js`. Each user entry must include `email` and `password`.

**Do not put real passwords, tokens, or production secrets in the README, feature files, or committed examples.** Keep real credential files local. Prefer gitignoring anything that holds live accounts.

Shape (see `config/credentials.example.json`):

```json
{
  "validUser": {
    "email": "your-email@example.com",
    "password": "your-password"
  }
}
```

Feature files reference credential **file names** only (not raw secrets):

```gherkin
When I login using "credentials_login_valid.json"
Given I am logged in using "credentials_login_valid.json"
Given I am on project overview using "credentials_login_valid.json"
```

Expected local files (create from the example; names match feature usage):

- `config/credentials_login_valid.json` — valid account for authenticated scenarios
- `config/credentials_login_invalid.json` — intentionally invalid credentials for negative login

`config/credentials.json` is also supported as the default file name when a step does not pass a file name. That path is listed in `.gitignore`.

## Project Structure

```text
fe-automation/
├── config/                      # Credential JSON files and examples
├── features/
│   ├── ui/                      # Gherkin feature files
│   ├── pages/                   # Page Object Model (CSS locators)
│   ├── step_definitions/        # Cucumber step implementations
│   └── support/                 # World, hooks, env, credentials, artifacts
├── scripts/                     # PowerShell runners + clean-results.js
├── reports/                     # Generated Cucumber HTML/JSON (cleaned each run)
├── test-results/                # Screenshots, traces, videos (cleaned each run)
├── cucumber.js                  # Default and UI Cucumber profiles
├── Jenkinsfile                  # CI pipeline
├── package.json
└── .env.example                 # Sample environment variables
```

### Page objects

Registered in `features/support/world.js`:

| World property | Class |
| --- | --- |
| `this.basePage` | `BasePage` |
| `this.homePage` | `HomePage` |
| `this.loginPage` | `LoginPage` |
| `this.dashboardPage` | `DashboardPage` |
| `this.vendorPage` | `VendorPage` |
| `this.projectPage` | `ProjectPage` |

Each page class exposes semantic methods and an `elements` object with Playwright locators (CSS). Step definitions should use page objects instead of duplicating selectors.

### Support modules

| File | Role |
| --- | --- |
| `features/support/world.js` | Cucumber world + page object wiring |
| `features/support/hooks.js` | Browser lifecycle and failure artifacts |
| `features/support/env.js` | Environment variable loading |
| `features/support/credentials.js` | Credential file resolution and validation |
| `features/support/artifacts.js` | Screenshot / video / trace helpers |

## Available Steps

### Generic UI (`ui_steps.js`)

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

### Login / session (`login_steps.js`)

- `Given I open the Bataknese wedding login page`
- `When I login with email {string} and password {string}`
- `When I login with {string} credentials`
- `When I login using {string}`
- `Given I am logged in using {string}`
- `Given I am on project overview using {string}`
- `Given I am on the project detail page using {string}`
- `Given I am on a new project detail page using {string}`
- `Given I am on an existing project detail page using {string}`
- `Then I should see the dashboard`
- `Then I should see login failed message`
- `Then I able to logout`
- `Then I should see {string}`

### Home (`home_steps.js`)

- `Then the home page title should contain {string}`
- `Then the home page should show {string}`

### Vendor (`vendor_steps.js`)

- `When I able to access vendor page`
- `When I navigate to vendor directory page`
- `Then I should see list of vendor`
- `Then I should see vendor details`
- `Then I should able to filter vendor by {string}`
- `When I check {string} vendor filter`
- `Then I wait until vendor list is filtered by {string}`
- `Then I should see only {string} vendors in the list`

### Project list / pagination (`pagination_steps.js`)

- `Given I am on the project list page`
- `Then I verify the {string} pagination button is disabled`
- `When I go to the latest page of the project list`

### Project (`project_steps.js`)

- `When I see edit project information`
- `When I open an existing project detail page`
- `Then I edit the project information`
- `Then I verify the project information changes`
- `When I create a project for deletion`
- `When I delete the created project`
- `Then I verify the created project is not found in the project list search`
- `When I create a project for finalization`
- `When I finalize the created project`
- `Then I verify the created project status is finalized in the project list search`
- `When I add a category with the required field`
- `Then I verify the category was made on the list`
- `When I search vendor recommendation {string}`
- `Then I verify the vendor recommendation search result matched`
- `When I choose {int} vendor recommendations to compare`
- `When I try to choose another vendor recommendation to compare`
- `Then I verify only {int} vendor recommendations can be compared`
- `When I open the vendor comparison`
- `Then I verify the vendor comparison shows {int} vendors`
- `Then I verify the most budget friendly vendor is green highlighted`
- `When I filter vendor recommendations by each available area`
- `Then I verify each vendor recommendation area filter result matched`
- `When I filter vendor recommendations by area {string}`
- `Then I verify vendor recommendation area filter result matched for {string}`
- `When I filter vendor recommendations by each available price`
- `Then I verify each vendor recommendation price filter result matched`
- `When I filter vendor recommendations by price {string}`
- `Then I verify vendor recommendation price filter result matched for {string}`
- `When I sort vendor recommendations by price {string}`
- `Then I verify vendor recommendations are sorted by price {string}`
- `When I filter vendor recommendations by each available capacity`
- `Then I verify each vendor recommendation capacity filter result matched`
- `When I filter vendor recommendations by capacity {string}`
- `Then I verify vendor recommendation capacity filter result matched for {string}`
- `When I select a vendor recommendation`
- `Then I verify the vendor has been selected`
- `When I remove the selected vendor`
- `Then I verify the selected vendor has been removed`
- `When I export the project budget as {string}`
- `Then I verify the downloaded {string} budget file is correct`

## Reports and Artifacts

Cucumber writes reports to:

- `reports/cucumber-report.html`
- `reports/cucumber-report.json`

Playwright artifacts are stored under `test-results/`. Screenshots, videos, and traces follow the `SCREENSHOT`, `VIDEO`, and `TRACE` settings.

Both folders are cleaned at the start of each `npm test` / `test:ui` / `test:headed` / `test:debug` run.

## Jenkins

The `Jenkinsfile` pipeline:

1. Checks out the repository.
2. Uses the configured `NodeJS 20` tool.
3. Installs dependencies with `npm ci`.
4. Installs Chromium with `npx playwright install chromium`.
5. Runs `npm run test:ui` with pipeline environment variables (`BASE_FE_URL`, `BROWSER`, `HEADLESS`, artifact modes).
6. Archives `reports/**` and `test-results/**`.
7. Publishes `reports/cucumber-report.html` as the Cucumber Test Report.

Supply credentials and any secrets through Jenkins credentials or secure environment injection — not hard-coded in feature files or documentation.

## Security Notes

- Never commit real passwords, API keys, session tokens, or private keys.
- Keep `.env` and live credential JSON out of version control; use placeholders in examples only.
- Prefer referencing credential **file names** in Gherkin, not email/password values.
- Screenshots and videos in `test-results/` may capture UI data; treat them as sensitive when sharing or archiving.
- This suite is intended to run against production-like environments; avoid destructive test data patterns that harm real users when sharing setup instructions.
