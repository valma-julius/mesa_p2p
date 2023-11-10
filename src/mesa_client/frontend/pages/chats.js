if (localStorage.getItem('mesa_user') === null) {
    redirectToHome();
}


document.addEventListener('DOMContentLoaded', (event) => {
    homeButton = document.getElementById("home-button");

    homeButton.addEventListener("click", () => {
        redirectToHome();
    });

    fetchConversations()
});

function drawChats(chats) {
    chatsContainer = document.getElementById("chats-container");

    if (chats.length === 0) {

        chatsContainer.innerHTML += createChat({
            id: 1,
            conversation_name: "No chats yet",
            created_at: "",
        });
    
        return;
    }

    chats.forEach(chat => {
        chatsContainer.innerHTML += createChat(chat);
    });
}

function createChat(chat) {
    return `
        <div class="chat" id="chat-${chat.id}" onclick="openChat('${chat.id}')">
            <p>${chat.conversation_name}</p>
            <p>${chat.created_at !== "" ? chat.created_at.split("T")[0] : ""}</p>
        </div>
    `
}

function openChat(chatId) {
    localStorage.setItem('mesa_chat', chatId);
    window.location.href = `/pages/p2p_chat.html`;
}

function fetchConversations() {
    fetch(`${BASE_URL}/conversations`, {
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
        console.log(response)
        drawChats(response.conversations)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
