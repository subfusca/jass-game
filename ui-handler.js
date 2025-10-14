// UI Handler for Dental Care Card Game

class UIHandler {
    constructor() {
        this.gameState = null;
        this.selectedPatientCard = null;
        this.selectedProcedureCard = null;
        this.selectedPharmacologyCards = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Game control buttons
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('end-turn-btn').addEventListener('click', () => {
            this.endTurn();
        });

        document.getElementById('draw-cards-btn').addEventListener('click', () => {
            this.drawCards();
        });

        // Modal buttons
        document.getElementById('game-rules-btn').addEventListener('click', () => {
            this.showRulesModal();
        });

        document.getElementById('close-rules-btn').addEventListener('click', () => {
            this.hideRulesModal();
        });

        document.getElementById('confirm-patient-btn').addEventListener('click', () => {
            this.confirmPatientSelection();
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });
    }

    startGame() {
        this.gameState = new GameState();
        this.gameState.startGame();
        this.updateGameDisplay();
        
        // Disable start button, enable other controls
        document.getElementById('start-game-btn').disabled = true;
        document.getElementById('draw-cards-btn').disabled = false;
    }

    endTurn() {
        if (this.gameState) {
            this.gameState.endTurn();
            this.updateGameDisplay();
        }
    }

    drawCards() {
        if (this.gameState && this.gameState.turnPhase === 'draw') {
            this.gameState.drawCards();
            this.updateGameDisplay();
        }
    }

    updateGameDisplay() {
        if (!this.gameState) return;

        // Update current player display
        const currentPlayerElement = document.getElementById('current-player');
        currentPlayerElement.textContent = `Player ${this.gameState.currentPlayer}'s Turn`;

        // Update button states
        const drawBtn = document.getElementById('draw-cards-btn');
        const endTurnBtn = document.getElementById('end-turn-btn');
        
        drawBtn.disabled = this.gameState.turnPhase !== 'draw';
        endTurnBtn.disabled = this.gameState.turnPhase === 'draw';

        // Update player areas
        this.updatePlayerArea(1);
        this.updatePlayerArea(2);

        // Show game messages
        if (this.gameState.gameMessage) {
            this.showGameMessage(this.gameState.gameMessage);
            this.gameState.gameMessage = '';
        }
    }

    updatePlayerArea(playerId) {
        const player = this.gameState.players[playerId];
        const isCurrentPlayer = playerId === this.gameState.currentPlayer;

        // Update patient card
        this.updatePatientCard(playerId, player.activePatient);

        // Update hands
        this.updateHand(playerId, 'procedures', player.procedures, 'procedure-card');
        this.updateHand(playerId, 'pharmacology', player.pharmacology, 'pharmacology-card');
        
        // Update modifiers
        const allModifiers = [
            ...player.easyModifiers.map(m => ({...m, modifierType: 'easy'})),
            ...player.challengingModifiers.map(m => ({...m, modifierType: 'challenging'}))
        ];
        this.updateHand(playerId, 'modifiers', allModifiers, 'modifier-card');

        // Highlight current player
        const playerArea = document.getElementById(`player${playerId}-area`);
        if (isCurrentPlayer) {
            playerArea.style.border = '3px solid #74b9ff';
            playerArea.style.boxShadow = '0 0 20px rgba(116, 185, 255, 0.5)';
        } else {
            playerArea.style.border = '3px solid transparent';
            playerArea.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }
    }

    updatePatientCard(playerId, patient) {
        const patientElement = document.getElementById(`player${playerId}-patient`);
        
        if (patient) {
            patientElement.innerHTML = `
                <div class="patient-info">
                    <h4>${patient.name}</h4>
                    <p>${patient.condition}</p>
                    ${patient.vulnerability ? `<div class="vulnerability">⚠️ ${patient.vulnerability}</div>` : ''}
                    <div class="treatment-goal">
                        <strong>Treatment Goal:</strong>
                        ${patient.treatmentGoal.map(goal => 
                            `<div class="requirement">${goal.quantity}x ${goal.type}</div>`
                        ).join('')}
                    </div>
                </div>
            `;
        } else {
            patientElement.innerHTML = '<div class="card-placeholder">Select Patient</div>';
        }
    }

    updateHand(playerId, handType, cards, cardClass) {
        const handElement = document.getElementById(`player${playerId}-${handType}`);
        handElement.innerHTML = '';

        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${cardClass}`;
            
            if (card.modifierType) {
                cardElement.classList.add(card.modifierType === 'easy' ? 'easy-card' : 'challenging-card');
            }
            
            cardElement.textContent = card.name;
            cardElement.dataset.cardId = card.instanceId;
            
            // Add click handlers for current player
            if (playerId === this.gameState.currentPlayer) {
                cardElement.addEventListener('click', () => {
                    this.handleCardClick(card, handType, cardElement);
                });
            }
            
            handElement.appendChild(cardElement);
        });
    }

    handleCardClick(card, handType, cardElement) {
        if (handType === 'procedures') {
            this.selectProcedureCard(card, cardElement);
        } else if (handType === 'pharmacology') {
            this.selectPharmacologyCard(card, cardElement);
        } else if (handType === 'modifiers') {
            this.selectModifierCard(card, cardElement);
        }
    }

    selectProcedureCard(card, cardElement) {
        // Clear previous selections
        this.clearCardSelections();
        
        this.selectedProcedureCard = card;
        cardElement.style.border = '3px solid #fdcb6e';
        cardElement.style.transform = 'scale(1.05)';
        
        // Show required pharmacology cards
        this.highlightRequiredPharmacology(card.requirements);
    }

    selectPharmacologyCard(card, cardElement) {
        if (this.selectedProcedureCard) {
            // Toggle selection
            const index = this.selectedPharmacologyCards.findIndex(c => c.instanceId === card.instanceId);
            
            if (index === -1) {
                this.selectedPharmacologyCards.push(card);
                cardElement.style.border = '3px solid #00b894';
                cardElement.style.transform = 'scale(1.05)';
            } else {
                this.selectedPharmacologyCards.splice(index, 1);
                cardElement.style.border = '';
                cardElement.style.transform = '';
            }
            
            // Check if we can play the procedure
            this.checkCanPlayProcedure();
        }
    }

    selectModifierCard(card, cardElement) {
        // For now, just highlight the card
        cardElement.style.border = '3px solid #e84393';
        cardElement.style.transform = 'scale(1.05)';
        
        // TODO: Implement modifier targeting and playing
        this.showMessage(`Selected modifier: ${card.name}`);
    }

    highlightRequiredPharmacology(requirements) {
        const currentPlayer = this.gameState.currentPlayer;
        const handElement = document.getElementById(`player${currentPlayer}-pharmacology`);
        const cards = handElement.querySelectorAll('.card');
        
        cards.forEach(cardElement => {
            const cardId = cardElement.dataset.cardId;
            const card = this.gameState.players[currentPlayer].pharmacology.find(c => c.instanceId === cardId);
            
            if (card && requirements.some(req => req.type === card.type)) {
                cardElement.style.boxShadow = '0 0 15px rgba(0, 184, 148, 0.8)';
            }
        });
    }

    checkCanPlayProcedure() {
        if (!this.selectedProcedureCard) return;
        
        const canPlay = this.gameState.canPlayProcedure(
            this.selectedProcedureCard,
            this.selectedPharmacologyCards,
            this.gameState.players[this.gameState.currentPlayer]
        );
        
        if (canPlay) {
            this.playProcedure();
        }
    }

    playProcedure() {
        const success = this.gameState.playProcedure(
            this.selectedProcedureCard,
            this.selectedPharmacologyCards
        );
        
        if (success) {
            this.clearCardSelections();
            this.updateGameDisplay();
        }
    }

    clearCardSelections() {
        // Clear visual selections
        document.querySelectorAll('.card').forEach(card => {
            card.style.border = '';
            card.style.transform = '';
            card.style.boxShadow = '';
        });
        
        // Clear data
        this.selectedProcedureCard = null;
        this.selectedPharmacologyCards = [];
    }

    showPatientSelection(patientOptions) {
        const modal = document.getElementById('card-selection-modal');
        const optionsContainer = document.getElementById('patient-options');
        
        optionsContainer.innerHTML = '';
        
        patientOptions.forEach(patient => {
            const optionCard = document.createElement('div');
            optionCard.className = 'option-card';
            optionCard.innerHTML = `
                <h4>${patient.name}</h4>
                <p>${patient.condition}</p>
                ${patient.vulnerability ? `<div class="vulnerability">⚠️ ${patient.vulnerability}</div>` : ''}
                <div class="treatment-goal">
                    <strong>Treatment Goal:</strong>
                    ${patient.treatmentGoal.map(goal => 
                        `<div class="requirement">${goal.quantity}x ${goal.type}</div>`
                    ).join('')}
                </div>
            `;
            
            optionCard.addEventListener('click', () => {
                this.selectPatientOption(patient, optionCard);
            });
            
            optionsContainer.appendChild(optionCard);
        });
        
        modal.classList.remove('hidden');
    }

    selectPatientOption(patient, optionElement) {
        // Clear previous selection
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select this option
        optionElement.classList.add('selected');
        this.selectedPatientCard = patient;
        
        // Enable confirm button
        document.getElementById('confirm-patient-btn').disabled = false;
    }

    confirmPatientSelection() {
        if (this.selectedPatientCard) {
            this.gameState.selectPatient(this.selectedPatientCard);
            this.selectedPatientCard = null;
            this.hidePatientSelection();
            this.updateGameDisplay();
        }
    }

    hidePatientSelection() {
        document.getElementById('card-selection-modal').classList.add('hidden');
        document.getElementById('confirm-patient-btn').disabled = true;
    }

    showRulesModal() {
        document.getElementById('rules-modal').classList.remove('hidden');
    }

    hideRulesModal() {
        document.getElementById('rules-modal').classList.add('hidden');
    }

    hideAllModals() {
        this.hidePatientSelection();
        this.hideRulesModal();
    }

    showGameMessage(message) {
        const messageElement = document.getElementById('game-message');
        messageElement.textContent = message;
        messageElement.classList.remove('hidden');
        
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 3000);
    }

    showMessage(message) {
        console.log(message);
        // Could also show toast notifications here
    }
}

// Global functions for game state access
window.updateGameUI = function(gameState) {
    if (window.uiHandler) {
        window.uiHandler.gameState = gameState;
        window.uiHandler.updateGameDisplay();
    }
};

window.showPatientSelection = function(patientOptions) {
    if (window.uiHandler) {
        window.uiHandler.showPatientSelection(patientOptions);
    }
};

window.hidePatientSelection = function() {
    if (window.uiHandler) {
        window.uiHandler.hidePatientSelection();
    }
};
