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
      categoryTableCard: () => this.page.locator(".card.table-card").filter({
        has: this.page.locator(".table-card-header .section-title", { hasText: "Pesta Adat - Categories" })
      }),
      addCategoryButton: () => this.elements.categoryTableCard().locator(".table-card-header button.btn.btn-primary"),
      categoryModal: () => this.page.locator(".modal").filter({
        has: this.page.locator("h3", { hasText: "Add Category" })
      }),
      categoryNameInput: () => this.elements.categoryModal().locator('input[required][placeholder="Search or type category name..."]'),
      categoryPlannedBudgetInput: () => this.elements.categoryModal().locator('input[placeholder="e.g. 50.000.000"]'),
      saveCategoryButton: () => this.elements.categoryModal().locator('button[type="submit"].btn.btn-primary'),
      categorySuccessModal: () => this.page.locator(".modal").filter({
        has: this.page.locator("h3", { hasText: "Category Added" })
      }),
      categorySuccessOkButton: () => this.elements.categorySuccessModal().locator("button.btn.btn-primary"),
      categoryRow: (categoryName) => this.elements.categoryTableCard().locator("tbody tr").filter({
        has: this.page.locator("td").filter({ hasText: categoryName })
      }),
      vendorRecommendationCard: () => this.page.locator(".vendor-layout .card").filter({
        has: this.page.locator("h3", { hasText: "Vendor Recommendations" })
      }),
      vendorRecommendationSearchInput: () => this.elements.vendorRecommendationCard().locator('input[placeholder="Search vendors..."]'),
      vendorRecommendationResultRow: (vendorName) => this.elements.vendorRecommendationCard().locator("tbody tr").filter({
        has: this.page.locator("td").filter({ hasText: vendorName })
      }),
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
      await expect(this.elements.inProgressProjectCard()).toBeVisible();
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

    await expect(this.elements.newProjectButton()).toBeVisible();
    await this.elements.newProjectButton().click();
    const groomNameInput = this.page.locator('input[type="text"]').nth(0);
    const brideNameInput = this.page.locator('input[type="text"]').nth(1);
    const citySelect = this.page.locator("select").nth(1);
    const addressInput = this.page.locator('input[type="text"]').nth(2);
    const weddingDateInput = this.page.locator('input[type="date"]');
    const budgetInput = this.page.locator('input[type="text"]').nth(3);
    const guestInput = this.page.locator('input[type="number"]');
    const eventTypeInput = this.page.locator('input[name="eventType"][value="PESTA_ADAT"]');

    await expect(groomNameInput).toBeVisible();
    await groomNameInput.fill(`Yosu${timestamp}`);
    await expect(brideNameInput).toBeVisible();
    await brideNameInput.fill(`Gaby${timestamp}`);
    await expect(citySelect).toBeVisible();
    await citySelect.selectOption({ label: "Jakarta Pusat" });
    await expect(addressInput).toBeVisible();
    await addressInput.fill("Jakarta Timur");
    await expect(weddingDateInput).toBeVisible();
    await weddingDateInput.fill(weddingDate.toISOString().slice(0, 10));
    await expect(budgetInput).toBeVisible();
    await budgetInput.fill("100000000");
    await expect(guestInput).toBeVisible();
    await guestInput.fill("100");
    await expect(eventTypeInput).toBeVisible();
    await eventTypeInput.check();
    await expect(this.elements.createProjectButton()).toBeVisible();
    await this.elements.createProjectButton().click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle").catch(() => undefined);
  }

  async addRequiredCategory(categoryName, plannedBudget = "1000000") {
    await expect(this.elements.addCategoryButton()).toBeVisible();
    await this.elements.addCategoryButton().click();
    await expect(this.elements.categoryModal()).toBeVisible();
    await expect(this.elements.categoryNameInput()).toBeVisible();
    await this.elements.categoryNameInput().fill(categoryName);
    await expect(this.elements.categoryPlannedBudgetInput()).toBeVisible();
    await this.elements.categoryPlannedBudgetInput().fill(plannedBudget);
    await expect(this.elements.saveCategoryButton()).toBeVisible();
    await this.elements.saveCategoryButton().click();
    await expect(this.elements.categorySuccessModal()).toBeVisible();
    await expect(this.elements.categorySuccessOkButton()).toBeVisible();
    await this.elements.categorySuccessOkButton().click();
    await expect(this.elements.categorySuccessModal()).toBeHidden();
  }

  async expectCategoryVisible(categoryName) {
    await expect(this.elements.categoryRow(categoryName)).toBeVisible();
  }

  async searchVendorRecommendation(vendorName) {
    await expect(this.elements.vendorRecommendationSearchInput()).toBeVisible();
    await this.elements.vendorRecommendationSearchInput().fill(vendorName);
  }

  async expectVendorRecommendationSearchResult(vendorName) {
    await expect(this.elements.vendorRecommendationResultRow(vendorName)).toBeVisible();
  }
}
module.exports = ProjectPage;
