"use strict";

var ctx = null;
var canvas = null; 
var img = new Image;
var targetCount = 0; //initialising count of Target cells as 0
var targetAcheived = 0; //initialising count of boxes placed on Target as 0
var moves = 0; //total number of moves made
var prevState = null; //previous state of cell is stored here after player moves out of it (useful when player moves on Target cell)
var currentPos = []; //Current position of Sokoban will be stored here
var prevPos = null; //Previous position of Sokoban will be stored here
var cellSide = 50;  //size of each cell
const array2DLevel01 = [
    ['#', '#', '#','#','#','#'],
    ['#', 'S','0','B','T','#'],
    ['#', '#','#', '#','#','#']
]; //level 01 map stored in a 2D array S:Sokoban, 0: Empty space, B:Box, T: Target, Y:Box on Target, $: Sokoban on Target

const array2DLevel02 = [
    ['#', '#', '#','0','0'],
    ['#', 'T','#','#','#'],
    ['#', 'Y','B','0','#'],
    ['#', '0','S','0','#'],
    ['#', '#','#','#','#']
];
const array2DLevel03 = [
    ['#', '#', '#','#','#','#','#'],
    ['#', 'T','S','0','#','0','#'],
    ['#', 'B','Y', '0','B','0','#'],
    ['#', '0','0', '0','B','0','#'],
    ['#', '0','T', 'T','0','0','#'],
    ['#', '0','0', 'Y','0','0','#'],
    ['#', '#','#', '#','#','#','#']
];

const array2DLevel04 = [
    ['0','0','0','0','#', '#', '#','#','#'],
    ['0','#', '#','#','#','0','0','0','#'],
    ['0','#', '0','S', '0','B','#','0','#'],
    ['0','#', '0','#', 'T','T','T','T','#'],
    ['#', '#','B', '0','B','0','B','0','#'],
    ['#', '0','0', '#','#','#','0','#','#'],
    ['#','0','0','0','0','0','0','#'],
    ['#', '#','#', '#','#','0','0','#'],
    ['0','0','0','0','#', '#','#', '#']
];  
var levelNum = 0; //levelNum set to 0 to Initialize level array with 0 element
var levels = [array2DLevel01,array2DLevel02,array2DLevel03,array2DLevel04];
var currentLevel= levels[levelNum]; //current Level is saved in this variable

//when the document is ready, we set the canvas and draw our level map
$(document).ready( function() {

    document.getElementById("gameLevel").innerHTML = "1";
    canvas = document.getElementById("gameCanvas");
    canvas.width = 800;
    canvas.height = 600;   
    ctx = canvas.getContext('2d');
    requestAnimationFrame(drawLevel);
    document.onkeydown = processArrowKey;
    console.log("Hello World");
});

//Waits to draw image on canvas until the image is ready
async function draw(path,x,y) {
    let img = new Image();
    await new Promise(r => img.onload=r, img.src=path);
    ctx.drawImage(img, x, y, cellSide, cellSide);
}

//This method is to draw level on canvas
function drawLevel(){
    console.log("draw")
    for (let i = 0; i < currentLevel.length; i++) {
        for (let j = 0; j < currentLevel[i].length; j++) {
            let x = j * cellSide;
            let y = i * cellSide;
            console.log("interation i,j for coordinates x,y:",i,j,x,y)
            ctx.beginPath();
            if (currentLevel[i][j] == '0') { 
                draw("assets/empty.PNG", x, y);
            }
            else if(currentLevel[i][j] == '#'){   
                draw("assets/wall.PNG", x, y);
            }
            else if(currentLevel[i][j] == 'B'){
                draw("assets/box.PNG", x, y);
            }
            else if(currentLevel[i][j] == 'S'){
                draw("assets/sokoban.PNG", x, y);
                currentPos=[i,j];
            }
            else if (currentLevel[i][j] == '$') {
                draw("assets/redSoko.PNG", x, y);
                currentPos=[i,j];
            }
            else if(currentLevel[i][j] == 'T'){
                draw("assets/target.PNG", x, y);
                targetCount++; //counts total targets
            }
            else if(currentLevel[i][j] == 'Y'){
                draw("assets/check.PNG", x, y);
                targetCount++; //counts total targets
                targetAcheived++; //counts boxes on target
                document.getElementById("targetAcheived").innerHTML = targetAcheived;
                
            }
        }
    }
   requestAnimationFrame(draw); // continuosly draws every frame
}

//Process which key is pressed by the player and change coordinates accordingly
function processArrowKey(e) {
    var nextPos = []; //varience in X and Y coordinate will be stored in these variables
    var varI = null;
    var varJ = null; //varience in the i and j coordinates of 2D array will be stored here
    console.log("Before computing:prev,curr,next",prevPos,currentPos,nextPos);

    switch(e.keyCode) {
        //Left Arrow
        case 37:
            varI = 0;
            varJ = -1;
            break;
        //Up Arrow
        case 38:
            varI = -1;
            varJ = 0;
            break;
        //Right Arrow
        case 39:
            varI = 0;
            varJ = 1;
            break;
        //Down Arrow
        case 40:
            varI = 1;
            varJ = 0;
            break;
        default:
            alert("Invalid move! Use arrow keys to move the sokoban")
            return;
    }

    //The varience is added to current pos to calculate new position of Sokoban
    nextPos[0] = currentPos[0] + varI;
    nextPos[1] = currentPos[1] + varJ;

    if(canMove(nextPos)){
        moveSprite(nextPos,varI,varJ);
    }
}

//check if player can move
function canMove(nextPos){
    //If the next cell is NOT a wall, it is a valid move OR the next cell is a box whose next cell is empty, it is also a valid move
    if(currentLevel[nextPos[0]][nextPos[1]] != '#' || (currentLevel[nextPos[0]][nextPos[1]] == 'B' &&(currentLevel[2*nextPos[0]][2*nextPos[1]] = '0') )){
        return true;
    }
}

//move the player to the next cell depending on what is present on the next cell
function moveSprite(nextPos,varI,varJ){

    if(currentLevel[nextPos[0]][nextPos[1]] == '0'){
        moveToEmptySpace(nextPos);
    }

    else if(currentLevel[nextPos[0]][nextPos[1]] == 'B'){
        if(canPush(nextPos,varI,varJ)){

             //next cell is made Sokoban
            currentLevel[nextPos[0]][nextPos[1]] = 'S';
            draw("assets/sokoban.PNG", nextPos[1]*cellSide, nextPos[0]*cellSide);

            pushBox(nextPos,varI,varJ);
        }
    }
    else if(currentLevel[nextPos[0]][nextPos[1]] == 'T'){
        moveToTarget(nextPos);
    }
    else if(currentLevel[nextPos[0]][nextPos[1]] == 'Y'){
        if(canPush(nextPos,varI,varJ)){
            moveToChecked(nextPos,varI,varJ);
        }
    }
        //If all boxes are on target, Level Finished
    if(targetCount == targetAcheived){
        //Alert the user
        setTimeout(function() {
            alert("HOORAY! :) Level solved!"); 
          }, 100);

        //Reset all stored values and update currentLevel to next in array
        setTimeout(function() {
        targetCount = 0; 
        targetAcheived = 0; 
        moves = 0; 
        prevState = null; 
        currentPos = [];
        prevPos = null;
        levelNum++;

        if(!levels[levelNum]){
            alert("You have finished all levels!");
        }
        else{
            document.getElementById("gameLevel").innerHTML = levelNum + 1;  
            document.getElementById("moves").innerHTML = moves; 
            currentLevel = levels[levelNum]; 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawLevel);
        }
       
      }, 500);
    }
    //Increse total number of moves by player
    moves++;
    document.getElementById("moves").innerHTML = moves;

}

function moveToEmptySpace(nextPos){
    
    changeCurrentCell(nextPos);
     
     //next cell is made Sokoban
     currentLevel[nextPos[0]][nextPos[1]] = 'S';
     draw("assets/sokoban.PNG", nextPos[1]*cellSide, nextPos[0]*cellSide);
 
     //the coordinates for next Position become current Position
     prevPos = currentPos;
     currentPos = nextPos; 
}

function moveToTarget(nextPos){
    
    changeCurrentCell(nextPos);

    //next cell is made Sokoban
    currentLevel[nextPos[0]][nextPos[1]] = '$';
    draw("assets/redSoko.PNG", nextPos[1]*cellSide, nextPos[0]*cellSide);

    //the coordinates for next Position become current Position
    prevState = 'T';
    prevPos = currentPos;
    currentPos = nextPos; 
}

//'checked' is position where a Box is already on Target
function moveToChecked(nextPos,varI,varJ){

    //next cell is made Red Sokoban
    currentLevel[nextPos[0]][nextPos[1]] = '$';
    draw("assets/redSoko.PNG", nextPos[1]*cellSide, nextPos[0]*cellSide);
    
    pushBox(nextPos,varI,varJ);

    //upate Target acheived count
    targetAcheived--;
    document.getElementById("targetAcheived").innerHTML = targetAcheived;  

    //the coordinates for next Position become current Position
    prevState = 'Y';
    prevPos = currentPos;
    currentPos = nextPos; 
}

function changeCurrentCell(nextPos){
     //If player is moving out of a cell which was previously Target , change image back to Target
     if(prevState == 'T' || prevState == 'Y'){
        currentLevel[currentPos[0]][currentPos[1]] = 'T';
        draw("assets/target.PNG", currentPos[1]*cellSide, currentPos[0]*cellSide);
        prevState = null; //empty the prev state varibale after it is used
    }
    // else if(prevState == 'Y'){
    //     currentLevel[currentPos[0]][currentPos[1]] = 'T';
    //     draw("assets/target.PNG", currentPos[1]*cellSide, currentPos[0]*cellSide);
    //     prevState = null; //empty the prev state varibale after it is used
    // }
    //Else, current cell is made empty
    else{
        currentLevel[currentPos[0]][currentPos[1]] = '0';
        draw("assets/empty.PNG", currentPos[1]*cellSide, currentPos[0]*cellSide);
    }
}

function pushBox(nextPos,varI,varJ){  

    changeCurrentCell(nextPos);

    //If next to next is Target, make box checked
    if(currentLevel[varI+nextPos[0]][varJ+nextPos[1]] == 'T'){
        currentLevel[varI+nextPos[0]][varJ+nextPos[1]] = 'Y';
        draw("assets/check.PNG", (varJ+nextPos[1])*cellSide, (varI+nextPos[0])*cellSide); 
        //upate Target aceived count
        targetAcheived++;
        document.getElementById("targetAcheived").innerHTML = targetAcheived;  
    }
    else{
    //next to next is made Box
    currentLevel[varI+nextPos[0]][varJ+nextPos[1]] = 'B';
    draw("assets/box.PNG", (varJ+nextPos[1])*cellSide, (varI+nextPos[0])*cellSide);
    }
  
    //the coordinates for next Position become current Position
    prevPos = currentPos;
    currentPos = nextPos; 
}

function canPush(nextPos,varI,varJ){
    //If, next to next cell is a empty or Target, return true
    if(currentLevel[varI+nextPos[0]][varJ+nextPos[1]] == 'T' || currentLevel[varI+nextPos[0]][varJ+nextPos[1]] == '0'){
        return true;
    }
    else{
        alert("Invalid push")
    }
}


