const success = require("../../helper/success.js");
const error_handling = require("../../helper/error.js");
const error_handling_v2 = require("../../helper/new_error.js");
const {
  FindOneAkun,
  FindOneCustomerFilter,
  readAllTransaksi,
} = require("../../services/user/userRepository.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtsecret = require("../../auth_config.js");

const read = async (req, res) => {
  try {
    // let getData = await userRepository.FindListAkun();
    let result = [
      { endpoint: "/api/v1/init", method: "POST" },
      { endpoint: "/api/v1/wallet", method: "POST" },
      { endpoint: "/api/v1/wallet", method: "GET" },
      { endpoint: "/api/v1/wallet/transactions", method: "GET" },
      { endpoint: "/api/v1/wallet/deposits", method: "POST" },
      { endpoint: "/api/v1/wallet/withdrawals", method: "POST" },
      { endpoint: "/api/v1/wallet", method: "PATCH" },
    ];

    return success("Read Berhasil", 200, result, res);
  } catch (error) {
    console.log(error);
    return error_handling("Read Gagal", 404, error.message, res);
  }
};

const signin = async (req, res) => {
  try {
    let getData = await FindOneAkun(req.body.username);
    if (!getData) {
      return error_handling("Login Gagal", 422, "Username Salah", res);
    }
    let cekPassword = bcrypt.compareSync(req.body.password, getData.password);
    if (cekPassword) {
      let token = jwt.sign(
        {
          id: getData.id,
        },
        jwtsecret,
        {
          expiresIn: "1460d", // expires in 365 days
        }
      );
      let result = { ...getData.dataValues, token };
      return success("Login Berhasil", 201, result, res);
    } else {
      return error_handling("Login Gagal", 422, "Password Salah", res);
    }
  } catch (error) {
    console.log(error);
    return error_handling("Login Gagal", 404, error.message, res);
  }
};

const get_wallet = async (req, res) => {
  try {
    if (!req.headers?.authorization) {
      return error_handling_v2(
        "fail",
        400,
        { authorization: "Missing data for required field." },
        res
      );
    }
    let getToken = req.headers.authorization.split(" ")[1];
    let get = await FindOneCustomerFilter({
      where: {
        token: getToken,
      },
    });
    if (!get) {
      return error_handling_v2("fail", 400, "Not found", res);
    } else if (get.status == "disabled") {
      return error_handling_v2("fail", 400, "Wallet disabled", res);
    }
    let getTransaksi = await readAllTransaksi({
      where: { customer_id: get.id },
    });
    let jumlah = 0;
    getTransaksi.forEach((element) => {
      if (element.status == "success") {
        if (element.type == "deposit") {
          jumlah += element.amount;
        } else {
          jumlah -= element.amount;
        }
      }
    });
    return res.json({
      status: "success",
      data: {
        wallet: {
          id: get.kode_customer,
          owned_by: get.token,
          status: "enabled",
          enabled_at: new Date(Date.now()),
          balance: jumlah,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return error_handling_v2("fail", 404, error.message, res);
  }
};

const get_transaksi = async (req, res) => {
  try {
    if (!req.headers?.authorization) {
      return error_handling_v2(
        "fail",
        400,
        { authorization: "Missing data for required field." },
        res
      );
    }
    let getToken = req.headers.authorization.split(" ")[1];
    let getCustomer = await FindOneCustomerFilter({
      where: {
        token: getToken,
      },
    });
    if (!getCustomer) {
      return error_handling_v2("fail", 400, "Not found", res);
    } else if (getCustomer.status == "disabled") {
      return error_handling_v2("fail", 400, "Wallet disabled", res);
    }
    let get = await readAllTransaksi({
      where: {
        owned_by: getToken,
      },
    });
    let result = [];
    get.forEach((element) => {
      result.push({
        id: element.kode_transaksi,
        status: element.status,
        transacted_at:
          element.type == "deposit"
            ? element.deposited_at
            : element.withdrawn_at,
        type: element.type,
        amount: element.amount,
        reference_id: element.reference_id,
      });
    });

    if (!get) {
      return res.json({
        status: "success",
        data: {
          transactions: [],
        },
      });
    } else {
      return res.json({
        status: "success",
        data: {
          transactions: result,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return error_handling_v2("fail", 404, error.message, res);
  }
};

module.exports = { read, signin, get_wallet, get_transaksi };
