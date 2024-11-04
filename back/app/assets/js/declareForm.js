
const declareFormModule = {
    fieldsets: document.querySelectorAll('fieldset'), // Select all fieldsets

    currentFieldsetIndex: 0, // Start with the first fieldset

    // Set up event listeners for fieldsets
    setupFieldsetListeners: function() {

        // // Explorers fieldset (first fieldset)
        // const explorerFieldset = declareFormModule.fieldsets[0].querySelectorAll('input[name="explorerId"]');
        // explorerFieldset.forEach(radio => {
        //     radio.addEventListener('change', declareFormModule.showNextFieldset); // Show the next fieldset when an explorer is selected
        // });

        // Place select fieldset (second fieldset)
        const placeFieldset = declareFormModule.fieldsets[0].querySelector('#placeSelect');
        if (placeFieldset) {
            placeFieldset.addEventListener('change', declareFormModule.showNextFieldset);
        }

        // Card list fieldset (third fieldset)
        const cardFieldset = declareFormModule.fieldsets[1].querySelector('#cardList');
        cardFieldset.addEventListener('change', function() {
            const selectedCards = cardFieldset.querySelectorAll('input[type="checkbox"]:checked');
            if (selectedCards.length > 0) {
                declareFormModule.showNextFieldset(); // Show the next fieldset if cards are selected
                submitBtn.classList.remove('d-none'); 
            }
        });
    },

    // Function to show the next fieldset
    showNextFieldset: function() {
        const fieldsets = document.querySelectorAll('fieldset'); // Select all fieldsets

        if (declareFormModule.currentFieldsetIndex < fieldsets.length - 1) {
            // fieldsets[currentFieldsetIndex].classList.add('d-none'); // Hide current fieldset
            declareFormModule.currentFieldsetIndex++; // Move to the next fieldset
            fieldsets[declareFormModule.currentFieldsetIndex].classList.remove('d-none'); // Show next fieldset
        }
    },

    handleDeclareForm: async function(event) {
        event.preventDefault();
        const path = window.location.pathname; 
        const explorerId = path.split('/')[1]; 

        const formData = new FormData(event.target);
        const formObject = Object.fromEntries(formData);
        const nextFieldsets = document.querySelectorAll(".next_fieldsets");

        // Get selected card IDs and add them to formObject
        const selectedCardIds = formData.getAll("cardId[]");
        formObject.cardIds = selectedCardIds;

        // Get IDs from duplicates and add them to formObject
        const selectedDuplicates = formData.getAll('duplicateId[]'); 
        formObject.duplicateIds = selectedDuplicates;

        try {
            const response = await fetch(`/api/v1/${explorerId}/declare`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject)
            });
            const result = await response.json();

            // Reset form
            for (const nextFieldset of nextFieldsets) {
                nextFieldset.classList.add("d-none");
            }
            declareFormModule.currentFieldsetIndex = 0;
            document.getElementById("declareForm").reset();
            window.scrollTo(0, 0);

        } catch (error) {
            console.error('Error:', error);
        }

    }, 

}
