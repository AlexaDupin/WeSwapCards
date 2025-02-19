const datamapper = require("../../models/user");

const userController  = {
  // Retrieve user info from database using Clerk userId
  async getUserByUID(req, res) {
    const userUID = req.body.userUID;
    console.log("CTRL getUserByUID userUID", userUID);

    try {
      const user = await datamapper.getExplorerInfo(userUID);
      console.log("CTRL user", user);
      return res.status(200).json(user);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  // Create new user in database with username and Clerk id
  async createUser(req, res) {
   console.log("ENTERRING CREATE USER");
   const { userUID, sanitizedUsername } = req.body;
   console.log("CTRL userUID username", userUID, sanitizedUsername);
   console.log("CTRL req.body", req.body);
   if (!userUID || !sanitizedUsername) {
     return res.status(400).json({ error: 'UserUID and username are required' });
   }
   // Sanitize username to remove any characters that are not alphanumeric or underscores
   const sanitizeUsername = (username) => {
     return username.replace(/[^a-zA-Z0-9_]/g, '');
   };
   sanitizedUsernameBack = sanitizeUsername(sanitizedUsername);

   const usernameRegex = /^[a-zA-Z0-9_]{2,30}$/;
   if (!usernameRegex.test(sanitizedUsernameBack)) {
     return res.status(400).json({ error: 'Username format is invalid. It must be 2-30 characters and contain only letters, numbers, and underscores.' });
   }
   
   try {
     const user = await datamapper.createExplorer(userUID, sanitizedUsernameBack);
     console.log("CTRL User created successfully:", user);

     return res.status(201).json({ message: 'User successfully registered!', user });
   } catch (err) {
     console.error("Error during user creation:", err); 
     return res.status(500).json({ error: 'Error during sign-up: ' + err.message });    }
  }

};

module.exports = userController;
