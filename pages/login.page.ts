import { Page } from '@playwright/test';


export class loginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(
      'https://idcs-7a2538a62c0544dd9d9d1de1c3a71bfb.identity.oraclecloud.com/ui/v1/signin',
      { waitUntil: 'networkidle' }
    );
  }

  async enterUsername(username: string) {
    console.log("Waiting for Oracle login page...");
    await this.page.waitForLoadState('networkidle');
    const usernameField = this.page.locator(
      'input[name="userid"], input[name="username"], input[type="email"], input[type="text"]'
    ).first();

    console.log("Locating username field...");
    await usernameField.waitFor({ state: 'visible', timeout: 30000 });
    await usernameField.click();
    await usernameField.fill('');
    await usernameField.fill(username);
    console.log("Username entered");
  }

  async enterPassword(password: string) {
    console.log("Entering password...");

    const passwordField = this.page.locator('input[type="password"]');

    await passwordField.waitFor({ state: 'visible', timeout: 30000 });
    await passwordField.click();
    await passwordField.fill('');
    await passwordField.fill(password);
  }

  async getErrorMessage(): Promise<string> {
    console.log("Fetching error message...");

    const errorLocator = this.page.locator('text=Invalid');

    await errorLocator.waitFor({ state: 'visible', timeout: 10000 });

    return await errorLocator.textContent() || '';
  }
}
