const express = require('express');
const userController = require('../../controllers/api/user');
const reportController = require('../../controllers/api/report');


const cardController = require('../../controllers/api/explorerCards');
const declareController = require('../../controllers/api/declare');
const opportunitiesController = require('../../controllers/api/opportunities');
const explorerCardsController = require('../../controllers/api/explorerCards');
const menuController = require('../../controllers/api/menu');
// const websiteController = require('../../controllers/website');

const router = express.Router();

router.post('/register', userController.signUp);
router.post('/register/user', userController.authMiddleware, userController.createUser);
router.post('/login', userController.login);
router.post('/login/user', userController.authMiddleware, userController.getUserByUID);

router.get('/signout', userController.signOut);

router
    .route('/places')
    .get(reportController.getAllPlaces)

router
    .route('/cards/:placeId')
    .get(reportController.getCardsFromPlace);

router
    .route('/cards/:placeId/:explorerId')
    .get(reportController.getExplorerCardsFromOnePlace);

router
    .route('/cards/:placeId/:explorerId/duplicates')
    .get(reportController.getDuplicateCards);

router
    .route('/declare/:explorerId')
    .post(reportController.addCardsToExplorer);

// OLD ROUTES //

// router.get('/menu', userController.authMiddleware, menuController.getMenu);
router.get('/menu', menuController.getMenu);

/// TEST
router.post('/menu', menuController.getMenu);
// router.get('/menu', userController.authMiddleware, menuController.getMenu);

router.get('/user', userController.authMiddleware, userController.getUser);
router.post('/user', userController.getUserByUID);

// router.get('/cards/:cardId/:explorerId/duplicate', explorerCardsController.getDuplicateStatus);

// router.get('/opportunities/:placeId/:explorerId', opportunitiesController.getOpportunitiesCountForOnePlaceForOneExplorer);

router.get('/:explorerId/opportunities', opportunitiesController.handleOpportunities);
router.get('/:explorerId/opportunities/:placeId', opportunitiesController.getOpportunitiesCountForOnePlaceForOneExplorer);
router.get('/:explorerId/cards', cardController.getExplorerCards);
router.get('/:explorerId/cards/:cardId/duplicate', explorerCardsController.getDuplicateStatus);


// router.post('/declare', userController.authMiddleware,declareController.addCardsToExplorer);
// router.post('/opportunities', opportunitiesController.handleOpportunities);


router.patch('/cards/:cardId/:explorerId/duplicate', explorerCardsController.editDuplicateStatus);


module.exports = router;