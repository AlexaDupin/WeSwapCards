const datamapper = require("../../models/datamapper");

const reportController = {
    async getAllPlaces(req, res) {
            //console.log("ENTERING PLACES");
            try {
                const places = await datamapper.getAllPlaces();
                // console.log(places);
                res.json({places});
            } catch (error) {
                res.status(500).send(error);
            }
    },
    async getCardsFromPlace(req, res) {
        const placeId = req.params.placeId;

        try {
            const cards = await datamapper.getAllCardsFromOnePlace(placeId);
            // console.log(cards);
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
    async reportCardsForExplorer(req, res) {
        const explorerId = Number(req.params.explorerId);
        const selectedCardsIds = (req.body.selectedCardsIds ?? []).map(Number);
        const duplicatesIds    = (req.body.duplicatesIds ?? []).map(Number);
        const toBeDeletedIds   = (req.body.toBeDeletedIds ?? []).map(Number);

        if (!Number.isInteger(explorerId)) {
            return res.status(400).json({ error: "Explorer ID is required" });
        }

        if (!selectedCardsIds.length && !toBeDeletedIds.length) {
            return res.status(200).json({ ok: true, upserted: [], deleted: 0 });
        }

        // console.log("selectedCardsIds", selectedCardsIds);
        // console.log("duplicatesIds", duplicatesIds);
        // console.log("toBeDeletedIds", toBeDeletedIds);

        try {
            const selectedCardsData = selectedCardsIds.map(cardId => ({
                cardId: cardId,
                duplicate: duplicatesIds.includes(cardId)
            }));

            const results = await datamapper.manageExplorerCards(
                explorerId, 
                selectedCardsData, 
                toBeDeletedIds
            );
            
            res.status(201).json(results);       

        } catch (error) {
            console.error('Error managing explorer cards:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = reportController;