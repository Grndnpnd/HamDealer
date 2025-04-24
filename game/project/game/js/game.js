/**
 * HAM DEALER - Core Game Logic
 * This file contains the main game state and core functionality
 */

// Game state object
const gameState = {
    player: {
        cash: 1000,
        debt: 5000,
        debtDueDay: 30,
        inventory: {}
    },
    currentDay: 1,
    currentLocation: 'Market',
    locations: ['Market', 'Farm', 'City', 'Port', 'Village'],
    hamTypes: [
        { id: 'country', name: 'Country Ham', basePrice: 15, volatility: 0.2 },
        { id: 'honey', name: 'Honey Ham', basePrice: 25, volatility: 0.3 },
        { id: 'spiral', name: 'Spiral Ham', basePrice: 30, volatility: 0.25 },
        { id: 'smoked', name: 'Smoked Ham', basePrice: 20, volatility: 0.15 },
        { id: 'prosciutto', name: 'Prosciutto', basePrice: 45, volatility: 0.4 },
        { id: 'serrano', name: 'Serrano Ham', basePrice: 40, volatility: 0.35 },
        { id: 'black_forest', name: 'Black Forest Ham', basePrice: 35, volatility: 0.3 },
        { id: 'virginia', name: 'Virginia Ham', basePrice: 28, volatility: 0.4 }
    ],
    marketPrices: {},
    maxDebtDays: 30,
    gameOver: false
};

// Initialize the game
function initGame() {
    console.log('Initializing HAM DEALER game...');
    
    // Generate initial market prices
    updateMarketPrices();
    
    // Update UI
    updatePlayerStats();
    
    // Initialize market display
    if (typeof displayMarket === 'function') {
        displayMarket();
    }
    
    // Initialize travel options
    if (typeof initTravel === 'function') {
        initTravel();
    }
    
    console.log('Game initialized successfully!');
}

// Update market prices based on location and random factors
function updateMarketPrices() {
    gameState.hamTypes.forEach(ham => {
        // Base price variation by location
        let locationFactor = 1.0;
        
        switch(gameState.currentLocation) {
            case 'Farm':
                locationFactor = 0.8; // Cheaper at farms
                break;
            case 'City':
                locationFactor = 1.2; // More expensive in cities
                break;
            case 'Port':
                locationFactor = 1.1; // Slightly more expensive at ports
                break;
            case 'Village':
                locationFactor = 0.9; // Slightly cheaper in villages
                break;
            default: // Market
                locationFactor = 1.0;
        }
        
        // Random price fluctuation based on volatility
        const fluctuation = 1 + (Math.random() * ham.volatility * 2 - ham.volatility);
        
        // Calculate final price
        const price = Math.round(ham.basePrice * locationFactor * fluctuation);
        
        // Store in market prices
        gameState.marketPrices[ham.id] = price;
    });
    
    console.log('Market prices updated:', gameState.marketPrices);
}

// Update player stats in the UI
function updatePlayerStats() {
    document.getElementById('player-cash').textContent = gameState.player.cash;
    document.getElementById('player-debt').textContent = gameState.player.debt;
    document.getElementById('current-day').textContent = gameState.currentDay;
    document.getElementById('current-location').textContent = gameState.currentLocation;
    
    // Update debt due day display
    const debtDueElement = document.getElementById('debt-due-day');
    if (gameState.player.debtDueDay) {
        debtDueElement.textContent = gameState.player.debtDueDay;
        
        // Highlight if close to deadline
        const daysLeft = gameState.player.debtDueDay - gameState.currentDay;
        if (daysLeft <= 5 && daysLeft > 0) {
            debtDueElement.style.color = 'red';
            debtDueElement.style.fontWeight = 'bold';
        } else {
            debtDueElement.style.color = '';
            debtDueElement.style.fontWeight = '';
        }
    } else {
        debtDueElement.textContent = 'N/A';
        debtDueElement.style.color = '';
        debtDueElement.style.fontWeight = '';
    }
}

// Buy ham
function buyHam(hamId, quantity = 1) {
    // Check if game is over
    if (gameState.gameOver) {
        showGameOverMessage();
        return false;
    }
    
    const price = gameState.marketPrices[hamId];
    const totalCost = price * quantity;
    
    if (gameState.player.cash >= totalCost) {
        // Deduct cash
        gameState.player.cash -= totalCost;
        
        // Add to inventory
        if (!gameState.player.inventory[hamId]) {
            gameState.player.inventory[hamId] = 0;
        }
        gameState.player.inventory[hamId] += quantity;
        
        // Update UI
        updatePlayerStats();
        if (typeof updateInventoryDisplay === 'function') {
            updateInventoryDisplay();
        }
        
        console.log(`Bought ${quantity} ${hamId} for $${totalCost}`);
        return true;
    } else {
        console.log('Not enough cash to buy ham');
        alert('Not enough cash!');
        return false;
    }
}

// Sell ham
function sellHam(hamId, quantity = 1) {
    // Check if game is over
    if (gameState.gameOver) {
        showGameOverMessage();
        return false;
    }
    
    if (gameState.player.inventory[hamId] && gameState.player.inventory[hamId] >= quantity) {
        const price = gameState.marketPrices[hamId];
        const totalEarned = price * quantity;
        
        // Add cash
        gameState.player.cash += totalEarned;
        
        // Remove from inventory
        gameState.player.inventory[hamId] -= quantity;
        if (gameState.player.inventory[hamId] <= 0) {
            delete gameState.player.inventory[hamId];
        }
        
        // Update UI
        updatePlayerStats();
        if (typeof updateInventoryDisplay === 'function') {
            updateInventoryDisplay();
        }
        
        console.log(`Sold ${quantity} ${hamId} for $${totalEarned}`);
        return true;
    } else {
        console.log('Not enough ham in inventory to sell');
        alert('Not enough ham in inventory!');
        return false;
    }
}

// Take out a loan
function takeLoan(amount) {
    // Check if game is over
    if (gameState.gameOver) {
        showGameOverMessage();
        return false;
    }
    
    gameState.player.cash += amount;
    gameState.player.debt += amount;
    
    // Set due date for debt
    gameState.player.debtDueDay = gameState.currentDay + gameState.maxDebtDays;
    
    // Update UI
    updatePlayerStats();
    
    console.log(`Took loan of $${amount}, due on day ${gameState.player.debtDueDay}`);
    
    // Show message about debt deadline
    alert(`You've taken a loan of $${amount}. You must repay it by day ${gameState.player.debtDueDay} or face serious consequences!`);
}

// Pay back debt
function payDebt(amount) {
    // Check if game is over
    if (gameState.gameOver) {
        showGameOverMessage();
        return false;
    }
    
    if (amount > gameState.player.cash) {
        console.log('Not enough cash to pay debt');
        alert('Not enough cash to pay that much debt!');
        return false;
    }
    
    if (amount > gameState.player.debt) {
        amount = gameState.player.debt;
    }
    
    gameState.player.cash -= amount;
    gameState.player.debt -= amount;
    
    // Clear debt due date if debt is fully paid
    if (gameState.player.debt <= 0) {
        gameState.player.debt = 0;
        gameState.player.debtDueDay = null;
    }
    
    // Update UI
    updatePlayerStats();
    
    console.log(`Paid $${amount} toward debt`);
    return true;
}

// Advance to next day
function advanceDay() {
    // Check if game is over
    if (gameState.gameOver) {
        showGameOverMessage();
        return;
    }
    
    gameState.currentDay++;
    
    // Check for debt deadline
    if (gameState.player.debtDueDay && gameState.currentDay > gameState.player.debtDueDay) {
        handleDebtDefault();
    }
    
    // Update market prices
    updateMarketPrices();
    
    // Update UI
    updatePlayerStats();
    if (typeof displayMarket === 'function') {
        displayMarket();
    }
    
    console.log(`Advanced to day ${gameState.currentDay}`);
}

// Handle debt default
function handleDebtDefault() {
    // Check if debt is still outstanding
    if (gameState.player.debt > 0) {
        // Game over due to debt default
        gameState.gameOver = true;
        
        // Show game over message
        showGameOverScreen("GAME OVER", 
            `You failed to pay your debt of $${gameState.player.debt} by day ${gameState.player.debtDueDay}! The debt collectors have taken everything you own.`,
            `You lasted ${gameState.currentDay} days as a Ham Dealer.`);
    }
}

// Show game over message for actions attempted after game over
function showGameOverMessage() {
    alert("Game Over! You can no longer perform actions. Start a new game to play again.");
}

// Show game over screen
function showGameOverScreen(title, message, stats) {
    // Create game over popup
    const gameOverPopup = document.createElement('div');
    gameOverPopup.className = 'popup';
    gameOverPopup.id = 'game-over-popup';
    
    // Create popup content
    gameOverPopup.innerHTML = `
        <div class="popup-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <p>${stats}</p>
            <button class="button" onclick="location.reload()">Start New Game</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(gameOverPopup);
    
    console.log('Game over screen displayed');
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);