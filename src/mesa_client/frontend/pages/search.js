if (localStorage.getItem('mesa_user') === null) {
    redirectToHome();
}


document.addEventListener('DOMContentLoaded', (event) => {
    homeButton = document.getElementById("home-button");

    homeButton.addEventListener("click", () => {
        redirectToHome();
    });

    searchButton = document.getElementById("search-button");

    searchButton.addEventListener("click", () => {
        username = document.getElementById("search-input").value;
        searchUsers(username);
    });

    searchInput = document.getElementById("search-input");

    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            username = document.getElementById("search-input").value;
            searchUsers(username);
        }

        if (document.getElementById("search-input").value === "") {
            disableSearchButton();
        } else {
            enableSearchButton();
        }

        removeResults();
    });
});

function enableSearchButton() {
    searchButton = document.getElementById("search-button");
    searchButton.removeAttribute("disabled");
}

function disableSearchButton() {
    searchButton = document.getElementById("search-button");
    searchButton.setAttribute("disabled", "true");
}

function drawResults(results) {
    resultsContainer = document.getElementById("search-container");

    if (results.length === 0) {

        resultsContainer.innerHTML += createResults({
            id: 1,
            username: "No user found  ...",
        });
    
        return;
    }

    results.forEach(result => {
        resultsContainer.innerHTML += createResults(result);
    });
}

function removeResults() {
    resultsContainer = document.getElementById("search-container");
    resultsContainer.innerHTML = "";
}

function createResults(result) {
    return `
        <div class="result" id="result-${result.id}" onclick="drawModal('${result.id}', '${result.username}')">
            <p>${result.username}</p>
        </div>
    `
}

function drawModal(user_id, username) {
    document.body.innerHTML += `
    <div class="modal" id="chat-create-modal">
        <!-- Modal content -->
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <p>Start a p2p chat with ${username}</p>
            <br/>
            <button class="p2p-button" id="p2p-button" onclick="createConversation('${user_id}')">P2P Chat</button>
        </div>
    </div>
    `
}

function closeModal() {
    modal = document.getElementById("chat-create-modal");
    modal.remove();
}

function searchUsers(username) {
    fetch(`${BASE_URL}/users/search?username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('mesa_token'),
        },
    })
    .then(response => {
        if (!response.ok) {
            return null
        }
        return response.json()
    })
    .then(response => {
        drawResults(response.users)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function createConversation(user_id) {
    mesa_user = JSON.parse(localStorage.getItem('mesa_user'));

    body = {
        conversation: {
            name: "P2P CHAT",
            users: [mesa_user.id, user_id],
            identifier: "p2p"
        }
    }

    fetch(`${BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('mesa_token'),
        },
        body: JSON.stringify(body),
    })
    .then(response => {
        if (!response.ok) {
            return null
        }
        return response.json()
    })
    .then(response => {
        redirectToChats();
    })
    .catch((error) => {
        console.error('Error:', error);
        closeModal();
        showErrorBanner("Error creating conversation");
    });
}

function redirectToChats() {
    window.location.href = "chats.html";
}


























chats = [
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'other user',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'real_name',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'other user',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'real_name',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'other user',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'real_name',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'other user',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'real_name',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'other user',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'real_name',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'other user',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'real_name',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'real_name',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'other user',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'real_name',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'other user',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    },
    {
        id: 1,
        name: 'some_name',
        conversation_name: 'real_name',
        identifier: 'what?',
        created_at: Date.now(),
        user_id: 1,
    }
]
