/* =========================================================
   MARKETPLACE DZ
   SCRIPT.JS
   PHASE 1 — ACCOUNTS & SESSION
========================================================= */


/* =========================================================
   1. APPLICATION STATE
========================================================= */

let selectedAccountType = "";

const STORAGE_USERS = "marketplaceDz_users";
const STORAGE_SESSION = "marketplaceDz_session";


/* =========================================================
   2. PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   3. STORAGE FUNCTIONS
========================================================= */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_USERS)
        ) || [];

    } catch (error) {

        return [];
    }
}


function saveUsers(users) {

    localStorage.setItem(
        STORAGE_USERS,
        JSON.stringify(users)
    );
}


function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_SESSION)
        );

    } catch (error) {

        return null;
    }
}


function saveCurrentUser(user) {

    localStorage.setItem(
        STORAGE_SESSION,
        JSON.stringify(user)
    );
}


function clearCurrentUser() {

    localStorage.removeItem(STORAGE_SESSION);
}


/* =========================================================
   4. ACCOUNT TYPE
========================================================= */

function selectAccountType(type) {

    if (type !== "seller" && type !== "buyer") {
        return;
    }

    selectedAccountType = type;

    const signupTitle =
        document.getElementById("signupTitle");

    if (signupTitle) {

        if (type === "seller") {

            signupTitle.textContent =
                "Create Seller Account";

        } else {

            signupTitle.textContent =
                "Create Buyer Account";
        }
    }

    showPage("signupPage");
}


/* =========================================================
   5. SIGN UP
========================================================= */

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("signupName")
                    .value
                    .trim();


            const username =
                document
                    .getElementById("signupUsername")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("signupPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("signupConfirmPassword")
                    .value;


            const message =
                document.getElementById(
                    "signupMessage"
                );


            /* Account type */

            if (!selectedAccountType) {

                message.textContent =
                    "Please select an account type.";

                message.style.color = "#d62828";

                return;
            }


            /* Password confirmation */

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color = "#d62828";

                return;
            }


            /* Password length */

            if (password.length < 6) {

                message.textContent =
                    "Password must contain at least 6 characters.";

                message.style.color = "#d62828";

                return;
            }


            /* Get existing users */

            const users = getUsers();


            /* Username check */

            const usernameExists =
                users.some(user =>
                    user.username.toLowerCase() ===
                    username.toLowerCase()
                );


            if (usernameExists) {

                message.textContent =
                    "Username already exists.";

                message.style.color = "#d62828";

                return;
            }


            /* Email check */

            const emailExists =
                users.some(user =>
                    user.email.toLowerCase() ===
                    email.toLowerCase()
                );


            if (emailExists) {

                message.textContent =
                    "Email already exists.";

                message.style.color = "#d62828";

                return;
            }


            /* Create account */

            const newUser = {

                id: Date.now(),

                name: name,

                username: username,

                email: email,

                password: password,

                type: selectedAccountType

            };


            users.push(newUser);

            saveUsers(users);


            /* Success */

            message.textContent =
                "Account created successfully.";

            message.style.color = "#18864b";


            setTimeout(function() {

                signupForm.reset();

                message.textContent = "";

                selectedAccountType = "";

                showPage("loginPage");

            }, 1000);

        }
    );
}


/* =========================================================
   6. LOGIN
========================================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const identifier =
                document
                    .getElementById("loginIdentifier")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const users = getUsers();


            /* Find user */

            const user =
                users.find(account => {

                    const emailMatch =
                        account.email.toLowerCase() ===
                        identifier.toLowerCase();


                    const usernameMatch =
                        account.username.toLowerCase() ===
                        identifier.toLowerCase();


                    return (
                        (emailMatch || usernameMatch) &&
                        account.password === password
                    );

                });


            /* Login failed */

            if (!user) {

                message.textContent =
                    "Invalid username/email or password.";

                message.style.color = "#d62828";

                return;
            }


            /* =================================================
               IMPORTANT
               SAVE USER SESSION
            ================================================= */

            saveCurrentUser(user);


            message.textContent =
                "Login successful.";

            message.style.color = "#18864b";


            setTimeout(function() {

                openUserDashboard(user);

            }, 500);

        }
    );
}


/* =========================================================
   7. OPEN USER DASHBOARD
========================================================= */

function openUserDashboard(user) {

    if (!user) {
        showPage("homePage");
        return;
    }


    if (user.type === "seller") {

        const welcome =
            document.getElementById(
                "sellerWelcome"
            );


        if (welcome) {

            welcome.textContent =
                "Welcome, " + user.name;
        }


        showPage("sellerPage");

    }


    else if (user.type === "buyer") {

        const welcome =
            document.getElementById(
                "buyerWelcome"
            );


        if (welcome) {

            welcome.textContent =
                "Welcome, " + user.name;
        }


        showPage("buyerPage");

    }

}


/* =========================================================
   8. LOGOUT
========================================================= */

function logout() {

    /*
       Remove ONLY the current login session.
       The account itself remains saved.
    */

    clearCurrentUser();


    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.reset();
    }


    showPage("homePage");
}


/* =========================================================
   9. AUTOMATIC LOGIN
========================================================= */

window.addEventListener(
    "load",
    function() {

        const currentUser =
            getCurrentUser();


        /*
           No saved session:
           show normal home page.
        */

        if (!currentUser) {

            showPage("homePage");

            return;
        }


        /*
           Saved session found:
           open the correct account directly.
        */

        openUserDashboard(currentUser);

    }
);


/* =========================================================
   10. PROTECTION AGAINST INVALID SESSION
========================================================= */

function validateSession() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return false;
    }


    const users =
        getUsers();


    const accountStillExists =
        users.some(user =>
            user.id === currentUser.id
        );


    if (!accountStillExists) {

        clearCurrentUser();

        return false;
    }


    return true;
}


/* =========================================================
   END OF PHASE 1
========================================================= */
