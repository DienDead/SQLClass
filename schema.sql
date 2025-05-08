create database if not exists `deltaApp`;
use `deltaApp`;
create table user(
    id varchar(50) primary key,
    username varchar(50) unique,
    email varchar(100) unique not null,
    password varchar(100) not null
);