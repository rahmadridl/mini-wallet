// import { AkunRoutes } from "../services/user/userRoutes.js";


// const MainRoutes = (app) => {
//     AkunRoutes(app)
// };

// export default MainRoutes;

const AkunRoutes = require("../services/user/userRoutes.js");

const MainRoutes = (app) => {
  AkunRoutes(app);
};

module.exports = MainRoutes;
