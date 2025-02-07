const datamapper = require("../../models/datamapper");


const apiController = {
    home(req, res) {
        console.log("ENTERING HOME", req.headers);
        return res.send("Home");
    },
    async country(req, res) {
        console.log("ENTERING COUNTRY");
        try {
            const places = await datamapper.getAllCountries();
            res.json({places});
        } catch (error) {
            console.log("COUNTRYerr", error);
            res.status(500).send(error);
        }
        // return res.send("Country");
    },
};

module.exports = apiController;