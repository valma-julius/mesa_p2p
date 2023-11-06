if (localStorage.getItem('mesa_user') === null) {
    redirectToHome();
}

document.addEventListener('DOMContentLoaded', (event) => {
    logoutButton = document.getElementById("logout-button");
    homeButton = document.getElementById("home-button");

    logoutButton.addEventListener("click", () => {
        logoutUser();
    });

    homeButton.addEventListener("click", () => {
        redirectToHome();
    });

    usernameField = document.getElementById("username-field");
    dateCreatedField = document.getElementById("date-field");

    user = JSON.parse(localStorage.getItem('mesa_user'));

    usernameField.textContent = user.username;
    dateCreatedField.textContent = user.created_at.split("T")[0];

})
