const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class ProjectPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      editProjectButton: () => this.page.getByRole("button", { name: "Edit Info" }),
      saveEditProjectButton: () => this.page.locator('button[type="submit"].btn.btn-primary'),
      editGroomNameProject: () => this.page.locator('input[type="text"][required]').first(),
      textGroomandBrideLabel: () => this.page.locator('h1.page-title'),
      confirmEditProjectButton: () => this.page.locator('.modal .modal-actions button.btn.btn-primary'),
      newProjectButton: () => this.page.getByRole("button", { name: /New Project/i }),
      createProjectButton: () => this.page.getByRole("button", { name: "Create Project" }),
      inProgressProjectCard: () => this.page
        .locator('.card, .card-hover, [class*="card"]')
        .filter({ has: this.page.getByText(/^In Progress$/i) })
        .first()
    };
  }

  async expecteditProjectButtonVisible() {
    await expect(this.elements.editProjectButton()).toBeVisible();
  }

  async saveEditProjectButtonVisible() {
    await expect(this.elements.saveEditProjectButton()).toBeVisible();
  }

  async editGroomNameProjectVisible(){
    await expect(this.elements.editGroomNameProject()).toBeVisible();
  }
  
  async textGroomandBrideLabelVisible(){
    await expect(this.elements.textGroomandBrideLabel()).toBeVisible();
  }

  async expectInProgressProjectCardVisible() {
    await expect(
      this.elements.inProgressProjectCard(),
      "Expected at least one project card with status 'In Progress' on the project overview page."
    ).toBeVisible();
  }

  async openInProgressProject() {
    if (await this.elements.inProgressProjectCard().isVisible().catch(() => false)) {
      await this.elements.inProgressProjectCard().click();
      return;
    }

    await this.createInProgressProject();

    if (await this.elements.editProjectButton().waitFor({ state: "visible", timeout: 15000 }).then(() => true).catch(() => false)) {
      return;
    }

    await this.expectInProgressProjectCardVisible();
    await this.elements.inProgressProjectCard().click();
  }

  async createInProgressProject() {
    const timestamp = Date.now();
    const weddingDate = new Date();
    weddingDate.setDate(weddingDate.getDate() + 30);

    await this.elements.newProjectButton().click();
    await this.page.locator('input[type="text"]').nth(0).fill(`Yosu${timestamp}`);
    await this.page.locator('input[type="text"]').nth(1).fill(`Gaby${timestamp}`);
    await this.page.locator("select").nth(1).selectOption({ label: "Jakarta Pusat" });
    await this.page.locator('input[type="text"]').nth(2).fill("Jakarta Timur");
    await this.page.locator('input[type="date"]').fill(weddingDate.toISOString().slice(0, 10));
    await this.page.locator('input[type="text"]').nth(3).fill("100000000");
    await this.page.locator('input[type="number"]').fill("100");
    await this.page.locator('input[name="eventType"][value="PESTA_ADAT"]').check();
    await this.elements.createProjectButton().click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle").catch(() => undefined);
  }
}
module.exports = ProjectPage;
