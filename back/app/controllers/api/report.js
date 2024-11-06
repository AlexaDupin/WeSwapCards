const datamapper = require("../../models/datamapper");

const reportController = {
    async getAllPlaces(req, res) {
            try {
                const places = await datamapper.getAllPlaces();
                res.json({places});
            } catch (error) {
                res.status(500).send(error);
            }
    },
};

module.exports = reportController;