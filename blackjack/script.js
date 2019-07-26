//DOM VARIABLES
var newGameButton = document.getElementById("newGameButton"),
    hitButton = document.getElementById("hitButton"),
    stayButton = document.getElementById("stayButton");
    message = document.getElementById("message"),
    playerText = document.getElementById("playerScore"),
    dealerText = document.getElementById("dealerScore"),
    overallScore = document.getElementById("overallPlayerScore"),
    currentBet = document.getElementById("currentBet"),
    playerCards = document.getElementById("playerCards"),
    dealerCards = document.getElementById("dealerCards"),
    options = document.getElementById('options'),
    optionSettingsBox = document.getElementById('optionSettingsBox'),
    dropDownBox = document.getElementById('dropDownBox'),
    normal = document.getElementById('standard'),
    smashBros = document.getElementById('smashBros'),
    dragonball = document.getElementById('dragonBall'),
    baseball= document.getElementById('baseBall');

//GAME VARIABLES
var suits = [
        {
            name:'Standard',
            values: ['Spades','Hearts','Diamonds','Clubs']
        },
        {
            name: 'Smashbros',
            values: ['mario','kirby','joker','sonic']
        },
        {
            name: 'Dragonball',
            values: ['Goku','Vegeta', 'Krillin', 'Hercule']
        },
        {
            name: 'Baseball',
            values: ['braves','dodgers','yankees','astros']
        },
        {
            name: 'Apples',
            values: ['Crab','Fuji','Granny Smith','Red Delicious']
        }
    ],
    values = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Jack','Queen','King']
    suit= suits[0],
    deck = [],
    playerHand = [],
    playerScore = 0,
    overallPlayerScore = 100;
    dealerHand = [],
    dealerScore = 0,
    bet = 10;

//START UP CALLS
createOptionButtons();

//BUTTON CLICKS
options.addEventListener('click',function(){
    if(optionSettingsBox.classList.contains('hide')){
        optionSettingsBox.classList.remove('hide');
    }else{
        optionSettingsBox.classList.add('hide');
    }
});

function createOptionButtons(){

    for(let i=0;i<suits.length;i++){
        var button=document.createElement('button');
        button.innerText=suits[i].name;
        button.classList.add('optionButtons');
        button.onclick=function(){
            suit=suits[i];
        }
        dropDownBox.appendChild(button);
    }
}

newGameButton.addEventListener('click', function() {
    deck=[];
    makeDeck();
    shuffleDeck();
    playerHand = [deal(),deal()];
    dealerHand = [deal(),deal()];

    message.innerHTML="Are you feeling lucky?";

    displayPlayerStuff();
    displayDealerStuff();

    optionSettingsBox.classList.add('hide');
    newGameButton.classList.add('hide');
    hitButton.classList.remove('hide');
    stayButton.classList.remove('hide');
    options.classList.add('hide');
    message.classList='';

    if((dealerScore==21)&&(playerScore==21)){
        tie();
    }
    else if(playerScore==21){
        playerWin();
    }
    else if(dealerScore == 21){
        dealerWin();
    }
});
// button event
hitButton.addEventListener('click', function()  {
    //displayDealerStuff();
    playerHand.push(deal());
    displayPlayerStuff();
    if(playerScore>21){
        dealerWin();
    }
    tie();
});

stayButton.addEventListener('click', function() {
    //displayPlayerStuff();
    while(dealerScore<17){
        dealerHand.push(deal());
        displayDealerStuff();
    }

    if((dealerScore>21)||(dealerScore<playerScore)){
        playerWin();
    } else if(dealerScore>playerScore){
        dealerWin();
    } else {
        tie();
    }
});

//GETTING STARTED FUNCTIONS
function makeDeck(){
    var vals = suit.values;
    for (let i=0; i<vals.length; i++){
        for (let j=0; j<values.length; j++){
            var card = {
                suit: vals[i],
                value: values[j]
            }
            deck.push(card);
        }
    }
}
function selectImage(cardSuit){
    // switch(cardSuit){
    //     case suit.values[0]:
    //         return 'images/'+suit.name+'/'+suit.values[0]+'.png'
    //     case suit.values[1]:
    //         return 'images/'+suit.name+'/'+suit.values[1]+'.png'
    //     case suit.values[2]:
    //         return 'images/'+suit.name+'/'+suit.values[2]+'.png'
    //     case suit.values[3]:
    //         return 'images/'+suit.name+'/'+suit.values[3]+'.png'
    // } 
    var vals = suit.values;
    for(let i=0;i<vals.length;i++){
        if(cardSuit===vals[i]){
            return 'images/'+suit.name+'/'+vals[i]+'.png'
        }    
    }
}
function createCard(card){
    
    var cardText=document.createElement('div'),
        cardBox = document.createElement('div'),
        img = document.createElement('img');
        text = card.value +' of '+ card.suit;    
    cardText.textContent=text;
    cardText.classList.add('padding');
    cardBox.appendChild(cardText); 
    img.src=selectImage(card.suit);
    img.classList.add('img', 'padding');
    cardBox.classList.add('card', 'padding');
    cardBox.appendChild(img);
    return cardBox;
}
function createPlayerCards(cards,name){
    playerCards.innerHTML='';
    for(let i = 0;i<cards.length;i++){
        var card = cards[i],
            cardBox = createCard(card),
            id = name + i;
        cardBox.setAttribute('id', id);
        playerCards.appendChild(cardBox);
    }
}

function createDealerCards(cards,name){
    dealerCards.innerHTML='';
    for(let i = 0;i<cards.length;i++){
        var card = cards[i],
            cardBox = createCard(card),
            id = name + i;
        cardBox.setAttribute('id', id);
        dealerCards.appendChild(cardBox);
    }
}
//cards indecies are randomly swapped
function shuffleDeck(){
    for(let i = 0;i<deck.length;i++){
        var random = Math.floor(Math.random()*52),
            temp = deck[random];
        deck[random]=deck[i];
        deck[i] = temp;
    }
}

function deal(){
    return deck.shift();
}

//SCORE FUNCTIONS
function convert(value){
    switch(value){
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
}

function displayPlayerStuff(){
    playerScore = getScore(playerHand);
    playerText.innerHTML = "Score: " + playerScore;
    overallScore.innerHTML = "Total Cash: $"+overallPlayerScore;
    currentBet.innerHTML = "Bet: $"+bet;
    createPlayerCards(playerHand,'playerCard');
}

function displayDealerStuff(){
    dealerScore = getScore(dealerHand);
    dealerText.innerHTML = "Score: " + dealerScore;
    createDealerCards(dealerHand,'dealerCard');
}

function getScore(cards){
    var ace = false,
        score = null;
    for(let i=0;i<cards.length;i++){
        var value = convert(cards[i].value);
        if(value == 1){
            ace = true;
        }
        score += value;
    }
    if (score+10 <=21 && ace){
        return score +=10;
    } else {
        return score;
    }
}

//WIN/LOSE FUNCTIONS
function playerWin(){
    message.innerHTML="You have won! Congrats!!!";
    message.classList.add('win');
    overallPlayerScore+=10;
    endGame();
}

function dealerWin(){
    message.innerHTML="You have lost! Man you suck!!!";
    message.classList.add('lose');
    overallPlayerScore-=10;
    endGame();
    //}
}
function tie(){
    if(playerScore==dealerScore){
        message.innerHTML="IT'S A TIE";
        message.classList.add('tie');
        endGame();
    }
}

//GENERAL USE FUNCTIONS
function endGame(){
    newGameButton.classList.remove('hide');
    hitButton.classList.add('hide');
    stayButton.classList.add('hide');
    if(overallPlayerScore<=0){
        newGameButton.classList.add('hide');
        message.innerHTML="You have lost all your money!!! Get lost Hobo";
    }
    //overallScore+=playerScore;
}

function restart(){
    playerHand = [];
    playerScore = 0;
    dealerHand =[];
    dealerScore = 0;
}