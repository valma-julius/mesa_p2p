// Event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    username = document.getElementById("register-username");
    password = document.getElementById("register-password");
    repeatPassword = document.getElementById("register-repeat-password");
    let registerButton = document.getElementById("register-button");

    username.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            handleRegister();
        }

        if (username.value !== null && username.value.length > 0) {
            registerButton.removeAttribute("disabled");
        } else {
            registerButton.setAttribute("disabled", "disabled");
        }
    });

    password.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            handleRegister();
        }

        if (password.value !== null && password.value.length > 0) {
            registerButton.removeAttribute("disabled");
        } else {
            registerButton.setAttribute("disabled", "disabled");
        }
    });

    repeatPassword.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            handleRegister();
        }

        if (repeatPassword.value !== null && repeatPassword.value.length > 0) {
            registerButton.removeAttribute("disabled");
        } else {
            registerButton.setAttribute("disabled", "disabled");
        }
    });

    registerButton.addEventListener("click", () => {
        handleRegister();
    });
});

function getParameters() {
    username = document.getElementById("register-username").value;
    password = document.getElementById("register-password").value;
    repeatPassword = document.getElementById("register-repeat-password").value;

    return {
        username: username,
        password: password,
        repeatPassword: repeatPassword
    }
}

function handleRegister() {
    params = getParameters();

    const data = {
        user: {
          username: params.username,
          password: params.password,
          password_confirmation: params.repeatPassword
        }
      };

    fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (!response.ok) {
            handleRegisterError(response)
            return null
        }
        return response
      })
      .then(response => {
        if (response === null) {
            return
        }
        handleRegisterSuccess(response)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Clean the fields
    cleanFields();
}

function cleanFields() {
    username = document.getElementById("register-username").value = "";
    password = document.getElementById("register-password").value = "";
    repeatPassword = document.getElementById("register-repeat-password").value = "";
}

function handleRegisterSuccess(data) {
    const token = data.headers.get('Authorization');
    localStorage.setItem('mesa_token', token);
    console.log("THIS IS GOOD?")
    redirectToHome();
}

function handleRegisterError(response) {
    switch (response.status) {
        case 422:
            showErrorBanner("Username already taken");
            break;
        default:
            console.log("Unknown error");
    }
}
