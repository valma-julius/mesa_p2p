// Event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    username = document.getElementById("login-username");
    password = document.getElementById("login-password");
    let loginButton = document.getElementById("login-button");

    username.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            handleLogin();
        }

        if (username.value !== null && username.value.length > 0) {
            loginButton.removeAttribute("disabled");
        } else {
            loginButton.setAttribute("disabled", "disabled");
        }
    });

    password.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            handleLogin();
        }

        if (password.value !== null && password.value.length > 0) {
            loginButton.removeAttribute("disabled");
        } else {
            loginButton.setAttribute("disabled", "disabled");
        }
    });

    loginButton.addEventListener("click", () => {
        handleLogin();
    });

    document.getElementById("logout-button").addEventListener("click", () => {
        localStorage.removeItem('mesa_token');
        sendLogout();
    });
});

sendLogout = () => {    
    fetch(`${BASE_URL}/users/sign_out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('mesa_token'),
        },
      })
      .then(response => {
        console.log(response)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

}

function getParameters() {
    username = document.getElementById("login-username").value;
    password = document.getElementById("login-password").value;

    return {
        username: username,
        password: password,
    }
}

function handleLogin() {
    params = getParameters();

    const data = {
        user: {
          username: params.username,
          password: params.password,
        }
      };

    fetch(`${BASE_URL}/users/sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (!response.ok) {
            handleLoginError(response)
            return null
        }
        return response
      })
      .then(response => {
        if (response === null) {
            return
        }
        handleLoginSuccess(response)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Clean the fields
    cleanFields();
}

function cleanFields() {
    username = document.getElementById("login-username").value = "";
    password = document.getElementById("login-password").value = "";
}

function handleLoginSuccess(data) {
    const token = data.headers.get('Authorization');
    localStorage.setItem('mesa_token', token);
    generateNewE2EKeyPair().then((result) => {
        redirectToHome();
    }).catch((error) => {
        console.error("Failed to generate key pair:", error);
        showErrorBanner("Failed to authenticate properly, please try again.")
    });
}

function handleLoginError(response) {
    switch (response.status) {
        case 401:
            showErrorBanner("Unauthorized. Either the username or password is incorrect.");
            break;
        default:
            console.log("Unknown error");
    }
}
