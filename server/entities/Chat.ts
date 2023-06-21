import { DataTypes } from "sequelize";
import getSequelize from "./init";

const sql = getSequelize();

const ChatMessage = sql.define("chat_message", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  chat_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default ChatMessage;
