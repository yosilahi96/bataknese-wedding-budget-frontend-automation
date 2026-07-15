const { expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const BasePage = require("./base_page");
const config = require("../support/env");

class ProjectPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      editProjectButton: () => this.page.getByRole("button", { name: "Edit Info" }),
      saveEditProjectButton: () => this.page.locator('button[type="submit"].btn.btn-primary'),
      editGroomNameProject: () => this.page.locator('input[type="text"][required]').first(),
      textGroomandBrideLabel: () => this.page.locator('h1.page-title'),
      exportPdfButton: () => this.page.locator("button.btn.btn-outline.btn-sm").filter({ hasText: /^PDF$/i }),
      exportExcelButton: () => this.page.locator("button.btn.btn-outline.btn-sm").filter({ hasText: /^Excel$/i }),
      confirmEditProjectButton: () => this.page.locator('.modal .modal-actions button.btn.btn-primary'),
      newProjectButton: () => this.page.getByRole("button", { name: /New Project/i }),
      createProjectButton: () => this.page.getByRole("button", { name: "Create Project" }),
      eventTypeRadio: (eventTypeValue) => this.page.locator(`input[name="eventType"][value="${eventTypeValue}"]`),
      projectTypeStatLabel: (typePattern) => this.page.locator(".stat-card .stat-label").filter({
        hasText: typePattern
      }).first(),
      projectTypeSectionTitle: (typeLabel) => this.page.locator("h3.section-title").filter({
        hasText: typeLabel
      }).first(),
      projectSearchInput: () => this.page.locator('input[type="search"]').first(),
      projectCardByName: (projectName) => this.page.locator(".card.card-hover").filter({
        hasText: projectName
      }),
      deleteProjectButton: () => this.page.locator("button.btn.btn-danger.btn-sm").filter({
        hasText: /^Delete$/i
      }).first(),
      confirmDeleteProjectButton: () => this.page.locator(".modal:visible button.btn.btn-danger").filter({
        hasText: /^Delete Project$/i
      }),
      finalizeProjectButton: () => this.page.locator("button.btn.btn-primary.btn-sm").filter({
        hasText: /^Finalize$/i
      }),
      confirmFinalizeProjectButton: () => this.page.locator(".modal:visible button.btn.btn-primary").filter({
        hasText: /^Finalize$/i
      }),
      finalizedProjectStatus: () => this.page.locator(".status-badge, .badge, span, div").filter({
        hasText: /^Finalized$/i
      }).first(),
      projectFinalizedOkButton: () => this.page.locator(".modal:visible button.btn.btn-primary").filter({
        hasText: /^OK$/i
      }),
      // Works for both "Pesta Adat - Categories" and "3M Ceremony - Categories"
      categoryTableCard: () => this.page.locator(".card.table-card").filter({
        has: this.page.locator(".table-card-header .section-title").filter({ hasText: /Categories/i })
      }).first(),
      addCategoryButton: () => this.elements.categoryTableCard().locator(".table-card-header button.btn.btn-primary").filter({
        hasText: /Add Category/i
      }),
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
      vendorRecommendationAreaDropdown: () => this.elements.vendorRecommendationCard().locator("select").filter({
        has: this.page.locator("option", { hasText: /area|jakarta/i })
      }).first(),
      vendorRecommendationPriceDropdown: () => this.elements.vendorRecommendationCard().locator("select").filter({
        has: this.page.locator("option", { hasText: /rp|idr|budget|under|below|above|juta|million|\d+\s*m\b/i })
      }).first(),
      vendorRecommendationPriceSortDropdown: () => this.elements.vendorRecommendationCard().locator("select").filter({
        has: this.page.locator("option", { hasText: /low\s*to\s*high|high\s*to\s*low|lowest|highest|ascending|descending|termurah|termahal/i })
      }).first(),
      vendorRecommendationCapacityDropdown: () => this.elements.vendorRecommendationCard().locator("select").filter({
        has: this.page.locator("option", { hasText: /capacity|kapasitas|guest|guests|pax|orang|people/i })
      }).first(),
      vendorRecommendationRows: () => this.elements.vendorRecommendationCard().locator("tbody tr"),
      vendorRecommendationSelectRows: () => this.elements.vendorRecommendationCard().locator("tbody tr").filter({
        has: this.page.locator("button.btn.btn-primary:not(:disabled)").filter({ hasText: /^Select$/i })
      }),
      vendorRecommendationEmptyState: () => this.elements.vendorRecommendationCard().locator(".empty-state, .no-results, p, div").filter({
        hasText: /no vendors found/i
      }).first(),
      vendorRecommendationResultRow: (vendorName) => this.elements.vendorRecommendationCard().locator("tbody tr").filter({
        has: this.page.locator("td").filter({ hasText: vendorName })
      }),
      vendorRecommendationSelectButton: (vendorName) => this.elements.vendorRecommendationResultRow(vendorName).locator("button.btn.btn-primary:not(:disabled)").filter({ hasText: /^Select$/i }).first(),
      vendorRecommendationCompareRows: () => this.elements.vendorRecommendationRows().filter({
        has: this.page.locator("button").filter({ hasText: /^Compare$/i })
      }),
      vendorRecommendationUnselectCompareButtons: () => this.elements.vendorRecommendationCard().locator("tbody tr button").filter({
        hasText: /^Unselect$/i
      }),
      vendorRecommendationOpenComparisonButton: () => this.elements.vendorRecommendationCard().getByRole("button", {
        name: /^Compare \(\d+\)$/i
      }),
      vendorComparisonModal: () => this.page.locator(".modal:visible").filter({
        has: this.page.locator("h3", { hasText: "Vendor Comparison" })
      }).first(),
      vendorComparisonTable: () => this.elements.vendorComparisonModal().locator("table"),
      vendorComparisonHeaders: () => this.elements.vendorComparisonTable().locator("thead th").filter({
        hasText: /[A-Za-z]/
      }),
      vendorComparisonBestValueCells: () => this.elements.vendorComparisonTable().locator("td.best-value"),
      vendorComparisonBudgetFriendlyVendor: () => this.elements.vendorComparisonModal().locator("strong").first(),
      vendorComparisonCloseButton: () => this.elements.vendorComparisonModal().getByRole("button", { name: /^Close$/i }),
      vendorSelectedModal: () => this.page.locator(".modal", { hasText: "Vendor Selected" }),
      vendorSelectedModalOkButton: () => this.elements.vendorSelectedModal().getByRole("button", { name: /^OK$/i }),
      vendorSelectionErrorModal: () => this.page.locator(".modal").filter({
        hasText: /error|failed|unable|cannot|already|gagal|tidak bisa/i
      }).first(),
      visibleModalActionButton: () => this.page.locator(".modal:visible").getByRole("button", {
        name: /^(OK|Ok|Close|Cancel|Tutup)$/i
      }).first(),
      selectedVendorsSidebar: () => this.page.locator(".vendor-sidebar"),
      selectedVendorRemoveButtons: () => this.elements.selectedVendorsSidebar().locator('button[title="Remove"]'),
      selectedVendorRemoveButton: (vendorName) => this.elements.selectedVendorsSidebar().locator("div").filter({
        hasText: vendorName
      }).locator('button[title="Remove"]').first(),
      selectedVendorEmptyState: () => this.elements.selectedVendorsSidebar().locator("p", {
        hasText: "No vendors selected yet. Choose from the recommendations."
      }),
      existingProjectCard: () => this.page.locator(".card.card-hover").first(),
      inProgressProjectCard: () => this.page
        .locator('.card, .card-hover, [class*="card"]')
        .filter({ has: this.page.getByText(/^In Progress$/i) })
        .first(),
      previousPageButton: () => this.page.locator("div.pagination-actions button").filter({ hasText: /^Previous$/i }),
      nextPageButton: () => this.page.locator("div.pagination-actions button").filter({ hasText: /^Next$/i })
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

  async expectExportButtonsVisible() {
    await expect(this.elements.exportPdfButton()).toBeVisible();
    await expect(this.elements.exportExcelButton()).toBeVisible();
  }

  async expectVendorRecommendationsReady() {
    await expect(
      this.elements.vendorRecommendationCard(),
      "Expected the vendor recommendations section to be visible on the project detail page."
    ).toBeVisible({ timeout: config.defaultTimeout });
  }

  async expectInProgressProjectCardVisible() {
    await expect(
      this.elements.inProgressProjectCard(),
      "Expected at least one project card with status 'In Progress' on the project overview page."
    ).toBeVisible();
  }

  async expectExistingProjectCardVisible() {
    await expect(
      this.elements.existingProjectCard(),
      "Expected at least one existing project card on the project overview page."
    ).toBeVisible();
  }

  async openInProgressProject() {
    await this.openExistingInProgressProject();
  }

  async openExistingInProgressProject() {
    await expect(
      this.elements.existingProjectCard(),
      "Expected project cards to load on the project overview page."
    ).toBeVisible({ timeout: config.defaultTimeout });

    const inProgressProjectLoaded = await this.elements.inProgressProjectCard()
      .waitFor({ state: "visible", timeout: 15000 })
      .then(() => true)
      .catch(() => false);

    if (inProgressProjectLoaded) {
      await expect(this.elements.inProgressProjectCard()).toBeVisible();
      await this.elements.inProgressProjectCard().click();
      return;
    }

    // Finalized projects do not expose vendor recommendations. Never fall back to
    // the first arbitrary card because production may contain only finalized data.
    // Create an isolated in-progress project so vendor scenarios remain eligible.
    await this.createInProgressProject();
  }

  async createAndOpenNewInProgressProject() {
    await this.createInProgressProject();

    if (await this.elements.editProjectButton().waitFor({ state: "visible", timeout: 15000 }).then(() => true).catch(() => false)) {
      return;
    }

    await this.openExistingInProgressProject();
  }

  async createInProgressProject() {
    const timestamp = Date.now();
    const weddingDate = new Date();
    weddingDate.setDate(weddingDate.getDate() + 30);

    await this.createProject({
      groomName: `Yosu${timestamp}`,
      brideName: `Gaby${timestamp}`,
      weddingDate: weddingDate.toISOString().slice(0, 10)
    });
  }

  async createProjectForDeletion() {
    await this.createTrackedProject("DeleteAuto");
  }

  async createProjectForFinalization() {
    await this.createTrackedProject("FinishAuto");
  }

  async createTrackedProject(projectPrefix, eventTypeLabel = "Pesta Adat") {
    const timestamp = Date.now();
    const weddingDate = new Date();
    weddingDate.setDate(weddingDate.getDate() + 45);
    const groomName = `${projectPrefix}Groom${timestamp}`;
    const brideName = `${projectPrefix}Bride${timestamp}`;

    this.createdProjectSearchName = groomName;
    this.createdProjectTitle = `${groomName} & ${brideName}`;
    this.createdProjectType = eventTypeLabel;

    await this.createProject({
      groomName,
      brideName,
      weddingDate: weddingDate.toISOString().slice(0, 10),
      eventType: this.resolveEventTypeValue(eventTypeLabel)
    });
    await this.expectCreatedProjectDetailVisible();
  }

  async createProjectWithType(eventTypeLabel) {
    await this.createTrackedProject("TypeAuto", eventTypeLabel);
  }

  resolveEventTypeValue(eventTypeLabel) {
    const normalized = String(eventTypeLabel).trim().toLowerCase().replace(/\s+/g, " ");

    if (normalized === "3m" || normalized === "3m ceremony" || normalized === "three_m" || normalized === "three m") {
      return "THREE_M";
    }

    if (normalized === "pesta adat" || normalized === "pesta_adat") {
      return "PESTA_ADAT";
    }

    throw new Error(
      `Unsupported project type "${eventTypeLabel}". Use "3M" or "Pesta Adat".`
    );
  }

  getProjectTypeDisplayPattern(eventTypeLabel) {
    const eventTypeValue = this.resolveEventTypeValue(eventTypeLabel);

    if (eventTypeValue === "THREE_M") {
      return /3M(\s*Ceremony)?/i;
    }

    return /Pesta\s*Adat/i;
  }

  async createProject({ groomName, brideName, weddingDate, eventType = "PESTA_ADAT" }) {
    await expect(
      this.elements.newProjectButton(),
      "Expected the New Project button to be visible on the project overview page."
    ).toBeVisible({ timeout: config.defaultTimeout });
    await this.elements.newProjectButton().click();
    const groomNameInput = this.page.locator('input[type="text"]').nth(0);
    const brideNameInput = this.page.locator('input[type="text"]').nth(1);
    const citySelect = this.page.locator("select").nth(1);
    const addressInput = this.page.locator('input[type="text"]').nth(2);
    const weddingDateInput = this.page.locator('input[type="date"]');
    const budgetInput = this.page.locator('input[type="text"]').nth(3);
    const guestInput = this.page.locator('input[type="number"]');
    const eventTypeInput = this.elements.eventTypeRadio(eventType);

    await expect(groomNameInput).toBeVisible({ timeout: config.defaultTimeout });
    await groomNameInput.fill(groomName);
    await expect(brideNameInput).toBeVisible();
    await brideNameInput.fill(brideName);
    await expect(citySelect).toBeVisible();
    await citySelect.selectOption({ label: "Jakarta Pusat" });
    await expect(addressInput).toBeVisible();
    await addressInput.fill("Jakarta Timur");
    await expect(weddingDateInput).toBeVisible();
    await weddingDateInput.fill(weddingDate);
    await expect(budgetInput).toBeVisible();
    await budgetInput.fill("100000000");
    await expect(guestInput).toBeVisible();
    await guestInput.fill("100");
    await expect(eventTypeInput).toBeVisible({ timeout: config.defaultTimeout });
    await eventTypeInput.check();
    await expect(eventTypeInput).toBeChecked();
    await expect(this.elements.createProjectButton()).toBeVisible();
    await this.elements.createProjectButton().click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.waitForNetworkIdleBriefly();
  }

  async expectProjectType(eventTypeLabel) {
    const displayPattern = this.getProjectTypeDisplayPattern(eventTypeLabel);
    const projectTypeLabel = this.elements.projectTypeStatLabel(displayPattern);

    await expect(
      this.elements.textGroomandBrideLabel(),
      "Expected project detail page to be visible before verifying project type."
    ).toBeVisible({ timeout: config.defaultTimeout });
    await expect(
      projectTypeLabel,
      `Expected project type label "${eventTypeLabel}" to be visible on the project detail page.`
    ).toBeVisible({ timeout: config.defaultTimeout });
    await expect(projectTypeLabel).toHaveText(displayPattern);

    if (this.resolveEventTypeValue(eventTypeLabel) === "THREE_M") {
      await expect(this.elements.projectTypeStatLabel(/Pesta\s*Adat/i)).toHaveCount(0);
      await expect(
        this.elements.projectTypeSectionTitle(/3M Ceremony/i)
      ).toBeVisible({ timeout: config.defaultTimeout });
      await expect(
        this.page.locator("h3.section-title").filter({ hasText: /Pesta\s*Adat/i })
      ).toHaveCount(0);
    }
  }

  async expectCreatedProjectDetailVisible() {
    await expect(
      this.elements.textGroomandBrideLabel(),
      "Expected the app to navigate from the new project form to the created project detail page."
    ).toContainText(this.createdProjectTitle, { timeout: 60000 });
  }

  async openProjectOverview() {
    const backToProjectsButton = this.page.locator("button.btn.btn-ghost.btn-sm").filter({
      hasText: /Back to Projects/i
    }).first();

    if (await backToProjectsButton.isVisible().catch(() => false)) {
      await expect(backToProjectsButton).toBeVisible();
      await backToProjectsButton.click();
      await this.waitForNetworkIdleBriefly();
    }

    if (await this.elements.projectSearchInput().isVisible().catch(() => false)) {
      await expect(this.elements.projectSearchInput()).toBeVisible();
      return;
    }

    await this.page.goto(new URL("/", this.page.url()).toString(), { waitUntil: "domcontentloaded" });
    await this.waitForNetworkIdleBriefly();
    await expect(this.elements.projectSearchInput()).toBeVisible({ timeout: 60000 });
  }

  async waitForNetworkIdleBriefly() {
    await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);
  }

  async deleteCreatedProject() {
    if (!this.createdProjectSearchName) {
      throw new Error("Expected a project to be created before deleting it.");
    }

    await expect(this.elements.textGroomandBrideLabel()).toBeVisible();
    await expect(this.elements.textGroomandBrideLabel()).toContainText(this.createdProjectTitle);
    await expect(this.elements.deleteProjectButton()).toBeVisible();
    await this.elements.deleteProjectButton().click();
    await expect(this.elements.confirmDeleteProjectButton()).toBeVisible();
    await this.elements.confirmDeleteProjectButton().click();
    await this.waitForNetworkIdleBriefly();
  }

  async expectCreatedProjectNotFoundInSearch() {
    if (!this.createdProjectSearchName) {
      throw new Error("Expected a project to be created before verifying search results.");
    }

    const projectOverviewUrl = new URL("/", this.page.url()).toString();

    await expect.poll(async () => {
      await this.page.goto(projectOverviewUrl, {
        waitUntil: "domcontentloaded",
        timeout: 15000
      });
      await this.searchProjectList(this.createdProjectSearchName);

      return this.elements.projectCardByName(this.createdProjectSearchName).count();
    }, {
      message: `Expected deleted project "${this.createdProjectSearchName}" to disappear after refreshing the project list.`,
      timeout: Math.min(config.defaultTimeout - 10000, 45000),
      intervals: [1000, 2000, 3000, 5000]
    }).toBe(0);
  }

  async finalizeCreatedProject() {
    if (!this.createdProjectSearchName) {
      throw new Error("Expected a project to be created before finalizing it.");
    }

    await expect(this.elements.textGroomandBrideLabel()).toBeVisible();
    await expect(this.elements.textGroomandBrideLabel()).toContainText(this.createdProjectTitle);
    await expect(this.elements.finalizeProjectButton()).toBeVisible();
    await this.elements.finalizeProjectButton().click();
    await expect(this.elements.confirmFinalizeProjectButton()).toBeVisible();
    await this.elements.confirmFinalizeProjectButton().click();
    await expect(this.elements.finalizedProjectStatus()).toBeVisible();
    await expect(this.elements.projectFinalizedOkButton()).toBeVisible();
    await this.elements.projectFinalizedOkButton().click();
  }

  async expectCreatedProjectFinalizedInSearch() {
    if (!this.createdProjectSearchName) {
      throw new Error("Expected a project to be created before verifying search results.");
    }

    await this.openProjectOverview();
    await this.searchProjectList(this.createdProjectSearchName);
    await this.waitForNetworkIdleBriefly();

    const projectCard = this.elements.projectCardByName(this.createdProjectSearchName).first();

    await expect(projectCard).toBeVisible();
    await expect(projectCard).toContainText(this.createdProjectTitle);
    await expect(projectCard).toContainText("Finalized");
    await projectCard.click();
    await this.deleteCreatedProject();
  }

  async searchProjectList(projectName) {
    await expect(this.elements.projectSearchInput()).toBeVisible({ timeout: 10000 });
    await this.elements.projectSearchInput().evaluate((input, value) => {
      const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

      valueSetter.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, projectName);
    await expect(this.elements.projectSearchInput()).toHaveValue(projectName, { timeout: 5000 });
  }

  async addRequiredCategory(categoryName, plannedBudget = "1000000") {
    await expect(
      this.elements.categoryTableCard(),
      "Expected a categories table card on the project detail page (Pesta Adat or 3M Ceremony)."
    ).toBeVisible({ timeout: config.defaultTimeout });
    await expect(this.elements.addCategoryButton()).toBeVisible({ timeout: config.defaultTimeout });
    await this.elements.addCategoryButton().click();
    await expect(this.elements.categoryModal()).toBeVisible({ timeout: config.defaultTimeout });
    await expect(this.elements.categoryNameInput()).toBeVisible();
    await this.elements.categoryNameInput().fill(categoryName);
    await expect(this.elements.categoryPlannedBudgetInput()).toBeVisible();
    await this.elements.categoryPlannedBudgetInput().fill(plannedBudget);
    await expect(this.elements.saveCategoryButton()).toBeVisible();
    await this.elements.saveCategoryButton().click();
    await expect(this.elements.categorySuccessModal()).toBeVisible({ timeout: config.defaultTimeout });
    await expect(this.elements.categorySuccessOkButton()).toBeVisible();
    await this.elements.categorySuccessOkButton().click();
    await expect(this.elements.categorySuccessModal()).toBeHidden();
  }

  async expectCategoryVisible(categoryName) {
    await expect(this.elements.categoryTableCard()).toBeVisible({ timeout: config.defaultTimeout });
    await expect(this.elements.categoryRow(categoryName)).toBeVisible({ timeout: config.defaultTimeout });
  }

  async searchVendorRecommendation(vendorName) {
    await this.expectVendorRecommendationsReady();
    await expect(this.elements.vendorRecommendationSearchInput()).toBeVisible({ timeout: config.defaultTimeout });
    await this.elements.vendorRecommendationSearchInput().fill(vendorName);
  }

  async expectVendorRecommendationSearchResult(vendorName) {
    await this.expectVendorRecommendationsReady();
    await expect(this.elements.vendorRecommendationResultRow(vendorName)).toBeVisible({ timeout: config.defaultTimeout });
  }

  async compareVendorRecommendations(expectedCount) {
    await this.clearVendorComparisonSelection();
    await expect(this.elements.vendorRecommendationCompareRows().first()).toBeVisible({ timeout: config.defaultTimeout });

    this.comparedVendors = [];

    for (let index = 0; index < expectedCount; index += 1) {
      const vendorRow = this.elements.vendorRecommendationCompareRows().first();

      await expect(vendorRow).toBeVisible();

      const vendorName = (await vendorRow.locator("td").first().innerText()).split("\n")[0].trim();
      const rowText = await vendorRow.innerText();
      const prices = this.extractPriceValues(rowText);

      if (prices.length === 0) {
        throw new Error(`Expected vendor recommendation "${vendorName}" to contain a price before comparing.`);
      }

      this.comparedVendors.push({
        name: vendorName,
        minPrice: Math.min(...prices)
      });

      const compareButton = vendorRow.locator("button").filter({ hasText: /^Compare$/i }).first();

      await expect(compareButton).toBeVisible();
      await compareButton.click();
    }

    await expect(this.elements.vendorRecommendationOpenComparisonButton()).toHaveText(`Compare (${expectedCount})`);
  }

  async tryToCompareOneMoreVendor(maxCount) {
    await expect(this.elements.vendorRecommendationOpenComparisonButton()).toHaveText(`Compare (${maxCount})`);

    const extraCompareButton = this.elements.vendorRecommendationCompareRows()
      .first()
      .locator("button")
      .filter({ hasText: /^Compare$/i })
      .first();

    await expect(extraCompareButton).toBeVisible();
    await extraCompareButton.click();
  }

  async expectVendorComparisonLimit(maxCount) {
    await expect(this.elements.vendorRecommendationOpenComparisonButton()).toHaveText(`Compare (${maxCount})`);
    await expect(this.elements.vendorRecommendationUnselectCompareButtons()).toHaveCount(maxCount);
  }

  async openVendorComparison() {
    await expect(this.elements.vendorRecommendationOpenComparisonButton()).toBeVisible();
    await this.elements.vendorRecommendationOpenComparisonButton().click();
    await expect(this.elements.vendorComparisonModal()).toBeVisible();
  }

  async expectVendorComparisonModalShowsComparedVendors(expectedCount) {
    await expect(this.elements.vendorComparisonModal()).toBeVisible();
    await expect(this.elements.vendorComparisonHeaders()).toHaveCount(expectedCount);

    for (const vendor of this.comparedVendors || []) {
      await expect(this.elements.vendorComparisonHeaders().filter({ hasText: vendor.name })).toBeVisible();
    }
  }

  async expectMostBudgetFriendlyVendorHighlighted() {
    const cheapestVendor = this.getCheapestComparedVendor();

    await expect(this.elements.vendorComparisonBudgetFriendlyVendor()).toBeVisible();
    await expect(this.elements.vendorComparisonBudgetFriendlyVendor()).toHaveText(cheapestVendor.name);
    await expect(this.elements.vendorComparisonBestValueCells()).toHaveCount(1);

    const highlightedCell = this.elements.vendorComparisonBestValueCells().first();

    await expect(highlightedCell).toBeVisible();
    await expect(highlightedCell).toHaveText(this.formatRupiah(cheapestVendor.minPrice));

    const highlightedCellStyle = await highlightedCell.evaluate((element) => {
      const style = window.getComputedStyle(element);

      return {
        backgroundColor: style.backgroundColor,
        fontWeight: style.fontWeight
      };
    });

    expect(
      highlightedCellStyle.backgroundColor,
      "Expected the most budget-friendly min price cell to be green highlighted."
    ).toBe("rgb(220, 252, 231)");
    expect(Number(highlightedCellStyle.fontWeight)).toBeGreaterThanOrEqual(600);
  }

  async clearVendorComparisonSelection() {
    await this.dismissVisibleModalIfPresent();
    await expect(this.elements.vendorRecommendationCard()).toBeVisible();

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const unselectButton = this.elements.vendorRecommendationUnselectCompareButtons().first();
      const unselectButtonVisible = await unselectButton.isVisible().catch(() => false);

      if (!unselectButtonVisible) {
        break;
      }

      await expect(unselectButton).toBeVisible();
      await unselectButton.click();
    }

    await expect(this.elements.vendorRecommendationUnselectCompareButtons()).toHaveCount(0);
  }

  getCheapestComparedVendor() {
    if (!this.comparedVendors || this.comparedVendors.length === 0) {
      throw new Error("Expected compared vendors to be captured before verifying the comparison modal.");
    }

    return this.comparedVendors.reduce((cheapest, vendor) =>
      vendor.minPrice < cheapest.minPrice ? vendor : cheapest
    );
  }

  formatRupiah(value) {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  }

  async selectFirstAvailableVendorRecommendation() {
    await this.removeExistingSelectedVendors();
    await expect(this.elements.vendorRecommendationSelectRows().first()).toBeVisible();

    const availableVendorCount = await this.elements.vendorRecommendationSelectRows().count();
    let lastSelectionError = null;

    for (let index = 0; index < availableVendorCount; index += 1) {
      const vendorRow = this.elements.vendorRecommendationSelectRows().nth(index);

      await expect(vendorRow).toBeVisible();

      const vendorCellText = await vendorRow.locator("td").first().innerText();
      this.selectedVendorName = vendorCellText.split("\n")[0].trim();
      const selectButton = this.elements.vendorRecommendationSelectButton(this.selectedVendorName);

      await expect(selectButton).toBeVisible();
      await selectButton.click();

      const selectionOutcome = await this.waitForVendorSelectionOutcome(this.selectedVendorName);

      if (selectionOutcome === "selected") {
        return;
      }

      lastSelectionError = selectionOutcome;
    }

    throw new Error(lastSelectionError || "Expected at least one vendor recommendation to be selectable.");
  }

  async waitForVendorSelectionOutcome(vendorName) {
    const selectedOutcome = expect(this.elements.selectedVendorsSidebar())
      .toContainText(vendorName, { timeout: 10000 })
      .then(() => "selected")
      .catch(() => null);
    const successModalOutcome = this.elements.vendorSelectedModal()
      .waitFor({ state: "visible", timeout: 10000 })
      .then(() => "success-modal")
      .catch(() => null);
    const errorModalOutcome = this.elements.vendorSelectionErrorModal()
      .waitFor({ state: "visible", timeout: 10000 })
      .then(() => "error-modal")
      .catch(() => null);

    const outcome = await Promise.race([
      selectedOutcome,
      successModalOutcome,
      errorModalOutcome
    ]);

    if (outcome === "success-modal") {
      await expect(this.elements.vendorSelectedModalOkButton()).toBeVisible();
      await this.elements.vendorSelectedModalOkButton().click();
      await expect(this.elements.vendorSelectedModal()).toBeHidden();
      await expect(this.elements.selectedVendorsSidebar()).toContainText(vendorName);
      return "selected";
    }

    if (outcome === "error-modal") {
      const errorText = await this.elements.vendorSelectionErrorModal().innerText().catch(() => "Vendor selection error modal appeared.");

      await this.dismissVisibleModalIfPresent();
      return `Vendor "${vendorName}" could not be selected. Modal text: ${errorText}`;
    }

    return outcome || `Vendor "${vendorName}" was not selected and no success or error modal appeared.`;
  }

  async removeExistingSelectedVendors() {
    await expect(this.elements.selectedVendorsSidebar()).toBeVisible();

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const removeButton = this.elements.selectedVendorRemoveButtons().first();
      const removeButtonVisible = await removeButton.isVisible().catch(() => false);

      if (!removeButtonVisible) {
        break;
      }

      const selectedVendorCount = await this.elements.selectedVendorRemoveButtons().count();

      await expect(removeButton).toBeVisible();
      await removeButton.click();
      await expect(this.elements.selectedVendorRemoveButtons()).toHaveCount(
        Math.max(selectedVendorCount - 1, 0),
        { timeout: config.defaultTimeout }
      );
    }
  }

  async expectSelectedVendorVisible() {
    await expect(this.elements.selectedVendorsSidebar()).toBeVisible();
    await expect(this.elements.selectedVendorsSidebar()).toContainText(this.selectedVendorName);
    await expect(this.elements.vendorRecommendationResultRow(this.selectedVendorName)).toContainText("Selected");
  }

  async removeSelectedVendor() {
    await this.dismissVendorSelectedModalIfVisible();
    await this.dismissVisibleModalIfPresent();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const removeButton = this.elements.selectedVendorRemoveButton(this.selectedVendorName);

      await expect(removeButton).toBeVisible({ timeout: config.defaultTimeout });
      await removeButton.click();

      const removed = await expect(this.elements.selectedVendorsSidebar()).not.toContainText(this.selectedVendorName, {
        timeout: 10000
      }).then(() => true).catch(() => false);

      if (removed) {
        return;
      }
    }
  }

  async expectSelectedVendorRemoved() {
    await expect(this.elements.selectedVendorsSidebar()).toBeVisible();
    await expect(this.elements.selectedVendorsSidebar()).not.toContainText(this.selectedVendorName, {
      timeout: config.defaultTimeout
    });
    await expect(this.elements.selectedVendorEmptyState()).toBeVisible({ timeout: config.defaultTimeout });
    await expect(this.elements.vendorRecommendationResultRow(this.selectedVendorName)).toContainText("Select", {
      timeout: config.defaultTimeout
    });
  }

  async getAreaFilterOptions() {
    return this.getVendorRecommendationFilterOptions(
      this.elements.vendorRecommendationAreaDropdown(),
      /^(all|semua)?\s*area(s)?$/i
    );
  }

  async filterVendorRecommendationsByEveryArea() {
    const areaOptions = await this.getAreaFilterOptions();

    if (areaOptions.length === 0) {
      throw new Error("Expected the vendor recommendation area dropdown to contain at least one area option.");
    }

    this.filteredAreaResults = [];

    for (const areaOption of areaOptions) {
      await expect(this.elements.vendorRecommendationAreaDropdown()).toBeVisible();
      await this.elements.vendorRecommendationAreaDropdown().selectOption(areaOption.value);
      await this.page.waitForLoadState("networkidle").catch(() => undefined);
      await this.expectVendorRecommendationsFilteredByArea(areaOption);
      this.filteredAreaResults.push(areaOption);
    }
  }

  async filterVendorRecommendationsByArea(area) {
    const areaOption = await this.getAreaFilterOption(area);

    await this.selectVendorRecommendationFilterOption(this.elements.vendorRecommendationAreaDropdown(), areaOption);
    this.filteredAreaResult = areaOption;
  }

  async getAreaFilterOption(area) {
    const areaOptions = await this.getAreaFilterOptions();
    const normalizedArea = this.normalizeAreaText(area);
    const areaOption = areaOptions.find((option) =>
      [option.label, option.value].some((areaText) => this.normalizeAreaText(areaText) === normalizedArea)
    );

    if (!areaOption) {
      throw new Error(`Expected area option "${area}" to exist in the vendor recommendation area dropdown.`);
    }

    return areaOption;
  }

  async expectEveryAreaFilterWasVerified() {
    expect(
      this.filteredAreaResults?.length || 0,
      "Expected at least one area filter option to be verified."
    ).toBeGreaterThan(0);
  }

  async expectVendorRecommendationsFilteredByAreaName(area) {
    const areaOption = this.filteredAreaResult && this.normalizeAreaText(this.filteredAreaResult.label) === this.normalizeAreaText(area)
      ? this.filteredAreaResult
      : await this.getAreaFilterOption(area);

    await this.expectVendorRecommendationsFilteredByArea(areaOption);
  }

  async expectVendorRecommendationsFilteredByArea(areaOption) {
    const expectedAreaTexts = [areaOption.label, areaOption.value]
      .filter(Boolean)
      .map((areaText) => this.normalizeAreaText(areaText));

    const rowTexts = await this.getVisibleVendorRecommendationRowTexts();

    if (rowTexts.length === 0) {
      await this.expectVendorRecommendationNoVisibleRows();
      return;
    }

    for (const rowText of rowTexts) {
      const normalizedRowText = this.normalizeAreaText(rowText);
      const hasExpectedArea = expectedAreaTexts.some((expectedAreaText) =>
        normalizedRowText.includes(expectedAreaText)
      );

      expect(
        hasExpectedArea,
        `Expected vendor recommendation row "${rowText}" to match selected area "${areaOption.label}".`
      ).toBeTruthy();
    }
  }

  normalizeAreaText(areaText) {
    return String(areaText)
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  async getPriceFilterOptions() {
    return this.getVendorRecommendationFilterOptions(
      this.elements.vendorRecommendationPriceDropdown(),
      /^(all|semua)?\s*(price|prices|harga|budget)(s)?$/i
    );
  }

  async getCapacityFilterOptions() {
    return this.getVendorRecommendationFilterOptions(
      this.elements.vendorRecommendationCapacityDropdown(),
      /^(all|semua)?\s*(capacity|capacities|kapasitas|guest|guests|pax|orang|people)(s)?$/i
    );
  }

  async getPriceFilterOption(price) {
    return this.getVendorRecommendationFilterOption(
      await this.getPriceFilterOptions(),
      price,
      "price"
    );
  }

  async getCapacityFilterOption(capacity) {
    return this.getVendorRecommendationFilterOption(
      await this.getCapacityFilterOptions(),
      capacity,
      "capacity"
    );
  }

  getVendorRecommendationFilterOption(options, filterName, filterType) {
    const normalizedFilterName = this.normalizeFilterText(filterName);
    const option = options.find((candidate) =>
      [candidate.label, candidate.value].some((filterText) =>
        this.normalizeFilterText(filterText) === normalizedFilterName
      )
    );

    if (!option) {
      throw new Error(`Expected ${filterType} option "${filterName}" to exist in the vendor recommendation ${filterType} dropdown.`);
    }

    return option;
  }

  async getVendorRecommendationFilterOptions(dropdown, placeholderPattern) {
    await this.expectVendorRecommendationsReady();
    await expect(dropdown).toBeVisible({ timeout: config.defaultTimeout });

    const options = await dropdown.locator("option").evaluateAll((optionNodes) =>
      optionNodes.map((option) => ({
        label: option.textContent.trim(),
        value: option.value
      }))
    );

    return options.filter((option) => {
      const optionText = `${option.label} ${option.value}`.trim();
      return option.value && !placeholderPattern.test(optionText);
    });
  }

  async selectVendorRecommendationFilterOption(dropdown, option) {
    await this.expectVendorRecommendationsReady();
    await expect(dropdown).toBeVisible({ timeout: config.defaultTimeout });
    await dropdown.selectOption(option.value);
    await this.page.waitForLoadState("networkidle").catch(() => undefined);
  }

  async filterVendorRecommendationsByEveryPrice() {
    const priceOptions = await this.getPriceFilterOptions();

    if (priceOptions.length === 0) {
      throw new Error("Expected the vendor recommendation price dropdown to contain at least one price option.");
    }

    this.filteredPriceResults = [];

    for (const priceOption of priceOptions) {
      await this.selectVendorRecommendationFilterOption(this.elements.vendorRecommendationPriceDropdown(), priceOption);
      await this.expectVendorRecommendationsFilteredByPrice(priceOption);
      this.filteredPriceResults.push(priceOption);
    }
  }

  async filterVendorRecommendationsByPrice(price) {
    const priceOption = await this.getPriceFilterOption(price);

    await this.selectVendorRecommendationFilterOption(this.elements.vendorRecommendationPriceDropdown(), priceOption);
    this.filteredPriceResult = priceOption;
  }

  async filterVendorRecommendationsByEveryCapacity() {
    const capacityOptions = await this.getCapacityFilterOptions();

    if (capacityOptions.length === 0) {
      throw new Error("Expected the vendor recommendation capacity dropdown to contain at least one capacity option.");
    }

    this.filteredCapacityResults = [];

    for (const capacityOption of capacityOptions) {
      await this.selectVendorRecommendationFilterOption(this.elements.vendorRecommendationCapacityDropdown(), capacityOption);
      await this.expectVendorRecommendationsFilteredByCapacity(capacityOption);
      this.filteredCapacityResults.push(capacityOption);
    }
  }

  async filterVendorRecommendationsByCapacity(capacity) {
    const capacityOption = await this.getCapacityFilterOption(capacity);

    await this.selectVendorRecommendationFilterOption(this.elements.vendorRecommendationCapacityDropdown(), capacityOption);
    this.filteredCapacityResult = capacityOption;
  }

  async expectEveryPriceFilterWasVerified() {
    expect(
      this.filteredPriceResults?.length || 0,
      "Expected at least one price filter option to be verified."
    ).toBeGreaterThan(0);
  }

  async expectEveryCapacityFilterWasVerified() {
    expect(
      this.filteredCapacityResults?.length || 0,
      "Expected at least one capacity filter option to be verified."
    ).toBeGreaterThan(0);
  }

  async expectVendorRecommendationsFilteredByPrice(priceOption) {
    await this.expectVendorRecommendationsFilteredByNumericRange(priceOption, "price");
  }

  async expectVendorRecommendationsFilteredByPriceName(price) {
    const priceOption = this.filteredPriceResult && this.normalizeFilterText(this.filteredPriceResult.label) === this.normalizeFilterText(price)
      ? this.filteredPriceResult
      : await this.getPriceFilterOption(price);

    await this.expectVendorRecommendationsFilteredByPrice(priceOption);
  }

  async sortVendorRecommendationsByPrice(direction) {
    const sortOption = await this.getPriceSortOption(direction);

    await expect(this.elements.vendorRecommendationPriceSortDropdown()).toBeVisible();
    await this.elements.vendorRecommendationPriceSortDropdown().selectOption(sortOption.value);
    await this.page.waitForLoadState("networkidle").catch(() => undefined);
    this.priceSortDirection = direction;
  }

  async getPriceSortOption(direction) {
    await expect(this.elements.vendorRecommendationPriceSortDropdown()).toBeVisible();

    const directionPattern = this.getPriceSortDirectionPattern(direction);
    const options = await this.elements.vendorRecommendationPriceSortDropdown().locator("option").evaluateAll((optionNodes) =>
      optionNodes.map((option) => ({
        label: option.textContent.trim(),
        value: option.value
      }))
    );
    const sortOption = options.find((option) =>
      option.value && directionPattern.test(`${option.label} ${option.value}`)
    );

    if (!sortOption) {
      throw new Error(`Expected price sort option "${direction}" to exist in the vendor recommendation sort dropdown.`);
    }

    return sortOption;
  }

  getPriceSortDirectionPattern(direction) {
    const normalizedDirection = this.normalizeFilterText(direction);

    if (/low.*high|asc|ascending|termurah/.test(normalizedDirection)) {
      return /low\s*to\s*high|lowest|asc|ascending|termurah/i;
    }

    if (/high.*low|desc|descending|termahal/.test(normalizedDirection)) {
      return /high\s*to\s*low|highest|desc|descending|termahal/i;
    }

    throw new Error(`Unsupported price sort direction "${direction}". Use "low to high" or "high to low".`);
  }

  async expectVendorRecommendationsSortedByPrice(direction = this.priceSortDirection) {
    const rowTexts = await this.getVisibleVendorRecommendationRowTexts();

    if (rowTexts.length === 0) {
      await this.expectVendorRecommendationNoVisibleRows();
      return;
    }
    const prices = rowTexts.map((rowText) => {
      const priceValues = this.extractPriceValues(rowText);

      if (priceValues.length === 0) {
        throw new Error(`Expected vendor recommendation row "${rowText}" to contain a price.`);
      }

      return priceValues[0];
    });
    const isAscending = /low.*high|asc|ascending|termurah/i.test(this.normalizeFilterText(direction));

    for (let index = 1; index < prices.length; index += 1) {
      const previousPrice = prices[index - 1];
      const currentPrice = prices[index];
      const sortedCorrectly = isAscending
        ? previousPrice <= currentPrice
        : previousPrice >= currentPrice;

      expect(
        sortedCorrectly,
        `Expected vendor recommendation prices to be sorted ${direction}, but found ${previousPrice} before ${currentPrice}.`
      ).toBeTruthy();
    }
  }

  async expectVendorRecommendationsFilteredByCapacity(capacityOption) {
    await this.expectVendorRecommendationsFilteredByNumericRange(capacityOption, "capacity");
  }

  async expectVendorRecommendationsFilteredByCapacityName(capacity) {
    const capacityOption = this.filteredCapacityResult && this.normalizeFilterText(this.filteredCapacityResult.label) === this.normalizeFilterText(capacity)
      ? this.filteredCapacityResult
      : await this.getCapacityFilterOption(capacity);

    await this.expectVendorRecommendationsFilteredByCapacity(capacityOption);
  }

  async expectVendorRecommendationsFilteredByNumericRange(option, filterType) {
    const rowTexts = await this.getVisibleVendorRecommendationRowTexts();

    if (rowTexts.length === 0) {
      await this.expectVendorRecommendationNoVisibleRows();
      return;
    }
    const range = this.parseFilterRange(option, filterType);

    for (const rowText of rowTexts) {
      const values = filterType === "price"
        ? this.extractPriceValues(rowText)
        : this.extractCapacityValues(rowText);
      const rowMatchesRange = values.some((value) => this.valueMatchesRange(value, range));

      expect(
        rowMatchesRange,
        `Expected vendor recommendation row "${rowText}" to match selected ${filterType} filter "${option.label}".`
      ).toBeTruthy();
    }
  }

  parseFilterRange(option, filterType) {
    const optionText = `${option.label} ${option.value}`.toLowerCase();
    const valueRange = this.parseOptionValueRange(option.value, filterType);

    if (valueRange) {
      return valueRange;
    }

    const values = this.extractRangeValues(optionText, filterType);

    if (values.length === 0) {
      throw new Error(`Expected ${filterType} option "${option.label}" to contain a numeric range.`);
    }

    if (/(under|below|less than|up to|maks|maximum|<=|<)/i.test(optionText)) {
      return { min: null, max: values[0] };
    }

    if (/(above|over|more than|minimum|min|>=|>)/i.test(optionText)) {
      return { min: values[0], max: null };
    }

    if (values.length === 1) {
      return { min: values[0], max: values[0] };
    }

    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  valueMatchesRange(value, range) {
    if (range.min !== null && value < range.min) {
      return false;
    }

    if (range.max !== null && value > range.max) {
      return false;
    }

    return true;
  }

  parseOptionValueRange(value, filterType) {
    const rangeParts = String(value).match(/(\d[\d.,]*)\s*-\s*(\d[\d.,]*)/);

    if (!rangeParts) {
      return null;
    }

    return {
      min: this.parseNumericValue(rangeParts[1], filterType),
      max: this.parseNumericValue(rangeParts[2], filterType)
    };
  }

  extractRangeValues(text, filterType) {
    const rangeText = String(text);
    const unitMatches = filterType === "price"
      ? rangeText.match(/(?:rp|idr)\s*[\d.,]+|[\d.,]+\s*(?:jt|juta|million|mio|m)\b/gi) || []
      : rangeText.match(/[\d.,]+/g) || [];

    if (unitMatches.length > 0) {
      return unitMatches
        .map((value) => this.parseNumericValue(value, filterType))
        .filter((value) => Number.isFinite(value));
    }

    return this.extractNumberValues(rangeText, filterType);
  }

  extractPriceValues(text) {
    const priceMatches = String(text).match(/(?:rp|idr)\s*[\d.,]+|[\d.,]+\s*(?:jt|juta|million|mio|m)\b/gi) || [];
    const values = priceMatches
      .map((value) => this.parseNumericValue(value, "price"))
      .filter((value) => Number.isFinite(value));

    return values.length > 0 ? values : this.extractNumberValues(text, "price");
  }

  extractCapacityValues(text) {
    const normalizedText = String(text);
    const capacityMatches = [
      ...normalizedText.matchAll(/(?:capacity|kapasitas|guest|guests|pax|orang|people)\D{0,20}([\d.,]+)/gi),
      ...normalizedText.matchAll(/([\d.,]+)\s*(?:capacity|kapasitas|guest|guests|pax|orang|people)/gi)
    ];
    const values = capacityMatches
      .map((match) => this.parseNumericValue(match[1], "capacity"))
      .filter((value) => Number.isFinite(value));

    if (values.length > 0) {
      return values;
    }

    return this.extractNumberValues(normalizedText.replace(/(?:rp|idr)\s*[\d.,]+/gi, ""), "capacity")
      .filter((value) => value < 100000);
  }

  extractNumberValues(text, filterType) {
    return (String(text).match(/\d[\d.,]*/g) || [])
      .map((value) => this.parseNumericValue(value, filterType))
      .filter((value) => Number.isFinite(value));
  }

  parseNumericValue(value, filterType) {
    const rawValue = String(value).toLowerCase();
    const hasMillionUnit = /(jt|juta|million|mio|\bm\b)/i.test(rawValue);
    const numericText = rawValue.replace(/[^\d.,]/g, "");
    const normalizedNumber = numericText.replace(/[.,]/g, "");
    const parsedValue = Number(normalizedNumber);

    if (!Number.isFinite(parsedValue)) {
      return Number.NaN;
    }

    if (filterType === "price" && hasMillionUnit && parsedValue < 100000) {
      return parsedValue * 1000000;
    }

    return parsedValue;
  }

  normalizeFilterText(filterText) {
    return String(filterText)
      .toLowerCase()
      .replace(/\+/g, " plus")
      .replace(/</g, " less than ")
      .replace(/>/g, " greater than ")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  async getVisibleVendorRecommendationRowTexts() {
    await expect(this.elements.vendorRecommendationCard()).toBeVisible();

    return this.elements.vendorRecommendationRows().evaluateAll((rows) =>
      rows
        .filter((row) => {
          const style = window.getComputedStyle(row);
          const rect = row.getBoundingClientRect();

          return style.display !== "none"
            && style.visibility !== "hidden"
            && Number(style.opacity) !== 0
            && rect.width > 0
            && rect.height > 0;
        })
        .map((row) => row.innerText)
    );
  }

  async expectVendorRecommendationNoVisibleRows() {
    await expect(this.elements.vendorRecommendationCard()).toBeVisible();

    if (await this.elements.vendorRecommendationEmptyState().isVisible().catch(() => false)) {
      await expect(this.elements.vendorRecommendationEmptyState()).toBeVisible();
    }
  }

  async dismissVendorSelectedModalIfVisible() {
    if (await this.elements.vendorSelectedModal().isVisible().catch(() => false)) {
      await expect(this.elements.vendorSelectedModalOkButton()).toBeVisible();
      await this.elements.vendorSelectedModalOkButton().click();
      await expect(this.elements.vendorSelectedModal()).toBeHidden();
    }
  }

  async dismissVisibleModalIfPresent() {
    const visibleModal = this.page.locator(".modal:visible").first();
    const visibleModalPresent = await visibleModal.isVisible().catch(() => false);

    if (!visibleModalPresent) {
      return;
    }

    const actionButton = this.elements.visibleModalActionButton();

    if (await actionButton.isVisible().catch(() => false)) {
      await expect(actionButton).toBeVisible();
      await actionButton.click();
      await expect(visibleModal).toBeHidden();
    }
  }

  async downloadBudgetExport(exportType, downloadDir) {
    await this.expectExportButtonsVisible();
    this.projectTitle = (await this.elements.textGroomandBrideLabel().innerText()).trim();
    this.totalBudgetText = (await this.page.locator(".stat-card").filter({ hasText: /total budget/i }).locator(".stat-value").innerText()).trim();
    this.downloadedBudgetExport = await this.downloadExport(this.getExportButton(exportType), downloadDir);
  }

  getExportButton(exportType) {
    if (/^pdf$/i.test(exportType)) {
      return this.elements.exportPdfButton();
    }

    if (/^excel$/i.test(exportType)) {
      return this.elements.exportExcelButton();
    }

    throw new Error(`Unsupported budget export type "${exportType}". Use "PDF" or "Excel".`);
  }

  async downloadExport(button, downloadDir) {
    fs.mkdirSync(downloadDir, { recursive: true });
    await expect(button).toBeVisible();

    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      button.click()
    ]);
    const filePath = path.join(downloadDir, download.suggestedFilename());

    await download.saveAs(filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();

    return {
      filePath,
      suggestedFilename: download.suggestedFilename(),
      size: fs.statSync(filePath).size
    };
  }

  async expectBudgetExportCorrect(exportType) {
    expect(this.downloadedBudgetExport, `Expected a downloaded ${exportType} export.`).toBeTruthy();

    if (/^pdf$/i.test(exportType)) {
      this.expectPdfBudgetExportCorrect(this.downloadedBudgetExport);
      return;
    }

    if (/^excel$/i.test(exportType)) {
      this.expectExcelBudgetExportCorrect(this.downloadedBudgetExport);
      return;
    }

    throw new Error(`Unsupported budget export type "${exportType}". Use "PDF" or "Excel".`);
  }

  expectPdfBudgetExportCorrect(downloadedFile) {
    this.expectDownloadedFile(downloadedFile, ".pdf", "%PDF-");
    this.expectProjectNameInFilename(downloadedFile);

    const pdfText = this.extractPdfText(downloadedFile.filePath);

    expect(pdfText).toMatch(/Bataknese/i);
    expect(pdfText).toMatch(/Budget/i);
    expect(pdfText).toMatch(/Repor/i);
    expect(pdfText).toMatch(/Groom/i);
    expect(pdfText).toMatch(/Br.*ide/i);
    expect(pdfText).toContain(this.totalBudgetText);
  }

  expectExcelBudgetExportCorrect(downloadedFile) {
    this.expectDownloadedFile(downloadedFile, ".xlsx", "PK\u0003\u0004");
    this.expectProjectNameInFilename(downloadedFile);

    const excelText = this.extractXlsxText(downloadedFile.filePath);

    this.expectProjectNameInText(excelText);

    expect(excelText).toMatch(/Budget/i);
    expect(excelText).toContain(this.totalBudgetText.replace(/[^\d]/g, ""));
  }

  expectProjectNameInFilename(downloadedFile) {
    for (const namePart of this.projectNameParts()) {
      expect(downloadedFile.suggestedFilename).toContain(namePart);
    }
  }

  expectProjectNameInText(text) {
    for (const namePart of this.projectNameParts()) {
      expect(text).toContain(namePart);
    }
  }

  projectNameParts() {
    return this.projectTitle.split("&").map((name) => name.trim()).filter(Boolean);
  }

  expectDownloadedFile(downloadedFile, extension, signature) {
    expect(downloadedFile.suggestedFilename.toLowerCase()).toContain(extension);
    expect(downloadedFile.size).toBeGreaterThan(0);

    const header = fs.readFileSync(downloadedFile.filePath).slice(0, signature.length).toString("latin1");
    expect(header).toBe(signature);
  }

  extractPdfText(filePath) {
    const buffer = fs.readFileSync(filePath);
    const raw = buffer.toString("latin1");
    const chunks = [];

    for (const match of raw.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
      const streamStart = raw.indexOf(match[1], match.index);
      const streamBuffer = buffer.slice(streamStart, streamStart + match[1].length);

      try {
        chunks.push(zlib.inflateSync(streamBuffer).toString("latin1"));
      } catch {
        chunks.push(streamBuffer.toString("latin1"));
      }
    }

    return chunks
      .join("\n")
      .replace(/<([0-9A-Fa-f\s]+)>/g, (_, hex) => Buffer.from(hex.replace(/\s+/g, ""), "hex").toString("latin1"))
      .replace(/\s+/g, " ");
  }

  extractXlsxText(filePath) {
    return this.readZipEntries(fs.readFileSync(filePath))
      .map((entry) => entry.text)
      .join("\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");
  }

  readZipEntries(buffer) {
    const entries = [];
    let offset = 0;

    while (offset < buffer.length - 30) {
      if (buffer.readUInt32LE(offset) !== 0x04034b50) {
        offset += 1;
        continue;
      }

      const method = buffer.readUInt16LE(offset + 8);
      const compressedSize = buffer.readUInt32LE(offset + 18);
      const nameLength = buffer.readUInt16LE(offset + 26);
      const extraLength = buffer.readUInt16LE(offset + 28);
      const dataStart = offset + 30 + nameLength + extraLength;
      const data = buffer.slice(dataStart, dataStart + compressedSize);
      let text = "";

      try {
        text = (method === 8 ? zlib.inflateRawSync(data) : data).toString("utf8");
      } catch {
        text = "";
      }

      entries.push({ text });
      offset = dataStart + compressedSize;
    }

    return entries;
  }

  async goToLatestPage() {
    let clickCount = 0;
    while (clickCount < 100) {
      const nextBtn = this.elements.nextPageButton();
      await expect(nextBtn).toBeVisible();
      const isDisabled = await nextBtn.getAttribute("disabled") !== null;
      if (isDisabled) {
        break;
      }
      await nextBtn.click();
      clickCount++;
      await this.waitForNetworkIdleBriefly();
    }
  }
}
module.exports = ProjectPage;
