CREATE TABLE `users` (
  `username` varchar(30) NOT NULL,
  `firstname` varchar(30) DEFAULT NULL,
  `surname` varchar(30) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ;

INSERT INTO `nodemysql_db`.`users`
(`username`,
`firstname`,
`surname`,
`password`,
`address`)
VALUES
("pvash",
"pragya",
"vashishtha",
"123456",
"Dublin, Ireland"),
("sid",
"siddharth",
"vashishtha",
"pass123",
"Rochester, NY"),
("test",
"guest",
"name",
"12345",
"mars"),
("ramisah",
"Ramisa",
"Hamed",
"pass123",
"Trinity College Dublin");

