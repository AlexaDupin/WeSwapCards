const datamapper = require("../../models/datamapper");

const opportunitiesController = {
    async getOpportunities(req, res) {
        const explorerId = req.params.explorerId;
        const limit = parseInt(req.query.limit) || 30;
        const offset = parseInt(req.query.offset) || 0;
        console.log("ENTERING getOpportunities", limit, offset);

        try {
            const opportunities = await datamapper.getOpportunitiesForOneExplorer(
                explorerId,
                limit,
                offset
                );
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
};


module.exports = opportunitiesController;
