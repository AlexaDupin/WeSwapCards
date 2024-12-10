const datamapper = require("../../models/datamapper");

const chatController = {
    async getConversation(req, res) {
        const explorerId = req.params.explorerId;
        const swapExplorerId = req.params.swapExplorerId;
        const swapCardName = req.params.swapCardName;
        console.log('getConversation CTRL', explorerId, swapExplorerId, swapCardName);

            try {
                const conversation = await datamapper.findConversation(swapCardName, explorerId, swapExplorerId);

                if (!conversation) {
                    console.log("NO PREVIOUS CONVO");
                    res.status(204).json({message: "NO PREVIOUS CONVO", conversation});

                } else if (conversation) {
                    console.log("CONVO FOUND");
                    res.status(200).json(conversation);
                }

            } catch (error) {
                console.error("Error while retrieving conversation:", error);
                return res.status(500).send({ message: 'An error occurred while retrieving conversation.', error: error.message });            
            }
    },
    async createConversation(req, res) {
        const explorerId = req.params.explorerId;
        const swapExplorerId = req.params.swapExplorerId;
        const swapCardName = req.params.swapCardName;

        console.log('createConversation CTRL', explorerId, swapExplorerId, swapCardName);
            try {
                const conversation = await datamapper.createConversation(swapCardName, explorerId, swapExplorerId);
                
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

        console.log("content", content);
        console.log("timestamp", timestamp);
        console.log("senderId", senderId);
        console.log("recipientId", recipientId);
        console.log("conversationId", conversationId);

        try {
            const result = await datamapper.insertNewMessage({
                content: content,
                timestamp: timestamp,
                senderId: senderId,
                recipientId: recipientId,
                conversationId: conversationId,
            });
            console.log("result", result);
              
            res.status(201).json(result);             

        } catch (error) {
            console.error('Error while sending message:', error);
            return res.status(500).send({ message: 'Internal Server Error while sending message', error: error.message });
        }
    },
    async getAllMessagesInConversation(req, res) {
        const conversationId = req.params.conversationId;
        console.log('CHAT CTRL convoId', conversationId);

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
        console.log('CHAT CTRL read', conversationId, explorerId);

            try {
                const read = await datamapper.updateMessageStatus(conversationId, explorerId);
                console.log("READ CTRL", read);
                res.status(200).json({ read });
            } catch (error) {
                console.error("Error while retrieving messages:", error);
                return res.status(500).send({ message: 'An error occurred while retrieving messages.', error: error.message });            
            }
    },
    async getAllConversations(req, res) {
        const explorerId = req.params.explorerId;
        console.log('CHAT CTRL', explorerId);

            try {
                const allConversations = await datamapper.getAllConversationsOfExplorer(explorerId);
                res.status(200).json({ allConversations });
            } catch (error) {
                console.error("Error while retrieving conversations:", error);
                return res.status(500).send({ message: 'An error occurred while retrieving conversations.', error: error.message });            
            }
    },
    async editConversationStatus(req, res) {
        const conversationId = req.params.conversationId;
        const status = req.body.status;
        console.log('CHAT CTRL status', conversationId, status);

            try {
                const updatedStatus = await datamapper.editConversationStatus(conversationId, status);
                console.log("STATUS CTRL", updatedStatus );
                res.status(200).json({ updatedStatus });
            } catch (error) {
                console.error("Error while updating conversation status:", error);
                return res.status(500).send({ message: 'An error occurred while updating conversation status.', error: error.message });            
            }
    },
};

module.exports = chatController;