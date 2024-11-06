
const cardModule = {

    cardList: document.getElementById('cardList'),
    explorerCardList: document.getElementById('explorerCardList'),
    duplicateList: [],

    // Fetch cards from API depending on placeId
    fetchPlaceCards: function(placeId) {
        return fetch(`/api/v1/cards/${placeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },

    // Fetch cards from API depending on explorerId
    fetchExplorerCards: function(explorerId) {
        return fetch(`/api/v1/cards/explorer/${explorerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },

    // Fetch cards from API depending on placeId and explorerId
    fetchExplorerCardsForOnePlace: function(placeId, explorerId) {
        return fetch(`/api/v1/cards/${placeId}/${explorerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },

    fetchDuplicateCards: function(explorerId, placeId) {
        return fetch(`/api/v1/cards/${placeId}/${explorerId}/duplicates`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },

    // Update card list
    updateCardList: function(retrievedCards, checkedCards, duplicates) {
        cardModule.cardList.innerHTML = ''; // Clear loading message

        if (retrievedCards.cards && retrievedCards.cards.length > 0) {
            // Show all cards from the selected place
            retrievedCards.cards.forEach(card => {
                const cardHtml = cardModule.createCardHtml(card);
                cardModule.cardList.insertAdjacentHTML('beforeend', cardHtml);
            });

            // If card already logged for this explorer, mark it as checked
            checkedCards.cards.forEach(checkedCard => {
                const checkbox = cardModule.cardList.querySelector(`input[type="checkbox"][id="card${checkedCard.id}"]`);
                if (checkbox) {
                    checkbox.checked = true; // Set the checkbox as checked
                }
            });

            // Add duplicates for this place and explorer to duplicateList variable
            duplicates.cards.forEach(duplicate => {
                cardModule.duplicateList.push(duplicate.card_id)
            })

        } else {
            cardModule.cardList.innerHTML = '<div class="text-center">Aucune carte disponible</div>';
        }
    },

    // Create html for a single card
    createCardHtml: function(card) {
        return `
        <div class="col-4 pt-3">
            <input type="checkbox" class="btn-check card-check" id="card${card.id}" name="cardId[]" value="${card.id}">
            <label class="btn card" for="card${card.id}" id=number${card.number}>
            
                <img src="../assets/images/${card.number}-square.svg" class="card-img-top" alt="${card.name}">
                                                   
                <div class="card-body p-1">
                    <h2 class="card-title h6">${card.name}</h2>
                </div>
                
            </label>
        </div>`;
    },

    // Reset both card lists
    resetCardLists: function() {
        cardModule.cardList.innerHTML = '';
        cardModule.explorerCardList.innerHTML = '';
    },

    // Show loading state
    showLoadingState: function() {
        cardList.innerHTML = '<div class="text-center">Chargement...</div>';
    },

    // Show error state
    showErrorState: function(error) {
        console.error('Error fetching cards:', error);
        cardList.innerHTML = '<div class="text-center">Erreur de chargement</div>';
    },

    // Handle card selection change > add duplicate option for selected cards
    handleCardSelection: function() {
        explorerCardList.innerHTML = ''; // Reset duplicate card list
        const selectedCards = Array.from(cardList.querySelectorAll('input[type="checkbox"]:checked'));
        selectedCards.forEach(cardInput => {
            const cardId = cardInput.id.replace('card', ''); // Extract card ID
            const cardLabel = cardInput.nextElementSibling; // Get corresponding label
            const cardNumber = cardLabel.id.replace('number', ''); // Extract card number
            const duplicateCardHtml = cardModule.createDuplicateCardHtml(cardId, cardNumber, cardLabel);
            explorerCardList.insertAdjacentHTML('beforeend', duplicateCardHtml);
        
            // If card already logged indicated as duplicate, mark it as checked
            if (cardModule.duplicateList.includes(Number(cardId))) {
                cardModule.explorerCardList.querySelector(`input[type="checkbox"][id="duplicateCard${cardId}"]`).checked = true;            
            }
        });

    },
    // Create html for a duplicate card
    createDuplicateCardHtml: function(cardId, cardNumber, cardLabel) {
        return `
        <div class="col-4 pt-3">
            <input type="checkbox" class="btn-check" id="duplicateCard${cardId}" name="duplicateId[]" value=${cardId}>
            <label class="btn card" for="duplicateCard${cardId}">
                <img src="../assets/images/${cardNumber}-square.svg" class="card-img-top" alt="${cardLabel.textContent.trim()}">
                <div class="card-body p-1">
                    <h2 class="card-title h6">${cardLabel.textContent.trim()}</h2>
                </div>
            </label>
        </div>`;
    },
    selectAll: function() {
        let inputs = document.querySelectorAll('.card-check');

        // Mark all cards as checked
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].checked = true;
        }

        // Show next fieldset with duplicate card options and button
        const explorerCardListFieldset = document.getElementById('explorerCardList-fieldset');
        explorerCardListFieldset.classList.remove('d-none'); 
        cardModule.handleCardSelection();
        submitBtn.classList.remove('d-none'); 
    }
}