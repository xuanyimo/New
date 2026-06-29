
import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';

// Increase timeout (VERY IMPORTANT)
setDefaultTimeout(60000);

Before(async function () {
  console.log("Before hook running...");

  await this.init();
});

After(async function () {
  console.log("After hook running...");

  await this.close();
});
``
