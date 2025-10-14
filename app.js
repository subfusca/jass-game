// Main application entry point

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the UI handler
    window.uiHandler = new UIHandler();
    
    // Show welcome message
    setTimeout(() => {
        if (window.uiHandler) {
            window.uiHandler.showMessage('Welcome to Dental Care Card Game! Click "Start Game" to begin.');
        }
    }, 1000);
});
