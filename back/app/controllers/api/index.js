

const apiController = {
    home(req, res) {
        console.log("ENTERING HOME", req.headers);
        return res.send("Home");
    },
};

module.exports = { apiController };