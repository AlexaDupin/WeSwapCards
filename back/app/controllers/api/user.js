const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const datamapper = require("../../models/datamapper");

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

      console.log('Supabase response:', response); // Log the entire response
      const { user, session, error } = response.data;
      console.log('SIGN UP data', response.data);

      if (error) {
        console.error('Supabase error:', error.message);
        res.status(401).json({ message: error.message });
      } else {
        res.status(200).json({ user, session });
      }

    } catch (error) {
        res.status(500).send(error);
    }
},
// Create new user after retrieving username
async createUser(req, res) {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  // Passing through body
  const userUIID = req.body.userUIID;
  console.log("CTRL getUserByUIID userUIID", userUIID);

  if (!token) {
    // return res.redirect('/'); // Redirect to the login page if no token
    return res.status(401).json({ message: 'Unauthorized - NO token' });
  }

  try {
    const user = await datamapper.getExplorerInfo(userUIID);
    console.log("CTRL user", user);
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
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

      if (response.data.user == null) {
        res.status(401).json({message: "Wrong logins", user, session});
      } else {
        res.status(200).json({ user, session });
      }

    } catch (error) {
      res.status(500).send(error);
    }
  },

  // Sign out
  async signOut() {
      console.log("SUPA SIGNOUT");
      const { error } = await supabase.auth.signOut()
      if (error) throw error
  },

  // Authorization middleware
  async authMiddleware(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
    console.log('TOKEN MDW', token);
    if (!token) {
      // return res.redirect('/'); // Redirect to the login page if no token
      // return res.status(401).json({ message: 'Unauthorized - NO token' });
      return res.redirect('/');
    }

    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      console.log('AUTH ERROR');
      return res.redirect('/'); // Redirect to the login page if token is invalid
    }

    req.user = user; // Attach user info to request object
    req.authenticated = true;

    // console.log('REQ USER', req.user);

    next(); // Proceed to the next middleware or route handler
  },
  // GetUserData
  async getUser(req, res) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
      // return res.redirect('/'); // Redirect to the login page if no token
      return res.status(401).json({ message: 'Unauthorized - NO token' });
    }

    // const { data: { user } } = await supabase.auth.getUser(token);
    const response = await supabase.auth.getUser(token);
    // console.log('RESPONSE GET U', response);
    const user = response.data.user;
    
    console.log('USER DATA getUSer', user);

    if (!user) {
      console.log('AUTH ERROR');
      return res.redirect('/'); // Redirect to the login page if token is invalid
    }

    res.status(200).json(user);             
  },
  async getUserByUIID(req, res) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    // Passing through body
    const userUIID = req.body.userUIID;
    console.log("CTRL getUserByUIID userUIID", userUIID);

    if (!token) {
      // return res.redirect('/'); // Redirect to the login page if no token
      return res.status(401).json({ message: 'Unauthorized - NO token' });
    }

    try {
      const user = await datamapper.getExplorerInfo(userUIID);
      console.log("CTRL user", user);
      res.json(user);
    } catch (error) {
      res.status(500).send(error);
    }
   },
};

module.exports = userController;