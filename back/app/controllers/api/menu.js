
const menuController = {
    getMenu(req, res) {
        console.log('MENU CONTR', req.authenticated);
        // res.redirect('/menu'); 
        res.json({ message: 'This is protected menu data', user: req.user, authenticated: req.authenticated });
    },
};

module.exports = menuController;
