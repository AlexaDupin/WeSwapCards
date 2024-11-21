const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const cookie = require('cookie'); 

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
// const datamapper = require("../../models/datamapper");
const datamapper = require("../../models/user");

const userController  = {
  // Sign up
  async signUp(req, res) {
    const { email, password} = req.body;
    console.log({email, password});

    try {
      const response = await supabase.auth.signUp({
        email,
        password,
      })

      // console.log('Supabase response:', response); // Log the entire response
      const { user, session, error } = response.data;
      console.log('SIGN UP data', response.data);

      if (error) {
        console.error('Supabase error:', error.message);
        res.status(401).json({ message: error.message });
      } else {
        res.status(200).json({ user, session });
      }

    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).send({ message: 'An error occurred during registration.', error: error.message });
    }
},
  // Create new user after retrieving username
  async createUser(req, res) {
    // const userUID = req.body.userUID;
    // const name = req.body.username;
    const { userUID, username } = req.body;
    console.log("CTRL req.body", req.body);

    try {
      const user = await datamapper.createExplorer(userUID, username);

      console.log("CTRL user", user);
      res.json(user);

    } catch (error) {
      console.error("Error in creating user:", error);

        // Check if the error is due to a unique constraint violation
        if (error.code === '23505') {
            // Unique constraint violation
            return res.status(400).send({ message: 'Username must be unique' });
        } else {
            return res.status(500).send({ message: 'An error occurred while creating the user', error: error.message });
        }
    }
  },
  // Sign in
  async login(req, res) {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      const { user, session, error } = response.data;
      console.log('LOGIN data', response.data);

      if (error) {
        console.error('Supabase error:', error.message);
        throw error;
      }

      if (!user) {
        res.status(401).json({message: "Wrong logins", user, session});
      }

       // Successfully authenticated, set the refresh token in an HTTP-only cookie
      const refreshToken = session.refresh_token;

      // Set the refresh token cookie (HTTP-only, Secure, SameSite=Strict for protection)
      res.setHeader('Set-Cookie', cookie.serialize('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Only secure cookies in production
        sameSite: 'Strict',  // CSRF protection
        maxAge: 30 * 24 * 60 * 60,  // Refresh token expiry (e.g., 30 days)
        path: '/',  // Available to all paths
      }));

      // Send back user and session data (Access token is not necessary since it's in the Authorization header)
      res.status(200).json({ user, session });

    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).send({ message: 'An error occurred during login.', error: error.message });
    }
  },
  // Sign out
  async signOut(req, res) {
      console.log("SUPA SIGNOUT");
      try {
        const { error } = await supabase.auth.signOut()

        if (error) {
          return res.status(400).send({ message: 'An error occurred during sign out.', error: error.message });
        }
    
        res.status(200).send({ message: 'User signed out successfully' });
      } catch (error) {
        console.error("Error during sign out:", error);
        return res.status(500).send({ message: 'An error occurred during sign out.', error: error.message });
      }
  },

  // Authorization middleware
  async authMiddleware(req, res, next) {
    const token = req.headers['authorization']; // Extract token from Authorization header   
    console.log('TOKEN MDW', token);

    if (!token) {
      console.log('AUTH ERROR: no token');
      return res.redirect('/');
    }

    try {
      const response = await supabase.auth.getUser(token);

      if (response.error && response.error.code === 'bad_jwt') {
        // Token is expired or invalid, try to refresh it using the refresh token from cookies
        console.log('Token expired or invalid, trying to refresh token...');
  
        const refreshToken = req.cookies.refresh_token; // Extract refresh token from cookies
        if (!refreshToken) {
          console.log('AUTH ERROR: no refresh token');
          return res.redirect('/login'); // If no refresh token, re-login required
        }
  
        // Use the refresh token to get a new access token
        const refreshResponse = await supabase.auth.api.refreshAccessToken(refreshToken);
        if (refreshResponse.error) {
          console.log('AUTH ERROR: refresh token failed');
          return res.redirect('/login'); // Refresh failed, redirect to login
        }
  
        // If refresh is successful, get the new access token
        const newToken = refreshResponse.data.access_token;
        req.headers['authorization'] = newToken; // Set the new token in the headers
  
        // Get the user again with the new access token
        const userResponse = await supabase.auth.getUser(newToken);
        if (!userResponse.data.user) {
          console.log('AUTH ERROR: no user');
          return res.redirect('/login');
        }
  
        req.user = userResponse.data.user;
        req.authenticated = true;
        console.log('MDLW REQ USER', req.user);
      } else {
        // Token is valid, proceed with the request
        req.user = response.data.user;
        req.authenticated = true;
        console.log('MDLW REQ USER', req.user);
      }
      // // const { data: { user } } = await supabase.auth.getUser(token);
      // console.log("DATA", response);

      // if (!response.data.user) {
      //   console.log('AUTH ERROR: no user');
      //   return res.redirect('/login'); // Redirect to the login page if token is invalid
      // }

      // req.user = user; // Attach user info to request object
      // req.authenticated = true;

      // console.log('MDLW REQ USER', req.user);

    } catch (error) {
      console.error("Error in authentication middleware:", error);
      return res.status(500).send({ message: 'An error occurred in authentication middleware.', error: error.message });
    }

    next();
  },
  async getUserByUID(req, res) {
    const userUID = req.user.id;
    console.log("CTRL getUserByUID req.user", req.user);

    try {
      const user = await datamapper.getExplorerInfo(userUID);
      console.log("CTRL user", user);
      res.json(user);
    } catch (error) {
      res.status(500).send(error);
    }
   },

   
  // GetUserData
  async getUser(req, res) {
    const token = req.headers['authorization']; // Extract token from Authorization header   

    if (!token) {
      // return res.redirect('/'); // Redirect to the login page if no token
      return res.status(401).json({ message: 'Unauthorized - NO token' });
    }

    // const { data: { user } } = await supabase.auth.getUser(token);
    const response = await supabase.auth.getUser(token);
    // console.log('RESPONSE GET U', response);
    const user = response.data.user;

    console.log('GET USER', user);

    if (!user) {
      console.log('AUTH ERROR');
      return res.redirect('/'); // Redirect to the login page if token is invalid
    }

    res.status(200).json(user);
  },

};

module.exports = userController;
