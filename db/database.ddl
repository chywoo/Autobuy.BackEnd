
CREATE DATABASE IF NOT EXISTS autobuy;

CREATE USER IF NOT EXISTS 'capstone'@'%';

ALTER USER 'capstone'@'%' IDENTIFIED WITH mysql_native_password BY 'capstone2023';

GRANT ALL PRIVILEGES ON autobuy.* TO 'capstone'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;

USE autobuy;

DROP TABLE Roles;
CREATE TABLE Roles (
  roleID   int(11)  PRIMARY KEY, 
  roleName varchar(20) NOT NULL);

INSERT INTO Roles(roleID, roleName) VALUES ( 1, 'USER');
INSERT INTO Roles(roleID, roleName) VALUES ( 2, 'SELLER');
INSERT INTO Roles(roleID, roleName) VALUES ( 3, 'ADMINISTRATOR');

DROP TABLE UserInfo;

CREATE TABLE UserInfo (
  UserName varchar(20) NOT NULL PRIMARY KEY, 
  Password varchar(255) NOT NULL, 
  FullName varchar(255) NOT NULL, 
  Email    varchar(255) NOT NULL,
  RoleID   int(11) default 1);

INSERT INTO autobuy.UserInfo (UserName, Password, FullName, Email, RoleID) VALUES('user', 'user', 'User', 'user@autobuy.com', 1);
INSERT INTO autobuy.UserInfo (UserName, Password, FullName, Email, RoleID) VALUES('seller', 'seller', 'I am Seller', 'seller@autobuy.com', 2);
INSERT INTO autobuy.UserInfo (UserName, Password, FullName, Email, RoleID) VALUES('admin', 'admin', 'Administrator', 'admin@autobuy.com', 3);


DROP TABLE MakerInfo;
CREATE TABLE MakerInfo (
  makerID   int(11) AUTO_INCREMENT PRIMARY KEY, 
  makerName varchar(20));

INSERT INTO MakerInfo (makerName) VALUES ('Alpha Romeo');
INSERT INTO MakerInfo (makerName) VALUES ('BMW');
INSERT INTO MakerInfo (makerName) VALUES ('Chevrolet');
INSERT INTO MakerInfo (makerName) VALUES ('Ford');
INSERT INTO MakerInfo (makerName) VALUES ('Genesis');
INSERT INTO MakerInfo (makerName) VALUES ('Honda');
INSERT INTO MakerInfo (makerName) VALUES ('Hyundai');
INSERT INTO MakerInfo (makerName) VALUES ('Lamborghini');
INSERT INTO MakerInfo (makerName) VALUES ('Lexus');
INSERT INTO MakerInfo (makerName) VALUES ('Mercedes AMG');
INSERT INTO MakerInfo (makerName) VALUES ('Nissan');
INSERT INTO MakerInfo (makerName) VALUES ('Toyota');
INSERT INTO MakerInfo (makerName) VALUES ('Volkswagan');
INSERT INTO MakerInfo (makerName) VALUES ('Kia');


DROP TABLE CarInfo;
CREATE TABLE CarInfo (
  carID    int(11) NOT NULL AUTO_INCREMENT, 
  makerID  int(11) NOT NULL, 
  carName  varchar(20) NOT NULL, 
  imageURL varchar(255), 
  PRIMARY KEY (carID));

INSERT INTO CarInfo (makerID, carName, imageURL) VALUES (1, 'Car1', '/images/car1.jpg');
INSERT INTO CarInfo (makerID, carName, imageURL) VALUES (2, 'Car2', '/images/car2.jpg');
INSERT INTO CarInfo (makerID, carName, imageURL) VALUES (2, 'Car3', '/images/car3.jpg');


DROP TABLE CarTrim;
CREATE TABLE CarTrim ( 
  trimID       int(11) NOT NULL AUTO_INCREMENT, 
  carID        int(11), 
  displacement int(11), 
  weelbase     int(11), 
  length       int(11), 
  width        int(11), 
  height       int(11), 
  power        int(11), 
  PRIMARY KEY (trimID));

DROP TABLE Post;
CREATE TABLE Post (
  postID      int(11) NOT NULL AUTO_INCREMENT,
  title       varchar(100) NOT NULL, 
  userName    varchar(20) NOT NULL, 
  carID       int(11) NOT NULL, 
  year        int(11) NOT NULL, 
  mileage     int(11), 
  `condition` varchar(10), 
  price       int(11) NOT NULL, 
  description text NOT NULL, 
  PRIMARY KEY (postID));

INSERT INTO autobuy.Post (title, userName, carID, `year`, mileage, `condition`, price, description) VALUES('Post1', 'user', 1, 2012, 140000, '', 80000000, 'Good car');
INSERT INTO autobuy.Post (title, userName, carID, `year`, mileage, `condition`, price, description) VALUES('Post2', 'user', 2, 2011, 140000, '', 80000000, 'Good car');
INSERT INTO autobuy.Post (title, userName, carID, `year`, mileage, `condition`, price, description) VALUES('Post3', 'seller', 3, 2011, 140000, '', 620000000, 'Good car');

