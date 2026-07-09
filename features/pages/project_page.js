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
      vendorSelectedModal: () => this.page.locator(".modal", { hasText: "Vendor Selected" }),
      vendorSelectedModalOkButton: () => this.elements.vendorSelectedModal().getByRole("button", { name: /^OK$/i }),
      selectedVendorsSidebar: () => this.page.locator(".vendor-sidebar"),
      selectedVendorRemoveButtons: () => this.elements.selectedVendorsSidebar().locator('button[title="Remove"]'),
      selectedVendorRemoveButton: (vendorName) => this.elements.selectedVendorsSidebar().locator("div").filter({
        hasText: vendorName
      }).locator('button[title="Remove"]').first(),
      selectedVendorEmptyState: () => this.elements.selectedVendorsSidebar().locator("p", {
        hasText: "No vendors selected yet. Choose from the recommendations."
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

  async openExistingInProgressProject() {
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

  async selectFirstAvailableVendorRecommendation() {
    await this.removeExistingSelectedVendors();
    await expect(this.elements.vendorRecommendationSelectRows().first()).toBeVisible();

    const vendorRow = this.elements.vendorRecommendationSelectRows().first();
    const vendorCellText = await vendorRow.locator("td").first().innerText();
    this.selectedVendorName = vendorCellText.split("\n")[0].trim();

    await expect(this.elements.vendorRecommendationSelectButton(this.selectedVendorName)).toBeVisible();
    await this.elements.vendorRecommendationSelectButton(this.selectedVendorName).click();

    const selectedModalVisible = await this.elements.vendorSelectedModal()
      .waitFor({ state: "visible", timeout: 3000 })
      .then(() => true)
      .catch(() => false);

    if (selectedModalVisible) {
      await expect(this.elements.vendorSelectedModalOkButton()).toBeVisible();
      await this.elements.vendorSelectedModalOkButton().click();
      await expect(this.elements.vendorSelectedModal()).toBeHidden();
    }
  }

  async removeExistingSelectedVendors() {
    await expect(this.elements.selectedVendorsSidebar()).toBeVisible();

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const removeButton = this.elements.selectedVendorRemoveButtons().first();
      const removeButtonVisible = await removeButton.isVisible().catch(() => false);

      if (!removeButtonVisible) {
        break;
      }

      await expect(removeButton).toBeVisible();
      await removeButton.click();
      await removeButton.waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined);
    }
  }

  async expectSelectedVendorVisible() {
    await expect(this.elements.selectedVendorsSidebar()).toBeVisible();
    await expect(this.elements.selectedVendorsSidebar()).toContainText(this.selectedVendorName);
    await expect(this.elements.vendorRecommendationResultRow(this.selectedVendorName)).toContainText("Selected");
  }

  async removeSelectedVendor() {
    await this.dismissVendorSelectedModalIfVisible();
    await expect(this.elements.selectedVendorRemoveButton(this.selectedVendorName)).toBeVisible();
    await this.elements.selectedVendorRemoveButton(this.selectedVendorName).click();
  }

  async expectSelectedVendorRemoved() {
    await expect(this.elements.selectedVendorsSidebar()).toBeVisible();
    await expect(this.elements.selectedVendorsSidebar()).not.toContainText(this.selectedVendorName);
    await expect(this.elements.selectedVendorEmptyState()).toBeVisible();
    await expect(this.elements.vendorRecommendationResultRow(this.selectedVendorName)).toContainText("Select");
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
    await expect(dropdown).toBeVisible();

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
    await expect(dropdown).toBeVisible();
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
}
module.exports = ProjectPage;
