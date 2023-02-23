
CREATE DATABASE IF NOT EXISTS autobuy;

CREATE USER IF NOT EXISTS 'capstone'@'%';

ALTER USER 'capstone'@'%' IDENTIFIED WITH mysql_native_password BY 'capstone2023';

GRANT ALL PRIVILEGES ON autobuy.* TO 'capstone'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;

USE autobuy;

CREATE TABLE IF NOT EXISTS UserInfo (
  UserName varchar(20) NOT NULL PRIMARY KEY, 
  Password varchar(255) NOT NULL, 
  FullName varchar(255) NOT NULL, 
  Email    varchar(255) NOT NULL);

CREATE TABLE Roles (
  roleID   int(11) NOT NULL AUTO_INCREMENT, 
  roleName varchar(10) NOT NULL, 
  PRIMARY KEY (roleID));

CREATE TABLE MakerInfo (
  makerID   int(11) NOT NULL, 
  makerName varchar(20), 
  PRIMARY KEY (makerID));

CREATE TABLE CarInfo (
  carID   int(11) NOT NULL AUTO_INCREMENT, 
  makerID int(11) NOT NULL, 
  carName varchar(20) NOT NULL, 
  PRIMARY KEY (carID));


CREATE TABLE CarTrim (
  trimID       int(11) NOT NULL AUTO_INCREMENT, 
  carID        int(11), 
  isEV         int(11), 
  displacement int(11), 
  weelbase     int(11), 
  length       int(11), 
  width        int(11), 
  height       int(11), 
  power        int(11), 
  PRIMARY KEY (trimID));

