const datamapper = require("../../models/user");

const userController  = {
  async getUserByUID(req, res) {
    const userUID = req.body.userUID;
    console.log("CTRL getUserByUID userUID", userUID);

    try {
      const user = await datamapper.getExplorerInfo(userUID);
      console.log("CTRL user", user);
      res.json(user);
    } catch (error) {
      res.status(500).send(error);
    }
   },
   async createUser(req, res) {
    console.log("ENTERRING CREATE USER");
    const { userUID, username } = req.body;
    console.log("CTRL req.body userUID", userUID, username);

    if (!userUID || !username) {
      return res.status(400).json({ error: 'UserUID and username are required' });
    }
  
    try {
      const user = await datamapper.createExplorer(userUID, username);
      console.log("CTRL User created successfully:", user);
  
      return res.status(200).json({ message: 'User successfully registered!', user });
    } catch (err) {
      console.error("Error during user creation:", err); 
      return res.status(500).json({ error: 'Error during sign-up: ' + err.message });    }
  }

};

module.exports = userController;
