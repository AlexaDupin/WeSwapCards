const datamapper = require("../../models/datamapper");

const toSnapshot = (rows) => {
    return rows.map(row => ({
      card_id: row.card_id,
      status: row.duplicate ? 'duplicated' : 'owned',
    }));
};

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
    // async markAll(req, res) {
    //     const explorerId = Number(req.params.explorerId);
    //     const rawIds = Array.isArray(req.body?.cardIds) ? req.body.cardIds : [];
    //     const duplicate = !!req.body?.duplicate;

    //     if (!Number.isInteger(explorerId) || rawIds.length === 0) {
    //       return res.status(400).json({ error: 'Invalid payload: cardIds[] required' });
    //     }

    //     const cardIds = rawIds
    //       .map(Number)
    //       .filter((n) => Number.isInteger(n));
    //     if (!cardIds.length) {
    //       return res.status(400).json({ error: 'No valid cardIds' });
    //     }

    //     try {
    //       // Reuse the "replace" path so existing rows are updated on conflict.
    //       const payload = duplicate
    //         ? { ownedIds: [], duplicatedIds: cardIds, defaultIds: [] }
    //         : { ownedIds: cardIds, duplicatedIds: [], defaultIds: [] };

    //       const result = await datamapper.bulkReplaceStatuses(explorerId, payload);
    //       // UI only checks 200; still nice to return some stats
    //       return res.status(200).json({ ...result, total: cardIds.length, duplicate });
    //     } catch (error) {
    //       console.error('Error bulk-marking cards:', error);
    //       return res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // },
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
      async deleteAllCards(req, res) {
        const explorerId = Number(req.params.explorerId);
        if (!Number.isInteger(explorerId)) {
          return res.status(400).json({ error: 'Invalid explorerId' });
        }

        try {
          const deletedRows = await datamapper.deleteAllCardsForExplorer(explorerId);
          const snapshotBefore = toSnapshot(deletedRows);

          return res.status(200).json({ success: true, snapshot: snapshotBefore });
        } catch (error) {
          console.error('deleteAllCards error', error);
          return res.status(500).json({ error: 'Failed to delete all cards' });
        }
      },
    
      async restoreBulkCards(req, res) {
        const explorerId = Number(req.params.explorerId);
        if (!Number.isInteger(explorerId)) {
          return res.status(400).json({ error: 'Invalid explorerId' });
        }
    
        const items = Array.isArray(req.body?.items) ? req.body.items : [];
        if (!items.length) {
          return res.status(400).json({ error: 'No items to restore' });
        }
    
        try {
          const applied = await datamapper.applyExplorerCardStatusesBulk(explorerId, items);
          return res.status(200).json({ success: true, appliedCount: applied.appliedCount });
        } catch (error) {
          console.error('restoreBulkCards error', error);
          return res.status(500).json({ error: 'Failed to restore cards' });
        }
      },
      async markAll(req, res) {
        const explorerId = Number(req.params.explorerId);
        const duplicate = !!req.body?.duplicate;

        if (!Number.isInteger(explorerId)) {
             return res.status(400).json({ error: 'Invalid explorerId' });
        }

        try {
          const result = duplicate
            ? await datamapper.markAllDuplicated(explorerId)
            : await datamapper.markAllOwnedPreservingDuplicates(explorerId);
            return res.status(200).json({ success: true, duplicate, ...result });
        } catch (error) {
          console.error('Error bulk-marking cards:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = cardController;