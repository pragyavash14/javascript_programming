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
app.use(session({secret: "ttgfhrwgedgnl7qtcoqtcg2uyaugyuegeuagu111",
                resave: false,
                saveUninitialized: true,
                cookie: {maxAge: 60000}}));

// configure out database connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
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

var userName, passWord, firstName, lastName, addRess;

var products = [
    {
        id : "01",
        title : "Hope",
        price : "€50.00",
        medium : "Digital",
        image : "/images/hope.png",
        altText : "A girl in PPE kit looking at the end of the tunnel"
    },
    {
        id : "02",
        title : "Girl In Green",
        price : "€60.00",
        medium : "Digital",
        image : "/images/green.png",
        altText : "A portrait of a girl in crosshatching against a green background"
    },
    {
        id : "03",
        title : "Singularity",
        price : "€50.00",
        medium : "Digital",
        image : "/images/waves.png",
        altText : "Two humans kissing against an abstract blue background"

    },
    {
        id : "04",
        title : "Andhadhun",
        price : "€80.00",
        medium : "Digital",
        image : "/images/andha.png",
        altText : "A blind man playing a piano with his cat's silhouette against the window"
    },
    {
        id : "05",
        title : "Self",
        price : "€40.00",
        medium : "Digital",
        image : "/images/self.jpg",
        altText : "An abstract beige and black portrait of a girl with short hair"
    }
];


// http://localhost:8000/
app.get("/",function (req,res){
    var sessionData = req.session.data;

    if (sessionData) {
        res.render("index.ejs", {"btnName": "Profile", "link":"/profile"});
    } else {
        res.render("index.ejs", {"btnName": "Login", "link":"login.html"});
    }

});

// http://localhost:8000/products
app.get("/products", function (req, res) {

    res.render("products.ejs", {"prod": products});

});

// http://localhost:8000/products/02
app.get("/products/:productID", function (req, res) {
    var id = req.params.productID;
    var prodDetail = products.filter(function (product) { return product.id == id;});
    res.render("productInfo.ejs", {"prodId": id, "prodDetail": prodDetail });
});


// http://localhost:8000/search?searchterm=Self
app.get("/search/", function (req, res) {
    
    var searchTerm = req.query.searchterm;
    var prodDetail = products.filter(function (product) { return product.title == searchTerm;});
    if(searchTerm){
        res.render("search.ejs", {"item": searchTerm,"prodDetail": prodDetail});
    }
    else{
        res.send("Please enter a search term");
    } 
   
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

   //res.render("profile.ejs", {"uname" : userName});
   var user = req.session.data;
   console.log("user: ", user);
   res.render("profile.ejs", {"uname" : user["username"], "fname": user["firstname"], "lname": user["surname"], "add": user["address"]});
});

// http://localhost:8000/login
app.post("/login", function (req, res) {

    userName = req.body.username;
    passWord = req.body.password;

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

    req.session.destroy();
    res.redirect("/");
 });

// http://localhost:8000/success
app.post("/success", function (req, res) {
    var file = req.files.myimage;
    file.mv("assets/uploads/"+file.name);
    res.render("success.ejs", {"filename": file.name});
});

// http://localhost:8000/signup
app.post("/signup", function (req, res) {

    userName = req.body.username;
    passWord = req.body.password;
    firstName = req.body.firstname;
    lastName = req.body.lastname;
    addRess = req.body.address;

    var sql = `SELECT * FROM users`; 
    con.query(sql, function(err, results) {
        if (err) {
            res.send("A database error occurred: "+err);
        } else {
            //if SQL query has no error, and results are not null, check if user already exists
            if (results.length >0) {
                console.log(results);
                checkUserExists(res, results, userName,passWord,firstName,lastName,addRess);
            } else {
                res.send("No results returned");
            }
        }
     });
 });


function checkUserExists(res, results, userName,passWord,firstName,lastName,addRess){

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
    var sql = `INSERT INTO users (username, firstname, surname, password, address) VALUES ("${userName}", "${firstName}", "${lastName}", "${passWord}", "${addRess}")`;
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
        console.log(results[i]["username"]);
            console.log(userName);

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

