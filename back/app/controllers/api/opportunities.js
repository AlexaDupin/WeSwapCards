const datamapper = require("../../models/datamapper");

const opportunitiesController = {
    async findSwapOpportunities(req, res) {
        const explorerId = req.params.explorerId;
        const cardId = req.params.cardId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        try {
            const result = await datamapper.findSwapOpportunities(cardId, explorerId, page, limit);
            // console.log("CTRL opportunities result", result);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getOpportunities(req, res) {
        const explorerId = req.params.explorerId;

        try {
            const opportunities = await datamapper.getOpportunitiesForOneExplorer(explorerId);
            // console.log(opportunities);
            res.status(200).json(opportunities);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getCountForOnePlaceForOneExplorer(req, res) {
        const explorerId = Number(req.params.explorerId);
        const placeId = Number(req.params.placeId);

        try {
            const count = await datamapper.getCountForOnePlaceForExplorer(explorerId, placeId);
            res.status(200).json(count);
        } catch (error) {
            console.error('Error adding cards to explorer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getCardName(req, res) {
        const cardId = Number(req.params.cardId);

        try {
            const name = await datamapper.getCardName(cardId);
            res.status(200).json(name);
        } catch (error) {
            console.error('Error adding cards to explorer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getLatestChapters(req, res) {
        const limit = req.query.limit;
      
        try {
          const chapters = await datamapper.getLatestChapters(limit);
          
          res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=300');
          return res.status(200).json(chapters);
        } catch (error) {
          console.error('Error fetching latest chapters:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getChaptersByIds(req, res) {
        const { ids } = req.query;
        try {
          const chapters = await datamapper.getChaptersByIds(ids);
          res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=300');
          return res.status(200).json(chapters);
        } catch (error) {
          console.error('Error fetching chapters by ids:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};


module.exports = opportunitiesController;
