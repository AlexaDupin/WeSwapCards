const datamapper = require("../../models/datamapper");

const cardController = {
    async getAllCards(req, res) {
        try {
            const cards = await datamapper.getAllCards();
            // console.log("cardCtrl getAllCards", cards);
            res.json({cards});
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async getAllCardsStatuses(req, res) {
        const explorerId = Number(req.params.explorerId);
  
        try {
            const statuses = await datamapper.getAllCardsStatuses(explorerId);
            res.json({statuses});
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async addCardToExplorer(req, res) {
        const explorerId = Number(req.params.explorerId);
        const cardId = Number(req.params.cardId);
        const duplicate = req.body.duplicate;
        console.log("addCardToExplorer CTRL", explorerId, req.body, cardId, duplicate);
        
        if (!Number.isInteger(explorerId) || !Number.isInteger(cardId)) {
            return res.status(400).json({ error: "Invalid explorerId/cardId" });
        }
        if (typeof duplicate !== "boolean") {
          return res.status(400).json({ error: "duplicate must be boolean" });
        }

        try {
            const result = await datamapper.upsertExplorerHasCard({ explorerId, cardId, duplicate });
            return res.status(200).json(result);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async deleteCardFromExplorer(req, res) {
        const explorerId = Number(req.params.explorerId);
        const cardId = Number(req.params.cardId);
        console.log("deleteCardFromExplorer CTRL", explorerId, cardId);
        
        if (!Number.isInteger(explorerId) || !Number.isInteger(cardId)) {
            return res.status(400).json({ error: "Invalid explorerId/cardId" });
        }

        try {
            const response = await datamapper.deleteCardFromExplorerHasCard(explorerId, cardId);
            return res.status(200).json(response);
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = cardController;