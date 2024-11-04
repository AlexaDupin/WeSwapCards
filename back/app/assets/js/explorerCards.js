const explorerCardsModule = {
    explorerCardsList: document.getElementById('explorerCards'),

    handleExplorerCardsForm: async function(event) {
        event.preventDefault();
        const path = window.location.pathname; 
        const explorerId = path.split('/')[1]; 
        explorerCardsModule.explorerCardsList.innerHTML = '';

        try {
            const cardsByPlace = await explorerCardsModule.fetchExplorerCards(explorerId);
            explorerCardsModule.updateExplorerCardsList(cardsByPlace, explorerId);
        } catch (error) {
            console.error('Error:', error);
        }
    },
    updateExplorerCardsList: async function(cardsByPlace, explorerId) {

        if (cardsByPlace && cardsByPlace.length > 0) {

            // Actions on each place group
            for (place of cardsByPlace) {
                const placeName = place.place_name;

                const explorerCardHtml = explorerCardsModule.createPlaceHtml(place);
                explorerCardsModule.explorerCardsList.insertAdjacentHTML('beforeend', explorerCardHtml);      

                // Actions for each card
                for (const card of place.cards) {
                    const cardId = card.id;

                    // Create html and retrieve element by cardId
                    const placeCardHtml = explorerCardsModule.createCardsByPlaceHtml(card);
                    document.getElementById(`${placeName}`).insertAdjacentHTML('beforeend', placeCardHtml);
                    const cardElement = document.getElementById(`ci${cardId}`);

                    // Retrieve duplicate status and add coloring
                    const duplicateStatus = await explorerCardsModule.fetchDuplicateStatus(cardId, explorerId);

                    if (duplicateStatus.duplicate) {
                        cardElement.classList.add('duplicate');
                    } 
                    
                    // On click, edit duplicate status
                    cardElement.addEventListener('click', async function () {
                        cardElement.classList.toggle('duplicate');
                        const newDuplicateData = {duplicate: !duplicateStatus.duplicate};
                        const response = await explorerCardsModule.toggleDuplicateStatus(cardId, explorerId, newDuplicateData);
                        console.log(response);
                    });
                };

            if (place.cards.length === 9) {
                document.getElementById(`pb${placeName}`).classList.add('full');
            }
            };
        };
    },
    createPlaceHtml: function(place) {
        const percentage = place.cards.length/9*100;

        return `
        <div class="d-flex flex-column align-items-center">
            <h1 class="explorerCard-title">
                ${place.place_name}
            </h1>

            <div class="container d-flex flex-row justify-content-center">
                <div class="progress w-25 mb-3" role="progressbar" aria-label="Basic example" 
                aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" 
                style="height: 0.8rem">
                    <div class="progress-bar" style="width: ${percentage}%" id="pb${place.place_name}"></div>
                </div>
                <div class="progress-bar-label">${place.cards.length}/9</div>
            </div>

            <div class="explorerCard-numbers" id="${place.place_name}">
            </div>
        </div>
        `
    },
    createCardsByPlaceHtml: function(placeCard) {
        return `
        <div class="placeCards-container d-inline-flex">
            <img src="../assets/images/${placeCard.number}-square.svg" 
            class="card-img-top card-square" alt="" id="ci${placeCard.id}">
        </div>
        `
    },
    fetchExplorerCards: function(explorerId) {
        return fetch(`/api/v1/${explorerId}/cards`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },
    fetchDuplicateStatus: function(cardId, explorerId) {
        return fetch(`/api/v1/${explorerId}/cards/${cardId}/duplicate`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },
    toggleDuplicateStatus: function(cardId, explorerId, newDuplicateData) {
        return fetch(`api/v1/cards/${cardId}/${explorerId}/duplicate`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDuplicateData)  
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },
};
