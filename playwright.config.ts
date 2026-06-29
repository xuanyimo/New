
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    browserName: 'chromium'
  }
});
