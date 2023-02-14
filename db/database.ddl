
CREATE DATABASE IF NOT EXISTS autobuy;
CREATE USER IF NOT EXISTS 'capstone'@'%' IDENTIFIED BY 'capstone2023';
GRANT ALL PRIVILEGES ON capstone.* TO 'capstone'@'%' WITH GRANT OPTION;

CREATE TABLE IF NOT EXISTS UserInfo (
  UserId   varchar(20) NOT NULL, 
  Password varchar(255) NOT NULL, 
  FullName varchar(255) NOT NULL, 
  Email    varchar(255) NOT NULL, 
  PRIMARY KEY (UserId));
