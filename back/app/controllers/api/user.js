const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

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

      if (response.data.user === null) {
        res.status(401).json({message: "Wrong logins", user, session});
      } else {
        res.status(200).json({ user, session });
      }

    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).send({ message: 'An error occurred during login.', error: error.message });
    }
  },
  // Sign out
  async signOut() {
      console.log("SUPA SIGNOUT");
      try {
      const { error } = await supabase.auth.signOut()
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

    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      console.log('AUTH ERROR: no user');
      return res.redirect('/'); // Redirect to the login page if token is invalid
    }

    req.user = user; // Attach user info to request object
    req.authenticated = true;

    console.log('MDLW REQ USER', req.user);

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
