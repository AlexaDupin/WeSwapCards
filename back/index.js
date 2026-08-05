// Only polyfill fetch/Request/Headers if the Node runtime doesn't
// already provide them natively (Node 18+ does). On modern Node,
// overriding these with node-fetch v2 breaks Clerk's JWKS verification.
if (typeof globalThis.fetch !== 'function') {
  const fetch = require('node-fetch');  // Import node-fetch version 2.x
  global.fetch = fetch;        // Set fetch globally
  global.Request = fetch.Request;  // Set global Request to node-fetch's Request
  global.Headers = fetch.Headers;  // Expose Headers globally
}

// Initialize Sentry as early as possible, but AFTER the fetch guard above so it
// instruments the same fetch the app will use. No-op unless SENTRY_DSN is set.
require('./instrument');
const Sentry = require('@sentry/node');

if (typeof(PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}

const express = require('express');
require('dotenv').config();
require('./app/worker/imageIngestionWorker');
const { clerkMiddleware } = require('@clerk/express');

const router = require('./app/routers');
const cors = require('cors');
const { Webhook } = require('svix');
const bodyParser = require('body-parser');
const datamapper = require("./app/models/user");
const { notFoundHandler, errorHandler } = require('./app/middlewares/errorHandler');

const app = express();
const port = process.env.PORT ?? 3001;

const corsOptions = {
  origin: process.env.CORS_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Clerk webhook to listen to user events
app.post('/api/webhooks',
    bodyParser.raw({ type: 'application/json' }),
  
    async (req, res) => {
      const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET
  
      if (!SIGNING_SECRET) {
        console.error('CLERK_SIGNING_SECRET is missing');
        return res.status(500).json({
          success: false,
          message: 'Missing CLERK_SIGNING_SECRET in env',
        });
      }
  
      // Create new Svix instance with secret
      const wh = new Webhook(SIGNING_SECRET)
      // Get Svix headers for verification
      const svix_id = req.headers['svix-id'];
      const svix_timestamp = req.headers['svix-timestamp'];
      const svix_signature = req.headers['svix-signature'];
  
      // If there are no headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({
          success: false,
          message: 'Error: Missing svix headers',
        })
      }
  
      let evt;
  
      // Attempt to verify the incoming webhook
      // If successful, the payload will be available from 'evt'
      // If verification fails, error out and return error code
      try {
        const payloadString = req.body.toString('utf8');
        evt = wh.verify(payloadString, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        })
      } catch (err) {
        console.error('Error: Could not verify webhook:', err.message)
        return res.status(400).json({
          success: false,
          message: err.message,
        })
      }
  
      try {
        const { id } = evt.data
        const eventType = evt.type
        console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
        console.log('Webhook payload:', evt.data)

        if (eventType === 'user.deleted') {
          console.log('userId:', evt.data.id)
          try {
              // deleteExplorer cascades to the user's cards, push tokens,
              // conversations, and messages. Idempotent: rowCount 0 means the
              // explorer is already gone (e.g. the in-app DELETE /account path
              // purged it first), which is a success, not an error.
              const rowCount = await datamapper.deleteExplorer(evt.data.id);
              console.log(
                rowCount === 1
                  ? `Deleted user from db: ${evt.data.id}`
                  : `User already absent from db (no-op): ${evt.data.id}`,
              );
              return res.status(200).json({ message: 'User deleted from db' });
          } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ error: 'Error while deleting user: ' + error.message });
          }
        }

        return res.status(200).json({ ok: true });
      } catch (err) {
        console.error('Webhook handler error:', err);
        return res.status(500).json({ error: 'Internal error in webhook handler' });
      }

    },
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use(router);

// NOT a health check: no dependencies, proves only that the process is up.
// The real check is GET /api/health.
app.get('/', function(req, res) {
    const body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

// JSON 404 for unmatched /api routes, then the centralized error handler.
// API routes never redirect — auth/authorization failures come back as JSON.
app.use('/api', notFoundHandler);

// Sentry captures errors (5xx by default) before our handler formats the
// response. No-op when SENTRY_DSN is unset. Must be after all routes and before
// our own error handler.
Sentry.setupExpressErrorHandler(app);

app.use(errorHandler);

// Make the runtime shape visible in the logs at boot. The prod outage was a
// silent Node bump (native fetch) vs. an unconditional node-fetch polyfill; if
// fetch ever stops being native again, this line says so immediately.
const fetchKind =
  typeof globalThis.fetch !== 'function'
    ? 'MISSING'
    : globalThis.fetch.Promise || typeof globalThis.fetch.isRedirect === 'function'
    ? 'polyfilled (node-fetch)'
    : 'native';
// swapFilter is logged because losing those env vars unfilters results silently.
const { swapFilterSummary } = require('./app/models/datamapper');
console.log(
  `[startup] node=${process.version} fetch=${fetchKind} ` +
  `env=${process.env.NODE_ENV || 'undefined'} swapFilter=${swapFilterSummary()}`,
);

if (typeof(PhusionPassenger) !== 'undefined') {
    app.listen('passenger');
    console.log(`Listening on passenger`);

} else {
    app.listen(`${port}`);
    console.log(`Listening on ${port}`);
}