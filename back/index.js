const fetch = require('node-fetch');  // Import node-fetch version 2.x
global.fetch = fetch;  // Set fetch globally

// Polyfill global Request (used by Clerk)
global.Request = fetch.Request;  // Set global Request to node-fetch's Request
global.Headers = fetch.Headers;     // Expose Headers globally

if (typeof(PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}

const express = require('express');
require('dotenv').config();
const { clerkMiddleware } = require('@clerk/express');

const router = require('./app/routers');
const cors = require('cors');
const { Webhook } = require('svix');
const bodyParser = require('body-parser');
const datamapper = require("./app/models/user");

const app = express();
const port = process.env.PORT ?? 3001;

app.get('/', function(req, res) {
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

// Clerk webhook to listen to user events
app.post('/api/webhooks',
    bodyParser.raw({ type: 'application/json' }),
  
    async (req, res) => {
      const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET
  
      if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
      }
  
      // Create new Svix instance with secret
      const wh = new Webhook(SIGNING_SECRET)
  
      // Get headers and body
      const headers = req.headers
      const payload = req.body
  
      // Get Svix headers for verification
      const svix_id = headers['svix-id']
      const svix_timestamp = headers['svix-timestamp']
      const svix_signature = headers['svix-signature']
  
      // If there are no headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return void res.status(400).json({
          success: false,
          message: 'Error: Missing svix headers',
        })
      }
  
      let evt
  
      // Attempt to verify the incoming webhook
      // If successful, the payload will be available from 'evt'
      // If verification fails, error out and return error code
      try {
        evt = wh.verify(payload, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        })
      } catch (err) {
        console.log('Error: Could not verify webhook:', err.message)
        return void res.status(400).json({
          success: false,
          message: err.message,
        })
      }
  
      // Do something with payload
      const { id } = evt.data
      const eventType = evt.type
      console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
      console.log('Webhook payload:', evt.data)
      if (evt.type === 'user.deleted') {
        console.log('userId:', evt.data.id)
        try {
            const response = await datamapper.deleteExplorer(evt.data.id);
            if (response === 1) {
                console.log("Deleted user from db:", evt.data.id);
                return res.status(200).json({ message: 'User deleted from db'});
            } else {
                console.log("Failed to delete user from db:", evt.data.id);
                return res.status(400).json({ message: 'User not found'});
            }
          } catch (error) {
            res.status(500).json({ error: 'Error while deleting user: ' + error.message });
          }
      }
  
    //   return void res.status(200).json({
    //     success: true,
    //     message: 'Webhook received',
    //   })
    },
);

// app.listen(3000, () => {
//     console.log("Server Listening on port 3000");
// })

// Payload JSON
app.use(express.json());
// Payload urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

const corsOptions = {
  origin: process.env.CORS_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(router);

if (typeof(PhusionPassenger) !== 'undefined') {
    app.listen('passenger');
    console.log(`Listening on passenger`);

} else {
    app.listen(`${port}`);
    console.log(`Listening on ${port}`);
}

// module.exports = app;