class Deck {
    suits = [
        'spades',
        'hearts',
        'diamonds',
        'clubs'
    ]

    // default to blackjack card values
    ranksAndValues = {
        'ace': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
        'ten': 10,
        'jack': 10,
        'queen': 10,
        'king': 10
    }

    constructor(ranksAndValues=null) {
        if(ranksAndValues) {
            this.ranksAndValues = ranksAndValues;
        }

        this.resetDeck();
    }

    resetDeck = () => {
        let cards = [];

        this.suits.forEach(suit => {
            Object.keys(this.ranksAndValues).forEach(rank => {
                cards.push(new Card(suit, rank, this.ranksAndValues[rank]));
            })
        });

        this.cards = cards;
    }

    shuffle = () => {
        this.cards.sort((first, second) => Math.random() - 0.5);
    }

    // remove a card from the deck
    // return None if the deck is empty. The caller can use reset_deck() to get a full deck again
    dealCard = () => {
        let card = null;

        if(this.cards.length > 0)
            card = this.cards.pop();

        return card;
    }
}