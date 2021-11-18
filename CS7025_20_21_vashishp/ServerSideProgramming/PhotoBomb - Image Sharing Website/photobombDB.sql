/*Users table */
CREATE TABLE `users` (
  `username` varchar(30) NOT NULL,
  `firstname` varchar(30) DEFAULT NULL,
  `surname` varchar(30) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `bio` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`username`)
);

INSERT INTO `users`
(`username`,
`firstname`,
`surname`,
`password`,
`address`,
`bio`)
VALUES
("pragyav",
"Pragya",
"Vashishtha",
"pass123",
"Rajasthan, India",
"MSc IDM student at Trinity College Dublin"),
("sidvash",
"Siddharth",
"Vashishtha",
"123456",
"NY, USA",
"I like playing chess"),
("simonb",
"Simon",
"Birchall",
"123456",
"Ireland",
"Bartending and fun :)"),
("test",
"Mojo",
"jojo",
"12345",
"Ireland",
"I'm a test user <3");

/*Images table */
CREATE TABLE `images` (
  `imageid` varchar(70) NOT NULL,
  `uploader` varchar(30) DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  `upload_date` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`imageid`)
) ;
INSERT INTO `images`
(`imageid`,
`uploader`,
`filename`,
`upload_date`)
VALUES
("1619986574938_pragyav",
"pragyav",
"andha.png",
"30/4/2021"),
("1619986672540_pragyav",
"pragyav",
"hope.png",
"1/5/2021"),
("1619986744964_sidvash",
"sidvash",
"self.jpg",
"2/5/2021"),
("1619986904793_simonb",
"simonb",
"IDMclass1.png",
"2/5/2021"),
("1619986939226_simonb",
"simonb",
"tcd.jpg",
"2/5/2021");

/* Comment table */
CREATE TABLE `comments` (
  `commentid` varchar(70) NOT NULL,
  `commentby` varchar(30) DEFAULT NULL,
  `text` varchar(100) DEFAULT NULL,
  `imageid` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`commentid`)
);
INSERT INTO comments
(`commentid`,
`commentby`,
`text`,
`imageid`)
VALUES
("1619986574938_comm_simonb",
"simonb",
"Love this picture! :) ",
"1619986574938_pragyav"),
("1619986574938_comm_sidvash",
"sidvash",
"Agree with Simon, such a nice one!",
"1619986574938_pragyav"),
("1619986672540_comm_sidvash",
"sidvash",
"Wow! Blue is my fav colour <3",
"1619986672540_pragyav"),
("1619986744964_comm_pragyav",
"pragyav",
"Keep up the good work!",
"1619986744964_sidvash"),
("1619986904793_comm_pragyav",
"pragyav",
"Aww! Everyone looks so cute",
"1619986904793_simonb"),
("1619986904793_comm_sidvash",
"sidvash",
"Yay! IDM rocks :D haha",
"1619986904793_simonb"),
("1619986939226_comm_pragyav",
"pragyav",
"This is definetly not clicked by you, Simon. lol",
"1619986939226_simonb");

/*Likes table*/
CREATE TABLE `likes` (
  `likeid` varchar(70) NOT NULL,
  `likeby` varchar(30) DEFAULT NULL,
  `imageid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`likeid`)
) ;


INSERT INTO `likes`
(`likeid`,
`likeby`,
`imageid`)
VALUES
("1619987813228_like_pragyav",
"pragyav",
"1619986744964_sidvash"),
("1619987817053_like_pragyav",
"pragyav",
"1619986904793_simonb"),
("1619987821337_like_pragyav",
"pragyav",
"1619986939226_simonb"),
("1619987821338_like_sidvash",
"sidvash",
"1619986939226_simonb");

