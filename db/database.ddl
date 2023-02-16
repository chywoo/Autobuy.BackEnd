
CREATE DATABASE IF NOT EXISTS autobuy;

CREATE USER IF NOT EXISTS 'capstone'@'%';

ALTER USER 'capstone'@'%' IDENTIFIED WITH mysql_native_password BY 'capstone2023';

GRANT ALL PRIVILEGES ON autobuy.* TO 'capstone'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;

USE autobuy;

CREATE TABLE IF NOT EXISTS UserInfo (
  UserName   varchar(20) NOT NULL PRIMARY KEY, 
  Password varchar(255) NOT NULL, 
  FullName varchar(255) NOT NULL, 
  Email    varchar(255) NOT NULL);
