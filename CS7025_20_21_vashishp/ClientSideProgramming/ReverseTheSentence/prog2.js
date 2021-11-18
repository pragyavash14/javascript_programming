"use strict";
//This function generates an Array of random numbers b/w 1-100. The size of array is passed as parameter
function generateRandom( number ){
    for(let i = 0 ; i < number ; i++){
        randoms.push(Math.floor((Math.random())*100) + 1);
        console.log("array: ",randoms);
    }
    return randoms;
}

//Calculates the mean of all elements in an array
function calculateAverage( array ){
    for(let i = 0 ; i < array.length ; i++){
        sum = sum + array[i];
        console.log("sum : ",sum)
    }
    let average = sum/(array.length);
    return average;
}

var randoms = new Array();
var count = 50;
var sum = 0;



alert("The array is: "+generateRandom(count));
alert("The average of all elements is: "+calculateAverage(randoms));