
CREATE DATABASE IF NOT EXISTS autobuy;

CREATE USER IF NOT EXISTS 'capstone'@'%';

ALTER USER 'capstone'@'%' IDENTIFIED WITH mysql_native_password BY 'capstone2023';

GRANT ALL PRIVILEGES ON autobuy.* TO 'capstone'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;

USE autobuy;

DROP TABLE UserInfo;

CREATE TABLE UserInfo (
  UserName varchar(20) NOT NULL PRIMARY KEY, 
  Password varchar(255) NOT NULL, 
  FullName varchar(255) NOT NULL, 
  Email    varchar(255) NOT NULL);


DROP TABLE Roles;
CREATE TABLE Roles (
  roleID   int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  roleName varchar(20) NOT NULL);

INSERT INTO Roles(roleName) VALUES ('USER');
INSERT INTO Roles(roleName) VALUES ('SELLER');
INSERT INTO Roles(roleName) VALUES ('ADMINISTRATOR');


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


DROP TABLE CarInfo;
CREATE TABLE CarInfo (
  carID    int(11) NOT NULL AUTO_INCREMENT, 
  makerID  int(11) NOT NULL, 
  carName  varchar(20) NOT NULL, 
  imageURL varchar(255), 
  PRIMARY KEY (carID));


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
  userName    varchar(20) NOT NULL, 
  carID       int(11) NOT NULL, 
  year        int(11) NOT NULL, 
  mileage     int(11), 
  `condition` varchar(10), 
  price       int(11) NOT NULL, 
  description int(11) NOT NULL, 
  PRIMARY KEY (postID));

