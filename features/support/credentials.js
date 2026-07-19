const fs = require("fs");
const path = require("path");

const credentialsDir = path.resolve("config");
const defaultCredentialsFile = "credentials.json";

/**
 * When config JSON files are not on disk (typical in CI), resolve users from env.
 * Invalid-login defaults are non-secret placeholders and are always safe to use.
 */
const FILE_SOURCES = {
  "credentials_login_valid.json": () => ({
    validUser: {
      email: process.env.LOGIN_VALID_EMAIL || process.env.VALID_USER_EMAIL,
      password: process.env.LOGIN_VALID_PASSWORD || process.env.VALID_USER_PASSWORD
    }
  }),
  "credentials_login_invalid.json": () => ({
    validUser: {
      email:
        process.env.LOGIN_INVALID_EMAIL ||
        process.env.INVALID_USER_EMAIL ||
        "invalid@example.com",
      password:
        process.env.LOGIN_INVALID_PASSWORD ||
        process.env.INVALID_USER_PASSWORD ||
        "invalid-password"
    }
  }),
  "credentials.json": () => ({
    validUser: {
      email: process.env.LOGIN_VALID_EMAIL || process.env.VALID_USER_EMAIL,
      password: process.env.LOGIN_VALID_PASSWORD || process.env.VALID_USER_PASSWORD
    }
  })
};

function resolveCredentialsPath(fileName = defaultCredentialsFile) {
  const credentialsPath = path.resolve(credentialsDir, fileName);

  if (!credentialsPath.startsWith(credentialsDir)) {
    throw new Error(`Invalid credentials file path "${fileName}".`);
  }

  return credentialsPath;
}

function credentialsFromEnv(fileName) {
  const factory = FILE_SOURCES[fileName];
  if (!factory) {
    return null;
  }

  const data = factory();
  const user = data.validUser;
  if (!user?.email || !user?.password) {
    return null;
  }

  return data;
}

function loadCredentials(fileName = defaultCredentialsFile) {
  const credentialsPath = resolveCredentialsPath(fileName);

  if (fs.existsSync(credentialsPath)) {
    return JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  }

  const fromEnv = credentialsFromEnv(fileName);
  if (fromEnv) {
    return fromEnv;
  }

  throw new Error(
    `Missing config/${fileName}. Create the file from config/*.example.json, ` +
      `or set LOGIN_VALID_EMAIL / LOGIN_VALID_PASSWORD for CI ` +
      `(optional: LOGIN_INVALID_EMAIL / LOGIN_INVALID_PASSWORD).`
  );
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
