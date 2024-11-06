const datamapper = require("../../models/datamapper");

const websiteController = {
    async displayMenu(req, res) {
        console.log('MENU WEBSITECONTROLLER');
        explorerId = req.params.explorerId;

        try {
            const explorer = await datamapper.getExplorerInfoByExplorerId(explorerId);
            console.log("WB explorer", explorer);
            res.render('menu', { title: 'Échange WeCards', explorer: explorer }); 

          } catch (error) {
            console.error(error);
            res.redirect('/');
          }
        // const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

        // if (!token) {
        //     return res.redirect('/'); // Redirect to the login page if no token
        //     return res.status(401).json({ message: 'Unauthorized - NO token' });
        //     return res.redirect('/');
        // }

        // console.log('TOKEN WEBSITECONTROLLER', token);

    },
    login(_, res) {
        res.render('login', {title: 'Connexion', message: 'Tes identifiants ne correspondent pas'});
    },
};

module.exports = websiteController;