"use strict";

var sentence = prompt("Hi! Please write a sentence and I will reverse it for you!");

//converting String into Array
var sentenceArr = sentence.split(" ");

//Initializing an empty String to store words and make reversed sentence
var reverse = "";

//Repeat popping out last word and adding it to a new string till Array is not empty
while(sentenceArr.length>0){
    reverse = reverse + " " +sentenceArr.pop(); 
}

alert("The reversed sentence is:\n "+reverse);