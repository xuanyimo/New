
import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('user navigates to the signin page only', async function () {
  console.log("Opening Sign-in page...");

  await this.page.goto('https://navigator.oracle.com/navigator-ui/');

  await this.page.waitForLoadState('domcontentloaded');

  // Debug screenshot
  await this.page.screenshot({ path: 'signin-page.png' });

  console.log("Navigation complete");
});

Then('signin page should be displayed', async function () {
    console.log("Verifying Sign-in page...");

  // Flexible Oracle page validation
  
const usernameField = this.page.locator(
  'input[name="userid"], input[type="email"], input[placeholder*="User"]'
);

const signInText = this.page.locator('text=Sign In');

// check either condition
const isVisible =
  (await usernameField.first().isVisible()) ||
  (await signInText.first().isVisible());

if (!isVisible) {
  throw new Error("Sign-in page not displayed correctly");
}});
