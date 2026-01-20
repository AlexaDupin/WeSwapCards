if (typeof fetch !== "function") {
  const fetch = require('node-fetch');  // Import node-fetch version 2.x
  global.fetch = fetch;  // Set fetch globally
  
  // Polyfill global Request (used by Clerk)
  global.Request = fetch.Request;  // Set global Request to node-fetch's Request
  global.Headers = fetch.Headers;     // Expose Headers globally
}

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
              const response = await datamapper.deleteExplorer(evt.data.id);
              if (response === 1) {
                  console.log("Deleted user from db:", evt.data.id);
                  return res.status(200).json({ message: 'User deleted from db'});
              } else {
                  console.log("Failed to delete user from db:", evt.data.id);
                  return res.status(404).json({ message: 'User not found'});
              }
          } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Error while deleting user: ' + error.message });
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

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use('/api', (err, _req, res, _next) => {
  console.error("API ERROR:", err);  
  const status = err?.status || err?.statusCode || 500;
  const msg = err?.message || 'Server error';
  res.status(status).json({ error: msg });
});

app.get('/', function(req, res) {
    const body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

if (typeof(PhusionPassenger) !== 'undefined') {
    app.listen('passenger');
    console.log(`Listening on passenger`);

} else {
    app.listen(`${port}`);
    console.log(`Listening on ${port}`);
}