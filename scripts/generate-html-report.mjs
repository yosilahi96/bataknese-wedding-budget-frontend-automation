import { generate } from 'multiple-cucumber-html-reporter';

generate({
  jsonDir: 'reports',
  reportPath: 'reports/cucumber-html-report',
  displayDuration: true,
  durationUnits: 's',
  pageTitle: 'FE Automation Test Report',
  reportName: 'FE Automation — Cucumber Report',
  metadata: {
    browser: { name: 'chromium', version: 'latest' },
    device: 'Local test machine',
    platform: { name: 'Windows', version: '10' },
  },
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project', value: 'FE Automation' },
      { label: 'Run date', value: new Date().toISOString().split('T')[0] },
    ],
  },
});
