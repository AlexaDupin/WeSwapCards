const express = require('express');
const requireApiAuth = require('../../middlewares/requireApiAuth');
const { checkConversationAuthorization, checkExplorerAuthorization } = require('../../middlewares/authorization');
const validateNewMessage = require('../../middlewares/validation');

const userController = require('../../controllers/api/user');
const reportController = require('../../controllers/api/report');
const opportunitiesController = require('../../controllers/api/opportunities');
const chatController = require('../../controllers/api/chat');
const apiController = require('../../controllers/api/index');
const cardController = require('../../controllers/api/cards');
const pushTokenController = require('../../controllers/api/pushToken');
const moderationController = require('../../controllers/api/moderation');

const controllerHandler = require('../../helpers/controllerHandler');

const router = express.Router();

router.get('/', apiController.home);

router.post('/register/user',
 requireApiAuth, controllerHandler(userController.createUser));
router.post('/login/user',
 requireApiAuth, controllerHandler(userController.getUserByUID));

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
    .route('/chapters/vintage')
    .get(controllerHandler(opportunitiesController.getVintageChapters));

router
    .route('/cards/statuses/:explorerId')
    .get(requireApiAuth, checkExplorerAuthorization, controllerHandler(cardController.getAllCardsStatuses))

router
    .route('/explorercards/:explorerId/cards/:cardId')
    .put(requireApiAuth, checkExplorerAuthorization, controllerHandler(cardController.addCardToExplorer))
    .delete(requireApiAuth, checkExplorerAuthorization, controllerHandler(cardController.deleteCardFromExplorer));

router
  .route('/explorercards/:explorerId/chapters/:chapterId/status')
  .post(requireApiAuth, checkExplorerAuthorization, controllerHandler(cardController.markChapter));

router
    .route('/cards/:placeId')
    .get(controllerHandler(reportController.getCardsFromPlace));

router
    .route('/opportunities/:explorerId')
    .get(requireApiAuth, checkExplorerAuthorization, controllerHandler(opportunitiesController.getOpportunities));

router
    .route('/opportunities/:explorerId/:placeId')
    .get(requireApiAuth, checkExplorerAuthorization, controllerHandler(opportunitiesController.getCountForOnePlaceForOneExplorer));

router
    .route('/opportunities/:explorerId/card/:cardId')
    .get(requireApiAuth, checkExplorerAuthorization, controllerHandler(opportunitiesController.findSwapOpportunities));

router
    .route('/card/:cardId')
    .get(requireApiAuth, controllerHandler(opportunitiesController.getCardName));

router
    .route('/conversation/:explorerId/:swapExplorerId/:swapCardName')
    .get(requireApiAuth, checkExplorerAuthorization, controllerHandler(chatController.getConversation))
    .post(requireApiAuth, checkExplorerAuthorization, controllerHandler(chatController.createConversation))

router
    .route('/conversation/:conversationId/:explorerId')
    .put(requireApiAuth, checkConversationAuthorization, controllerHandler(chatController.setMessagesToRead))

router
    .route('/conversation/:conversationId/:explorerId/unread')
    .put(requireApiAuth, checkConversationAuthorization, controllerHandler(chatController.setConversationToUnread));

router
    .route('/conversation/:explorerId')
    .get(requireApiAuth, checkExplorerAuthorization, controllerHandler(chatController.getCurrentConversations))

router
    .route('/conversation/unread/:explorerId')
    .get(requireApiAuth, checkExplorerAuthorization, controllerHandler(chatController.getUnreadConversations))

router
    .route('/conversation/past/:explorerId')
    .get(requireApiAuth, checkExplorerAuthorization, controllerHandler(chatController.getPastConversations))

router
    .route('/conversation/:conversationId/opportunities/:creatorId/:recipientId')
    .get(requireApiAuth, checkConversationAuthorization, controllerHandler(chatController.getOpportunitiesForRecipient))

router
    .route('/conversation/:conversationId')
    .put(requireApiAuth, checkConversationAuthorization, controllerHandler(chatController.editConversationStatus))

router
    .route('/chat/:conversationId')
    .get(requireApiAuth, checkConversationAuthorization, controllerHandler(chatController.getAllMessagesInConversation))
    .post(requireApiAuth, checkConversationAuthorization, validateNewMessage, controllerHandler(chatController.insertNewMessage));
    
router
    .route('/exploreractivity/:explorerId')
    .post(requireApiAuth, checkExplorerAuthorization, controllerHandler(userController.updateLastActive))

// Moderation: blocking + reports. :explorerId is the acting user, verified
// against the Clerk session by checkExplorerAuthorization.
router
    .route('/block/:explorerId/:targetExplorerId')
    .post(requireApiAuth, checkExplorerAuthorization, controllerHandler(moderationController.blockUser))
    .delete(requireApiAuth, checkExplorerAuthorization, controllerHandler(moderationController.unblockUser))

router
    .route('/block/:explorerId')
    .get(requireApiAuth, checkExplorerAuthorization, controllerHandler(moderationController.getMyBlocks))

router
    .route('/report/:explorerId')
    .post(requireApiAuth, checkExplorerAuthorization, controllerHandler(moderationController.reportUser))

// Device push tokens. The explorer is derived from the Clerk session inside the
// controller (no :explorerId in the path), so no checkExplorerAuthorization here.
router
    .route('/push-tokens')
    .post(requireApiAuth, controllerHandler(pushTokenController.registerPushToken))
    .delete(requireApiAuth, controllerHandler(pushTokenController.deletePushToken))

// Account deletion. Explorer is derived from the Clerk session (no path param),
// so a user can only ever delete their own account.
router
    .route('/account')
    .delete(requireApiAuth, controllerHandler(userController.deleteAccount))

router
    .route('/cards')
    .get(controllerHandler(cardController.getAllCards))   

module.exports = router;