
const utils = {
        //Initialize event listeners
    loginEventListeners: function(){
        document.getElementById('loginForm').addEventListener('submit', loginModule.handleLoginForm);
    },
    menuEventListeners: function(){
        // window.addEventListener('DOMContentLoaded', menuModule.fetchMenu);
        document.getElementById('signout').addEventListener('click', loginModule.handleSignOut);
    },
    declareEventListeners: function() {
        placeSelect.addEventListener('change', placeModule.handlePlaceChange);
        cardList.addEventListener('change', cardModule.handleCardSelection);
        declareFormModule.setupFieldsetListeners();
        document.getElementById('declareForm').addEventListener('submit', declareFormModule.handleDeclareForm);
        document.getElementById('selectAllCheckbox').addEventListener('click', cardModule.selectAll);
    },
    opportunitiesEventListeners: function(){
        document.getElementById('opportunitiesBtn').addEventListener('click', opportunitiesFormModule.handleOpportunitiesForm);
        // window.addEventListener('DOMContentLoaded', opportunitiesFormModule.handleOpportunitiesForm);
    },
    explorerCardsEventListeners: function(){
        // document.getElementById('cardForm').addEventListener('submit', explorerCardsModule.handleExplorerCardsForm);
        window.addEventListener('DOMContentLoaded', explorerCardsModule.handleExplorerCardsForm);
    },
    scrollToTop: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
    }
}