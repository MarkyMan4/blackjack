// all interaction in the UI is handled here

let deck = new Deck();
deck.shuffle();

let player = new Player();
let dealer = new Player();

// this mainly comes into play when the player splits
// 0 is the primary hand and 1 is the split hand
// if a player can split multiple times (need to check blackjack rules) this would keep incrementing
let handBeingPlayed = 0;
let playerSplit = false;

let cardDisplay = document.getElementById("card-display"); // area that displays cards on the table
let playerCardDisplay = document.getElementById("player-cards");
let dealerCardDisplay = document.getElementById("dealer-cards");
let startBtn = document.getElementById("start-btn"); // button to start a round
let pointDisplay = document.getElementById("point-display"); // UI display of points
let controls = document.getElementById("controls"); // group of controls to hit or stay
let betEntry = document.getElementById("bet-entry"); // group of controls for placing bet
let betDisplay = document.getElementById("bet-display"); // UI display of the player's bet
let roundResults = document.getElementById("round-results"); // UI display for winner of the round
let splitBtn = document.getElementById("split-btn");
let splitDisplay = document.getElementById("split-display");
let splitCardDisplay = document.getElementById("split-cards");
let activeHandDisplay = document.getElementById("active-hand-display");

const updatePlayerCardDisplay = () => {
    let html = "";
    player.cards.forEach(card => {
        html += "<div>" + card.getCardName() + "</div>";
    });

    html += "<br />"
    html += "Total: " + (player.getCardTotal() <= 21 ? player.getCardTotal() : "bust"); // show "bust" if total is over 21

    playerCardDisplay.innerHTML = html;
}

const updateDealerCardDisplay = (showFinalHand=false) => {
    let html = "";
    dealer.cards.forEach((card, indx) => {
        if(indx === 0 && !showFinalHand)
            html += "<div>--face down--</div>"
        else
            html += "<div>" + card.getCardName() + "</div>";
    });

    if(showFinalHand) {
        html += "<br />"
        html += "Total: " + (dealer.getCardTotal() <= 21 ? dealer.getCardTotal() : "bust"); // show "bust" if total is over 21
    }

    dealerCardDisplay.innerHTML = html;
}

const updateSplitCardDisplay = () => {
    let html = "";
    player.splitCards.forEach(card => {
        html += "<div>" + card.getCardName() + "</div>";
    });

    html += "<br />"
    html += "Total: " + (player.getSplitCardTotal() <= 21 ? player.getSplitCardTotal() : "bust"); // show "bust" if total is over 21

    splitCardDisplay.innerHTML = html;
}

const getCard = () => {
    let card = deck.dealCard();

    if(!card) {
        deck.resetDeck();
        deck.shuffle();
        card = deck.dealCard();
    }

    return card;
}

const updatePointDisplay = () => {
    pointDisplay.innerHTML = "Points available: " + player.points;
}

const dealHands = () => {
    // deal two cards to player and dealer and display them
    for(let i = 0; i < 2; i++) {
        player.giveCard(getCard());
        dealer.giveCard(getCard());
    }

    updatePlayerCardDisplay();
    updateDealerCardDisplay();
}

const startRound = () => {
    // hide start button and cards, show the bet entry controls
    startBtn.style.display = "none";
    roundResults.style.display = "none";
    cardDisplay.style.visibility = "hidden";
    betEntry.style.display = "block";
    splitDisplay.style.display = "none"; // hide split hand display
    playerSplit = false;

    handBeingPlayed = 0; // reset to playing the primary hand

    // deal cards even though they are invisible until bets are placed
    // this is so the layout doesn't get messed up when the card display section is empty
    dealHands();

    updatePointDisplay();
}

const decreaseBet = () => {
    // don't allow bet to go below 10 (minimum bet defined by the Player class)
    if(player.bet > 10) {
        player.bet -= 10;
        betDisplay.innerHTML = player.bet;
    }
}

const increaseBet = () => {
    // 200 is the max bet allowed
    if(player.bet < 200) {
        player.bet += 10;
        betDisplay.innerHTML = player.bet;
    }
}

const placeBet = () => {
    // subtract bet from player points and refresh the display
    player.points -= player.bet;
    updatePointDisplay();

    // hide controls for betting and show controls to hit/stay
    betEntry.style.display = "none";
    controls.style.display = "block";

    // show the split button if the two cards the player was dealt are the same rank (i.e. two kings)
    if(player.cards[0].rank === player.cards[1].rank) 
        splitBtn.style.visibility = "visible";

    // show the cards that have been dealt
    cardDisplay.style.visibility = "visible";
}

const stay = () => {
    if(!playerSplit || handBeingPlayed >= 1) {
        endRound();
    }
    else {
        handBeingPlayed++;
        activeHandDisplay.innerHTML = "Playing second hand";
    }
}

const endRound = () => {
    // hide controls and play the dealers
    controls.style.display = "none";
    roundResults.style.display = "block";
    let mainHandResult = ''; // win, lose or draw
    let splitHandResult = '';

    if(player.getCardTotal() <= 21 || (playerSplit && player.getSplitCardTotal() <= 21)) {
        // if player didn't bust, dealer will play their hand
        playDealerHand();

        // determine the outcome of the players main hand
        if((player.getCardTotal() > 21 && dealer.getCardTotal() > 21) || player.getCardTotal() === dealer.getCardTotal()) {
            // both bust or both have the same score
            mainHandResult = 'draw';
            player.points += player.bet; // give the  player their bet back
        }
        else if(player.getCardTotal() <= 21 && (dealer.getCardTotal() > 21 || player.getCardTotal() > dealer.getCardTotal())) {
            // player didn't bust and dealer did bust
            // OR player and dealer didn't bust, but player has higher score
            mainHandResult = 'win';
            player.points += (player.bet * 2); // award player their winnings
        }
        else { 
            mainHandResult = 'lose';
        }

        // determine the outcome of the players split hand if they have one
        if(playerSplit) {
            if((player.getSplitCardTotal() > 21 && dealer.getCardTotal() > 21) || player.getSplitCardTotal() === dealer.getCardTotal()) {
                // both bust or both have the same score
                splitHandResult = 'draw';
                player.points += player.bet; // give the  player their bet back
            }
            else if(player.getSplitCardTotal() <= 21 && (dealer.getCardTotal() > 21 || player.getSplitCardTotal() > dealer.getCardTotal())) {
                // player didn't bust and dealer did bust
                // OR player and dealer didn't bust, but player has higher score
                splitHandResult = 'win';
                player.points += (player.bet * 2); // award player their winnings
            }
            else { 
                splitHandResult = 'lose';
            }
        }
    }
    else {
        // if player busted with both hands, dealer automatically wins
        mainHandResult = 'lose';
        splitHandResult = 'lose';
    }

    updatePointDisplay();

    // show the dealer's final hand and score
    updateDealerCardDisplay(true);

    if(mainHandResult === 'win' && (splitHandResult === 'win' || splitHandResult === '')) { // split hand empty string means they didn't split
        roundResults.innerHTML = "You won!";
    }
    else if(mainHandResult === 'win' || splitHandResult === 'win') { // winning one hand means the player broke even
        roundResults.innerHTML = "You broke even";
    }
    else if(mainHandResult === 'draw' && (splitHandResult === 'draw' || splitHandResult === '')) { // draw for both hands is breaking even
        roundResults.innerHTML = "You broke even";
    }
    else {
        roundResults.innerHTML = "You lost!";
    }

    // at the end of the round, show the button to start a new round, reset the player's bet,
    // and reset the cards in both player and dealer's hands

    activeHandDisplay.style.display = "none"; // hide the output telling which hand the player is actively playing
    startBtn.style.display = "block";
    player.bet = 10;
    betDisplay.innerHTML = player.bet; // reset display to the default player bet
    player.resetCards();
    dealer.resetCards();
}

const hit = () => {
    if(handBeingPlayed == 0) {
        player.giveCard(getCard());
        updatePlayerCardDisplay();

        if(player.getCardTotal() > 21)
            stay();
    }
    else {
        player.giveSplitCard(getCard());
        updateSplitCardDisplay();

        if(player.getSplitCardTotal() > 21)
            stay();
    }
}

const playDealerHand = () => {
    while(dealer.getCardTotal() <= 16) {
        dealer.giveCard(getCard());
    }
}

const split = () => {
    playerSplit = true;
    player.split();
    splitDisplay.style.display = "block"; // show split hand display
    splitBtn.style.visibility = "hidden"; // hide the split button
    activeHandDisplay.style.display = "block";
    activeHandDisplay.innerHTML = "Playing first hand";

    // subtract bet from player points and refresh the display
    player.points -= player.bet;
    updatePointDisplay();

    // update both player card displays
    updatePlayerCardDisplay();
    updateSplitCardDisplay();
}
