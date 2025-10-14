// Game Logic for Dental Care Card Game

class GameState {
    constructor() {
        this.currentPlayer = 1;
        this.gamePhase = 'setup'; // setup, playing, ended
        this.players = {
            1: new Player(1),
            2: new Player(2)
        };
        this.decks = {
            patients: shuffleDeck([...CARD_DATA.patients]),
            procedures: shuffleDeck([...CARD_DATA.procedures]),
            pharmacology: shuffleDeck([...CARD_DATA.pharmacology]),
            easyModifiers: shuffleDeck([...CARD_DATA.easyModifiers]),
            challengingModifiers: shuffleDeck([...CARD_DATA.challengingModifiers])
        };
        this.selectedPatient = null;
        this.gameMessage = '';
        this.turnPhase = 'draw'; // draw, action, modifiers, replenish
    }

    startGame() {
        this.gamePhase = 'playing';
        this.setupPlayerHands();
        this.showPatientSelection();
    }

    setupPlayerHands() {
        // Each player draws initial cards
        for (let playerId = 1; playerId <= 2; playerId++) {
            const player = this.players[playerId];
            
            // Draw 2 patient cards (will choose 1)
            player.patientOptions = drawCards(this.decks.patients, 2);
            
            // Draw 3 procedure cards
            player.procedures = drawCards(this.decks.procedures, 3).map(card => 
                createCardInstance(card)
            );
            
            // Draw 4 pharmacology cards
            player.pharmacology = drawCards(this.decks.pharmacology, 4).map(card => 
                createCardInstance(card)
            );
            
            // Draw 1 easy and 1 challenging modifier
            player.easyModifiers = drawCards(this.decks.easyModifiers, 1).map(card => 
                createCardInstance(card)
            );
            player.challengingModifiers = drawCards(this.decks.challengingModifiers, 1).map(card => 
                createCardInstance(card)
            );
        }
    }

    showPatientSelection() {
        const currentPlayer = this.players[this.currentPlayer];
        if (currentPlayer.patientOptions.length === 0) {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            if (this.players[this.currentPlayer].patientOptions.length === 0) {
                this.startTurn();
                return;
            }
        }
        
        // Show patient selection modal
        this.displayPatientOptions(currentPlayer.patientOptions);
    }

    selectPatient(patientCard) {
        const currentPlayer = this.players[this.currentPlayer];
        currentPlayer.activePatient = createCardInstance(patientCard);
        
        // Remove selected patient from options
        currentPlayer.patientOptions = currentPlayer.patientOptions.filter(
            p => p.id !== patientCard.id
        );
        
        // Put remaining patient back in deck
        if (currentPlayer.patientOptions.length > 0) {
            this.decks.patients.push(currentPlayer.patientOptions[0]);
        }
        
        this.hidePatientSelection();
        this.showPatientSelection(); // Next player selects
    }

    startTurn() {
        this.turnPhase = 'draw';
        this.updateUI();
    }

    drawCards() {
        const currentPlayer = this.players[this.currentPlayer];
        
        // Draw 1 procedure and 1 pharmacology card
        const newProcedure = drawCards(this.decks.procedures, 1);
        const newPharmacology = drawCards(this.decks.pharmacology, 1);
        
        if (newProcedure.length > 0) {
            currentPlayer.procedures.push(createCardInstance(newProcedure[0]));
        }
        if (newPharmacology.length > 0) {
            currentPlayer.pharmacology.push(createCardInstance(newPharmacology[0]));
        }
        
        // Enforce hand size limits
        this.enforceHandLimits(currentPlayer);
        
        this.turnPhase = 'action';
        this.updateUI();
    }

    enforceHandLimits(player) {
        const maxProcedures = 7;
        const maxPharmacology = 7;
        
        if (player.procedures.length > maxProcedures) {
            const excess = player.procedures.length - maxProcedures;
            player.procedures.splice(-excess);
            this.showMessage(`Discarded ${excess} excess procedure cards`);
        }
        
        if (player.pharmacology.length > maxPharmacology) {
            const excess = player.pharmacology.length - maxPharmacology;
            player.pharmacology.splice(-excess);
            this.showMessage(`Discarded ${excess} excess pharmacology cards`);
        }
    }

    playProcedure(procedureCard, requiredPharmacology) {
        const currentPlayer = this.players[this.currentPlayer];
        
        // Check if player has the required pharmacology cards
        if (!this.canPlayProcedure(procedureCard, requiredPharmacology, currentPlayer)) {
            this.showMessage('Cannot play procedure: missing required pharmacology cards');
            return false;
        }
        
        // Remove required pharmacology cards from hand
        requiredPharmacology.forEach(req => {
            const index = currentPlayer.pharmacology.findIndex(card => card.type === req.type);
            if (index !== -1) {
                currentPlayer.pharmacology.splice(index, 1);
            }
        });
        
        // Add procedure to completed procedures
        procedureCard.played = true;
        currentPlayer.completedProcedures = currentPlayer.completedProcedures || [];
        currentPlayer.completedProcedures.push(procedureCard);
        
        // Remove procedure from hand
        const procedureIndex = currentPlayer.procedures.findIndex(card => card.instanceId === procedureCard.instanceId);
        if (procedureIndex !== -1) {
            currentPlayer.procedures.splice(procedureIndex, 1);
        }
        
        this.showMessage(`${currentPlayer.activePatient.name}: ${procedureCard.name} completed!`);
        
        // Check if patient is fully treated
        if (this.isPatientFullyTreated(currentPlayer)) {
            this.completePatient(currentPlayer);
        }
        
        return true;
    }

    canPlayProcedure(procedureCard, requiredPharmacology, player) {
        return requiredPharmacology.every(req => {
            return player.pharmacology.some(card => card.type === req.type);
        });
    }

    isPatientFullyTreated(player) {
        if (!player.activePatient) return false;
        
        const treatmentGoal = player.activePatient.treatmentGoal;
        const completedProcedures = player.completedProcedures || [];
        
        return treatmentGoal.every(goal => {
            const completed = completedProcedures.find(proc => proc.name === goal.type);
            return completed && completed.played;
        });
    }

    completePatient(player) {
        player.completedCases = (player.completedCases || 0) + 1;
        this.showMessage(`Patient ${player.activePatient.name} fully treated! Cases completed: ${player.completedCases}`);
        
        if (player.completedCases >= 2) {
            this.endGame(player.id);
            return;
        }
        
        // Draw new patient
        const newPatient = drawCards(this.decks.patients, 1);
        if (newPatient.length > 0) {
            player.activePatient = createCardInstance(newPatient[0]);
            player.completedProcedures = [];
        } else {
            this.showMessage('No more patients available!');
        }
    }

    playModifier(modifierCard, targetPlayerId) {
        const currentPlayer = this.players[this.currentPlayer];
        const targetPlayer = this.players[targetPlayerId];
        
        if (modifierCard.type === 'easy') {
            // Easy modifiers help the current player
            this.applyEasyModifier(modifierCard, currentPlayer);
        } else {
            // Challenging modifiers affect the target player
            this.applyChallengingModifier(modifierCard, targetPlayer);
        }
        
        // Remove modifier from hand and draw new one
        const modifierIndex = modifierCard.type === 'easy' 
            ? currentPlayer.easyModifiers.findIndex(card => card.instanceId === modifierCard.instanceId)
            : currentPlayer.challengingModifiers.findIndex(card => card.instanceId === modifierCard.instanceId);
            
        if (modifierIndex !== -1) {
            if (modifierCard.type === 'easy') {
                currentPlayer.easyModifiers.splice(modifierIndex, 1);
                const newEasy = drawCards(this.decks.easyModifiers, 1);
                if (newEasy.length > 0) {
                    currentPlayer.easyModifiers.push(createCardInstance(newEasy[0]));
                }
            } else {
                currentPlayer.challengingModifiers.splice(modifierIndex, 1);
                const newChallenging = drawCards(this.decks.challengingModifiers, 1);
                if (newChallenging.length > 0) {
                    currentPlayer.challengingModifiers.push(createCardInstance(newChallenging[0]));
                }
            }
        }
    }

    applyEasyModifier(modifierCard, player) {
        switch (modifierCard.id) {
            case 'dental-assistant-aid':
                // Draw extra card
                const extraCard = drawCards(this.decks.pharmacology, 1);
                if (extraCard.length > 0) {
                    player.pharmacology.push(createCardInstance(extraCard[0]));
                }
                this.showMessage('Dental Assistant\'s Aid: Drew extra card!');
                break;
            case 'rush-order':
                player.rushOrderActive = true;
                this.showMessage('Rush Order: Next procedure requires one fewer pharmacology card!');
                break;
            case 'clinical-confidence':
                player.clinicalConfidenceActive = true;
                this.showMessage('Clinical Confidence: Can ignore one special condition this turn!');
                break;
        }
    }

    applyChallengingModifier(modifierCard, targetPlayer) {
        switch (modifierCard.id) {
            case 'patient-panic':
                if (targetPlayer.pharmacology.length > 0) {
                    const randomIndex = Math.floor(Math.random() * targetPlayer.pharmacology.length);
                    targetPlayer.pharmacology.splice(randomIndex, 1);
                    this.showMessage(`${targetPlayer.id}: Patient Panic! Discarded random card.`);
                }
                break;
            case 'supply-shortage':
                this.supplyShortageActive = true;
                this.showMessage('Supply Shortage: All players cannot use Anesthetics this round!');
                break;
            case 'anesthetic-failure':
                targetPlayer.pharmacology = targetPlayer.pharmacology.filter(card => card.type !== 'Anesthetic');
                this.showMessage(`${targetPlayer.id}: Anesthetic Failure! All anesthetic cards discarded.`);
                break;
            case 'equipment-malfunction':
                targetPlayer.skipNextTurn = true;
                this.showMessage(`${targetPlayer.id}: Equipment Malfunction! Must skip next turn.`);
                break;
        }
    }

    endTurn() {
        // Apply any end-of-turn effects
        const currentPlayer = this.players[this.currentPlayer];
        currentPlayer.rushOrderActive = false;
        currentPlayer.clinicalConfidenceActive = false;
        
        // Switch to next player
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        
        // Check if next player should skip turn
        if (this.players[this.currentPlayer].skipNextTurn) {
            this.players[this.currentPlayer].skipNextTurn = false;
            this.showMessage(`Player ${this.currentPlayer} skips turn due to equipment malfunction.`);
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }
        
        this.startTurn();
    }

    endGame(winnerId) {
        this.gamePhase = 'ended';
        this.showMessage(`🎉 Player ${winnerId} wins! First to complete 2 cases!`);
    }

    showMessage(message) {
        this.gameMessage = message;
        // This will be handled by the UI
    }

    updateUI() {
        // This will be handled by the UI handler
        if (window.updateGameUI) {
            window.updateGameUI(this);
        }
    }

    displayPatientOptions(patientOptions) {
        // This will be handled by the UI
        if (window.showPatientSelection) {
            window.showPatientSelection(patientOptions);
        }
    }

    hidePatientSelection() {
        // This will be handled by the UI
        if (window.hidePatientSelection) {
            window.hidePatientSelection();
        }
    }
}

class Player {
    constructor(id) {
        this.id = id;
        this.activePatient = null;
        this.patientOptions = [];
        this.procedures = [];
        this.pharmacology = [];
        this.easyModifiers = [];
        this.challengingModifiers = [];
        this.completedProcedures = [];
        this.completedCases = 0;
        this.rushOrderActive = false;
        this.clinicalConfidenceActive = false;
        this.skipNextTurn = false;
    }
}
