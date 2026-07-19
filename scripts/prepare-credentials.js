/**
 * Materialize gitignored credential JSON files from environment variables.
 * Safe to run locally (skips when files already exist) and in CI.
 *
 * Env (valid login — required in CI if files are absent):
 *   LOGIN_VALID_EMAIL / LOGIN_VALID_PASSWORD
 *   (aliases: VALID_USER_EMAIL / VALID_USER_PASSWORD)
 *
 * Env (invalid login — optional; defaults to non-secret placeholders):
 *   LOGIN_INVALID_EMAIL / LOGIN_INVALID_PASSWORD
 */
const fs = require("fs");
const path = require("path");

const configDir = path.resolve("config");

function writeIfMissing(fileName, user) {
  const filePath = path.join(configDir, fileName);

  if (fs.existsSync(filePath)) {
    console.log(`credentials: keeping existing ${fileName}`);
    return true;
  }

  if (!user.email || !user.password) {
    console.error(
      `credentials: cannot write ${fileName} — missing email/password. ` +
        `Set LOGIN_VALID_EMAIL and LOGIN_VALID_PASSWORD (or create config/${fileName}).`
    );
    return false;
  }

  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(
    filePath,
    `${JSON.stringify({ validUser: user }, null, 2)}\n`,
    "utf8"
  );
  console.log(`credentials: wrote ${fileName} from environment`);
  return true;
}

const validOk = writeIfMissing("credentials_login_valid.json", {
  email: process.env.LOGIN_VALID_EMAIL || process.env.VALID_USER_EMAIL,
  password: process.env.LOGIN_VALID_PASSWORD || process.env.VALID_USER_PASSWORD
});

const invalidOk = writeIfMissing("credentials_login_invalid.json", {
  email:
    process.env.LOGIN_INVALID_EMAIL ||
    process.env.INVALID_USER_EMAIL ||
    "invalid@example.com",
  password:
    process.env.LOGIN_INVALID_PASSWORD ||
    process.env.INVALID_USER_PASSWORD ||
    "invalid-password"
});

if (!validOk || !invalidOk) {
  process.exit(1);
}
