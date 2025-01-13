const express = require('express');
const userController = require('../../controllers/api/user');
const reportController = require('../../controllers/api/report');
const opportunitiesController = require('../../controllers/api/opportunities');
const explorerCardsController = require('../../controllers/api/explorerCards');
const chatController = require('../../controllers/api/chat');

const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

// router.post('/register', controllerHandler(userController.signUp));
router.post('/register/user', controllerHandler(userController.createUser));
// router.post('/login', userController.login);
// router.post('/login/user', controllerHandler(userController.getUserByUID));
router.get('/login/user', controllerHandler(reportController.getAllPlaces));

// router.get('/signout', userController.signOut);

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
    .post(controllerHandler(reportController.addCardsToExplorer));

router
    .route('/opportunities/:explorerId')
    .get(controllerHandler(opportunitiesController.getOpportunities));

router
    .route('/opportunities/:explorerId/:placeId')
    .get(controllerHandler(opportunitiesController.getCountForOnePlaceForOneExplorer));

router
    .route('/opportunities/:explorerId/card/:cardId')
    .get(controllerHandler(opportunitiesController.findSwapOpportunities));

router
    .route('/conversation/:explorerId/:swapExplorerId/:swapCardName')
    .get(controllerHandler(chatController.getConversation))
    .post(controllerHandler(chatController.createConversation))

router
    .route('/conversation/:conversationId/:explorerId')
    .put(controllerHandler(chatController.setMessagesToRead))

router
    .route('/conversation/:explorerId')
    .get(controllerHandler(chatController.getAllConversations))

router
    .route('/conversation/:conversationId')
    .put(controllerHandler(chatController.editConversationStatus))

router
    .route('/chat')
    .post(controllerHandler(chatController.insertNewMessage));

router
    .route('/chat/:conversationId')
    .get(controllerHandler(chatController.getAllMessagesInConversation))


// router
//     .route('/opportunities/:explorerId/card/:cardId')
//     .get(userController.authMiddleware, controllerHandler(opportunitiesController.findExplorerForswapCard));

// router
//     .route('/opportunities/:explorerId/swapexplorer/:swapExplorerId')
//     .get(userController.authMiddleware, controllerHandler(opportunitiesController.findSwapOpportunities));

router
    .route('/explorercards/:explorerId')
    .get(controllerHandler(explorerCardsController.getExplorerCardsByPlace));

router
    .route('/explorercards/:explorerId/cards/:cardId/duplicate')
    .patch(controllerHandler(explorerCardsController.editDuplicateStatus));

module.exports = router;