const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
const MainRoutes = require("./routes/routes.js");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const upload = multer();

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));
app.use(upload.none());

MainRoutes(app);

app.listen(process.env.PORT, () => console.log("Server is running on port " + process.env.PORT));
