const DataTypes = require("sequelize");
const db = require("../database.js");

const attributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: null,
    comment: null,
    primaryKey: true,
    field: "id",
    autoIncrement: true,
  },
  username: {
    type: DataTypes.CHAR(100),
    allowNull: true,
    defaultValue: null,
    comment: null,
    primaryKey: false,
    field: "username",
    autoIncrement: false,
  },
  password: {
    type: DataTypes.CHAR(100),
    allowNull: true,
    defaultValue: null,
    comment: null,
    primaryKey: false,
    field: "password",
    autoIncrement: false,
  },
};

const options = {
  freezeTableName: true,
  timestamps: false,
  tableName: "akun",
  comment: "",
  indexes: [],
};

const akun = db.define("akun", attributes, options);

module.exports = akun;
