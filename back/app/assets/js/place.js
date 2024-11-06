
const placeModule = {

    // Handle place selection change
    handlePlaceChange: async function(event) {
        console.log("PLACE CHANGE");
        const selectedPlaceId = event.target.value;
        const path = window.location.pathname; 
        const explorerId = path.split('/')[1]; 
        console.log(path, explorerId);
        
        cardModule.resetCardLists();

        if (selectedPlaceId) {
            cardModule.showLoadingState();
            
            try {
                const allCards = await cardModule.fetchPlaceCards(selectedPlaceId);
                const checkedCards = await cardModule.fetchExplorerCardsForOnePlace(selectedPlaceId, explorerId);
                const duplicates = await cardModule.fetchDuplicateCards(explorerId, selectedPlaceId);
                
                cardModule.updateCardList(allCards, checkedCards, duplicates);

            } catch (error) {
                cardModule.showErrorState(error);
            }
        }
    }
}


