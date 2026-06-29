
import { Page } from '@playwright/test';

export class SignInPage {
  private page: Page;

  // Locator (XPath)
  private signInButton = '//*[@id="width_full_button"]';

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToSignIn(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }


async clickSignIn() {
  await this.page.waitForLoadState('networkidle');
  await this.page.getByRole('button', { name: 'Sign in' }).click();
  
// Take screenshot BEFORE click (to debug what is on screen)
  await this.page.screenshot({ path: 'signin-before-click.png' });

}
}