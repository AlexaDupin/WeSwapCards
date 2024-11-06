const datamapper = require("../../models/datamapper");

const declareController = {
    async getDataFromExplorer(req, res) {
        explorerId = req.params.explorerId;

            try {
                // const explorers = await datamapper.getAllExplorers();
                const explorer = await datamapper.getExplorerInfoByExplorerId(explorerId);
                const places = await datamapper.getAllPlaces();
                const cards = await datamapper.getAllCardsFromOnePlace(null);

                res.render('declare', {explorer, places, cards, title: "Déclarer mes cartes"});
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
    async addCardsToExplorer(req, res) {
        const explorerCard = req.body;
        const explorerId = req.params.explorerId;
        console.log("explorerCard", explorerCard);

        try {
            const results = [];

            // For each card submitted, check if already exists in db
            // If it exists, check if the duplicate status has changed
            for (const cardId of explorerCard.cardIds) {
                const exists = await datamapper.checkCardExists(explorerId, cardId);
                const hasDuplicate = explorerCard.duplicateIds.includes(cardId); // Check if this card ID is marked as having duplicates

                if (!exists) {
                    const result = await datamapper.createExplorerHasCard({
                        explorerId: explorerId,
                        cardId: cardId,
                        duplicate: hasDuplicate,
                    });
                    console.log("result", result);
                    results.push(result)
                } else if (exists) {
                    const duplicateStatus = await datamapper.checkDuplicateStatus(explorerId, cardId);
                    // console.log('duplicateStatus.duplicate', duplicateStatus.duplicate, cardId);
                    // console.log('hasDuplicate', hasDuplicate, cardId);
                    if (duplicateStatus.duplicate === hasDuplicate) {
                        console.log('Card already exists', cardId);
                    } else if (duplicateStatus.duplicate !== hasDuplicate) {
                        const result = await datamapper.editExplorerHasCard(hasDuplicate, explorerId, cardId);
                        console.log("change in duplicate", cardId);
                        results.push(result)
                    }
                }
            }

            res.status(201).json(results);             

        } catch (error) {
            console.error('Error adding cards to explorer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
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
            const cards = await datamapper.checkDuplicates(explorerId, placeId);
            res.json({ cards });
        } catch (error) {
            res.status(500).send(error);
        }
    },
};


module.exports = declareController;
