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