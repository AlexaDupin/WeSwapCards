const express = require('express');
const { requireAuth } = require('@clerk/express');
const { checkConversationAuthorization, checkExplorerAuthorization } = require('../../middlewares/authorization');
const validateNewMessage = require('../../middlewares/validation');

const userController = require('../../controllers/api/user');
const reportController = require('../../controllers/api/report');
const opportunitiesController = require('../../controllers/api/opportunities');
const chatController = require('../../controllers/api/chat');
const apiController = require('../../controllers/api/index');
const cardController = require('../../controllers/api/cards');
const pushTokenController = require('../../controllers/api/pushToken');

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
    .route('/chapters/latest')
    .get(controllerHandler(opportunitiesController.getLatestChapters));

router
    .route('/chapters/by-ids')
    .get(controllerHandler(opportunitiesController.getChaptersByIds));

router
    .route('/cards/statuses/:explorerId')
    .get(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.getAllCardsStatuses))

router
    .route('/explorercards/:explorerId/cards/:cardId')
    .put(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.addCardToExplorer))
    .delete(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.deleteCardFromExplorer));

router
  .route('/explorercards/:explorerId/chapters/:chapterId/status')
  .post(requireAuth(), checkExplorerAuthorization, controllerHandler(cardController.markChapter));

router
    .route('/cards/:placeId')
    .get(controllerHandler(reportController.getCardsFromPlace));

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
    .route('/conversation/:conversationId/:explorerId/unread')
    .put(requireAuth(), checkConversationAuthorization, controllerHandler(chatController.setConversationToUnread));

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
    
router
    .route('/exploreractivity/:explorerId')
    .post(requireAuth(), checkExplorerAuthorization, controllerHandler(userController.updateLastActive))

// Device push tokens. The explorer is derived from the Clerk session inside the
// controller (no :explorerId in the path), so no checkExplorerAuthorization here.
router
    .route('/push-tokens')
    .post(requireAuth(), controllerHandler(pushTokenController.registerPushToken))
    .delete(requireAuth(), controllerHandler(pushTokenController.deletePushToken))

// Account deletion. Explorer is derived from the Clerk session (no path param),
// so a user can only ever delete their own account.
router
    .route('/account')
    .delete(requireAuth(), controllerHandler(userController.deleteAccount))

router
    .route('/cards')
    .get(controllerHandler(cardController.getAllCards))   

module.exports = router;