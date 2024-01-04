BASE_URL = "http://127.0.0.1:7777/api";

let token = localStorage.getItem('mesa_token')
let user = null

userLoggedIn = false;

if (token !== null || token !== "") {
    fetchUser()
}

function showLoggedInMenu() {
    document.getElementById("logged-in-menu").style.display = "";
    document.getElementById("logged-out-menu").style.display = "none";
}

function hideLoggedInMenu() {
    document.getElementById("logged-in-menu").style.display = "none";
    document.getElementById("logged-out-menu").style.display = "";
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
        return response.json()
    })
    .then(response => {
        if (response.status === 422) {
            handleFetchUserFail();
            return
        }

        handleFetchUserSuccess(response)
    })
    .catch((error) => {
        console.log("FAIL")
        handleFetchUserFail();
        console.error('Error:', error);
    });
}

function handleFetchUserFail() {
    localStorage.removeItem('mesa_token');
    localStorage.removeItem('mesa_user');
    hideLoggedInMenu();
}

function handleFetchUserSuccess(data) {
    userLoggedIn = true;
    user = data.user;
    localStorage.setItem('mesa_user', JSON.stringify(user));

    showLoggedInMenu();
} 

document.addEventListener('DOMContentLoaded', (event) => {
    logoutButton = document.getElementById("logout-button");

    logoutButton.addEventListener("click", () => {
        logoutUser();
    });
});
