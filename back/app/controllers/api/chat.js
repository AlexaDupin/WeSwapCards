const datamapper = require("../../models/datamapper");

const chatController = {
    async insertNewMessage(req, res) {
        const content = req.body.content;
        const timestamp = req.body.timestamp;
        const senderId = req.body.sender_id;
        const recipientId = req.body.recipient_id;

        console.log("content", content);
        console.log("timestamp", timestamp);
        console.log("senderId", senderId);
        console.log("recipientId", recipientId);

        try {
            const result = await datamapper.insertNewMessage({
                content: content,
                timestamp: timestamp,
                senderId: senderId,
                recipientId: recipientId,
            });
            console.log("result", result);
              
            res.status(201).json(result);             

        } catch (error) {
            console.error('Error while sending message:', error);
            return res.status(500).send({ message: 'Internal Server Error while sending message', error: error.message });
        }
    },
    async getAllMessages(req, res) {
        const explorerId = req.params.explorerId;
        const swapExplorerId = req.params.swapExplorerId;
        console.log('CHAT CTRL', explorerId, swapExplorerId);

            try {
                const allMessages = await datamapper.getAllMessagesInAChat(explorerId, swapExplorerId);
                res.status(200).json({ allMessages });
            } catch (error) {
                console.error("Error while retrieving messages:", error);
                return res.status(500).send({ message: 'An error occurred while retrieving messages.', error: error.message });            
            }
    },
    // async getCardsFromPlace(req, res) {
    //     const placeId = req.params.placeId;

    //     try {
    //         const cards = await datamapper.getAllCardsFromOnePlace(placeId);
    //         res.json({ cards });
    //     } catch (error) {
    //         res.status(500).send(error);
    //     }
    // },
    // async getExplorerCardsFromOnePlace(req, res) {
    //     const placeId = req.params.placeId;
    //     const explorerId = req.params.explorerId;

    //     try {
    //         const cards = await datamapper.getCardsFromOneExplorerInOnePlace(placeId, explorerId);
    //         res.json({ cards });
    //     } catch (error) {
    //         res.status(500).send(error);
    //     }
    // },
    // async getDuplicateCards(req, res) {
    //     const placeId = req.params.placeId;
    //     const explorerId = req.params.explorerId;

    //     try {
    //         const cards = await datamapper.getDuplicatesFromExplorerInOnePlace(explorerId, placeId);
    //         res.json({ cards });
    //     } catch (error) {
    //         res.status(500).send(error);
    //     }
    // },

};

module.exports = chatController;