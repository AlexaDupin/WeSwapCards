const express = require('express');

const websiteController = require('../../controllers/website');
const declareController = require('../../controllers/api/declare');
const opportunitiesController = require('../../controllers/api/opportunities');
const cardController = require('../../controllers/api/explorerCards');
const userController = require('../../controllers/api/user');
const menuController = require('../../controllers/api/menu');

// const { ApiError } = require('../../helpers/errorHandler');
// const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

// router.use((_, res, next) => {
//     // On défini le content-type de la réponse en html pour détection de format d'erreur
//     res.type('html');
//     next();
// });

// router.get('/', websiteController.login);

// router.get('/menu', websiteController.displayMenu);
// // router.get('/menu/:explorerId', websiteController.displayMenu);
// router.get('/:explorerId/menu', websiteController.displayMenu);

// // router.get('/signup', websiteController.signup);

// // router.get('/declare', declareController.getDataFromExplorer);
// router.get('/:explorerId/declare', declareController.getDataFromExplorer);
// router.get('/:explorerId/opportunities', opportunitiesController.getOpportunities);
// router.get('/:explorerId/cards', cardController.getExplorer);

// router.get('/opportunities', opportunitiesController.getOpportunities);
// router.get('/cards', cardController.getExplorers);

// router.use(() => {
//     throw new ApiError('Page introuvable', { statusCode: 404 });
// });

module.exports = router;