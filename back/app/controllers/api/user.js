const datamapper = require("../../models/user");

const userController  = {
  // async getUserByUID(req, res) {
  //   const userUID = req.body.userUID;
  //   console.log("CTRL getUserByUID userUID", userUID);

  //   try {
  //     const user = await datamapper.getExplorerInfo(userUID);
  //     console.log("CTRL user", user);
  //     res.json(user);
  //   } catch (error) {
  //     res.status(500).send(error);
  //   }
  //  },
   async createUser(req, res) {
    console.log("ENTERRING CREATE USER");
    const { userUID, username } = req.body;
    // console.log("CTRL req.body", req.body);
    // const userUID = req.body.userUID;
    // const name = req.body.username;
    console.log("CTRL req.body userUID", userUID, username);
    console.log("CTRL userUID", userUID);
    console.log("CTRL name", username);

    if (!userUID || !username) {
      return res.status(400).json({ error: 'UserUID and username are required' });
    }
  
    try {
      // Insert user data into Supabase
      console.log("CTRL Attempting to insert user into Supabase...");

      const user = await datamapper.createExplorer(userUID, username);
      console.log("CTRL User created successfully:", user);
  
      return res.status(200).json({ message: 'User successfully registered!', user });
    } catch (err) {
      console.error("Error during user creation:", err); // Log the full error object
      return res.status(500).json({ error: 'Error during sign-up: ' + err.message });    }
  }
//         // const userUID = req.body.userUID;
//         // const name = req.body.username;
//         const { userUID, username } = req.body;
//         console.log("CTRL req.body", req.body);
    
//         try {
          // const user = await datamapper.createExplorer(userUID, username);
    
//           console.log("CTRL user", user);
//           res.json(user);
    
//         } catch (error) {
//           console.error("Error in creating user:", error);
    
//             // Check if the error is due to a unique constraint violation
//             if (error.code === '23505') {
//                 // Unique constraint violation
//                 return res.status(400).send({ message: 'Username must be unique' });
//             } else {
//                 return res.status(500).send({ message: 'An error occurred while creating the user', error: error.message });
//             }
//         }
//       },
   
};

module.exports = userController;
