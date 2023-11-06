function showErrorBanner(message) {
    // Create the error banner div
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
  
    // Add the banner to the body
    document.body.appendChild(errorBanner);
  
    // Optional: Remove the banner after 3 seconds
    setTimeout(() => {
      document.body.removeChild(errorBanner);
    }, 3000);
}
  
function redirectToHome() {
    window.location.href = "/";
}

// Constants
BASE_URL = "http://localhost:7777";


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

