const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelizeInstance = new Sequelize(process.env.POSTGRES_URL+ "?sslmode=require", {
  dialectModule: require("pg"),
});

sequelizeInstance
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelizeInstance;
