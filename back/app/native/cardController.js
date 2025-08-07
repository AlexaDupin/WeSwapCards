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
};

module.exports = cardController;