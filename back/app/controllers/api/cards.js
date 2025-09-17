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
        console.log("get request");
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
        // console.log("addCardToExplorer CTRL", explorerId, req.body, cardId, duplicate);
        
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
        // console.log("deleteCardFromExplorer CTRL", explorerId, cardId);
        
        if (!Number.isInteger(explorerId) || !Number.isInteger(cardId)) {
            return res.status(400).json({ error: "Invalid explorerId/cardId" });
        }

        try {
            const response = await datamapper.deleteCardFromExplorerHasCard(explorerId, cardId);
            return res.status(200).json(response);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async markAllAsOwned(req, res) {
        const explorerId = Number(req.params.explorerId);
        const cardIds = req.body?.cardIds;
        console.log("CTRL cardIds", cardIds);
        
        if (!explorerId || !Array.isArray(cardIds) || cardIds.length === 0) {
            return res.status(400).json({ error: 'Invalid payload: cardIds[] required' });
        }

        try {
            const { inserted, skipped } = await datamapper.bulkInsertOwned(explorerId, cardIds);
            return res.status(200).json({ inserted, skipped, total: cardIds.length });
        } catch (error) {
            console.error('Error bulk-owning cards:', error);
            return res.status(500).json({ error: 'Internal Server Error' });            
        }
    },
    async replaceStatuses(req, res) {
        const explorerId = Number(req.params.explorerId);
        const statusesMap = req.body?.statuses;
    
        if (!Number.isInteger(explorerId) || !statusesMap || typeof statusesMap !== 'object') {
          return res.status(400).json({ error: "Invalid payload: statuses map required" });
        }
    
        const ownedIds = [];
        const duplicatedIds = [];
        const defaultIds = [];
    
        for (const [key, val] of Object.entries(statusesMap)) {
          const cardId = Number(key);
          if (!Number.isInteger(cardId)) {
            return res.status(400).json({ error: `Invalid cardId key: ${key}` });
          }
          if (val === 'owned') ownedIds.push(cardId);
          else if (val === 'duplicated') duplicatedIds.push(cardId);
          else if (val === 'default' || val == null) defaultIds.push(cardId);
          else return res.status(400).json({ error: `Invalid status for cardId ${key}: ${val}` });
        }
    
        try {
          const result = await datamapper.bulkReplaceStatuses(explorerId, { ownedIds, duplicatedIds, defaultIds });
          return res.status(200).json(result); // { upserted, deleted }
        } catch (error) {
          console.error('Error replacing statuses:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
};

module.exports = cardController;