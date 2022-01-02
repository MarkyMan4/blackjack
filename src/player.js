class Player {
    constructor(initialPoints=100) {
        this.cards = [];
        this.points = initialPoints;
        this.bet = 10; // minimum bet is 10
    }

    giveCard = (card) => {
        this.cards.push(card);
    }

    resetCards = () => {
        this.cards = [];
    }

    // calculate the total of the current cards in the players hand
    getCardTotal = () => {
        let total = 0;

        this.cards.forEach(card => {
            // ace is worth 11 if it doesn't make the hand go over 21
            // otherwise it is worth 1 (it's default value according to the deck)
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
}