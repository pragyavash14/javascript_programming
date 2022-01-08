"use strict";


var randomWords = ["ALEX", "MARTY", "GLORIA", "MELMAN", "JULIEN", "MORT", "RICO", "SKIPPER", "KOWALSKI", "PRIVATE"];
var index = 0; //set default as 1st element
var word;
var letter;
var lettersUsed = new Array();
var error=false;
var chances = 6; //initialize total chances 
var correctGuesses = 0; //intialize correct guesses as 0


//generate a random word out of the randomWords Array
function generateWord(){

    //This will generate a number between 0 to max index of array
    index = Math.floor(Math.random()*(randomWords.length));
    word = randomWords[index];
    console.log("word: ",randomWords[index])
    return word;
}

//Place blanks for the random word
function placeBlankSpaces(){

    //First, generate a random word and number of chances
    generateWord();

    document.getElementById("chance_left").innerHTML = chances;   

    //Then, clear the previous blanks
    document.getElementById("blanks").innerHTML="";

    //At last, create blank spaces for the word
    for(let i=0; i<word.length ; i++){   
        var blank = document.createElement("span");
        blank.setAttribute("id","letter"+(i));   //setting ID for each letter (letter0, letter1 etc.)
        blank.innerHTML = " _ ";
        document.getElementById("blanks").appendChild(blank);     
    }

}

//Error Handling of input letter 
function checkErrors(){


    letter = (document.getElementById("letter_input").value).toUpperCase();
    
    console.log("Input: ",letter);
 
    //error if input is not an alphabet and not used before
    if ((!/^[a-zA-Z]*$/g.test(letter)) && !(lettersUsed.includes(letter))){
        document.getElementById("error").innerHTML = "Invalid input! Please enter an alphabet";
        lettersUsed.push(letter);
        error = true;
    }
    //error if input is empty
    else if (!letter){
        document.getElementById("error").innerHTML = "You must enter a letter!";
        error = true;
    }
    //error if letter is already used
    else if(lettersUsed.includes(letter)){
        document.getElementById("error").innerHTML = "You have already used this!";
        error = true;
    }
    //no error
    else{
        error = false;
        lettersUsed.push(letter);
        document.getElementById("error").innerHTML="&nbsp";
    }

    
}

//Match the input with letters in random word
function play(){


        console.log("Play!\nLetters Used Array", lettersUsed)

        //check if letter is present in the word
        let match = false;
        var allChar = word.split("");

        for (let i=0; i<allChar.length; i++){
            //If match(es) found, replace the blank with letter in DOM // not repeated leters
            if(letter == allChar[i] && !error){
                document.getElementById("letter"+(i)).innerHTML = letter;
                match = true;
                correctGuesses++;
                console.log("correctGuesses",correctGuesses);
            }      
        }

        //If error OR no match found for a letter, change image and number of chances    
        if(error || !match){
            chances--;
            document.getElementById("chance_left").style.color = "tomato";
            document.getElementById("chance_left").innerHTML = chances;
            document.getElementById("hangman").src = "images/"+chances+"left.PNG";
            //Display all the letters used till now
            document.getElementById("incorrect_guesses").innerHTML = document.getElementById("incorrect_guesses").innerHTML + " " +letter;
    

        }

        //LOSE
        if(chances == 0){
            document.getElementById("error").innerHTML = "YOU LOSE! \nRefresh the page to play again :)";
            document.getElementById("submit").disabled = true;
        }
        //WIN
        if(correctGuesses == word.length){
            document.getElementById("error").innerHTML = "YOU WIN! \nRefresh the page to play again :)";
            document.getElementById("hangman").src = "images/win.PNG";
            document.getElementById("submit").disabled = true;
        }

        
}
