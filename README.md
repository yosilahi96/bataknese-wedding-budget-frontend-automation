# Frontend Automation Base

Playwright + Cucumber automation scaffold for frontend tests written in Gherkin.

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

Run only UI tagged scenarios:

```powershell
npm run test:ui
```

Run with the browser visible:

```powershell
npm run test:headed
```

Run with Playwright debug mode:

```powershell
npm run test:debug
```

## Structure

- `features/ui/*.feature`: Gherkin UI scenarios.
- `features/step_definitions/*_steps.js`: Cucumber step implementations.
- `features/step_definitions/home_steps.js`: sample page-specific steps that call the Home POM.
- `features/step_definitions/login_steps.js`: sample login flow steps using Login and Dashboard POMs.
- `features/support/env.js`: environment bootstrapping.
- `features/support/world.js`: shared Playwright browser/page state.
- `features/support/hooks.js`: browser lifecycle and failure screenshots.
- `features/support/artifacts.js`: report artifact helpers.
- `features/pages/base_page.js`: reusable page actions/assertions.
- `features/pages/*_page.js`: Page Object Model classes and element locators.
- `config/credentials.json`: local login credentials used by credential-based steps.
- `config/credentials.example.json`: example credential file shape.
- `reports/`: generated Cucumber HTML and JSON reports.
- `test-results/`: screenshots, traces, and videos.

## Environment

Copy `.env.example` to `.env`, then change values as needed.

| Variable | Default | Description |
| --- | --- | --- |
| `BASE_FE_URL` | `https://example.com` | Application base URL. |
| `BROWSER` | `chromium` | Browser engine: `chromium`, `firefox`, or `webkit`. |
| `HEADLESS` | `true` | Set `false` to show the browser. |
| `DEFAULT_TIMEOUT` | `10000` | Cucumber step timeout in milliseconds. |
| `VIEWPORT_WIDTH` | `1440` | Browser viewport width. |
| `VIEWPORT_HEIGHT` | `900` | Browser viewport height. |
| `SLOW_MO` | `0` | Slow Playwright actions by milliseconds. |
| `IGNORE_HTTPS_ERRORS` | `false` | Allow invalid local/test certificates. |
| `SCREENSHOT` | `only-on-failure` | Use `on`, `off`, or `only-on-failure`. |
| `VIDEO` | `off` | Use `on`, `off`, or `retain-on-failure`. |
| `TRACE` | `retain-on-failure` | Use `on`, `off`, or `retain-on-failure`. |

## Adding A New UI Scenario

Create or update a `.feature` file:

```gherkin
@ui
Scenario: Open the home page
  Given I open the frontend home page
  Then the page title should contain "Example"
  And the page should contain "Example Domain"
```

Use `BASE_FE_URL` in `.env` to point scenarios at your application.

## Login Credentials

Copy the example credential file:

```powershell
Copy-Item config/credentials.example.json config/credentials.json
```

Then update `config/credentials.json`:

```json
{
  "validUser": {
    "email": "yosilahi10@gmail.com",
    "password": "yosua123"
  }
}
```

Use it in Gherkin:

```gherkin
When I login with "validUser" credentials
```

## Page Object Model

Each page should have its own file in `features/pages/`. Store page elements in the `elements` object, then expose page actions and assertions as methods.

Example:

```javascript
const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      emailInput: () => this.page.getByLabel("Email"),
      passwordInput: () => this.page.getByLabel("Password"),
      loginButton: () => this.page.getByRole("button", { name: "Login" }),
      errorMessage: () => this.page.getByText("Invalid email or password")
    };
  }

  async login(email, password) {
    await this.elements.emailInput().fill(email);
    await this.elements.passwordInput().fill(password);
    await this.elements.loginButton().click();
  }

  async expectLoginErrorVisible() {
    await expect(this.elements.errorMessage()).toBeVisible();
  }
}

module.exports = LoginPage;
```

Register the page in `features/support/world.js`:

```javascript
const LoginPage = require("../pages/login_page");

this.loginPage = new LoginPage(page);
this.pages.login = this.loginPage;
```

Then call page methods from step definitions:

```javascript
When("I login with email {string} and password {string}", async function (email, password) {
  await this.loginPage.login(email, password);
});
```

## Common Gherkin Steps

```gherkin
Given I open the frontend home page
When I visit "/login"
When I click the "Submit" button
When I click the "Forgot password" link
When I click text "Profile"
When I fill "Email" with "user@example.com"
When I select "Indonesia" from "Country"
When I check "Remember me"
When I wait for the page to finish loading
Then the page title should contain "Dashboard"
Then the page url should contain "/dashboard"
Then the page should contain "Welcome"
Then the page should not contain "Invalid password"
```

For application-specific flows, create a page object in `features/pages/` and thin steps in `features/step_definitions/`.
