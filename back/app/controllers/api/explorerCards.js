const datamapper = require("../../models/datamapper");

const cardController = {
    async getExplorer(req, res) {
        const explorerId = Number(req.params.explorerId);

        try {
            const explorer = await datamapper.getExplorerInfoByExplorerId(explorerId);
            res.render('explorerCards', {explorer, title: "Mes cartes"});
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async getExplorerCards(req, res) {
        const explorerId = Number(req.params.explorerId);

            try {
                const explorerCards = await datamapper.getCardsForOneExplorer(explorerId);
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
    async editDuplicateStatus(req, res) {
        const cardId = Number(req.params.cardId);
        const explorerId = Number(req.params.explorerId);
        const newDuplicateData = req.body.duplicate;
        console.log(cardId, explorerId, newDuplicateData);
            try {
                await datamapper.editDuplicateStatus(explorerId, cardId, newDuplicateData);
                res.status(200).json({ message: `Update done to ${cardId}` });
            } catch (error) {
                console.error('Error retrieving cards from explorer:', error);
                res.status(500).json({ error: 'Internal Server Error' });            }
    },
};

module.exports = cardController;
