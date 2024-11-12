const datamapper = require("../../models/datamapper");

const explorerCardsController = {
    async getExplorerCardsByPlace(req, res) {
        const explorerId = Number(req.params.explorerId);

            try {
                const explorerCards = await datamapper.getCardsByPlaceForOneExplorer(explorerId);
                res.status(200).json(explorerCards);
            } catch (error) {
                console.error('Error retrieving cards from explorer:', error);
                res.status(500).json({ error: 'Internal Server Error' });            }
    },
    async getDuplicateStatus(req, res) {
        const cardId = Number(req.params.cardId);
        const explorerId = Number(req.params.explorerId);

            try {
                const duplicateStatus = await datamapper.checkDuplicateStatus(explorerId, cardId);
                // console.log(cardId, duplicateStatus);
                res.status(200).json(duplicateStatus);
            } catch (error) {
                console.error('Error retrieving cards from explorer:', error);
                res.status(500).json({ error: 'Internal Server Error' });            }
    },
};

module.exports = explorerCardsController;