const { signup, init, wallet, deposit, withdrawals, wallet_disabled } = require("../../controllers/users/CreateController.js");
const { read, signin, get_wallet, get_transaksi } = require("../../controllers/users/ReadController.js");

const AkunRoutes = (app) => {
  app.route(`/`).get(read);
  app.route(`/api/v1/init`).post(init);
  app.route(`/api/v1/wallet`).post(wallet);
  app.route(`/api/v1/wallet`).get(get_wallet);
  app.route(`/api/v1/wallet/transactions`).get(get_transaksi);
  app.route(`/api/v1/wallet/deposits`).post(deposit);
  app.route(`/api/v1/wallet/withdrawals`).post(withdrawals);
  app.route(`/api/v1/wallet`).patch(wallet_disabled);
  // app.route(`/login`).post(signin);
  // app.route(`/register`).post(signup);
};

module.exports = AkunRoutes;
