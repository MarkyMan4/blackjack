// all interaction in the UI is handled here

let deck = new Deck();
deck.shuffle();

let player = new Player();
let dealer = new Player();

let playerCardDisplay = document.getElementById("player-cards");
let dealerCardDisplay = document.getElementById("dealer-cards");
let startBtn = document.getElementById("start-btn"); // button to start a round
let pointDisplay = document.getElementById("point-display"); // UI display of points
let controls = document.getElementById("controls"); // group of controls to hit or stay
let betEntry = document.getElementById("bet-entry"); // group of controls for placing bet
let betDisplay = document.getElementById("bet-display"); // UI display of the player's bet
let roundResults = document.getElementById("round-results"); // UI display for winner of the round

let roundInProgress = false;

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

const getCard = () => {
    let card = deck.dealCard();

    if(!card) {
        deck.resetDeck();
        deck.shuffle();
        card = deck.dealCard();
    }

    return card;
}

const startRound = () => {
    // deal two cards to player and dealer and display them
    roundInProgress = true;

    for(let i = 0; i < 2; i++) {
        player.giveCard(getCard());
        dealer.giveCard(getCard());
    }

    updatePlayerCardDisplay();
    updateDealerCardDisplay();

    startBtn.style.visibility = "hidden";
    roundResults.style.visibility = "hidden";
    betEntry.style.visibility = "visible";

    // update point display
    pointDisplay.innerHTML = "Points available: " + player.points;
}

const decreaseBet = () => {
    // don't allow bet to go below 10 (minimum bet defined by the Player class)
    if(player.bet > 10) {
        player.bet -= 10;
        betDisplay.innerHTML = player.bet;
    }
}

const increaseBet = () => {
    player.bet += 10;
    betDisplay.innerHTML = player.bet;
}

const placeBet = () => {
    // subtract bet from player points and refresh the display
    player.points -= player.bet;
    pointDisplay.innerHTML = "Points available: " + player.points;

    // hide controls for betting and show controls to hit/stay
    betEntry.style.visibility = "hidden";
    controls.style.visibility = "visible";
}

const endRound = () => {
    // hide controls and play the dealers
    controls.style.visibility = "hidden";
    roundResults.style.visibility = "visible";

    if(player.getCardTotal() <= 21) {
        // if player didn't bust, dealer will play their hand
        playDealerHand();

        // show the dealer's final hand and score
        updateDealerCardDisplay(true);

        // determine the winner
        if(player.getCardTotal() > dealer.getCardTotal() || dealer.getCardTotal() > 21) {
            roundResults.innerHTML = "You won!";
            player.points += (player.bet * 2); // award player their winnings

            // update point display
            pointDisplay.innerHTML = "Points available: " + player.points;
        }
        else if(player.getCardTotal() < dealer.getCardTotal() && dealer.getCardTotal() <= 21) {
            roundResults.innerHTML = "You lost!";
        }
        else {
            roundResults.innerHTML = "Draw";
        }
    }
    else {
        // if player busted, dealer automatically wins
        // show the dealer's final hand and score
        updateDealerCardDisplay(true);
        roundResults.innerHTML = "You lost!";
    }

    // at the end of the round, show the button to start a new round, reset the player's bet,
    // and reset the cards in both player and dealer's hands
    startBtn.style.visibility = "visible";
    player.bet = 10;
    betDisplay.innerHTML = player.bet; // reset display to the default player bet
    player.resetCards();
    dealer.resetCards();
}

const hit = () => {
    player.giveCard(getCard());
    updatePlayerCardDisplay();

    if(player.getCardTotal() > 21)
        endRound();
}

const playDealerHand = () => {
    while(dealer.getCardTotal() <= 16) {
        dealer.giveCard(getCard());
    }
}
