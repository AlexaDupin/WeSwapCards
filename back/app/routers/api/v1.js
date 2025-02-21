const express = require('express');
const { requireAuth } = require('@clerk/express');
const { checkConversationAuthorization, checkExplorerAuthorization } = require('../../middlewares/authorization');
const validateNewMessage = require('../../middlewares/validation');

const userController = require('../../controllers/api/user');
const reportController = require('../../controllers/api/report');
const opportunitiesController = require('../../controllers/api/opportunities');
const explorerCardsController = require('../../controllers/api/explorerCards');
const chatController = require('../../controllers/api/chat');
const apiController = require('../../controllers/api/index');

const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

router.get('/', apiController.home);
router.get('/country', apiController.country);

router.post('/register/user',
 requireAuth(), controllerHandler(userController.createUser));
router.post('/login/user',
 requireAuth(), controllerHandler(userController.getUserByUID));

router
    .route('/places')
    .get(controllerHandler(reportController.getAllPlaces))

router
    .route('/cards/:placeId')
    .get(requireAuth(), controllerHandler(reportController.getCardsFromPlace));

router
    .route('/cards/:placeId/:explorerId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(reportController.getExplorerCardsFromOnePlace));

router
    .route('/cards/:placeId/:explorerId/duplicates')
    .get(requireAuth(), controllerHandler(reportController.getDuplicateCards));

router
    .route('/report/:explorerId')
    .post(requireAuth(), checkExplorerAuthorization, controllerHandler(reportController.addCardsToExplorer));

router
    .route('/opportunities/:explorerId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(opportunitiesController.getOpportunities));

router
    .route('/opportunities/:explorerId/:placeId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(opportunitiesController.getCountForOnePlaceForOneExplorer));

router
    .route('/opportunities/:explorerId/card/:cardId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(opportunitiesController.findSwapOpportunities));

router
    .route('/card/:cardId')
    .get(requireAuth(), controllerHandler(opportunitiesController.getCardName));

router
    .route('/conversation/:explorerId/:swapExplorerId/:swapCardName')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(chatController.getConversation))
    .post(requireAuth(), checkExplorerAuthorization, controllerHandler(chatController.createConversation))

router
    .route('/conversation/:conversationId/:explorerId')
    .put(requireAuth(), checkConversationAuthorization, controllerHandler(chatController.setMessagesToRead))

router
    .route('/conversation/:explorerId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(chatController.getAllConversations))

router
    .route('/conversation/:conversationId')
    .put(requireAuth(), checkConversationAuthorization, controllerHandler(chatController.editConversationStatus))

router
    .route('/chat/:conversationId')
    .get(requireAuth(), checkConversationAuthorization, controllerHandler(chatController.getAllMessagesInConversation))
    .post(requireAuth(), checkConversationAuthorization, validateNewMessage, controllerHandler(chatController.insertNewMessage));
    
router
    .route('/explorercards/:explorerId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(explorerCardsController.getExplorerCardsByPlace));

router
    .route('/explorercards/:explorerId/cards/:cardId/duplicate')
    .patch(requireAuth(), checkExplorerAuthorization, controllerHandler(explorerCardsController.editDuplicateStatus));

// router
//     .route('/opportunities/:explorerId/card/:cardId')
//     .get(userController.authMiddleware, controllerHandler(opportunitiesController.findExplorerForswapCard));

// router
//     .route('/opportunities/:explorerId/swapexplorer/:swapExplorerId')
//     .get(userController.authMiddleware, controllerHandler(opportunitiesController.findSwapOpportunities));

module.exports = router;