const express = require('express');
const { requireAuth } = require('@clerk/express');

const userController = require('../../controllers/api/user');
const reportController = require('../../controllers/api/report');
const opportunitiesController = require('../../controllers/api/opportunities');
const explorerCardsController = require('../../controllers/api/explorerCards');
const chatController = require('../../controllers/api/chat');

const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

router.post('/register/user',
 requireAuth(), controllerHandler(userController.createUser));
router.post('/login/user',
 requireAuth(), controllerHandler(userController.getUserByUID));

router
    .route('/places')
    .get(requireAuth(), controllerHandler(reportController.getAllPlaces))

router
    .route('/cards/:placeId')
    .get(requireAuth(), controllerHandler(reportController.getCardsFromPlace));

router
    .route('/cards/:placeId/:explorerId')
    .get(requireAuth(), controllerHandler(reportController.getExplorerCardsFromOnePlace));

router
    .route('/cards/:placeId/:explorerId/duplicates')
    .get(requireAuth(), controllerHandler(reportController.getDuplicateCards));

router
    .route('/report/:explorerId')
    .post(requireAuth(), controllerHandler(reportController.addCardsToExplorer));

router
    .route('/opportunities/:explorerId')
    .get(requireAuth(), controllerHandler(opportunitiesController.getOpportunities));

router
    .route('/opportunities/:explorerId/:placeId')
    .get(requireAuth(), controllerHandler(opportunitiesController.getCountForOnePlaceForOneExplorer));

router
    .route('/opportunities/:explorerId/card/:cardId')
    .get(requireAuth(), controllerHandler(opportunitiesController.findSwapOpportunities));

router
    .route('/card/:cardId')
    .get(requireAuth(), controllerHandler(opportunitiesController.getCardName));

router
    .route('/conversation/:explorerId/:swapExplorerId/:swapCardName')
    .get(requireAuth(), controllerHandler(chatController.getConversation))
    .post(requireAuth(), controllerHandler(chatController.createConversation))

router
    .route('/conversation/:conversationId/:explorerId')
    .put(requireAuth(), controllerHandler(chatController.setMessagesToRead))

router
    .route('/conversation/:explorerId')
    .get(requireAuth(), controllerHandler(chatController.getAllConversations))

router
    .route('/conversation/:conversationId')
    .put(requireAuth(), controllerHandler(chatController.editConversationStatus))

router
    .route('/chat')
    .post(requireAuth(), controllerHandler(chatController.insertNewMessage));

router
    .route('/chat/:conversationId')
    .get(requireAuth(), controllerHandler(chatController.getAllMessagesInConversation))

router
    .route('/explorercards/:explorerId')
    .get(requireAuth(), controllerHandler(explorerCardsController.getExplorerCardsByPlace));

router
    .route('/explorercards/:explorerId/cards/:cardId/duplicate')
    .patch(requireAuth(), controllerHandler(explorerCardsController.editDuplicateStatus));

// router
//     .route('/opportunities/:explorerId/card/:cardId')
//     .get(userController.authMiddleware, controllerHandler(opportunitiesController.findExplorerForswapCard));

// router
//     .route('/opportunities/:explorerId/swapexplorer/:swapExplorerId')
//     .get(userController.authMiddleware, controllerHandler(opportunitiesController.findSwapOpportunities));

module.exports = router;