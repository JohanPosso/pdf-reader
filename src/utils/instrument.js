// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://d264076a069b899b505dd434368e24fb@o4509723118665728.ingest.de.sentry.io/4509723123515472',

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
