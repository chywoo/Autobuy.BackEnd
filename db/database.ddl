
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
  userName varchar(20) NOT NULL PRIMARY KEY, 
  password varchar(255) NOT NULL, 
  fullName varchar(255) NOT NULL, 
  email    varchar(255) NOT NULL,
  roleID   int(11) default 1);

INSERT INTO autobuy.UserInfo (userName, password, fullName, email, roleID) VALUES('user', 'user', 'User', 'user@autobuy.com', 1);
INSERT INTO autobuy.UserInfo (userName, password, fullName, email, roleID) VALUES('seller', 'seller', 'I am Seller', 'seller@autobuy.com', 2);
INSERT INTO autobuy.UserInfo (userName, password, fullName, email, roleID) VALUES('admin', 'admin', 'Administrator', 'admin@autobuy.com', 3);


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
  carModel varchar(20) NOT NULL, 
  imageURL varchar(255), 
  PRIMARY KEY (carID));

INSERT INTO CarInfo (makerID, carModel, imageURL) VALUES (1, '4C', 'AlphaRomeo_4C.jpeg');
INSERT INTO CarInfo (makerID, carModel, imageURL) VALUES (2, '3 Series', 'BMW_3series.jpeg');
INSERT INTO CarInfo (makerID, carModel, imageURL) VALUES (3, 'Corvette', 'Chevrolet_Corvette.jpeg');
INSERT INTO CarInfo (makerID, carModel, imageURL) VALUES (4, 'F150', 'Ford_F150.jpeg');


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

INSERT INTO autobuy.Post (title, userName, carID, `year`, mileage, `condition`, price, description) VALUES('Sell AlphaRomeo 4C Convertible Sports Car', 'user', 1, 2012, 140000, '', 80000000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO autobuy.Post (title, userName, carID, `year`, mileage, `condition`, price, description) VALUES('BMW 3 Sport Sedan. Silky 6 engine', 'user', 2, 2011, 140000, '', 80000000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO autobuy.Post (title, userName, carID, `year`, mileage, `condition`, price, description) VALUES('It\'s corvette.', 'seller', 3, 2011, 140000, '', 620000000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO autobuy.Post (title, userName, carID, `year`, mileage, `condition`, price, description) VALUES('Do you want a truck?', 'seller', 4, 2011, 140000, '', 620000000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');

