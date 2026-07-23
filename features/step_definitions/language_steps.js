const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

const translations = {
  Indonesian: {
    heading: "Proyek Pernikahan Saya",
    subtitle: "Pantau dan kelola anggaran pernikahan Anda",
    newProjectButton: "Proyek Baru",
    searchLabel: "Cari proyek",
    budgetOverview: "Ringkasan Anggaran",
    totalBudget: "Total Anggaran",
    planned: "Rencana",
    spent: "Terpakai",
    previousButton: "Sebelumnya",
  },
};

When("I switch the language to {string}", async function (languageCode) {
  await this.basePage.switchLanguage(languageCode);
  await this.basePage.expectLanguageOptionSelected(languageCode);
});

Then("I should see the page in {string} language", async function (language) {
  const expected = translations[language];

  if (!expected) {
    throw new Error(`Unsupported language "${language}".`);
  }

  await expect(
    this.page.getByRole("heading", { name: expected.heading })
  ).toBeVisible();
  await expect(this.page.getByText(expected.subtitle)).toBeVisible();
  await expect(
    this.page.getByRole("button", { name: expected.newProjectButton })
  ).toBeVisible();
  await expect(this.page.getByLabel(expected.searchLabel)).toBeVisible();
  await expect(this.page.locator(`text=${expected.budgetOverview}`)).toBeVisible();
  await expect(this.page.locator(`text=${expected.totalBudget}`)).toBeVisible();
  await expect(
    this.page.locator(`text=${expected.planned}`).first()
  ).toBeVisible();
  await expect(
    this.page.locator(`text=${expected.spent}`).first()
  ).toBeVisible();
  await expect(
    this.page.getByRole("button", { name: expected.previousButton })
  ).toBeVisible();
});
