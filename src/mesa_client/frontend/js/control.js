BASE_URL = "http://localhost:7777";

let token = localStorage.getItem('mesa_token')
let user = null

userLoggedIn = false;

if (token !== null) {
    fetchUser()
}

function fetchUser() {
    fetch(`${BASE_URL}/member-data`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
    })
    .then(response => {
        if (!response.ok) {
            return null
        }
        return response.json()
    })
    .then(response => {
        if (response === null) {
            return
        }
        handleFetchUserSuccess(response)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function handleFetchUserSuccess(data) {
    userLoggedIn = true;
    user = data.user;
    localStorage.setItem('mesa_user', JSON.stringify(user));

    showLoggedInMenu();
    hideLoggedOutMenu();
} 

function showLoggedInMenu() {
    document.getElementById("logged-in-menu").style.display = "";
}

function hideLoggedOutMenu() {
    document.getElementById("logged-out-menu").style.display = "none";
}

document.addEventListener('DOMContentLoaded', (event) => {
    logoutButton = document.getElementById("logout-button");

    logoutButton.addEventListener("click", () => {
        logoutUser();
    });
});
