"use strict";

//Compare each element of aray to the word and return it
function wordMatch( element ){
    if(element.toLowerCase() == word.toLowerCase()){
        return true;
    }
    else {
        return false;
    }    
}

var sentence = prompt("Hi! Give me a sentence :)");
var word = prompt("Now, give me a word and I'll tell you the number of times it occurs in the sentence!");
var count = 0; //initialize count as 0 to later use to store number of occurences 

//Convert the sentence String into array
var sentenceArr = sentence.split(" ");

//storing returned filtered array in variable
let repeatedWords = sentenceArr.filter( wordMatch );

//Printing the length of array to tell the number of times that word occured
alert("The number of times word "+ word +" occurs is: "+ repeatedWords.length);
