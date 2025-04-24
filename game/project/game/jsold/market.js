/**
 * HAM DEALER - Market Functionality
 * This file contains the market-related functionality
 */

// Display the market with all ham types and buy/sell options
function displayMarket() {
    const hamListElement = document.getElementById('ham-list');
    
    // Clear existing content
    hamListElement.innerHTML = '';
    
    // Create elements for each ham type
    gameState.hamTypes.forEach(ham => {
        const price = gameState.marketPrices[ham.id];
        
        // Create ham item container
        const hamElement = document.createElement('div');
        hamElement.className = 'ham-item';
        hamElement.id = `ham-${ham.id}`;
        
        // Create ham content
        hamElement.innerHTML = `
            <h3>${ham.name}</h3>
            <p>Price: $${price}</p>
            <div class="ham-actions">
                <button class="button button-buy" onclick="buyHam('${ham.id}')">Buy</button>
                <button class="button button-sell" onclick="sellHam('${ham.id}')">Sell</button>
            </div>
        `;
        
        // Add to market
        hamListElement.appendChild(hamElement);
    });
    
    console.log('Market display updated with all ham types');
}

// Update inventory display
function updateInventoryDisplay() {
    const inventoryElement = document.getElementById('inventory-list');
    
    // Clear existing content
    inventoryElement.innerHTML = '';
    
    // Check if inventory is empty
    if (Object.keys(gameState.player.inventory).length === 0) {
        inventoryElement.innerHTML = '<p>Your inventory is empty.</p>';
        return;
    }
    
    // Create elements for each inventory item
    for (const hamId in gameState.player.inventory) {
        const quantity = gameState.player.inventory[hamId];
        
        // Find ham details
        const hamDetails = gameState.hamTypes.find(ham => ham.id === hamId);
        
        if (!hamDetails) continue;
        
        // Create inventory item container
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        
        // Create item content
        itemElement.innerHTML = `
            <h3>${hamDetails.name}</h3>
            <p>Quantity: ${quantity}</p>
            <p>Market Price: $${gameState.marketPrices[hamId]}</p>
            <div class="ham-actions">
                <button class="button button-sell" onclick="sellHam('${hamId}')">Sell 1</button>
            </div>
        `;
        
        // Add to inventory
        inventoryElement.appendChild(itemElement);
    }
    
    console.log('Inventory display updated');
}

// Add market controls
function addMarketControls() {
    const marketSection = document.getElementById('market-section');
    
    // Create loan controls
    const loanControls = document.createElement('div');
    loanControls.className = 'loan-controls';
    loanControls.innerHTML = `
        <h3>Loan Office</h3>
        <div class="loan-actions">
            <button class="button" onclick="takeLoan(1000)">Take $1000 Loan</button>
            <button class="button" onclick="payDebt(1000)">Pay $1000 Debt</button>
        </div>
        <p class="loan-info">Loans must be repaid within ${gameState.maxDebtDays} days.</p>
    `;
    
    // Create day advancement control
    const dayControl = document.createElement('div');
    dayControl.className = 'day-control';
    dayControl.innerHTML = `
        <button class="button" onclick="advanceDay()">Next Day</button>
    `;
    
    // Add to market section
    marketSection.appendChild(document.createElement('hr'));
    marketSection.appendChild(loanControls);
    marketSection.appendChild(dayControl);
    
    console.log('Market controls added');
}

// Initialize market functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initial market display will be handled by initGame()
    
    // Add market controls
    addMarketControls();
    
    // Initial inventory display
    updateInventoryDisplay();
});