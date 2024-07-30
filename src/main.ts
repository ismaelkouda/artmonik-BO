import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { enableProdMode, ViewEncapsulation } from "@angular/core";
import { environment } from "./environments/environment";
import * as Sentry from "@sentry/angular-ivy";

Sentry.init({
  dsn: "https://6ef2970d6a68fc1a0ca5612a145b910a@o4506076809854976.ingest.us.sentry.io/4507226172227584",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/api-rest-distribution\.pretty-rattlesnake-77\.telebit\.io\/api\/v1/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    defaultEncapsulation: ViewEncapsulation.Emulated,
  })
  .catch((err) =>
    console.error(
      `Main:bootstrapModule: Application bootstrap error is ${err} ${JSON.stringify(err)}`,
    ),
  );
