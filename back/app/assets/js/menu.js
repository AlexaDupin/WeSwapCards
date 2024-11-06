const menuModule = {    
    // NOT USED
    fetchMenu: function(token) {
        console.log("FETCH MENU");
        return fetch(`/api/v1/menu`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = response.json();
            console.log("FETCH MENU DATA", data);
    
            window.location.replace('/menu');
            // return response.json();
        });


    },
    initializeMenu: async function() {
        console.log("initializeMENU");
        window.location.replace('/menu');
        // await menuModule.fetchMenu(userData);
    }

    //     // const token = localStorage.getItem('token');
        
    //     //     if (!token) {
    //     //         window.location.replace('/'); // Redirect to login if no token
    //     //         document.querySelector(".login-message").classList.remove("d-none");
    //     //         return;
    //     //     }
        
    //     //     const response = await fetch('/api/v1/menu', {
    //     //         method: 'GET',
    //     //         headers: {
    //     //             'Authorization': `Bearer ${token}`
    //     //         }
    //     //     });
        
    //     //     if (response.ok) {
    //     //         const menuData = await response.json();
    //     //         // Render the menu data as needed
    //     //         console.log('APP MENU DATA', menuData);
    //     //     } else {
    //     //         window.location.href = '/'; // Redirect to login if not authorized
    //     //     }
}
