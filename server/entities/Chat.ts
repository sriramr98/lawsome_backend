import { DataTypes } from "sequelize";
import getSequelize from "./init";

const sql = getSequelize();

const Chat = sql.define("chat", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
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

export default Chat;
