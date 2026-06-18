require("dotenv").config();

const DEFAULTS = {
  browser: "chromium",
  headless: "true",
  timeout: "60000",
  viewportWidth: "1440",
  viewportHeight: "900",
  screenshot: "only-on-failure",
  video: "off",
  trace: "retain-on-failure",
  slowMo: "0",
  ignoreHttpsErrors: "false",
  baseFeUrl: "https://example.com"
};

function env(name, fallback) {
  return process.env[name] || fallback;
}

function asBoolean(value) {
  return String(value).toLowerCase() === "true";
}

function asNumber(name, fallback) {
  const value = Number(env(name, fallback));

  if (Number.isNaN(value)) {
    throw new Error(`${name} must be a number.`);
  }

  return value;
}

module.exports = {
  baseFeUrl() {
    return env("BASE_FE_URL", DEFAULTS.baseFeUrl);
  },
  browserName: env("BROWSER", DEFAULTS.browser),
  headless: asBoolean(env("HEADLESS", DEFAULTS.headless)),
  defaultTimeout: asNumber("DEFAULT_TIMEOUT", DEFAULTS.timeout),
  slowMo: asNumber("SLOW_MO", DEFAULTS.slowMo),
  ignoreHttpsErrors: asBoolean(env("IGNORE_HTTPS_ERRORS", DEFAULTS.ignoreHttpsErrors)),
  screenshot: env("SCREENSHOT", DEFAULTS.screenshot),
  video: env("VIDEO", DEFAULTS.video),
  trace: env("TRACE", DEFAULTS.trace),
  viewport: {
    width: asNumber("VIEWPORT_WIDTH", DEFAULTS.viewportWidth),
    height: asNumber("VIEWPORT_HEIGHT", DEFAULTS.viewportHeight)
  }
};
