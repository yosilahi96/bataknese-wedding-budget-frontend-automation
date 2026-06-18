const fs = require("fs");
const path = require("path");

const credentialsDir = path.resolve("config");
const defaultCredentialsFile = "credentials.json";

function resolveCredentialsPath(fileName = defaultCredentialsFile) {
  const credentialsPath = path.resolve(credentialsDir, fileName);

  if (!credentialsPath.startsWith(credentialsDir)) {
    throw new Error(`Invalid credentials file path "${fileName}".`);
  }

  return credentialsPath;
}

function loadCredentials(fileName = defaultCredentialsFile) {
  const credentialsPath = resolveCredentialsPath(fileName);

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(
      `Missing config/${fileName}. Create the file or update the feature Examples table.`
    );
  }

  return JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
}

function getUser(userKey, fileName = defaultCredentialsFile) {
  const credentials = loadCredentials(fileName);
  const user = credentials[userKey];

  if (!user) {
    throw new Error(`User "${userKey}" is missing from config/${fileName}.`);
  }

  if (!user.email || !user.password) {
    throw new Error(`User "${userKey}" must include email and password.`);
  }

  return user;
}

module.exports = {
  loadCredentials,
  getUser
};
