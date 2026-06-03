const datamapper = require("../../models/datamapper");
const { getOpportunities } = require("./opportunities");
// const validator = require('validator');
// const { body, validationResult } = require('express-validator');

const chatController = {
    async getConversation(req, res) {
        const explorerId = req.params.explorerId;
        const swapExplorerId = req.params.swapExplorerId;
        const swapCardName = req.params.swapCardName;
        // console.log('getConversation CTRL', explorerId, swapExplorerId, swapCardName);

        try {
            const conversation = await datamapper.findConversation(swapCardName, explorerId, swapExplorerId);
            if (!conversation) {
                // console.log("NO PREVIOUS CONVO");
                res.status(204).json({message: "NO PREVIOUS CONVO", conversation});
            } else if (conversation) {
                // console.log("CONVO FOUND");
                res.status(200).json(conversation);
            }
        } catch (error) {
            console.error("Error while retrieving conversation:", error);
            return res.status(500).send({ message: 'An error occurred while retrieving conversation.', error: error.message });            
        }
    },
    async createConversation(req, res) {
        const explorerId = req.body.creator_id;
        const swapExplorerId = req.body.recipient_id;
        const swapCardName = req.body.card_name;
        const timestamp = req.body.timestamp;

        //console.log('createConversation CTRL', explorerId, swapExplorerId, swapCardName, timestamp);
            try {
                const conversation = await datamapper.createConversation(swapCardName, explorerId, swapExplorerId, timestamp);
                
                if (!conversation) {
                    res.status(400).json({message: "Could not create conversation", conversation});
                }

                res.status(201).json(conversation);             

            } catch (error) {
                console.error("Error while creating conversation:", error);
                return res.status(500).send({ message: 'An error occurred while creating conversation.', error: error.message });            
            }
    },
    async insertNewMessage(req, res) {
        const content = req.body.content;
        const timestamp = req.body.timestamp;
        const senderId = req.body.sender_id;
        const recipientId = req.body.recipient_id;
        const conversationId = req.body.conversation_id;
        // const sanitizedContent = validator.escape(content);

        // console.log("content", content, typeof(content));
        // console.log("timestamp", timestamp, typeof(timestamp));
        // console.log("senderId", senderId, typeof(senderId));
        // console.log("recipientId", recipientId, typeof(recipientId));
        // console.log("conversationId", conversationId, typeof(conversationId));
        
        try {
            const result = await datamapper.insertNewMessage({
                content: content,
                timestamp: timestamp,
                senderId: senderId,
                recipientId: recipientId,
                conversationId: conversationId,
            });
            // console.log("result", result);
              
            res.status(201).json(result);             

        } catch (error) {
            console.error('Error while sending message:', error);
            return res.status(500).send({ message: 'Internal Server Error while sending message', error: error.message });
        }
    },
    async getAllMessagesInConversation(req, res) {
        const conversationId = req.params.conversationId;
      
        try {
          const [allMessages, conversationStatus] = await Promise.all([
            datamapper.getAllMessagesInAChat(conversationId),
            datamapper.getConversationStatus(conversationId),
          ]);
      
          res.status(200).json({ allMessages, conversationStatus });
        } catch (error) {
          console.error("Error while retrieving messages:", error);
          return res.status(500).send({
            message: 'An error occurred while retrieving messages.',
            error: error.message,
          });
        }
    },
    async setMessagesToRead(req, res) {
        const conversationId = req.params.conversationId;
        const explorerId = req.params.explorerId;
        // console.log('CHAT CTRL read', conversationId, explorerId);

            try {
                const read = await datamapper.updateMessageStatus(conversationId, explorerId);
                // console.log("READ CTRL", read);
                res.status(200).json({ read });
            } catch (error) {
                console.error("Error while retrieving messages:", error);
                return res.status(500).send({ message: 'An error occurred while retrieving messages.', error: error.message });            
            }
    },
    async setConversationToUnread(req, res) {
        const conversationId = req.params.conversationId;
        const explorerId = req.params.explorerId;
      
        try {
          const unread = await datamapper.setConversationUnread(conversationId, explorerId);
          res.status(200).json({ unread });
        } catch (error) {
          console.error("Error while marking conversation unread:", error);
          return res.status(500).send({
            message: 'An error occurred while marking conversation unread.',
            error: error.message,
          });
        }
    },
    async getUnreadConversations(req, res) {
        const explorerId = req.params.explorerId;

            try {
                const result = await datamapper.getUnreadConversations(explorerId);
                res.status(200).json(result);
            } catch (error) {
                console.error("Error while counting unread conversations:", error);
                return res.status(500).send({ message: 'An error occurred while counting unread conversations.', error: error.message });            
            }
    },
    async getCurrentConversations(req, res) {
        const explorerId = req.params.explorerId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 40;
        const search = req.query.search || '';
        const sort = req.query.sort === 'name' ? 'name' : 'date';
        // console.log('CHAT CTRL', explorerId);

            try {
                const result = await datamapper.getCurrentConversationsOfExplorer(explorerId, page, limit, search, sort);
                // console.log("CTRL CHAT result", result);
                res.status(200).json(result);
            } catch (error) {
                console.error("Error while retrieving conversations:", error);
                return res.status(500).send({ message: 'An error occurred while retrieving conversations.', error: error.message });            
            }
    },
    async getPastConversations(req, res) {
        const explorerId = req.params.explorerId;
      
        // Shared
        const limit = parseInt(req.query.limit, 10) || 40;
        const search = req.query.search || "";
      
        // Web (existing)
        const page = parseInt(req.query.page, 10) || 1;
      
        // Mode switch (recommended)
        const mode = req.query.mode; // 'cursor' for RN
        const sort = req.query.sort === "name" ? "name" : "date";

        // RN cursor params (optional; present on "load more").
        // The primary cursor field depends on the active sort.
        const cursorPrimaryRaw =
          sort === "name"
            ? req.query.cursor_card_name
            : req.query.cursor_last_message_at;
        const cursorIdRaw = req.query.cursor_id;

        const hasCursorParams =
          cursorPrimaryRaw !== undefined && cursorIdRaw !== undefined;

        const isCursorMode = mode === "cursor" || hasCursorParams;

        try {
          // RN cursor mode (first load can omit cursor params)
          if (isCursorMode) {
            let cursorPrimary = null;
            let cursorId = null;

            if (hasCursorParams) {
              cursorPrimary = String(cursorPrimaryRaw);
              cursorId = Number(cursorIdRaw);

              // basic validation
              if (!Number.isFinite(cursorId)) {
                return res.status(400).send({ message: "Invalid cursor parameters." });
              }
            }

            const result =
              await datamapper.getPastConversationsOfExplorerCursorWebOrder(
                explorerId,
                limit,        // chunk size (RN)
                search,
                sort,
                cursorPrimary,
                cursorId
              );

            return res.status(200).json(result);
          }
      
          // Web paged mode (unchanged)
          const result = await datamapper.getPastConversationsOfExplorer(
            explorerId,
            page,
            limit,
            search
          );
      
          return res.status(200).json(result);
        } catch (error) {
          console.error("Error while retrieving conversations:", error);
          return res.status(500).send({
            message: "An error occurred while retrieving conversations.",
            error: error.message,
          });
        }
    },
    async editConversationStatus(req, res) {
        const conversationId = req.params.conversationId;
        const status = req.body.status;
        // console.log('CHAT CTRL status', conversationId, status);

            try {
                const updatedStatus = await datamapper.editConversationStatus(conversationId, status);
                // console.log("STATUS CTRL", updatedStatus );
                res.status(200).json({ updatedStatus });
            } catch (error) {
                console.error("Error while updating conversation status:", error);
                return res.status(500).send({ message: 'An error occurred while updating conversation status.', error: error.message });            
            }
    },
    async getOpportunitiesForRecipient(req, res) {
        const creatorId = req.params.creatorId;
        const recipientId = req.params.recipientId;

            try {
                const opportunities = await datamapper.getOpportunitiesForRecipient(creatorId, recipientId);
                res.status(200).json(opportunities);
            } catch (error) {
                console.error("Error while retrieving opportunities:", error);
                return res.status(500).send({ message: 'An error occurred while retrieving opportunities.', error: error.message });            
            }
    },
};

module.exports = chatController;