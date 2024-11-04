const datamapper = require("../../models/datamapper");

const opportunitiesController = {
    async getOpportunities(req, res) {
        explorerId = req.params.explorerId;

            try {
                // const explorers = await datamapper.getAllExplorers();
                const explorer = await datamapper.getExplorerInfoByExplorerId(explorerId);

                res.render('opportunities', {explorer, title: "Mes opportunités"});
            } catch (error) {
                res.status(500).send(error);
            }
    },
    async handleOpportunities(req, res) {
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
    async getOpportunitiesCountForOnePlaceForOneExplorer(req, res) {
        const explorerId = Number(req.params.explorerId);
        const placeId = Number(req.params.placeId);

        try {
            const opportunitiesCount = await datamapper.getOpportunitiesCountForOnePlaceForOneExplorer(explorerId, placeId);
            res.status(200).json(opportunitiesCount);
        } catch (error) {
            console.error('Error adding cards to explorer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};


module.exports = opportunitiesController;
