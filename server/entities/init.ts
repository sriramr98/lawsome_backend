import { Sequelize, DataTypes } from "sequelize";
import config from "./../config";

let sql: Sequelize;

export default function getSequelize() {
  if (!sql) {
    sql = new Sequelize(
      config.db.database,
      config.db.username,
      config.db.password,
      {
        host: config.db.host,
        dialect: "mysql",
      }
    );
  }

  return sql;
}
