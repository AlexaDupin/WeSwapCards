const { clerkClient } = require("@clerk/express");
const datamapper = require("../../models/user");

const userController  = {
  // Retrieve user info from database using Clerk userId
  async getUserByUID(req, res, next) {
    const userUID = req.body.userUID;
    //console.log("CTRL getUserByUID userUID", userUID);

    try {
      const user = await datamapper.getExplorerInfo(userUID);
      //console.log("CTRL user", user);
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },

  // Create new user in database with username and Clerk id
  async createUser(req, res) {
   //console.log("ENTERRING CREATE USER");
   const { userUID, userEmail, sanitizedUsername } = req.body;
   console.log("CTRL Creation of user:", userUID, userEmail, sanitizedUsername);
   //console.log("CTRL req.body", req.body);
   if (!userUID || !sanitizedUsername) {
     return res.status(400).json({ error: 'UserUID and username are required' });
   }
   // Sanitize username to remove any characters that are not alphanumeric,
   // underscores, or full stops. Full stops are allowed so usernames can match
   // external ones (e.g. WeWard) exactly. Keep this character set in sync with
   // the mobile USERNAME_PATTERN in app/(auth)/register-user.tsx.
   const sanitizeUsername = (username) => {
     return username.replace(/[^a-zA-Z0-9_.]/g, '');
   };
   sanitizedUsernameBack = sanitizeUsername(sanitizedUsername);

   const usernameRegex = /^[a-zA-Z0-9_.]{2,20}$/;
   if (!usernameRegex.test(sanitizedUsernameBack)) {
     return res.status(400).json({ error: 'Username format is invalid. It must be 2-20 characters and contain only letters, numbers, underscores, and full stops.' });
   }
   
   try {
     const user = await datamapper.createExplorer(userUID, sanitizedUsernameBack);
     //console.log("CTRL User created successfully:", user);

     return res.status(201).json({ message: 'User successfully registered!', user });
   } catch (err) {
     console.error("Error during user creation:", err);

     if (err.code === '23505') {
      if (err.constraint === 'explorer_UIID_key') {
        return res.status(409).json({ error: `UserID '${userUID}' is already registered. Username already logged for this user.` });
      } else if (err.constraint === 'explorer_name_key') {
        return res.status(409).json({ error: `Username '${sanitizedUsernameBack}' is already taken. Please choose a different username.` });
      }
    }

     return res.status(500).json({ error: 'Error during sign-up: ' + err.message });
   }
  },
  async updateLastActive (req, res) {
    const explorerId = req.params.explorerId;
    // console.log("USER CTRL last active explorerId", explorerId);

    try {
      await datamapper.updateExplorerActivity(explorerId, new Date());
      // console.log("USER CTRL last active", lastActive);
      res.status(200).json({ message: 'User last active timestamp updated' });
    } catch (error) {
      console.error('Error updating last active in db:', error);
      res.status(500).json({ error: 'Failed to update last active timestamp' });
    }
  },

  // DELETE /account — let an authenticated user delete their own account.
  // Order is deliberate: delete the Clerk identity FIRST (the PII-bearing record);
  // only on success do we purge the local data. The Clerk deletion also fires the
  // user.deleted webhook, which runs the same deleteExplorer as an idempotent
  // backstop — so a failure of the synchronous purge below still gets cleaned up.
  async deleteAccount(req, res) {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // 1) Delete the Clerk user. If this throws, nothing has been deleted yet,
      // so the client can safely retry.
      await clerkClient.users.deleteUser(clerkUserId);
    } catch (error) {
      console.error('Error deleting Clerk user:', error?.message || error);
      return res.status(502).json({ error: 'Could not delete account. Please try again.' });
    }

    try {
      // 2) Purge local data synchronously (DELETE FROM explorer cascades to
      // explorer_has_cards, push_token, conversations, and messages).
      await datamapper.deleteExplorer(clerkUserId);
    } catch (error) {
      // The identity is already gone and the webhook will retry the cleanup, so
      // report success to the client while flagging the row purge for follow-up.
      console.error('Clerk user deleted but local purge failed (webhook will retry):', error?.message || error);
    }

    return res.status(200).json({ message: 'Account deleted' });
  },

};

module.exports = userController;
