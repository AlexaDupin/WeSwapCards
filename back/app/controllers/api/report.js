const datamapper = require("../../models/datamapper");

const reportController = {
    async getAllPlaces(req, res) {
            try {
                const places = await datamapper.getAllPlaces();
                res.json({places});
            } catch (error) {
                res.status(500).send(error);
            }
    },
    async getCardsFromPlace(req, res) {
        const placeId = req.params.placeId;

        try {
            const cards = await datamapper.getAllCardsFromOnePlace(placeId);
            res.json({ cards });
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async getExplorerCardsFromOnePlace(req, res) {
        const placeId = req.params.placeId;
        const explorerId = req.params.explorerId;

        try {
            const cards = await datamapper.getCardsFromOneExplorerInOnePlace(placeId, explorerId);
            res.json({ cards });
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async getDuplicateCards(req, res) {
        const placeId = req.params.placeId;
        const explorerId = req.params.explorerId;

        try {
            const cards = await datamapper.getDuplicatesFromExplorerInOnePlace(explorerId, placeId);
            res.json({ cards });
        } catch (error) {
            res.status(500).send(error);
        }
    },
};

module.exports = reportController;