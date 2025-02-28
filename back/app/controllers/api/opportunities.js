const datamapper = require("../../models/datamapper");

const opportunitiesController = {
    async findSwapOpportunities(req, res) {
        const explorerId = req.params.explorerId;
        const cardId = req.params.cardId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        console.log("swapCard", explorerId, cardId, req.params, req.query);
        
        // if (cardId === undefined) {
        //     return res.status(400).json({ error: "Missing parameter" });
        //   }

        try {
            const opportunities = await datamapper.findSwapOpportunities(cardId, explorerId, page, limit);
            console.log("opportunities", opportunities);
            res.status(200).json(opportunities);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    // Get all opportunities ////
    async getOpportunities(req, res) {
        const explorerId = req.params.explorerId;

        try {
            const opportunities = await datamapper.getOpportunitiesForOneExplorer(explorerId);
            // console.log(opportunities);
            res.status(200).json(opportunities);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getCountForOnePlaceForOneExplorer(req, res) {
        const explorerId = Number(req.params.explorerId);
        const placeId = Number(req.params.placeId);

        try {
            const count = await datamapper.getCountForOnePlaceForExplorer(explorerId, placeId);
            res.status(200).json(count);
        } catch (error) {
            console.error('Error adding cards to explorer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getCardName(req, res) {
        const cardId = Number(req.params.cardId);

        try {
            const name = await datamapper.getCardName(cardId);
            res.status(200).json(name);
        } catch (error) {
            console.error('Error adding cards to explorer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};


module.exports = opportunitiesController;
