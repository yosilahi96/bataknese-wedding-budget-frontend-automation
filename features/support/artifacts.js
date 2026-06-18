const fs = require("fs");
const path = require("path");

function ensureDir(dirPath) {
  const resolvedPath = path.resolve(dirPath);
  fs.mkdirSync(resolvedPath, { recursive: true });
  return resolvedPath;
}

function sanitizeFileName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "scenario";
}

function shouldKeepArtifact(mode, failed) {
  switch (mode) {
    case "on":
      return true;
    case "off":
      return false;
    case "only-on-failure":
    case "retain-on-failure":
      return failed;
    default:
      throw new Error(`Unsupported artifact mode "${mode}". Use on, off, only-on-failure, or retain-on-failure.`);
  }
}

function shouldRecordVideo(mode) {
  return mode !== "off";
}

module.exports = {
  ensureDir,
  sanitizeFileName,
  shouldRecordVideo,
  shouldKeepArtifact
};
