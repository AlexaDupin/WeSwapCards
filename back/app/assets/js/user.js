const userModule = {    
    page: window.location.pathname,

    fetchUserData: async function(userUID) {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        console.log("FETCH USER DATA", userUID);
        
        if (!token) {
            console.error('No token found, please log in.');
            window.location.replace('/'); // Redirect to login if no token
            return;
        }
    
        try {
            const response = await fetch(`/api/v1/user/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userUID})
            });
    
            if (response.ok) {
                const userData = await response.json();
                console.log("FETCH USER DATA userData", userData);
                return userData; 
                // return token;
                // if (userModule.page === '/menu') {
                //     app.initMenu();
                // } 

            } else {
                console.error('Failed to fetch user data:', response.status);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
}