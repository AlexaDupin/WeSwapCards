const express = require('express');
const userController = require('../../controllers/api/user');
const reportController = require('../../controllers/api/report');
const opportunitiesController = require('../../controllers/api/opportunities');
const explorerCardsController = require('../../controllers/api/explorerCards');
const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

router.post('/register', controllerHandler(userController.signUp));
router.post('/register/user', userController.authMiddleware, userController.createUser);
router.post('/login', userController.login);
router.post('/login/user', userController.authMiddleware, userController.getUserByUID);

router.get('/signout', userController.signOut);

router
    .route('/places')
    .get(controllerHandler(reportController.getAllPlaces))

router
    .route('/cards/:placeId')
    .get(controllerHandler(reportController.getCardsFromPlace));

router
    .route('/cards/:placeId/:explorerId')
    .get(controllerHandler(reportController.getExplorerCardsFromOnePlace));

router
    .route('/cards/:placeId/:explorerId/duplicates')
    .get(controllerHandler(reportController.getDuplicateCards));

router
    .route('/card/:cardId')
    .get(controllerHandler(opportunitiesController.getCardName));

router
    .route('/report/:explorerId')
    .post(userController.authMiddleware, controllerHandler(reportController.addCardsToExplorer));

router
    .route('/opportunities/:explorerId')
    .get(userController.authMiddleware, controllerHandler(opportunitiesController.getOpportunities));

router
    .route('/opportunities/:explorerId/:placeId')
    .get(userController.authMiddleware, controllerHandler(opportunitiesController.getCountForOnePlaceForOneExplorer));

router
    .route('/opportunities/:explorerId/card/:cardId')
    .get(userController.authMiddleware, controllerHandler(opportunitiesController.findSwapOpportunities));

// router
//     .route('/opportunities/:explorerId/card/:cardId')
//     .get(userController.authMiddleware, controllerHandler(opportunitiesController.findExplorerForswapCard));

// router
//     .route('/opportunities/:explorerId/swapexplorer/:swapExplorerId')
//     .get(userController.authMiddleware, controllerHandler(opportunitiesController.findSwapOpportunities));

router
    .route('/explorercards/:explorerId')
    .get(userController.authMiddleware, controllerHandler(explorerCardsController.getExplorerCardsByPlace));

router
    .route('/explorercards/:explorerId/cards/:cardId/duplicate')
    .patch(userController.authMiddleware, controllerHandler(explorerCardsController.editDuplicateStatus));

module.exports = router;