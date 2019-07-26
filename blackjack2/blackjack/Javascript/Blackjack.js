//Deck Variables
var deck=[],
    playerScore,
    dealerScore,
    enValue = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","King","Queen"],
    suits = [
        {
            name: "Gravity Falls",
            values: ['Dipper','Mabel','Soos','Waddles']
        },
        {
            name: "Standard",
            values: ["Clubs","Diamonds","Hearts","Spades"]
        },
        {
            name: "Zelda",
            values:   ["Courage", "Wisdom", "Power", "Cucco"]
        },
        {
            name: "Pokemon",
            values: ['Bulbasaur', 'Charmander', 'Pikachu', 'Squirtle']
        }
    ],
    // gravity={
    //     name: "Gravity Falls",
    //     suits: ['Dipper','Mabel','Soos','Waddles']
    // };
    // stnd={
    //     name: "Standard",
    //     suits: ["Clubs","Diamonds","Hearts","Spades"]
    // };
    // zel={
    //     name: "Zelda",
    //     suits:   ["Courage", "Wisdom", "Power", "Cucco"]
    // };
    // poke={
    //     name: "Pokemon",
    //     suits: ['Bulbasaur', 'Charmander', 'Pikachu', 'Squirtle']
    // };
    playerHand=[],
    dealerHand=[],
    suit=suits[1];

//DOM Variables
var dealerScoreBox = document.getElementById("dealerScore"),
    stayButton = document.getElementById('stayButton'),
    start = document.getElementById('startButton'),
    hitButton = document.getElementById('hitButton'),
    playerCards = document.getElementById("playersCards"),
    dropDown = document.getElementById('myDropdown'),
    dealerCards = document.getElementById("dealersCards"),
    playerScoreBox = document.getElementById("playerScore"),
    optionsBox = document.getElementById('optBox'),
    options = document.getElementById('options'),
    playerBox = document.getElementById('playerContainer'),
    table = document.getElementById('table'),
    dealerBox = document.getElementById('dealerContainer');

//Adds suit buttons to the dropdown box based on given options
function createButton(){
    for(let i = 0; i<suits.length; i++){
        var button = document.createElement('button');
        button.innerText=suits[i].name;
        button.classList.add("buttonSetUp", "dropdownButton");
        dropDown.appendChild(button);
        button.onclick= function(){
            suit = suits[i]
        }
    }
}

createButton();

//When the start button is clicked the prepations for the BlackJack game begin
start.addEventListener('click', function(){
    //Clears the previous cards in the player and dealer space
    playerCards.innerHTML='';
    dealerCards.innerHTML='';
    createDeck(suit.values,enValue);
    shuffle(deck);
    playerHand =[draw(), draw()];
    dealerHand=[draw(), draw()];
    //Shows the player's and dealer's areas 
    playerBox.classList.remove('hide');
    dealerBox.classList.remove('hide');
    //Hides the options and start buttons
    options.classList.add('hide');
    start.classList.add('hide');
    //Shows the hit and stay buttons
    hitButton.classList.remove('hide');
    stayButton.classList.remove('hide');
    showPlayerHand();
    showDealerHand();
    playerScore = totalScore(playerHand);
    dealerScore = totalScore(dealerHand);
    //Determines if the player or dealer has BlackJack based on thier first two drawn cards.
    if(playerScore == 21){
        win();
    }else if(dealerScore == 21){
        lose();
    }else if(playerScore == 21 && dealerScore == 21){
        tie();
    }
    showPlayerScoreBox();
    showDealerScoreBox();
})

//Shows or hides the list of options in the BlackJack game
options.addEventListener('click', function() {
    // if(optionsBox.classList.contains('hide')){
    //       optionsBox.classList.remove('hide');

    //   }else{
    //       optionsBox.classList.add('hide');
    // }
    document.getElementById("myDropdown").classList.toggle("hide");
})
  
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('#options')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (!openDropdown.classList.contains('hide')) {
          openDropdown.classList.add('hide');
        }
      }
    }
}

//When the Hit button is clicked, will give the player another card and update thier hand and score.
hitButton.addEventListener('click', function(){
    playerHand.push(draw());
    playerCards.innerHTML="";
    showPlayerHand();
    playerScore = totalScore(playerHand);
    showPlayerScoreBox();
    isOver(playerScore);
})

//When the Stay button is clicked, will let the dealer draw until they have hit at least 17 points, then updates thier hand and score.
//Finally it will call a function to determine the winner.
stayButton.addEventListener('click', function(){
    while(dealerScore < 17){
        dealerHand.push(draw());
        dealerCards.innerHTML="";
        showDealerHand();
        dealerScore = totalScore(dealerHand);
        showDealerScoreBox();
    }
    determineWinner(playerScore, dealerScore);
})

//DECK CREATION
//places each card in the deck array
function createDeck(suits,values){
    for(var i=0;i<suits.length;i++){
        for(var j =0;j<values.length;j++){
            var card={
                suit: suits[i],
                value: values[j]
            };
            deck.push(card);
        }
    }
}
//SHUFFLE
//Switches different cards in random spaces within the deck array 
function shuffle(deck){
    var temp;
    for(let i=0; i<deck.length; i++){
        var randomNum = Math.floor(Math.random() * deck.length);
        temp = deck[i];
        deck[i]=deck[randomNum];
        deck[randomNum]=temp;
    }
}

//This function removes the top card in the deck array and returns it to the player's or dealer's hand
function draw(){
    return deck.shift();
}

//Shows the player's current hand
function showPlayerHand(){
    for(let i = 0; i<playerHand.length; i++){ 
        //Create a card div and give it an ID.
        var newSpace = document.createElement("div"),
            idNum=i+1;
            id="PlayerCard " + idNum;
        newSpace.setAttribute('id', id);
        newSpace.classList.add('cardDesign');
        var card = playerHand[i];
        //Add in the card text
        newSpace.appendChild(createCardText(card));
        //Add in the card picture
        newSpace.appendChild(createCardImg(card));
        //Add our newly created card to the DOM
        playerCards.appendChild(newSpace);
    }
}

//Shows the dealer's current hand
function showDealerHand(){
    for(let i=0; i<dealerHand.length; i++){
        var newSpace = document.createElement("div");
            idNum = i+1;
            id = "DealersCard " + idNum;
        newSpace.setAttribute('id', id);
        newSpace.classList.add('cardDesign');
        var card = dealerHand[i];
        //Add in the card text
        newSpace.appendChild(createCardText(card));
        //Add in the card picture
        newSpace.appendChild(createCardImg(card));
        //Add our newly created card to the DOM
        dealerCards.appendChild(newSpace);
    }
}

//Creates the text of the card
function createCardText(card){
    var textBox = document.createElement('div'),
        text = card.value + " of " + card.suit;
    textBox.innerText =text;
    textBox.classList.add('cardText')
    return textBox;
}

//Pulls the an image for the card from local folder
function createCardImg(card){
    var picBlock = document.createElement('div'),
        img = new Image(150, 150);
    img.src = determineImg(card.suit);
    picBlock.appendChild(img);
    return picBlock;
}

//Determines which image to use based on the suit of the card
function determineImg(cardSuit){
    var name = suit.name,
        tempSuit = suit.values;
    switch(cardSuit){
        case tempSuit[0]:
            return '../Images/' + name + '/' + tempSuit[0] + '.png';
        case tempSuit[1]:
            return '../Images/' + name + '/' + tempSuit[1] + '.png';
        case tempSuit[2]:
            return '../Images/' + name + '/' + tempSuit[2] + '.png';
        case tempSuit[3]:
            return '../Images/' + name + '/' + tempSuit[3] + '.png';
    }
}

//Shows the player's current score
function showPlayerScoreBox(){
    playerScoreBox.innerHTML="";
    var newSpace = document.createElement('label'),
        scoreInfo="Score: " + playerScore;
    newSpace.innerText =scoreInfo;
    playerScoreBox.appendChild(newSpace);
}

//Shows the dealer's current score
function showDealerScoreBox(){
    dealerScoreBox.innerHTML="";
    var newSpace = document.createElement('label'),
        scoreInfo="Score: " + dealerScore;
    newSpace.innerText =scoreInfo;
    dealerScoreBox.appendChild(newSpace);
}

//Determines the score of the player's hand and the dealer's hand 
function totalScore(hand){
    var total = 0;
    var isAce = false;
    for(let i =0; i<hand.length; i++){
        var cardValue = hand[i].value;
        switch(cardValue){
            case "Ace":
                isAce=true;
                total+=1;
                break;
            case "Two":
                total+=2;
                break;
            case "Three":
                total+=3;
                break;
            case "Four":
                total+=4;
                break;
            case "Five":
                total+=5;
                break;
            case "Six":
                total+=6;
                break;
            case "Seven":
                total+=7;
                break;
            case "Eight":
                total+=8;
                break;
            case "Nine":
                total+=9;
                break;
            default:
                total+=10;
        }
    }
    //Determines the worth of an ace.
    if(isAce && total+10<=21) {
        total +=10
    }
    return total;
}

//This function determins if the player is ever over the number 21 during thier hit selection
function isOver(player){
    if(player > 21){
        lose();
    }
}

//Compares the dealer's and player's final scores to determine who has the highest one.
function determineWinner(player,dealer){
    if(dealer > 21 || player>dealer){
        win();
    }else if(player<dealer){
        lose();
    }else{
        tie();
    }
}

//Calls a tie between dealer and player
function tie(){
    var newSpace=document.createElement('h3'),
            message = 'TIEEEE!';
        newSpace.innerText=message;
        playerCards.appendChild(newSpace);
        endGame();
}

//Calls the player as the winner
function win(){
    var newSpace=document.createElement('h2'),
        message = 'YOU WIN, WOW!';
    newSpace.innerText=message;
    playerCards.appendChild(newSpace);
    endGame();
}

//Calls the player as the loser
function lose(){
    var newSpace=document.createElement('h1'),
        message = 'YOU LOSE, LOSER!';
    newSpace.innerText=message;
    playerCards.appendChild(newSpace);
    endGame();
}

//Removes the hit and stay buttons and allows the player to play again
function endGame(){
    hitButton.classList.add('hide');
    stayButton.classList.add('hide');
    start.classList.remove('hide');
    options.classList.remove('hide');   
    deck =[];
}

