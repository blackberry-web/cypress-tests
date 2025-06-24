const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
      baseUrl: process.env.CYPRESS_BASE_URL,
      setupNodeEvents(on, config) {
      },
      env: {
        loginEmail: process.env.CYPRESS_USER,
        loginPassword: process.env.CYPRESS_PASSWORD,
    },
  },
});
