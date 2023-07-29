CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER auto_increment,
    conversationId VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    sender ENUM('user', 'bot') NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;
-- Add new column to chat_messages called likedStatus which is a NUMBER
ALTER TABLE chat_messages
ADD likeStatus SMALLINT NOT NULL DEFAULT -1;
DROP TABLE sources;
CREATE TABLE IF NOT EXISTS sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    law_id INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT NOW,
    updatedAt DATETIME NOT NULL DEFAULT NOW ON UPDATE NOW
) ENGINE = InnoDB;
DROP TABLE feedback;
CREATE TABLE IF NOT EXISTS feedback(
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    feedback TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT NOW,
    updatedAt DATETIME NOT NULL DEFAULT NOW ON UPDATE NOW
)