/**
 * HAM DEALER - Travel System
 * This file contains the travel-related functionality
 */

// Travel data
const travelData = {
    travelCost: {
        'Market': { 'Farm': 50, 'City': 100, 'Port': 150, 'Village': 75 },
        'Farm': { 'Market': 50, 'City': 125, 'Port': 175, 'Village': 60 },
        'City': { 'Market': 100, 'Farm': 125, 'Port': 100, 'Village': 90 },
        'Port': { 'Market': 150, 'Farm': 175, 'City': 100, 'Village': 120 },
        'Village': { 'Market': 75, 'Farm': 60, 'City': 90, 'Port': 120 }
    },
    // Chance of event occurring during travel (0-1)
    eventChance: 0.7
};

// Initialize travel options
function initTravel() {
    const locationListElement = document.getElementById('location-list');
    
    // Clear existing content
    locationListElement.innerHTML = '';
    
    // Check if game is over
    if (gameState.gameOver) {
        locationListElement.innerHTML = '<p>Travel is no longer available.</p>';
        return;
    }
    
    // Create elements for each location (except current)
    gameState.locations.forEach(location => {
        // Skip current location
        if (location === gameState.currentLocation) return;
        
        const cost = travelData.travelCost[gameState.currentLocation][location];
        
        // Create location item container
        const locationElement = document.createElement('div');
        locationElement.className = 'location-item';
        locationElement.onclick = () => travelTo(location);
        
        // Create location content
        locationElement.innerHTML = `
            <h3>${location}</h3>
            <p>Travel Cost: $${cost}</p>
            <p class="travel-note">Traveling advances the day by 1</p>
        `;
        
        // Add to location list
        locationListElement.appendChild(locationElement);
    });
    
    console.log('Travel options initialized');
}

// Travel to a new location
function travelTo(destination) {
    // Check if game is over
    if (gameState.gameOver) {
        if (typeof showGameOverMessage === 'function') {
            showGameOverMessage();
        } else {
            alert("Game Over! You can no longer travel. Start a new game to play again.");
        }
        return;
    }
    
    // Get travel cost
    const cost = travelData.travelCost[gameState.currentLocation][destination];
    
    // Check if player has enough cash
    if (gameState.player.cash < cost) {
        alert(`Not enough cash to travel to ${destination}! You need $${cost}.`);
        return;
    }
    
    // Deduct travel cost
    gameState.player.cash -= cost;
    
    // Update location
    gameState.currentLocation = destination;
    
    // Advance day when traveling
    gameState.currentDay++;
    
    // Check for debt deadline after advancing day
    if (gameState.player.debtDueDay && gameState.currentDay > gameState.player.debtDueDay) {
        if (typeof handleDebtDefault === 'function') {
            handleDebtDefault();
        }
    }
    
    // Update market prices for new location
    updateMarketPrices();
    
    // Update UI
    updatePlayerStats();
    displayMarket();
    updateInventoryDisplay();
    initTravel();
    
    console.log(`Traveled to ${destination} for $${cost}, advanced to day ${gameState.currentDay}`);
    
    // Check for random event
    checkForTravelEvent();
}

// Check for random event during travel
function checkForTravelEvent() {
    // Check if game is over
    if (gameState.gameOver) return;
    
    // Determine if event occurs
    if (Math.random() < travelData.eventChance) {
        // Trigger random event
        triggerRandomEvent();
    }
}

// Trigger a random travel event
function triggerRandomEvent() {
    // Get a random event
    const event = getRandomEvent();
    
    // Display event popup
    showEventPopup(event);
}

// Get a random event
function getRandomEvent() {
    // Array of possible events
    const events = [
        {
            title: "Roadside Ham Sale",
            description: "You stumble upon a roadside ham sale. The prices are surprisingly good!",
            choices: [
                {
                    text: "Buy some ham at a discount",
                    effect: () => {
                        // Select a random ham type
                        const randomHam = gameState.hamTypes[Math.floor(Math.random() * gameState.hamTypes.length)];
                        // Apply discount
                        const discountedPrice = Math.floor(gameState.marketPrices[randomHam.id] * 0.7);
                        // Add to inventory
                        if (!gameState.player.inventory[randomHam.id]) {
                            gameState.player.inventory[randomHam.id] = 0;
                        }
                        gameState.player.inventory[randomHam.id] += 2;
                        // Deduct cash
                        gameState.player.cash -= discountedPrice * 2;
                        
                        // Update UI
                        updatePlayerStats();
                        updateInventoryDisplay();
                        
                        return `You bought 2 ${randomHam.name} for $${discountedPrice * 2}!`;
                    }
                },
                {
                    text: "Ignore and continue on your way",
                    effect: () => {
                        return "You decide to ignore the sale and continue on your way.";
                    }
                }
            ]
        },
        {
            title: "Highway Robbery",
            description: "A group of bandits stops you on the road and demands payment!",
            choices: [
                {
                    text: "Pay them off",
                    effect: () => {
                        // Calculate payment (10-20% of cash)
                        const payment = Math.floor(gameState.player.cash * (0.1 + Math.random() * 0.1));
                        // Deduct cash
                        gameState.player.cash -= payment;
                        
                        // Update UI
                        updatePlayerStats();
                        
                        return `You paid the bandits $${payment} and they let you pass.`;
                    }
                },
                {
                    text: "Refuse and try to escape",
                    effect: () => {
                        // 50% chance of success
                        if (Math.random() < 0.5) {
                            return "You managed to escape without paying!";
                        } else {
                            // Calculate higher payment (20-30% of cash)
                            const payment = Math.floor(gameState.player.cash * (0.2 + Math.random() * 0.1));
                            // Deduct cash
                            gameState.player.cash -= payment;
                            
                            // Update UI
                            updatePlayerStats();
                            
                            return `You failed to escape and the bandits took $${payment} from you!`;
                        }
                    }
                }
            ]
        },
        {
            title: "Lost Ham Shipment",
            description: "You find a lost shipment of ham on the side of the road!",
            choices: [
                {
                    text: "Take the ham",
                    effect: () => {
                        // Select a random ham type
                        const randomHam = gameState.hamTypes[Math.floor(Math.random() * gameState.hamTypes.length)];
                        // Random quantity (1-3)
                        const quantity = 1 + Math.floor(Math.random() * 3);
                        // Add to inventory
                        if (!gameState.player.inventory[randomHam.id]) {
                            gameState.player.inventory[randomHam.id] = 0;
                        }
                        gameState.player.inventory[randomHam.id] += quantity;
                        
                        // Update UI
                        updateInventoryDisplay();
                        
                        return `You found ${quantity} ${randomHam.name} and added it to your inventory!`;
                    }
                },
                {
                    text: "Leave it alone",
                    effect: () => {
                        return "You decide to leave the shipment alone and continue on your way.";
                    }
                }
            ]
        },
        {
            title: "Traveling Merchant",
            description: "You meet a traveling merchant who offers to trade with you.",
            choices: [
                {
                    text: "Trade with the merchant",
                    effect: () => {
                        // Check if player has any ham
                        if (Object.keys(gameState.player.inventory).length === 0) {
                            return "You don't have any ham to trade!";
                        }
                        
                        // Select a random ham from inventory
                        const playerHamIds = Object.keys(gameState.player.inventory);
                        const randomPlayerHamId = playerHamIds[Math.floor(Math.random() * playerHamIds.length)];
                        const randomPlayerHam = gameState.hamTypes.find(ham => ham.id === randomPlayerHamId);
                        
                        // Select a different random ham to receive
                        let randomNewHamId;
                        do {
                            const randomIndex = Math.floor(Math.random() * gameState.hamTypes.length);
                            randomNewHamId = gameState.hamTypes[randomIndex].id;
                        } while (randomNewHamId === randomPlayerHamId);
                        
                        const randomNewHam = gameState.hamTypes.find(ham => ham.id === randomNewHamId);
                        
                        // Remove 1 from player's inventory
                        gameState.player.inventory[randomPlayerHamId]--;
                        if (gameState.player.inventory[randomPlayerHamId] <= 0) {
                            delete gameState.player.inventory[randomPlayerHamId];
                        }
                        
                        // Add new ham to inventory
                        if (!gameState.player.inventory[randomNewHamId]) {
                            gameState.player.inventory[randomNewHamId] = 0;
                        }
                        gameState.player.inventory[randomNewHamId] += 1;
                        
                        // Update UI
                        updateInventoryDisplay();
                        
                        return `You traded 1 ${randomPlayerHam.name} for 1 ${randomNewHam.name}!`;
                    }
                },
                {
                    text: "Decline and continue on your way",
                    effect: () => {
                        return "You decline the merchant's offer and continue on your way.";
                    }
                }
            ]
        },
        {
            title: "Ham Spoilage",
            description: "The hot weather has caused some of your ham to spoil!",
            choices: [
                {
                    text: "Inspect your inventory",
                    effect: () => {
                        // Check if player has any ham
                        if (Object.keys(gameState.player.inventory).length === 0) {
                            return "You don't have any ham that could spoil!";
                        }
                        
                        // Select a random ham from inventory
                        const playerHamIds = Object.keys(gameState.player.inventory);
                        const randomPlayerHamId = playerHamIds[Math.floor(Math.random() * playerHamIds.length)];
                        const randomPlayerHam = gameState.hamTypes.find(ham => ham.id === randomPlayerHamId);
                        
                        // Calculate how much spoils (1 or more depending on quantity)
                        const spoilAmount = Math.min(
                            gameState.player.inventory[randomPlayerHamId],
                            1 + Math.floor(Math.random() * 2)
                        );
                        
                        // Remove from player's inventory
                        gameState.player.inventory[randomPlayerHamId] -= spoilAmount;
                        if (gameState.player.inventory[randomPlayerHamId] <= 0) {
                            delete gameState.player.inventory[randomPlayerHamId];
                        }
                        
                        // Update UI
                        updateInventoryDisplay();
                        
                        return `${spoilAmount} ${randomPlayerHam.name} has spoiled and been removed from your inventory!`;
                    }
                },
                {
                    text: "Ignore it and hope for the best",
                    effect: () => {
                        // Check if player has any ham
                        if (Object.keys(gameState.player.inventory).length === 0) {
                            return "You don't have any ham that could spoil!";
                        }
                        
                        // 50% chance of more spoilage
                        if (Math.random() < 0.5) {
                            // Select a random ham from inventory
                            const playerHamIds = Object.keys(gameState.player.inventory);
                            const randomPlayerHamId = playerHamIds[Math.floor(Math.random() * playerHamIds.length)];
                            const randomPlayerHam = gameState.hamTypes.find(ham => ham.id === randomPlayerHamId);
                            
                            // Calculate how much spoils (more than the first option)
                            const spoilAmount = Math.min(
                                gameState.player.inventory[randomPlayerHamId],
                                2 + Math.floor(Math.random() * 2)
                            );
                            
                            // Remove from player's inventory
                            gameState.player.inventory[randomPlayerHamId] -= spoilAmount;
                            if (gameState.player.inventory[randomPlayerHamId] <= 0) {
                                delete gameState.player.inventory[randomPlayerHamId];
                            }
                            
                            // Update UI
                            updateInventoryDisplay();
                            
                            return `By ignoring the problem, ${spoilAmount} ${randomPlayerHam.name} has spoiled and been removed from your inventory!`;
                        } else {
                            return "Luckily, none of your ham spoiled this time!";
                        }
                    }
                }
            ]
        }
    ];
    
    // Return a random event
    return events[Math.floor(Math.random() * events.length)];
}

// Show event popup
function showEventPopup(event) {
    const popupElement = document.getElementById('event-popup');
    const titleElement = document.getElementById('event-title');
    const descriptionElement = document.getElementById('event-description');
    const choicesElement = document.getElementById('event-choices');
    
    // Set event details
    titleElement.textContent = event.title;
    descriptionElement.textContent = event.description;
    
    // Clear existing choices
    choicesElement.innerHTML = '';
    
    // Add choices
    event.choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.className = 'button';
        choiceButton.textContent = choice.text;
        choiceButton.onclick = () => {
            // Execute choice effect
            const result = choice.effect();
            
            // Display result
            descriptionElement.textContent = result;
            
            // Clear choices
            choicesElement.innerHTML = '';
            
            // Change close button text
            document.getElementById('close-popup').textContent = 'Continue';
        };
        
        choicesElement.appendChild(choiceButton);
    });
    
    // Show popup
    popupElement.classList.remove('hidden');
    
    console.log('Event popup displayed:', event.title);
}

// Close event popup
function closeEventPopup() {
    const popupElement = document.getElementById('event-popup');
    popupElement.classList.add('hidden');
    
    // Reset close button text
    document.getElementById('close-popup').textContent = 'Close';
    
    console.log('Event popup closed');
}

// Initialize event popup close button
document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.getElementById('close-popup');
    closeButton.addEventListener('click', closeEventPopup);
});