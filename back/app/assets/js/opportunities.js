const opportunitiesFormModule = {
    opportunitiesList: document.getElementById('opportunities'),
    cardIds: [],

    handleOpportunitiesForm: async function(event) {
        event.preventDefault();
        const path = window.location.pathname; 
        const explorerId = path.split('/')[1]; 
        const opportunitiesIntro = document.querySelector('#opportunities-intro');
        const spinner = document.querySelector('.spinner-grow');
        const spinnerText = document.querySelector('#opportunities-spinner-text');

        // Reset list and cardIds
        opportunitiesFormModule.resetOpportunitiesList();
        opportunitiesFormModule.cardIds = [];
        opportunitiesIntro.classList.add('d-none');

        try {
            const opportunities = await opportunitiesFormModule.fetchOpportunities(explorerId);
            // spinner.classList.remove('d-none');
            opportunitiesFormModule.updateOpportunitiesList(opportunities, explorerId);

            // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            // delay(2000).then(() => {
            //     opportunitiesFormModule.updateOpportunitiesList(opportunities, explorerId);
            //     spinner.classList.add('d-none');
            // });

        } catch (error) {
            console.error('Error:', error);
        }
    },

    updateOpportunitiesList: async function(opportunities, explorerId) {
    
        if (opportunities && opportunities.length > 0) {

            for (let opportunity of opportunities) {
                const placeId = opportunity.place_id;
                const cardId = opportunity.card_id;

                let count; // Counting number of cards the explorer has for 1 place
                opportunitiesFormModule.cardIds.push(cardId); // To avoid counting an opportunity twice
                // console.log("opportunity", opportunity);
                // console.log(opportunitiesFormModule.cardIds);
                try {
                    const opportunitiesCountForPlace = await opportunitiesFormModule.fetchOpportunitiesCountForOnePlaceForOneExplorer(placeId, explorerId);
                    count = Number(opportunitiesCountForPlace[0].count);
                    // console.log(`count for ${placeId}`, count);
                } catch (error) {
                    console.error('Error:', error);
                }

                const opportunityHtml = opportunitiesFormModule.createOpportunityHtml(opportunity);
                opportunitiesFormModule.opportunitiesList.insertAdjacentHTML('beforeend', opportunityHtml);
                

                // Add a different color depending on priority
                const element = document.getElementById(`${opportunity.id}`);
                if (count >= 8) { // Shiny
                    element.classList.add("star-card");
                }
                if (count >= 6) { // Green (Orange is 5)
                    element.classList.add("key-card");
                }
                if (count <= 4) { // White
                    element.classList.add("low-card");
                }
            };

            opportunitiesFormModule.opportunitiesList.insertAdjacentHTML('afterbegin', opportunitiesFormModule.createMessageHtml());

        } else {
            opportunitiesFormModule.opportunitiesList.innerHTML = '<div class="text-center">Aïe, pas de chance ! Aucune opportunité disponible</div>';
        }
    },

    createMessageHtml: function() {
        // Counting single card Ids only
        let uniqueCardIds = [...new Set(opportunitiesFormModule.cardIds)];

        if (opportunitiesFormModule.cardIds.length > 1) {
            return `
            <p class="message">Trop cool, tu as ${uniqueCardIds.length} opportunités !</p>
            `
            } else if (opportunitiesFormModule.cardIds.length == 1) {
                return `
                <p class="message p-1">Tu as ${uniqueCardIds.length} opportunité, c'est déjà ça !</p>
                `
        }
    },
    createOpportunityHtml: function(opportunity) {
        return `
        <p class="results btn btn-primary rounded-pill" id="${opportunity.id}">${opportunity.card_name} (${opportunity.explorer_name})</p>
        `
    },
    resetOpportunitiesList: function() {
        opportunitiesFormModule.opportunitiesList.innerHTML = '';
    },
    fetchOpportunities: function(explorerId) {
        return fetch(`/api/v1/${explorerId}/opportunities`)
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },
    fetchOpportunitiesCountForOnePlaceForOneExplorer: function(placeId, explorerId) {
        return fetch(`/api/v1/${explorerId}/opportunities/${placeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },
}