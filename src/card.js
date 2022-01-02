class Card {
    constructor(suit, rank, value=null) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
    }

    getCardName = () => {
        return this.rank + " of " + this.suit;
    }
}