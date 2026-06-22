const { expect } = require("@playwright/test");
const BasePage = require("./base_page");

class ProjectPage extends BasePage {
  constructor(page) {
    super(page);

    this.elements = {
      editProjectButton: () => this.page.locator('button.btn.btn-outline.btn-sm').first(),
      saveEditProjectButton: () => this.page.locator('button[type="submit"].btn.btn-primary'),
      editGroomNameProject: () => this.page.locator('input[type="text"][required]').first(),
      textGroomandBrideLabel: () => this.page.locator('h1.page-title'),
      confirmEditProjectButton: () => this.page.locator('.modal .modal-actions button.btn.btn-primary')
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
}
module.exports = ProjectPage;