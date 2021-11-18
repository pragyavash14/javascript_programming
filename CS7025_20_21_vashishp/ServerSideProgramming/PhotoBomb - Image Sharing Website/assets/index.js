'use strict';


function validateForm(){
    var firstInput = document.getElementById("pass").value;
    var secondInput = document.getElementById("confirmPass").value;
    
    if (firstInput != secondInput){
    
    alert("Passwords dont match!");
    return false;
    }

}


function updateLikes(imageId){
console.log("Update like called!");

$.ajax( {
    type: "POST",
    url: "http://localhost:8000/data",
    data: {"imgId": imageId},
    success: function(result) {
        console.log("Hi from ajax update Likes");
        console.log(result);
        
        //print on html
        for (var i in result) {
            var likeSection = document.createElement("p");
            
            $(likeSection).text("Liked by: "+result[i]["likeby"]+",");

            $(likeSection).appendTo($("#likeArea"));
        }
      
    }
    }

);

}



// function updateComments( imageId ){
//     console.log("Update comments called!");
//     var comment = document.getElementById("inputComment");
//     $.ajax( {
//         type: "POST",
//         url: "http://localhost:8000/comment",
//         data: {"commentBtn": imageId, "comment": comment},
//         success: function(result) {
//             console.log("Hi from ajax, Latest Comment:");
//             console.log(result);
//             console.log("ID from onclick:",imageId);
          
//                 //print on html
//                 for (var i in result) {
//                     var commentBy = document.createElement("p");
//                     var commentSection = document.createElement("p");
                    
//                     $(commentBy).text(result[i]["commentby"]);
//                     $(commentSection).text(result[i]["text"]);
        
//                     $(commentSection).appendTo($("#comArea"));
//                 }  
//         }
//         }
    
//     );
    
//     }



// function updateComments( imageId ){
//     console.log("Update comments called!");
//     var newComment = document.getElementById("inputComment");
//     $.ajax( {
//         type: "POST",
//         url: "http://localhost:8000/updatecomments",
//         data: {"imgId": imageId},
//         success: function(result) {
//             console.log("Hi from ajax");
//             console.log(result);
//             console.log("ID from onclick:",imageId);
            
//             //print on html
//             for (var i in result) {
//                 var commentBy = document.createElement("p");
//                 var commentSection = document.createElement("p");
                
//                 $(commentBy).text(result[i]["commentby"]);
//                 $(commentSection).text(result[i]["text"]);
    
//                 $(commentSection).appendTo($("#comArea"));
//             }
          
//         }
//         }
    
//     );
    
//     }



