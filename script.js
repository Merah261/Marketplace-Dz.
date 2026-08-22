/* =========================================
   MARKETPLACE DZ
   MAIN JAVASCRIPT
========================================= */

let selectedAccountType = "";


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageId) {

  const pages =
    document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active");
  });

  const selectedPage =
    document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  window.scrollTo(0, 0);
}


/* =========================================
   ACCOUNT TYPE
========================================= */

function selectAccountType(type) {

  selectedAccountType = type;

  const title =
    document.getElementById("signupTitle");

  if (title) {

    if (type === "seller") {

      title.textContent =
        "Create Seller Account";

    } else {

      title.textContent =
        "Create Buyer Account";
    }

  }

  showPage("signupPage");
}


/* =========================================
   SIGN UP
========================================= */

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
          .value.trim();


      const username =
        document
          .getElementById("signupUsername")
          .value.trim();


      const email =
        document
          .getElementById("signupEmail")
          .value.trim();


      const password =
        document
          .getElementById("signupPassword")
          .value;


      const confirmPassword =
        document
          .getElementById(
            "signupConfirmPassword"
          )
          .value;


      const message =
        document.getElementById(
          "signupMessage"
        );


      if (!selectedAccountType) {

        message.textContent =
          "Please select an account type.";

        message.style.color = "red";

        return;
      }


      if (password !== confirmPassword) {

        message.textContent =
          "Passwords do not match.";

        message.style.color = "red";

        return;
      }


      if (password.length < 6) {

        message.textContent =
          "Password must contain at least 6 characters.";

        message.style.color = "red";

        return;
      }


      const users =
        JSON.parse(
          localStorage.getItem(
            "marketplaceUsers"
          ) || "[]"
        );


      const usernameExists =
        users.some(
          user =>
            user.username.toLowerCase() ===
            username.toLowerCase()
        );


      if (usernameExists) {

        message.textContent =
          "Username already exists.";

        message.style.color = "red";

        return;
      }


      const emailExists =
        users.some(
          user =>
            user.email.toLowerCase() ===
            email.toLowerCase()
        );


      if (emailExists) {

        message.textContent =
          "Email already exists.";

        message.style.color = "red";

        return;
      }


      const newUser = {

        id: Date.now(),

        name: name,

        username: username,

        email: email,

        password: password,

        type: selectedAccountType

      };


      users.push(newUser);


      localStorage.setItem(
        "marketplaceUsers",
        JSON.stringify(users)
      );


      message.textContent =
        "Account created successfully.";

      message.style.color = "green";


      setTimeout(() => {

        signupForm.reset();

        message.textContent = "";

        showPage("loginPage");

      }, 1000);

    }
  );

}


/* =========================================
   LOGIN
========================================= */

const loginForm =
  document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const identifier =
        document
          .getElementById(
            "loginIdentifier"
          )
          .value.trim();


      const password =
        document
          .getElementById(
            "loginPassword"
          )
          .value;


      const message =
        document.getElementById(
          "loginMessage"
        );


      const users =
        JSON.parse(
          localStorage.getItem(
            "marketplaceUsers"
          ) || "[]"
        );


      const user =
        users.find(user => {

          const emailMatch =
            user.email.toLowerCase() ===
            identifier.toLowerCase();


          const usernameMatch =
            user.username.toLowerCase() ===
            identifier.toLowerCase();


          return (
            (emailMatch || usernameMatch) &&
            user.password === password
          );

        });


      if (!user) {

        message.textContent =
          "Invalid username/email or password.";

        message.style.color = "red";

        return;
      }


      localStorage.setItem(
        "marketplaceCurrentUser",
        JSON.stringify(user)
      );


      message.textContent =
        "Login successful.";

      message.style.color = "green";


      setTimeout(() => {

        if (user.type === "seller") {

          const sellerWelcome =
            document.getElementById(
              "sellerWelcome"
            );


          if (sellerWelcome) {

            sellerWelcome.textContent =
              "Welcome, " + user.name;

          }


          showPage("sellerPage");

        } else {

          const buyerWelcome =
            document.getElementById(
              "buyerWelcome"
            );


          if (buyerWelcome) {

            buyerWelcome.textContent =
              "Welcome, " + user.name;

          }


          showPage("buyerPage");

        }

      }, 300);

    }
  );

}


/* =========================================
   BUYER NAVIGATION
========================================= */

function buyerTab(tab) {

  const sections = {

    home:
      document.getElementById(
        "buyerHome"
      ),

    favorites:
      document.getElementById(
        "buyerFavorites"
      ),

    categories:
      document.getElementById(
        "buyerCategories"
      ),

    cart:
      document.getElementById(
        "buyerCart"
      ),

    more:
      document.getElementById(
        "buyerMore"
      )

  };


  Object.values(sections).forEach(
    section => {

      if (section) {

        section.style.display =
          "none";

      }

    }
  );


  if (sections[tab]) {

    sections[tab].style.display =
      "block";

  }


  const buttons =
    document.querySelectorAll(
      ".bottom-nav .nav-item"
    );


  buttons.forEach(button => {

    button.classList.remove(
      "active"
    );

  });


  const tabOrder = [
    "home",
    "favorites",
    "categories",
    "cart",
    "more"
  ];


  const index =
    tabOrder.indexOf(tab);


  if (index !== -1 && buttons[index]) {

    buttons[index].classList.add(
      "active"
    );

  }


  window.scrollTo(0, 0);
}


/* =========================================
   DARK MODE
========================================= */

function toggleDarkMode() {

  document.body.classList.toggle(
    "dark"
  );


  const enabled =
    document.body.classList.contains(
      "dark"
    );


  localStorage.setItem(
    "marketplaceDarkMode",
    enabled ? "true" : "false"
  );

}


/* =========================================
   LOAD DARK MODE
========================================= */

function loadDarkMode() {

  const darkMode =
    localStorage.getItem(
      "marketplaceDarkMode"
    );


  if (darkMode === "true") {

    document.body.classList.add(
      "dark"
    );

  }

}


/* =========================================
   LOGOUT
========================================= */

function logout() {

  localStorage.removeItem(
    "marketplaceCurrentUser"
  );


  const loginForm =
    document.getElementById(
      "loginForm"
    );


  if (loginForm) {

    loginForm.reset();

  }


  showPage("homePage");
}


/* =========================================
   AUTO LOGIN
========================================= */

window.addEventListener(
  "load",
  function() {

    loadDarkMode();


    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "marketplaceCurrentUser"
        )
      );


    if (!currentUser) {

      showPage("homePage");

      return;
    }


    if (currentUser.type === "seller") {

      const welcome =
        document.getElementById(
          "sellerWelcome"
        );


      if (welcome) {

        welcome.textContent =
          "Welcome back, " +
          currentUser.name;

      }


      showPage("sellerPage");


    } else {


      const welcome =
        document.getElementById(
          "buyerWelcome"
        );


      if (welcome) {

        welcome.textContent =
          "Welcome back, " +
          currentUser.name;

      }


      showPage("buyerPage");

      buyerTab("home");

    }

  }
);
