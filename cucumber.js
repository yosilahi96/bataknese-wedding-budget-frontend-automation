module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: [
      "features/support/**/*.js",
      "features/step_definitions/**/*.js"
    ],
    format: [
      "progress",
      "json:reports/cucumber-report.json"
    ],
    formatOptions: {
      snippetInterface: "synchronous"
    }
  },
  ui: {
    paths: ["features/ui/**/*.feature"],
    require: [
      "features/support/**/*.js",
      "features/step_definitions/**/*.js"
    ],
    format: [
      "progress",
      "json:reports/cucumber-report.json"
    ],
    formatOptions: {
      snippetInterface: "synchronous"
    },
    tags: "@ui"
  },
  smoke: {
    paths: ["features/ui/**/*.feature"],
    require: [
      "features/support/**/*.js",
      "features/step_definitions/**/*.js"
    ],
    format: [
      "progress",
      "json:reports/cucumber-report.json"
    ],
    formatOptions: {
      snippetInterface: "synchronous"
    },
    tags: "@smoke"
  }
};
