const userDatamapper = require("../models/user");
const datamapper = require("../models/datamapper");

// Middleware to check if the logged-in user's `explorerId` matches the URL parameter
const checkExplorerAuthorization = async (req, res, next) => {
  const explorerId = Number(req.params.explorerId);
  const clerkUserId = req.auth.userId;
//   console.log("AUTH MDLW explorerId", explorerId);
//   console.log("AUTH MDLW clerkUserId", clerkUserId);

  try {
    // Fetch the user from the database based on Clerk's `userId`
    const user = await userDatamapper.getExplorerIdByClerkId(clerkUserId);
    // console.log("AUTH MDLW USER", user.id);

    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // If the `explorerId` from the URL doesn't match the user's id, deny access
    if (user.id !== explorerId) {
      console.log("Error in AUTHORIZATION MDLW");
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }

    // console.log("LEFT AUTHORIZATION MDLW");
    // If the IDs match, proceed to the next middleware or controller
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if the logged-in user's `explorerId` matches the URL parameter
const checkConversationAuthorization = async (req, res, next) => {
  const conversationId = Number(req.params.conversationId);
  const clerkUserId = req.auth.userId;
  // console.log("CONV MDLW conversationId", conversationId);
  // console.log("CONV MDLW clerkUserId", clerkUserId);

  try {
    // Fetch the user from the database based on Clerk's `userId`
    // console.log("INTO CONV MDLW");
    const user = await userDatamapper.getExplorerIdByClerkId(clerkUserId);

    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const explorerId = Number(user.id);

    // Fetch the conversation and check the associated explorerId
    const conversation = await datamapper.getConversationParticipants(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    // console.log("CONVERSATION MDLW", conversation);
    const conversationCreator = conversation.creator_id;
    const conversationRecipient = conversation.recipient_id;
    // console.log("CONVERSATION MDLW", explorerId, conversationCreator, conversationRecipient);

    if (explorerId !== conversationCreator && explorerId !== conversationRecipient) {
      console.log("Error in CONV AUTHORIZATION MDLW");
      return res.status(403).json({ message: 'You are not authorized to access this conversation' });
    }

    // console.log("LEFT CONV AUTHORIZATION MDLW");
    // If the IDs match, proceed to the next middleware or controller
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { checkExplorerAuthorization, checkConversationAuthorization };
