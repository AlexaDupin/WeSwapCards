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

        console.log('createConversation CTRL', explorerId, swapExplorerId, swapCardName, timestamp);
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
    // async insertNewMessage(req, res) {
    //     const content = req.body.content;
    //     const timestamp = req.body.timestamp;
    //     const senderId = req.body.sender_id;
    //     const recipientId = req.body.recipient_id;
    //     const conversationId = req.body.conversation_id;
    //     // const sanitizedContent = validator.escape(content);

    //     // console.log("content", content, typeof(content));
    //     // console.log("timestamp", timestamp, typeof(timestamp));
    //     // console.log("senderId", senderId, typeof(senderId));
    //     // console.log("recipientId", recipientId, typeof(recipientId));
    //     // console.log("conversationId", conversationId, typeof(conversationId));
        
    //     try {
    //         const result = await datamapper.insertNewMessage({
    //             content: content,
    //             timestamp: timestamp,
    //             senderId: senderId,
    //             recipientId: recipientId,
    //             conversationId: conversationId,
    //         });
    //         // console.log("result", result);
              
    //         res.status(201).json(result);             

    //     } catch (error) {
    //         console.error('Error while sending message:', error);
    //         return res.status(500).send({ message: 'Internal Server Error while sending message', error: error.message });
    //     }
    // },
    async insertNewMessage(req, res) {
        const content = req.body.content;
        const timestamp = req.body.timestamp;
        const senderId = req.body.sender_id;
        const recipientId = req.body.recipient_id;
        const conversationId = req.body.conversation_id;
        
        try {
            // First, insert the message as you normally do
            const result = await datamapper.insertNewMessage({
                content: content,
                timestamp: timestamp,
                senderId: senderId,
                recipientId: recipientId,
                conversationId: conversationId,
            });
    
            // After successfully inserting the message, send a notification
            try {
                // Get recipient's Clerk user ID from your explorer table
                const recipientData = await datamapper.getExplorerById(recipientId);
                
                if (recipientData && recipientData.userid) {
                    // Get recipient's email from Clerk
                    const recipientEmail = await getUserEmailFromClerk(recipientData.userid);
                    
                    if (recipientEmail) {
                        // Send email notification
                        await sendNotificationEmail(
                            recipientEmail,
                            'New Message Notification',
                            `Someone sent you a message`,
                            `<h2>New Message</h2>
                             <p>'Someone sent you a message:</p>
                             <p style="padding: 10px; background-color: #f5f5f5;">A message is waiting for you on WeSwapCards!</p>
                             <p><a href="https://https://weswapcards.com/swap/dashboard">View conversation</a></p>`
                        );
                        
                        // // Update message to mark notification as sent
                        // // Assuming you add this column to your table
                        // await datamapper.updateMessageNotificationStatus(result.id, true);
                    }
                }
            } catch (notificationError) {
                // Log the error but don't fail the request
                console.error('Error sending notification:', notificationError);
                // The message was saved successfully, so we continue
            }
              
            res.status(201).json(result);             
        } catch (error) {
            console.error('Error while sending message:', error);
            return res.status(500).send({ message: 'Internal Server Error while sending message', error: error.message });
        }
    },
    async getAllMessagesInConversation(req, res) {
        const conversationId = req.params.conversationId;
        // console.log('CHAT CTRL convoId', conversationId);

            try {
                const allMessages = await datamapper.getAllMessagesInAChat(conversationId);
                res.status(200).json({ allMessages });
            } catch (error) {
                console.error("Error while retrieving messages:", error);
                return res.status(500).send({ message: 'An error occurred while retrieving messages.', error: error.message });            
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
    async getAllConversations(req, res) {
        const explorerId = req.params.explorerId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        // console.log('CHAT CTRL', explorerId);

            try {
                const result = await datamapper.getAllConversationsOfExplorer(explorerId, page, limit);
                // console.log("CTRL CHAT result", result.pagination);
                res.status(200).json(result);
            } catch (error) {
                console.error("Error while retrieving conversations:", error);
                return res.status(500).send({ message: 'An error occurred while retrieving conversations.', error: error.message });            
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