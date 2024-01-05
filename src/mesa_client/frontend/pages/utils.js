function showErrorBanner(message) {
    const errorBanner = document.createElement('div');
    errorBanner.textContent = message;
    errorBanner.style.position = 'fixed';
    errorBanner.style.top = '0';
    errorBanner.style.left = '50%';
    errorBanner.style.transform = 'translateX(-50%)';
    errorBanner.style.backgroundColor = '#FF5959';
    errorBanner.style.color = 'white';
    errorBanner.style.padding = '10px';
    errorBanner.style.zIndex = '1000';
    errorBanner.style.fontSize = '1rem';
    errorBanner.style.maxWidth = '50%';
    errorBanner.style.textAlign = 'center';
  
    document.body.appendChild(errorBanner);

    setTimeout(() => {
      document.body.removeChild(errorBanner);
    }, 3000);
}

function showNewMessageBanner(sender) {
  const messageBanner = document.createElement('div');
  messageBanner.textContent = 'You have a new message from: ' + sender;
  messageBanner.style.position = 'fixed';
  messageBanner.style.top = '0';
  messageBanner.style.left = '50%';
  messageBanner.style.transform = 'translateX(-50%)';
  messageBanner.style.backgroundColor = '#66ff61';
  messageBanner.style.color = 'black';
  messageBanner.style.padding = '10px';
  messageBanner.style.zIndex = '1000';
  messageBanner.style.fontSize = '1rem';
  messageBanner.style.maxWidth = '50%';
  messageBanner.style.textAlign = 'center';

  document.body.appendChild(messageBanner);

  setTimeout(() => {
    document.body.removeChild(messageBanner);
  }, 3000);
}

function showRefreshBanner() {
      // Create the error banner div
      const errorBanner = document.createElement('div');
      errorBanner.textContent = "Please, refresh the page.";
      errorBanner.style.position = 'fixed';
      errorBanner.style.top = '0';
      errorBanner.style.left = '50%';
      errorBanner.style.transform = 'translateX(-50%)';
      errorBanner.style.backgroundColor = '#FF5959';
      errorBanner.style.color = 'white';
      errorBanner.style.padding = '10px';
      errorBanner.style.zIndex = '1000';
      errorBanner.style.fontSize = '1rem';
      errorBanner.style.maxWidth = '50%';
      errorBanner.style.textAlign = 'center';
    
      document.body.appendChild(errorBanner);

      window.location.reload();
}

  
function redirectToHome() {
    window.location.href = "/";
}

// Constants
BASE_URL = "https://mesa-vu.com/api";


// Logout function
function logoutUser() {    
    fetch(`${BASE_URL}/users/sign_out`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('mesa_token'),
        },
      })
      .then(response => {
        if (!response.ok) {
            showErrorBanner("Error logging out");
            return null
        }

        localStorage.removeItem('mesa_token');
        localStorage.removeItem('mesa_user');
        redirectToHome();
      })
      .catch((error) => {
        throw error
      });
}


function sendAvailableICE() {
  user_id = JSON.parse(localStorage.getItem('mesa_user')).id;

  body = {
    ice: user_id + "_ice_candidate"
  }

  fetch(`${BASE_URL}/create_ice_candidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('mesa_token'),
    },
    body: JSON.stringify(body)
  })
  .then(response => {
    if (!response.ok) {
        showErrorBanner("Error sending ICE Candidate");
        return null
    }
  })
  .catch((error) => {
    throw error
  });
}

if (localStorage.getItem('mesa_user') !== null && localStorage.getItem('mesa_user') !== undefined) {
  setInterval(sendAvailableICE, 1000*10);
}


function getAvailableICE(conversation_id) {
  // Return the fetch promise chain
  return fetch(`${BASE_URL}/get_available_ice_candidates?conversation_id=${conversation_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('mesa_token'),
    }
  })
  .then(response => {
    if (!response.ok) {
      showErrorBanner("Error sending ICE Candidate");
      // Reject the promise if the response is not ok
      return Promise.reject(new Error("Response is not ok"));
    }
    return response.json(); // Parse and return the JSON response
  })
  .catch((error) => {
    showErrorBanner(`Error: ${error.message}`);
    // Re-throw the error to be caught by the caller
    throw error;
  });
}
