const datamapper = require("../../models/datamapper");

const opportunitiesController = {
    async findSwapOpportunities(req, res) {
        const explorerId = req.params.explorerId;
        const cardId = req.params.cardId;

        console.log("swapCard", cardId);
        
        try {
            const opportunities = await datamapper.findSwapOpportunities(cardId, explorerId);
            console.log("opportunities", opportunities);
            res.status(200).json(opportunities);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    // async findExplorerForswapCard(req, res) {
    //     const explorerId = req.params.explorerId;
    //     const cardId = req.params.cardId;

    //     console.log("swapCard", cardId);
        
    //     try {
    //         const explorers = await datamapper.findExplorersForCardIdOpportunity(cardId, explorerId);
    //         console.log("explorers", explorers);
    //         res.status(200).json(explorers);
    //     } catch (error) {
    //         console.error('Error fetching opportunities:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // },
    // async findSwapOpportunities(req, res) {
    //     const explorerId = req.params.explorerId;
    //     const swapExplorerId = req.params.swapExplorerId;

    //     console.log("swapExplorerId", swapExplorerId);
        
    //     try {
    //         const swapOpportunities = await datamapper.findSwapOpportunities(explorerId, swapExplorerId);
    //         console.log("swapOpportunities", swapOpportunities);
    //         res.status(200).json(swapOpportunities);
    //     } catch (error) {
    //         console.error('Error fetching opportunities:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // },
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
    //// Infinite scroll ////
    // async getOpportunities(req, res) {
    //     const explorerId = req.params.explorerId;
    //     const limit = parseInt(req.query.limit) || 30;
    //     const offset = parseInt(req.query.offset) || 0;
    //     console.log("ENTERING getOpportunities", limit, offset);

    //     try {
    //         const opportunities = await datamapper.getOpportunitiesForOneExplorer(
    //             explorerId,
    //             limit,
    //             offset
    //             );
    //         // console.log(opportunities);
    //         res.status(200).json(opportunities);
    //     } catch (error) {
    //         console.error('Error fetching opportunities:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // },
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
