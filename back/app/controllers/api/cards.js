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
};

module.exports = cardController;