const fs = require("fs");
const path = require("path");

const resultDirs = [
  "reports",
  "test-results"
];

for (const dir of resultDirs) {
  fs.rmSync(path.resolve(process.cwd(), dir), {
    force: true,
    recursive: true
  });
}

