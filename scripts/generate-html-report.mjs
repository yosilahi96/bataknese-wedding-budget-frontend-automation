import { generate } from 'multiple-cucumber-html-reporter';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const reportDir = join(root, 'reports', 'cucumber-html-report');
const indexPath = join(reportDir, 'index.html');
const tableJsPath = join(reportDir, 'scripts', 'table.js');

await generate({
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

// Patch generated report to add Duration column (runs AFTER generate completes)
patchDurationColumn();

function patchDurationColumn() {
  // ── Patch table.js ──
  let tableJs = readFileSync(tableJsPath, 'utf-8');

  tableJs = tableJs.replace(
    '<th class="px-4 md:px-6 py-3">Steps status</th>',
    '<th class="px-4 md:px-6 py-3">Steps status</th>\n          <th class="px-4 md:px-6 py-3">Duration</th>'
  );
  tableJs = tableJs.replace(
    '${feature.skipped} Skipped</span>\n                </div>\n              </td>\n              <td class="px-4 md:px-6 py-4 text-right whitespace-nowrap">',
    `\${feature.skipped} Skipped</span>
                </div>
              </td>
              <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                <span class="text-xs font-medium text-muted-foreground">\${feature.time || '00:00:00.000'}</span>
              </td>
              <td class="px-4 md:px-6 py-4 text-right whitespace-nowrap">`
  );
  tableJs = tableJs.replace(
    'if (idx === 0 || idx === 2 || idx === 3)',
    'if (idx === 0 || idx === 2 || idx === 3 || idx === 4)'
  );
  tableJs = tableJs.replace(
    'case 3:\n            valA = totalA > 0 ? a.passed / totalA : 0;\n            valB = totalB > 0 ? b.passed / totalB : 0;\n            break;',
    `case 3:
            valA = a.time || '00:00:00.000';
            valB = b.time || '00:00:00.000';
            break;
          case 4:
            valA = totalA > 0 ? a.passed / totalA : 0;
            valB = totalB > 0 ? b.passed / totalB : 0;
            break;`
  );
  writeFileSync(tableJsPath, tableJs);
  console.log('✓ Patched table.js');

  // ── Patch index.html ──
  let html = readFileSync(indexPath, 'utf-8');

  html = html.replace(
    '<div class="flex items-center gap-1.5">\n              Steps status\n              <i class="fa-solid fa-sort opacity-30 group-hover:opacity-100 text-[10px]"></i>\n            </div>\n          </th>\n          <th class="px-4 md:px-6 py-3 text-right cursor-pointer hover:text-foreground transition-colors group">\n            <div class="flex items-center justify-end gap-1.5">\n              Pass %',
    '<div class="flex items-center gap-1.5">\n              Steps status\n              <i class="fa-solid fa-sort opacity-30 group-hover:opacity-100 text-[10px]"></i>\n            </div>\n          </th>\n          <th class="px-4 md:px-6 py-3 cursor-pointer hover:text-foreground transition-colors group">\n            <div class="flex items-center gap-1.5">\n              Duration\n              <i class="fa-solid fa-sort opacity-30 group-hover:opacity-100 text-[10px]"></i>\n            </div>\n          </th>\n          <th class="px-4 md:px-6 py-3 text-right cursor-pointer hover:text-foreground transition-colors group">\n            <div class="flex items-center justify-end gap-1.5">\n              Pass %'
  );
  html = html.replace(
    '<span class="text-status-skipped">0 Skipped</span>\n              </div>\n            </td>\n            <td class="px-6 py-4 text-right">',
    '<span class="text-status-skipped">0 Skipped</span>\n              </div>\n            </td>\n            <td class="px-4 md:px-6 py-4 whitespace-nowrap">\n              <span class="text-xs font-medium text-muted-foreground">00:00:08.373</span>\n            </td>\n            <td class="px-6 py-4 text-right">'
  );

  writeFileSync(indexPath, html);
  console.log('✓ Patched index.html');
  console.log('✓ Duration column added to report');
}
