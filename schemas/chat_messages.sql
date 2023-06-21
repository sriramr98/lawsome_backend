CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `chat_id` varchar(50) NOT NULL,
  `sender` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX `user_id_idx` ON `chat_messages` (`user_id`);
CREATE INDEX `chat_id_idx` ON `chat_messages` (`chat_id`);
CREATE INDEX `user_id_chat_id_idx` ON `chat_messages` (`user_id`, `chat_id`);