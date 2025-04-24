/**
 * HAM DEALER - Events System
 * This file contains the random events functionality
 */

// Event system configuration
const eventSystem = {
    // Daily event chance (0-1)
    dailyEventChance: 0.3,
    
    // Event categories
    categories: ['market', 'debt', 'inventory', 'opportunity']
};

// Initialize events system
function initEvents() {
    console.log('Events system initialized');
    
    // Add event listener for day advancement to check for daily events
    document.addEventListener('dayAdvanced', checkForDailyEvent);
}

// Check for daily random event
function checkForDailyEvent() {
    // Determine if event occurs
    if (Math.random() < eventSystem.dailyEventChance) {
        // Get random event category
        const category = eventSystem.categories[Math.floor(Math.random() * eventSystem.categories.length)];
        
        // Trigger event based on category
        triggerCategoryEvent(category);
    }
}

// Trigger event based on category
function triggerCategoryEvent(category) {
    let event;
    
    switch(category) {
        case 'market':
            event = getMarketEvent();
            break;
        case 'debt':
            event = getDebtEvent();
            break;
        case 'inventory':
            event = getInventoryEvent();
            break;
        case 'opportunity':
            event = getOpportunityEvent();
            break;
        default:
            return;
    }
    
    // Display event popup
    showEventPopup(event);
}

// Get a random market event
function getMarketEvent() {
    const events = [
        {
            title: "Market Crash",
            description: "The ham market has crashed! Prices are at an all-time low.",
            choices: [
                {
                    text: "Buy ham while prices are low",
                    effect: () => {
                        // Reduce all ham prices by 30-50%
                        gameState.hamTypes.forEach(ham => {
                            const reduction = 0.5 + Math.random() * 0.2; // 50-70% of original price
                            gameState.marketPrices[ham.id] = Math.floor(gameState.marketPrices[ham.id] * reduction);
                        });
                        
                        // Update UI
                        displayMarket();
                        
                        return "Ham prices have dropped significantly! This is a great time to buy.";
                    }
                },
                {
                    text: "Wait for the market to recover",
                    effect: () => {
                        return "You decide to wait for the market to recover before making any moves.";
                    }
                }
            ]
        },
        {
            title: "Ham Shortage",
            description: "A ham shortage has caused prices to skyrocket!",
            choices: [
                {
                    text: "Sell ham while prices are high",
                    effect: () => {
                        // Increase all ham prices by 50-100%
                        gameState.hamTypes.forEach(ham => {
                            const increase = 1.5 + Math.random() * 0.5; // 150-200% of original price
                            gameState.marketPrices[ham.id] = Math.floor(gameState.marketPrices[ham.id] * increase);
                        });
                        
                        // Update UI
                        displayMarket();
                        
                        return "Ham prices have increased dramatically! This is a great time to sell.";
                    }
                },
                {
                    text: "Hold onto your ham for now",
                    effect: () => {
                        return "You decide to hold onto your ham for now.";
                    }
                }
            ]
        },
        {
            title: "Market Regulation",
            description: "New regulations have stabilized ham prices across all markets.",
            choices: [
                {
                    text: "Adapt to the new market",
                    effect: () => {
                        // Normalize all ham prices closer to base price
                        gameState.hamTypes.forEach(ham => {
                            const currentPrice = gameState.marketPrices[ham.id];
                            const basePrice = ham.basePrice;
                            // Move 60% toward base price
                            gameState.marketPrices[ham.id] = Math.floor(currentPrice * 0.4 + basePrice * 0.6);
                        });
                        
                        // Update UI
                        displayMarket();
                        
                        return "Ham prices have been normalized across all markets.";
                    }
                },
                {
                    text: "Ignore the regulations",
                    effect: () => {
                        return "You decide to ignore the regulations and continue as usual.";
                    }
                }
            ]
        }
    ];
    
    // Return a random event
    return events[Math.floor(Math.random() * events.length)];
}

// Get a random debt event
function getDebtEvent() {
    // Only trigger debt events if player has debt
    if (gameState.player.debt <= 0) {
        return getOpportunityEvent(); // Fallback to opportunity event
    }
    
    const events = [
        {
            title: "Debt Collector Visit",
            description: `A debt collector has arrived demanding immediate partial payment of your $${gameState.player.debt} debt!`,
            choices: [
                {
                    text: "Pay part of your debt",
                    effect: () => {
                        // Calculate payment amount (20-30% of debt)
                        const paymentAmount = Math.floor(gameState.player.debt * (0.2 + Math.random() * 0.1));
                        
                        // Check if player has enough cash
                        if (gameState.player.cash < paymentAmount) {
                            return `You don't have enough cash to make the payment of $${paymentAmount}!`;
                        }
                        
                        // Make payment
                        gameState.player.cash -= paymentAmount;
                        gameState.player.debt -= paymentAmount;
                        
                        // Clear debt due date if debt is fully paid
                        if (gameState.player.debt <= 0) {
                            gameState.player.debt = 0;
                            gameState.player.debtDueDay = null;
                        }
                        
                        // Update UI
                        updatePlayerStats();
                        
                        return `You paid $${paymentAmount} toward your debt. Remaining debt: $${gameState.player.debt}`;
                    }
                },
                {
                    text: "Refuse to pay now",
                    effect: () => {
                        // Reduce days until debt is due
                        const daysReduced = 5;
                        gameState.player.debtDueDay = Math.max(
                            gameState.currentDay + 1,
                            gameState.player.debtDueDay - daysReduced
                        );
                        
                        // Update UI
                        updatePlayerStats();
                        
                        return `The debt collector is angry! Your debt deadline has been moved up by ${daysReduced} days.`;
                    }
                }
            ]
        },
        {
            title: "Debt Relief Opportunity",
            description: "A debt relief program is offering to reduce your debt!",
            choices: [
                {
                    text: "Apply for debt relief",
                    effect: () => {
                        // Calculate relief amount (10-25% of debt)
                        const reliefAmount = Math.floor(gameState.player.debt * (0.1 + Math.random() * 0.15));
                        
                        // Apply relief
                        gameState.player.debt -= reliefAmount;
                        
                        // Clear debt due date if debt is fully paid
                        if (gameState.player.debt <= 0) {
                            gameState.player.debt = 0;
                            gameState.player.debtDueDay = null;
                        }
                        
                        // Update UI
                        updatePlayerStats();
                        
                        return `Your debt has been reduced by $${reliefAmount}! Remaining debt: $${gameState.player.debt}`;
                    }
                },
                {
                    text: "Decline the offer",
                    effect: () => {
                        return "You decide to decline the debt relief offer.";
                    }
                }
            ]
        },
        {
            title: "Debt Extension Offer",
            description: "A banker offers to extend your debt deadline for a fee.",
            choices: [
                {
                    text: "Pay for extension",
                    effect: () => {
                        // Calculate fee (5-10% of debt)
                        const feeAmount = Math.floor(gameState.player.debt * (0.05 + Math.random() * 0.05));
                        
                        // Check if player has enough cash
                        if (gameState.player.cash < feeAmount) {
                            return `You don't have enough cash to pay the fee of $${feeAmount}!`;
                        }
                        
                        // Pay fee
                        gameState.player.cash -= feeAmount;
                        
                        // Extend deadline
                        const daysExtended = 10;
                        gameState.player.debtDueDay += daysExtended;
                        
                        // Update UI
                        updatePlayerStats();
                        
                        return `You paid $${feeAmount} to extend your debt deadline by ${daysExtended} days.`;
                    }
                },
                {
                    text: "Decline the offer",
                    effect: () => {
                        return "You decide to decline the debt extension offer.";
                    }
                }
            ]
        }
    ];
    
    // Return a random event
    return events[Math.floor(Math.random() * events.length)];
}

// Get a random inventory event
function getInventoryEvent() {
    // Only trigger inventory events if player has inventory
    if (Object.keys(gameState.player.inventory).length === 0) {
        return getOpportunityEvent(); // Fallback to opportunity event
    }
    
    const events = [
        {
            title: "Ham Quality Inspection",
            description: "A health inspector is checking the quality of ham in the area.",
            choices: [
                {
                    text: "Submit your ham for inspection",
                    effect: () => {
                        // 70% chance of passing inspection
                        if (Math.random() < 0.7) {
                            // Quality certification increases ham value
                            const hamIds = Object.keys(gameState.player.inventory);
                            hamIds.forEach(hamId => {
                                gameState.marketPrices[hamId] = Math.floor(gameState.marketPrices[hamId] * 1.2);
                            });
                            
                            // Update UI
                            displayMarket();
                            
                            return "Your ham passed inspection! The certification has increased its value.";
                        } else {
                            // Failed inspection - lose some ham
                            const hamIds = Object.keys(gameState.player.inventory);
                            const randomHamId = hamIds[Math.floor(Math.random() * hamIds.length)];
                            const randomHam = gameState.hamTypes.find(ham => ham.id === randomHamId);
                            
                            // Calculate how much is confiscated
                            const confiscatedAmount = Math.min(
                                gameState.player.inventory[randomHamId],
                                1 + Math.floor(Math.random() * 2)
                            );
                            
                            // Remove from inventory
                            gameState.player.inventory[randomHamId] -= confiscatedAmount;
                            if (gameState.player.inventory[randomHamId] <= 0) {
                                delete gameState.player.inventory[randomHamId];
                            }
                            
                            // Update UI
                            updateInventoryDisplay();
                            
                            return `Your ${randomHam.name} failed inspection! ${confiscatedAmount} units were confiscated.`;
                        }
                    }
                },
                {
                    text: "Avoid the inspection",
                    effect: () => {
                        // 50% chance of getting caught
                        if (Math.random() < 0.5) {
                            // Fine for avoiding inspection
                            const fine = 100 + Math.floor(Math.random() * 200);
                            gameState.player.cash -= fine;
                            
                            // Update UI
                            updatePlayerStats();
                            
                            return `You were caught avoiding inspection and fined $${fine}!`;
                        } else {
                            return "You successfully avoided the inspection.";
                        }
                    }
                }
            ]
        },
        {
            title: "Storage Upgrade Opportunity",
            description: "A local merchant offers to improve your ham storage conditions.",
            choices: [
                {
                    text: "Pay for storage upgrade",
                    effect: () => {
                        // Calculate cost
                        const cost = 200 + Math.floor(Math.random() * 300);
                        
                        // Check if player has enough cash
                        if (gameState.player.cash < cost) {
                            return `You don't have enough cash to pay $${cost} for the storage upgrade!`;
                        }
                        
                        // Pay for upgrade
                        gameState.player.cash -= cost;
                        
                        // Increase ham value due to better storage
                        const hamIds = Object.keys(gameState.player.inventory);
                        hamIds.forEach(hamId => {
                            gameState.marketPrices[hamId] = Math.floor(gameState.marketPrices[hamId] * 1.15);
                        });
                        
                        // Update UI
                        updatePlayerStats();
                        displayMarket();
                        
                        return `You paid $${cost} for better ham storage. Your ham is now worth more!`;
                    }
                },
                {
                    text: "Decline the offer",
                    effect: () => {
                        return "You decide to decline the storage upgrade offer.";
                    }
                }
            ]
        },
        {
            title: "Bulk Sale Opportunity",
            description: "A restaurant owner wants to buy ham in bulk at a slightly reduced price.",
            choices: [
                {
                    text: "Sell ham in bulk",
                    effect: () => {
                        // Check if player has enough ham
                        const hamIds = Object.keys(gameState.player.inventory);
                        if (hamIds.length === 0) {
                            return "You don't have any ham to sell!";
                        }
                        
                        // Select a random ham type from inventory
                        const randomHamId = hamIds[Math.floor(Math.random() * hamIds.length)];
                        const randomHam = gameState.hamTypes.find(ham => ham.id === randomHamId);
                        
                        // Calculate bulk sale details
                        const quantity = Math.min(gameState.player.inventory[randomHamId], 3);
                        const pricePerUnit = Math.floor(gameState.marketPrices[randomHamId] * 0.9);
                        const totalEarned = quantity * pricePerUnit;
                        
                        // Remove from inventory
                        gameState.player.inventory[randomHamId] -= quantity;
                        if (gameState.player.inventory[randomHamId] <= 0) {
                            delete gameState.player.inventory[randomHamId];
                        }
                        
                        // Add cash
                        gameState.player.cash += totalEarned;
                        
                        // Update UI
                        updatePlayerStats();
                        updateInventoryDisplay();
                        
                        return `You sold ${quantity} ${randomHam.name} in bulk for $${totalEarned}!`;
                    }
                },
                {
                    text: "Decline the offer",
                    effect: () => {
                        return "You decide to decline the bulk sale offer.";
                    }
                }
            ]
        }
    ];
    
    // Return a random event
    return events[Math.floor(Math.random() * events.length)];
}

// Get a random opportunity event
function getOpportunityEvent() {
    const events = [
        {
            title: "Investment Opportunity",
            description: "A local businessman offers you an investment opportunity.",
            choices: [
                {
                    text: "Invest in the opportunity",
                    effect: () => {
                        // Calculate investment amount
                        const investmentAmount = 200 + Math.floor(Math.random() * 300);
                        
                        // Check if player has enough cash
                        if (gameState.player.cash < investmentAmount) {
                            return `You don't have enough cash to invest $${investmentAmount}!`;
                        }
                        
                        // Make investment
                        gameState.player.cash -= investmentAmount;
                        
                        // 60% chance of success
                        if (Math.random() < 0.6) {
                            // Calculate return (120-180% of investment)
                            const returnAmount = Math.floor(investmentAmount * (1.2 + Math.random() * 0.6));
                            gameState.player.cash += returnAmount;
                            
                            // Update UI
                            updatePlayerStats();
                            
                            return `Your investment was successful! You earned $${returnAmount - investmentAmount} profit.`;
                        } else {
                            // Update UI
                            updatePlayerStats();
                            
                            return `Your investment failed! You lost $${investmentAmount}.`;
                        }
                    }
                },
                {
                    text: "Decline the investment",
                    effect: () => {
                        return "You decide to decline the investment opportunity.";
                    }
                }
            ]
        },
        {
            title: "Ham Auction",
            description: "A rare ham auction is taking place in town.",
            choices: [
                {
                    text: "Participate in the auction",
                    effect: () => {
                        // Calculate auction cost
                        const auctionCost = 300 + Math.floor(Math.random() * 400);
                        
                        // Check if player has enough cash
                        if (gameState.player.cash < auctionCost) {
                            return `You don't have enough cash to bid $${auctionCost} at the auction!`;
                        }
                        
                        // Pay for auction
                        gameState.player.cash -= auctionCost;
                        
                        // Get a random premium ham
                        const premiumHams = gameState.hamTypes.filter(ham => ham.basePrice > 30);
                        const randomHam = premiumHams[Math.floor(Math.random() * premiumHams.length)];
                        
                        // Add to inventory
                        if (!gameState.player.inventory[randomHam.id]) {
                            gameState.player.inventory[randomHam.id] = 0;
                        }
                        gameState.player.inventory[randomHam.id] += 2;
                        
                        // Update UI
                        updatePlayerStats();
                        updateInventoryDisplay();
                        
                        return `You won the auction! You received 2 ${randomHam.name} for $${auctionCost}.`;
                    }
                },
                {
                    text: "Skip the auction",
                    effect: () => {
                        return "You decide to skip the ham auction.";
                    }
                }
            ]
        },
        {
            title: "Gambling Opportunity",
            description: "A street gambler offers you a chance to double your money.",
            choices: [
                {
                    text: "Gamble a small amount",
                    effect: () => {
                        // Calculate gambling amount (10-15% of cash)
                        const gamblingAmount = Math.floor(gameState.player.cash * (0.1 + Math.random() * 0.05));
                        
                        // Check if player has enough cash
                        if (gameState.player.cash < gamblingAmount) {
                            return "You don't have enough cash to gamble!";
                        }
                        
                        // Make bet
                        gameState.player.cash -= gamblingAmount;
                        
                        // 45% chance of winning
                        if (Math.random() < 0.45) {
                            // Calculate winnings (2x bet)
                            const winnings = gamblingAmount * 2;
                            gameState.player.cash += winnings;
                            
                            // Update UI
                            updatePlayerStats();
                            
                            return `You won the gamble! You earned $${winnings - gamblingAmount} profit.`;
                        } else {
                            // Update UI
                            updatePlayerStats();
                            
                            return `You lost the gamble! You lost $${gamblingAmount}.`;
                        }
                    }
                },
                {
                    text: "Decline to gamble",
                    effect: () => {
                        return "You wisely decide not to gamble your money.";
                    }
                }
            ]
        },
        {
            title: "Ham Festival",
            description: "The annual Ham Festival is happening in town!",
            choices: [
                {
                    text: "Attend the festival",
                    effect: () => {
                        // Increase all ham prices due to festival demand
                        gameState.hamTypes.forEach(ham => {
                            gameState.marketPrices[ham.id] = Math.floor(gameState.marketPrices[ham.id] * 1.25);
                        });
                        
                        // Update UI
                        displayMarket();
                        
                        return "The Ham Festival has increased demand! Ham prices have gone up by 25%.";
                    }
                },
                {
                    text: "Skip the festival",
                    effect: () => {
                        return "You decide to skip the Ham Festival this year.";
                    }
                }
            ]
        }
    ];
    
    // Return a random event
    return events[Math.floor(Math.random() * events.length)];
}

// Create a custom event for day advancement
const dayAdvancedEvent = new Event('dayAdvanced');

// Override the advanceDay function to dispatch the event
const originalAdvanceDay = window.advanceDay;
window.advanceDay = function() {
    // Call original function
    originalAdvanceDay();
    
    // Dispatch day advanced event
    document.dispatchEvent(dayAdvancedEvent);
};

// Initialize events system when DOM is loaded
document.addEventListener('DOMContentLoaded', initEvents);