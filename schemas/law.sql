-- Active: 1690119136073@@aws.connect.psdb.cloud@3306@lawsome_mvp
DROP TABLE acts;
CREATE TABLE acts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title TEXT NOT NULL
);
DROP TABLE laws;
-- This contains sections, orders and appendix
CREATE TABLE laws (
    id INT PRIMARY KEY AUTO_INCREMENT,
    act_id INT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    law_id VARCHAR(100) NOT NULL,
    law_type VARCHAR(20) NOT NULL
);