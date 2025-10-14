// Main application entry point

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    
    try {
        // Initialize the UI handler
        window.uiHandler = new UIHandler();
        console.log('UI Handler initialized');
        
        // Show welcome message
        setTimeout(() => {
            if (window.uiHandler) {
                window.uiHandler.showMessage('Welcome to Dental Care Card Game! Click "Start Game" to begin.');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Error initializing game. Please check console for details.');
    }
});
