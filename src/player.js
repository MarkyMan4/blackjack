class Player {
    constructor(initialPoints=100) {
        this.cards = [];
        this.splitCards = []; // should only be populated when the player splits
        this.points = initialPoints;
        this.bet = 10; // minimum bet is 10
    }

    giveCard = (card) => {
        this.cards.push(card);
    }

    giveSplitCard = (card) => {
        this.splitCards.push(card);
    }

    resetCards = () => {
        this.cards = [];
    }

    // this assumes the player currently has two cards in their hand
    // takes one card and moves it to splitCards
    split = () => {
        this.splitCards.push(this.cards.pop());
    }

    // gets the total of a hand given a list of cards
    getHandCardTotal = (cards) => {
        let total = 0;

        // ace is worth 11 if it doesn't make the hand go over 21
        // otherwise it is worth 1 (it's default value according to the deck)
        // need to add the aces last since their value is dependent on the rest of the cards
        let cardsWithAcesLast = []; // create a new list so I don't change the order of cards for display
        let aces = [];

        // make separate lists of non-aces and aces, then combine them with the aces last
        cards.forEach(card => {
            if(card.rank === 'ace') {
                aces.push(card);
            }
            else {
                cardsWithAcesLast.push(card);
            }
        });

        cardsWithAcesLast = cardsWithAcesLast.concat(aces);

        // finally, calculate the total - counting the aces after static card values have been counted
        cardsWithAcesLast.forEach(card => {
            
            if(card.rank === 'ace') {
                if(total + 11 > 21)
                    total += 1;
                else
                    total += 11;
            }
            else 
                total += card.value;
        });

        return total;
    }

    // calculate the total of the current cards in the players hand
    getCardTotal = () => {
        return this.getHandCardTotal(this.cards);
    }

    // calculate the total of the current cards in the players hand
    getSplitCardTotal = () => {
        return this.getHandCardTotal(this.splitCards);
    }
}