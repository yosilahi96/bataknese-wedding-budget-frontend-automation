const { Before, After, Status } = require("@cucumber/cucumber");
const fs = require("fs");
const { chromium, firefox, webkit } = require("playwright");
const config = require("./env");
const {
  ensureDir,
  sanitizeFileName,
  shouldRecordVideo,
  shouldKeepArtifact
} = require("./artifacts");

const browsers = { chromium, firefox, webkit };

Before(async function (scenario) {
  const browserType = browsers[config.browserName];

  if (!browserType) {
    throw new Error(`Unsupported browser "${config.browserName}". Use chromium, firefox, or webkit.`);
  }

  const scenarioSlug = sanitizeFileName(scenario.pickle.name);
  this.scenarioName = scenario.pickle.name;
  this.artifactsDir = ensureDir(`test-results/${scenarioSlug}-${Date.now()}`);

  this.browser = await browserType.launch({
    headless: config.headless,
    slowMo: config.slowMo
  });
  this.context = await this.browser.newContext({
    viewport: config.viewport,
    ignoreHTTPSErrors: config.ignoreHttpsErrors,
    recordVideo: shouldRecordVideo(config.video)
      ? { dir: this.artifactsDir }
      : undefined
  });

  if (config.trace !== "off") {
    await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  }

  this.setPage(await this.context.newPage());
});

After(async function (scenario) {
  const failed = scenario.result?.status === Status.FAILED;

  if (this.page && shouldKeepArtifact(config.screenshot, failed)) {
    const screenshot = await this.page.screenshot({
      path: `${this.artifactsDir}/screenshot.png`,
      fullPage: true
    });
    await this.attach(screenshot, "image/png");
  }

  if (this.context && config.trace !== "off") {
    const tracePath = `${this.artifactsDir}/trace.zip`;

    if (shouldKeepArtifact(config.trace, failed)) {
      await this.context.tracing.stop({ path: tracePath });
      await this.attach(`Trace saved to ${tracePath}`, "text/plain");
    } else {
      await this.context.tracing.stop();
    }
  }

  const videoPath = this.page && this.page.video()
    ? await this.page.video().path().catch(() => null)
    : null;

  if (this.context) {
    await this.context.close();
  }

  if (videoPath && shouldKeepArtifact(config.video, failed)) {
    await this.attach(`Video saved to ${videoPath}`, "text/plain");
  } else if (videoPath && fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
  }

  if (this.browser) {
    await this.browser.close();
  }
});
