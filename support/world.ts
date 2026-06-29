
import { setWorldConstructor } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';

export class CustomWorld {
  browser?: Browser;
  page?: Page;

  async init() {
    console.log("Launching browser...");

this.browser = await chromium.launch({
  headless: true // REQUIRED in Codespaces
});

    this.page = await this.browser.newPage();
  }

  async close() {
    console.log("Closing browser...");

    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);