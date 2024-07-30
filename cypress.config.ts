import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },

  e2e: {
    baseUrl: 'http://localhost:4200', // Set this to the URL where your Angular app is served
    setupNodeEvents(on, config) {
      // implement node event listeners here, such as custom tasks or plugins
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
