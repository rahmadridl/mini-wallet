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
  kode_customer: {
    type: DataTypes.CHAR(100),
    allowNull: true,
    defaultValue: null,
    comment: null,
    primaryKey: false,
    field: "kode_customer",
    autoIncrement: false,
  },
  token: {
    type: DataTypes.CHAR(100),
    allowNull: true,
    defaultValue: null,
    comment: null,
    primaryKey: false,
    field: "token",
    autoIncrement: false,
  },
  status: {
    type: DataTypes.CHAR(100),
    allowNull: true,
    defaultValue: null,
    comment: null,
    primaryKey: false,
    field: "status",
    autoIncrement: false,
  },
  enabled_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    comment: null,
    primaryKey: false,
    field: "enabled_at",
    autoIncrement: false,
  },
  disabled_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    comment: null,
    primaryKey: false,
    field: "disabled_at",
    autoIncrement: false,
  },
};

const options = {
  freezeTableName: true,
  timestamps: false,
  tableName: "customer",
  comment: "",
  indexes: [],
};

const customer = db.define("customer", attributes, options);

module.exports = customer;
