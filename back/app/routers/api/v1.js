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
const cardController = require('../../controllers/api/cards');

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
    .route('/cards/statuses/:explorerId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.getAllCardsStatuses))
    .post(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.markAll));

router
    .route('/cards/statuses/:explorerId/replace')
    .post(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.replaceStatuses));

router
    .route('/explorercards/:explorerId/cards/:cardId')
    .put(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.addCardToExplorer))
    .delete(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.deleteCardFromExplorer));

router
    .route('/explorercards/:explorerId/cards')
    .delete(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.deleteAllCards));

router
    .route('/explorercards/:explorerId/cards/restore-bulk')
    .post(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.restoreBulkCards));

router
    .route('/cards/:placeId')
    .get(requireAuth(), controllerHandler(reportController.getCardsFromPlace));

// router
//     .route('/cards/:placeId/:explorerId')
//     .get(requireAuth(), checkExplorerAuthorization, controllerHandler(reportController.getExplorerCardsFromOnePlace));

// router
//     .route('/cards/:placeId/:explorerId/duplicates')
//     .get(requireAuth(), controllerHandler(reportController.getDuplicateCards));

// router
//     .route('/report/:explorerId')
//     .post(requireAuth(), checkExplorerAuthorization, controllerHandler(reportController.reportCardsForExplorer));

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
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(chatController.getCurrentConversations))

router
    .route('/conversation/unread/:explorerId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(chatController.getUnreadConversations))

router
    .route('/conversation/past/:explorerId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(chatController.getPastConversations))

router
    .route('/conversation/:conversationId/opportunities/:creatorId/:recipientId')
    .get(requireAuth(), checkConversationAuthorization, controllerHandler(chatController.getOpportunitiesForRecipient))

router
    .route('/conversation/:conversationId')
    .put(requireAuth(), checkConversationAuthorization, controllerHandler(chatController.editConversationStatus))

router
    .route('/chat/:conversationId')
    .get(requireAuth(), checkConversationAuthorization, controllerHandler(chatController.getAllMessagesInConversation))
    .post(requireAuth(), checkConversationAuthorization, validateNewMessage, controllerHandler(chatController.insertNewMessage));
    
// router
//     .route('/explorercards/:explorerId')
//     .get(requireAuth(), checkExplorerAuthorization, controllerHandler(explorerCardsController.getExplorerCardsByChapter));

router
    .route('/exploreractivity/:explorerId')
    .post(requireAuth(), checkExplorerAuthorization, controllerHandler(userController.updateLastActive))

router
    .route('/cards')
    .get(controllerHandler(cardController.getAllCards))   

// router
//     .route('/explorercards/:explorerId/cards/:cardId/duplicate')
//     .patch(requireAuth(), checkExplorerAuthorization, controllerHandler(explorerCardsController.editDuplicateStatus));

// router
//     .route('/explorercards/:explorerId/cards/status')
//     .post(requireAuth(), checkExplorerAuthorization, controllerHandler(explorerCardsController.markAllAsOwned));    

module.exports = router;