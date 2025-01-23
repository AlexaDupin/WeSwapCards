const datamapper = require("../../models/datamapper");

const reportController = {
    async getAllPlaces(req, res) {
            console.log("ENTERING PLACES", req.headers);
            try {
                const places = await datamapper.getAllPlaces();
                console.log("RESPONSE PLACES", places);

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
    async addCardsToExplorer(req, res) {
        const explorerId = req.params.explorerId;
        const selectedCardsIds = req.body.selectedCardsIds;
        const duplicatesIds = req.body.duplicatesIds;
        const toBeDeletedIds = req.body.toBeDeletedIds;

        console.log("selectedCardsIds", selectedCardsIds);
        console.log("duplicatesIds", duplicatesIds);
        console.log("toBeDeletedIds", toBeDeletedIds);

        try {
            const results = [];

            // For each card submitted, check if already logged for this explorer in db
            // If logged, check if the duplicate status has changed    
            selectedCardsIds.forEach(async (selectedCardId) => {
                const alreadyLogged = await datamapper.checkIfCardLoggedForExplorer(explorerId, selectedCardId);
                const hasDuplicate = duplicatesIds.includes(selectedCardId); // Check if this card ID is marked as having duplicates

                if (!alreadyLogged) {
                    const result = await datamapper.createExplorerHasCard({
                        explorerId: explorerId,
                        cardId: selectedCardId,
                        duplicate: hasDuplicate,
                    });
                    console.log("result", result);
                    results.push(result)
                } else if (alreadyLogged) {
                    const duplicateStatus = await datamapper.checkDuplicateStatus(explorerId, selectedCardId);
                    // console.log('duplicateStatus.duplicate', duplicateStatus.duplicate, cardId);
                    // console.log('hasDuplicate', hasDuplicate, cardId);
                    if (duplicateStatus?.duplicate === hasDuplicate) {
                        console.log('Card already logged', selectedCardId);
                    } else if (duplicateStatus?.duplicate !== hasDuplicate) {
                        const result = await datamapper.editExplorerHasCard(hasDuplicate, explorerId, selectedCardId);
                        console.log("Change in duplicate", selectedCardId);
                        results.push(result)
                    }
                }
            })
       
            toBeDeletedIds.forEach(async (toBeDeletedId) => {
                const result = await datamapper.deleteCardFromExplorerHasCard(explorerId, toBeDeletedId);
                console.log("Card deleted for this explorer", toBeDeletedId);
                results.push(result)
            })

            res.status(201).json(results);             

        } catch (error) {
            console.error('Error adding cards to explorer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = reportController;