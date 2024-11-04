const loginModule = {
    handleLoginForm: async function(event) {
        event.preventDefault();
        let userUIID = '';

        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        try {
            const response = await fetch(`api/v1/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})  
            });

            const data = await response.json();
            const token = data.session.access_token;
            console.log("LOGIN JS DATA", data);
            if (data.session == null){
                console.error('Login failed');
                document.getElementById('loginForm').reset();
                document.querySelector(".login-message").classList.remove("d-none");
            } 
            
            if (!token) {
                window.location.href = "/";
            } else if (token) {
                localStorage.setItem('token', token); // Save the token in local storage

                userUIID = data.user.id;
                console.log(userUIID);

                // Pass userUIID to fetch matching explorerId in database
                const response = await userModule.fetchUserData(userUIID);
                console.log("RESPONSE", response);
                const explorerId = response[0].id;
                console.log("explorerId", explorerId);

                // menuModule.initializeMenu();
                // menuModule.fetchMenu(token);

                // try {
                //     const response = await fetch(`api/v1/menu`, {
                //         method: "POST",
                //         headers: {
                //             'Content-Type': 'application/json',
                //             'authorization': `Bearer ${token}`,
                //         },
                //         body: JSON.stringify({explorerId})  
                //     });
                // } catch (error) {
                //     console.error('Error:', error);
                // }


                window.location.href = `/${explorerId}/menu`;


            }  
                                
        } catch (error) {
            console.error('Error:', error);
        }
    },
    handleSignOut: async function() {
        localStorage.clear();
        await fetch(`api/v1/signout`);
    }
};
