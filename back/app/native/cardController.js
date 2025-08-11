const datamapper = require("./datamapper");

const cardController = {
    async getAllCards(req, res) {
        try {
            const cards = await datamapper.getAllCards();
            console.log(cards);
            res.json({cards});
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async getAllCardsStatuses(req, res) {
        try {
            const statuses = await datamapper.getAllCardsStatuses();
            console.log(statuses);
            res.json({statuses});
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = cardController;