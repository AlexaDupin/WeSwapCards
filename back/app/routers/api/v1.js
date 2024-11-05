const express = require('express');
const cardController = require('../../controllers/api/explorerCards');
const declareController = require('../../controllers/api/declare');
const opportunitiesController = require('../../controllers/api/opportunities');
const explorerCardsController = require('../../controllers/api/explorerCards');
const userController = require('../../controllers/api/user');
const menuController = require('../../controllers/api/menu');
// const websiteController = require('../../controllers/website');

const router = express.Router();

router.post('/register', userController.signUp);
router.post('/register/user', userController.createUser);
router.post('/login', userController.login);


// OLD ROUTES //

// router.get('/menu', userController.authMiddleware, menuController.getMenu);
router.get('/menu', menuController.getMenu);

/// TEST
router.post('/menu', menuController.getMenu);

router.get('/user', userController.authMiddleware, userController.getUser);
router.post('/user', userController.getUserByUIID);

router.get('/cards/:placeId', declareController.getCardsFromPlace);
router.get('/cards/:placeId/:explorerId', declareController.getExplorerCardsFromOnePlace);
router.get('/cards/:placeId/:explorerId/duplicates', declareController.getDuplicateCards);
// router.get('/cards/:cardId/:explorerId/duplicate', explorerCardsController.getDuplicateStatus);
router.get('/signout', userController.signOut);

// router.get('/opportunities/:placeId/:explorerId', opportunitiesController.getOpportunitiesCountForOnePlaceForOneExplorer);

router.post('/:explorerId/declare', declareController.addCardsToExplorer);
router.get('/:explorerId/opportunities', opportunitiesController.handleOpportunities);
router.get('/:explorerId/opportunities/:placeId', opportunitiesController.getOpportunitiesCountForOnePlaceForOneExplorer);
router.get('/:explorerId/cards', cardController.getExplorerCards);
router.get('/:explorerId/cards/:cardId/duplicate', explorerCardsController.getDuplicateStatus);


// router.post('/declare', userController.authMiddleware,declareController.addCardsToExplorer);
// router.post('/opportunities', opportunitiesController.handleOpportunities);


router.patch('/cards/:cardId/:explorerId/duplicate', explorerCardsController.editDuplicateStatus);


module.exports = router;