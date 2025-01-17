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
   
};

module.exports = userController;
