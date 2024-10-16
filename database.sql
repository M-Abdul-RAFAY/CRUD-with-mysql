create table person(
    id varchar(50) primary key unique,
    name varchar(50) not null,
    email varchar(50) not null,
    password varchar(50) not null
)