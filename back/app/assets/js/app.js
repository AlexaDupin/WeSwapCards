let app = {
    initLogin: function () {
        utils.loginEventListeners();
    },
    initMenu: function () {
        utils.menuEventListeners();
    },
    initDeclare: function () {
        utils.declareEventListeners();
    },
    initOpportunities: function () {
        utils.opportunitiesEventListeners();
    },
    initExplorerCards: function () {
        utils.explorerCardsEventListeners();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const page = window.location.pathname;
    const pageSplit = page.split('/')[2];
    const scrollBtn = document.getElementById('scrollBtn');
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    // if (pageSplit !== '/') {
    if (page !== '/') {
        scrollBtn.addEventListener('click', utils.scrollToTop);
        console.log("APP TOKEN", token, page, pageSplit);
        
        // Restrict access to pages
        // if (!token) {
        //     console.error('No token found, please log in.');
        //     window.location.replace('/'); // Redirect to login if no token
        //     return;
        // }

        if (pageSplit === 'menu') {
            app.initMenu();
            const backBtn = document.querySelector(".back-button");
            backBtn.classList.add("d-none");
        } 

        if (pageSplit === 'declare') {
            app.initDeclare();
        } 

        if (pageSplit === 'opportunities') {
            app.initOpportunities();
        } 

        if (pageSplit === 'cards') {
            app.initExplorerCards();
        }
        // window.addEventListener('DOMContentLoaded', userModule.fetchUserData);
        // window.addEventListener('DOMContentLoaded', userModule.fetchUserData(explorerUIID));
        // window.addEventListener('DOMContentLoaded', menuModule.initializeMenu);
    }
    window.scrollTo(0, 0);

    // Display go to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollBtn.classList.remove('d-none');
        } else {
            scrollBtn.classList.add('d-none');
        }
    });

    // Initialization by page
    if (page === '/') {
        app.initLogin();
    }
    // if (pageSplit === 'menu') {
    // if (page === 'menu') {
    //     app.initMenu();
    // } 
    // if (page == '/declare') {
    //     app.initDeclare();
    // } 
    // if (page === '/opportunities') {
    //     app.initOpportunities();
    // } 
    // if (page === '/cards') {
    //     app.initExplorerCards();
    // }
    if (page === '/' || page === '/menu') {
        const backBtn = document.querySelector(".back-button");
        backBtn.classList.add("d-none");
    }
});

