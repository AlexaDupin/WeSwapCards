const datamapper = require("../../models/datamapper");

const opportunitiesController = {
    async getOpportunities(req, res) {
        const explorerId = req.params.explorerId;

        try {
            const opportunities = await datamapper.getOpportunitiesForOneExplorer(explorerId);
            // console.log(opportunities);
            res.status(200).json(opportunities);
        } catch (error) {
            console.error('Error adding cards to explorer:', error);
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
};


module.exports = opportunitiesController;
