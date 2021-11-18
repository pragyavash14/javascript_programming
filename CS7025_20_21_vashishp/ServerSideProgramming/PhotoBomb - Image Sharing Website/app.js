"use strict";


var express = require("express");
var session = require("express-session");
const bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var mysql = require("mysql");

var port = 8000;

// create express app object
var app = express();

// configure middleware
app.use(express.static("assets"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
/*
Configure middlewares
 */
app.use(function(req, res, next) {
    console.log("Hi from middleware");
    console.log(req.url);
    next();
});
app.use(session({secret: "ttgfhrwgedgnl7qtcoqtcg2uyaugyuegeuagu111",
                resave: false,
                saveUninitialized: true,
                cookie: {maxAge: 100000}})); //session expiry time

// configure out database connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    multipleStatements: true,
    password: "12345678",  // Enter your own MySQL password
    database: "nodeMySQL_db" // Enter your database name
});

// connect to the DB
con.connect( function(err) {
    if (err) {
        console.log("Error: "+err);
    } else {
        console.log("Successfully connected to DB");
    }
 });

// set up our templating engine
app.set("view_engine", "ejs");
app.set("views", "templates");

// var userName, passWord, firstName, lastName, addRess, bio;
//saving the sql results
var allImageData, currentImageId;

// http://localhost:8000/
app.get("/",function (req,res){
    var sessionData = req.session.data;

    //if session data is present, diaply Profile button. Else, Provide Login option
    if (sessionData) {
        res.render("index.ejs", {"btnName": "Profile", "link":"/profile"});
    } else {
        res.render("index.ejs", {"btnName": "Login", "link":"login.html"});
    }

});


// http://localhost:8000/discover
app.get("/discover", function (req, res) {

    //Display all images from DB
    var sql = `SELECT * FROM images`; 
    con.query(sql, function(err, results) {
        if (err) {
            res.send("A database error occurred: "+err);
        } else {
            allImageData = results;
            //if SQL query has no error, and results are not null, check if user already exists
            if (results.length >0) {
                console.log("Image data results:",results);
                res.render("discover.ejs", {"imageData": results});
            } else {
                res.send("No results returned");
            }
        }
     });
});

// http://localhost:8000/imageDetails/12345678_pragyav
app.get("/imageDetails/:imgID", function (req, res) {

    //Display image details 
    var imgId = req.params.imgID;
    currentImageId = imgId;

    var sql = `SELECT DISTINCT i.*, c.commentby, c.text
    FROM images i, comments c 
    WHERE i.imageid = "${imgId}"
    AND i.imageid = c.imageid`; 
    con.query(sql, function(err, results) {
        if (err) {
            res.send("A database error occurred: "+err);
        } else {
            allImageData = results;
            //if SQL query has no error, and results are not null, check if user already exists
            if (results.length >0) {
                console.log("Image data results:",results);
                res.render("imageDetails.ejs", {"imageData": results});
            } else {
                var heading = "Oops!";
                var message = "No Likes or comments on this image";
                res.render("message.ejs", {"msgHead" : heading, "msgText": message});
            }
        }
     });

});

// http://localhost:8000/about
app.get("/about", function (req, res) {
    var name = "Pragya Vashishtha";
    res.render("about.ejs", {"name": name});

});

// http://localhost:8000/message
app.get("/message", function (req, res) {
    
    res.render("message.ejs", {"msgHead" : heading, "msgText": message});
 });

// http://localhost:8000/profile
app.get("/profile", function (req, res) {

    //get user data from session and display profile
   var user = req.session.data;
   console.log("user: ", user);
   res.render("profile.ejs", {"uname" : user["username"], "fname": user["firstname"], "lname": user["surname"], "add": user["address"], "bio": user["bio"]});
});

// http://localhost:8000/login
app.post("/login", function (req, res) {

    //get data from form body
    var userName = req.body.username;
    var passWord = req.body.password;

    //get all user data to check if username and password are valid
    var sql = `SELECT * FROM users`; 
    con.query(sql, function(err, results) {
        if (err) {
            res.send("A database error occurred: "+err);
        } else {
            //if SQL query has no error, and results are not null, check if user already exists
            if (results.length >0) {
                console.log(results);
                validateUserCredentials(res, req, results, userName,passWord);
            } else {
                res.send("No results returned");
            }
        }
     });

});

// http://localhost:8000/logout
app.get("/logout", function (req, res) {

    //destroy all session data if user logs out
    req.session.destroy();
    res.redirect("/");
 });

// http://localhost:8000/success
app.post("/success", function (req, res) {

    //successful image upload, insert all image data in DB
    var file = req.files.myimage;
    var fileName = file.name;
    file.mv("assets/uploads/"+file.name);

    var user = req.session.data;
    //If session data empty, tell user that session has expired
    if(user == undefined){
        var heading = "Session Expired!";
        var message = "Sorry, you need to login again to upload an image.";
         res.render("message.ejs", {"msgHead": heading, "msgText": message});
        
    }

    else{

        var userName = user["username"];

        console.log("user: ", userName);
        console.log("Filename: "+ fileName);
        //creating unique ID/ primary key for images table in DB
        var timestamp = Date.now();
        var imgId = timestamp+"_"+userName;
        console.log("unique Id: ", imgId);
    
        //get today's date to store in DB
        var d = new Date();
        var day = d.getDate();
        var mon = d.getMonth()+1;
        var year = d.getFullYear();
        var dateStr = day + "/" + mon + "/" + year;
       
        //save Image/file details to DB
        var sql = `INSERT INTO images (imageid, uploader, filename, upload_date) VALUES ("${imgId}","${userName}", "${fileName}", "${dateStr}")`;
        console.log(sql);
        con.query(sql, function(err, results) {
            if (err) {
                res.send("Database error "+err);
            } else {
                console.log(results);
                res.render("success.ejs", {"filename": file.name});
            }
        });

    }
    
});

// http://localhost:8000/signup
app.post("/signup", function (req, res) {

    //get data from Form
    var userName = req.body.username;
    var passWord = req.body.password;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var addRess = req.body.address;
    var bio = req.body.bio;

    //get all user data to check if username already exists
    var sql = `SELECT * FROM users`; 
    con.query(sql, function(err, results) {
        if (err) {
            res.send("A database error occurred: "+err);
        } else {
            //if SQL query has no error, and results are not null, check if user already exists
            if (results.length >0) {
                console.log(results);
                checkUserExists(res, results, userName,passWord,firstName,lastName,addRess,bio);
            } else {
                res.send("No results returned");
            }
        }
     });
 });

// http://localhost:8000/like
app.post("/like", function (req, res) {

    //getting imageId from html 
    var imageId = req.body.likeBtn;
    console.log("Button value Iamge: ",imageId)
    var user = req.session.data;
    if(user == undefined){
        var heading = "Sorry!";
        var message = "You are required to Login to like a post! \n Either your session has timed-out or you have not logged in at all.";
         res.render("message.ejs", {"msgHead": heading, "msgText": message});
        
    }
    else{
        //creating unique ID/likeid for like table in DB
        var userName = user["username"];
        var timestamp = Date.now();
        var likeId = timestamp+"_like_"+userName;
    console.log("unique Id: ", likeId);
        //save Image/like details to DB
     var sql = `INSERT INTO likes (likeid, likeby, imageid) VALUES ("${likeId}","${userName}", "${imageId}")`;
     console.log(sql);
     con.query(sql, function(err, results) {
         if (err) {
             res.send("Database error "+err);
         } else {
             console.log("Liked!!!!!",results);
             res.redirect("/discover");
            //  res.render("success.ejs", {"filename": file.name});
         }
     });


    }
     

});


// http://localhost:8000/comment
app.post("/comment/", function (req, res) {
    console.log("/comment request from AJAX: ",req)
    var commentText = req.body.comment;
    //getting imageId from html 
    var imageId = req.body.commentBtn;
    var user = req.session.data;
    if(user == undefined){
        var heading = "Sorry!";
         var message = "You are required to Login to post a comment! \n Either your session has timed-out or you have not logged in at all.";
         res.render("message.ejs", {"msgHead": heading, "msgText": message});
        
    }
    else{
        //creating unique ID/likeid for like table in DB
       
        var userName = user["username"];
        var timestamp = Date.now();
        var comId = timestamp+"_comm_"+userName;
        console.log("unique Id: ", comId);
         //save Image/like details to DB
     var sql = `INSERT INTO comments (commentid, commentby, text, imageid) VALUES ("${comId}","${userName}", "${commentText}", "${imageId}")`;
     console.log(sql);
     con.query(sql, function(err, results) {
         if (err) {
             res.send("Database error "+err);
         } else {
             console.log("commented!!",results);
             res.redirect("/discover");
            //  res.render("success.ejs", {"filename": file.name});
         }
     });

    }
    

});

// http://localhost:8000/updatelikes
app.post("/updatelikes", function (req, res) {

    //getting imageId from html 
    var imageId = req.body.showLikes;
    //var imageId = "1619356364214_simonb";
    console.log("Show Like Button value imageId: ",imageId)

     //save Image/like details to DB
    //  var sql = `SELECT COUNT(likeid) FROM likes WHERE imageid="${imageId}"`;
    var sql = `SELECT DISTINCT likeby FROM likes WHERE imageid="${imageId}"`;
     console.log(sql);
     con.query(sql, function(err, results) {
         if (err) {
             res.send("Database error "+err);
         } else {
             console.log("Liked!!!!!",results);
            
             res.render("likes.ejs", {"likeData": results});        
         }
     });

});


//for AJAX call:

// // http://localhost:8000/updatelikes
// app.post("/updatelikes", function (req, res) {

//     console.log("Request from AJAX: ", req.body.imgId);
//     //getting imageId from html 
//     var imageId = req.body.imgId;
//     //var imageId = "1619356364214_simonb";
//     console.log("Show Like Button value imageId: ",imageId)

//      //save Image/like details to DB
//     //  var sql = `SELECT COUNT(likeid) FROM likes WHERE imageid="${imageId}"`;
//     var sql = `SELECT DISTINCT likeby FROM likes WHERE imageid="${imageId}"`;
//      console.log(sql);
//      con.query(sql, function(err, results) {
//          if (err) {
//              res.send("Database error "+err);
//          } else {
//              console.log("Liked!!!!!",results);
//             res.json(results);           
//          }
//      });

// });

//For AJAX call:

// http://localhost:8000/updatecomments
app.get("/updatecomments", function (req, res) {

    //getting imageId from html 
    //var imageId = req.body.commentBtn;
    var imageId = currentImageId; 
    // var imageId = "1619356364214_simonb";
    console.log("Getting latest comment, imageId: ",imageId)

     //getting the latest comment:
    var sql = `SELECT commentby, text FROM comments WHERE imageid="${imageId}" ORDER BY commentid DESC LIMIT 1`;
     console.log(sql);
     con.query(sql, function(err, results) {
         if (err) {
             res.send("Database error "+err);
         } else {
             console.log("Latest comment",results);
            res.json(results);
         }
     });

});



//  Non-route handler functions:
function checkUserExists(res, results, userName,passWord,firstName,lastName,addRess,bio){

//check if username already exists in database
    for(var i in results){
        console.log(results[i]["username"]);
            console.log(userName);

        if(results[i]["username"] == userName){
             //if exists, redirect to message - oops - page and return
         var heading = "Oops!";
         var message = "Username already exists!";
         res.render("message.ejs", {"msgHead": heading, "msgText": message, "uname":userName});
         return;
}
    }

    //if same username not found, create a new user in database
    var sql = `INSERT INTO users (username, firstname, surname, password, address, bio) VALUES ("${userName}", "${firstName}", "${lastName}", "${passWord}", "${addRess}", "${bio}")`;
    console.log(sql);
    con.query(sql, function(err, results) {
        if (err) {
            res.send("Database error "+err);
        } else {
            console.log(results);
            //redirect to message - woohoo - page
            var heading = "Wohoo!"
            var message = "New user created!"
            res.render("message.ejs", {"msgHead": heading, "msgText": message, "uname":userName});
        }
    });

}

function validateUserCredentials(res, req, results, userName,passWord){
    //check if username and password match with any entry in database
    for(var i in results){
       // console.log(results[i]["username"]);
           // console.log(userName);

        //If valid, save user data in session data and return
        if(results[i]["username"] == userName && results[i]["password"] == passWord){
           // req.session.data = userName;
           req.session.data = results[i];
            console.log("session data:", req.session.data);
            res.redirect("/profile");
            return;
}
    }

    //if no match, return to homepage
     res.redirect("/");
   
}


// listen on our assigned port number
app.listen(port);

// some feedback for the web admin
console.log("Server running on http://localhost:"+port);

