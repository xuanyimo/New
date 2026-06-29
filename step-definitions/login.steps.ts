
import { Given, When, Then } from '@cucumber/cucumber';
import { loginPage as LoginPageClass } from '../pages/login.page';
import { expect, type Page } from '@playwright/test';
import { OTPService } from '../utils/otp.service';


let loginPageInstance: LoginPageClass;

Given(/^user is on Oracle login page$/, async function () {
  console.log('GIVEN STEP RUNNING');

  loginPageInstance = new LoginPageClass(this.page);

  await loginPageInstance.navigate();

  console.log('Navigation done');
});

When(/^user enters username "([^"]*)"$/, async function (username: string) {
  console.log('WHEN USERNAME STEP');

  if (!loginPageInstance) {
    throw new Error('loginPage is NOT initialised');
  }

  await loginPageInstance.enterUsername(username);
});

When(/^user enters password "([^"]*)"$/, async function (password: string) {
  console.log('WHEN PASSWORD STEP');

  if (!loginPageInstance) {
    throw new Error('loginPage is NOT initialised');
  }

  await loginPageInstance.enterPassword(password);
});

Then(/^error message should be displayed$/, async function () {
  console.log('THEN STEP');

  const error = await loginPageInstance.getErrorMessage();
  expect(error).toBeTruthy();
});

Then(/^user clicks on My Team tab$/, async function () {
  console.log('THEN STEP - My Team');

  const myTeamButton = this.page.getByRole('link', { name: 'My Team' });

  await myTeamButton.waitFor({ state: 'visible', timeout: 15000 });
  await myTeamButton.click();
});

Then(/^user should see My Team page$/, async function () {
  console.log('VERIFY My Team page');

  const myTeamHeader = this.page.getByRole('heading', { name: 'My Team' });

  await myTeamHeader.waitFor({ state: 'visible', timeout: 15000 });

  const headerText = await myTeamHeader.innerText();
  expect(headerText).toBe('My Team');
});


Then('user completes OTP verification', async function () {
  // wait for a likely OTP input to appear before polling
  await this.page.waitForSelector(
    'input[name="otp"], input[id*="otp"], input[placeholder*="OTP"], input[placeholder*="One-time"], input[type="tel"]',
    { state: 'visible', timeout: 15000 }
  );

  const otpService = new OTPService();
  const otp = await otpService.pollOTP();

  console.log(`OTP Retrieved: ${otp}`);

  // try common OTP input selectors first
  const otpSelectors = [
    'input[name="otp"]',
    'input[id*="otp"]',
    'input[placeholder*="OTP"]',
    'input[placeholder*="One-time"]',
    'input[type="tel"]',
  ];

  let filled = false;
  for (const sel of otpSelectors) {
    const element = await this.page.$(sel);
    if (element) {
      await this.page.fill(sel, otp);
      filled = true;
      break;
    }
  }

  // fallback to loginPageInstance.enterOTP if available at runtime
  if (!filled && loginPageInstance && typeof (loginPageInstance as any).enterOTP === 'function') {
    await (loginPageInstance as any).enterOTP(otp);
  }
});

