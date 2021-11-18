'use strict';


function validateForm(){
    var firstInput = document.getElementById("pass").value;
    var secondInput = document.getElementById("confirmPass").value;
    
    if (firstInput != secondInput){
    
    alert("Passwords dont match!");
    return false;
    }

}


