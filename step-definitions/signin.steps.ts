
import { Given, When } from '@cucumber/cucumber';
import { SignInPage } from '../pages/signin.page';

let signInPage: SignInPage;

Given('user is on the Oracle sign in landing page', async function () {
  const page = (this as any).page;
  signInPage = new SignInPage(page);

  await signInPage.navigateToSignIn(
    'https://idcs-7a2538a62c0544dd9d9d1de1c3a71bfb.identity.oraclecloud.com/ui/v1/signin'
  );
});

When('user clicks sign in button', async function () {
  await signInPage.clickSignIn();
});
