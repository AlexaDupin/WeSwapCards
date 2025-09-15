const datamapper = require("../../models/datamapper");

const explorerCardsController = {
    async getExplorerCardsByChapter(req, res) {
        const explorerId = Number(req.params.explorerId);
            try {
                const explorerCards = await datamapper.getCardsByPlaceForOneExplorer(explorerId);
                // console.log("CTRL explorerCards", explorerCards);
                res.status(200).json(explorerCards);
            } catch (error) {
                console.error('Error retrieving cards from explorer:', error);
                res.status(500).json({ error: 'Internal Server Error' });            }
    },
    async editDuplicateStatus(req, res) {
        const cardId = Number(req.params.cardId);
        const explorerId = Number(req.params.explorerId);
        const newDuplicateData = req.body.duplicate;
        //console.log(cardId, explorerId, req.body);
        
            try {
                await datamapper.editDuplicateStatus(explorerId, cardId, newDuplicateData);
                res.status(200).json({ message: `Update done to ${cardId}` });
            } catch (error) {
                console.error('Error retrieving cards from explorer:', error);
                res.status(500).json({ error: 'Internal Server Error' });            }
    },
};

module.exports = explorerCardsController;