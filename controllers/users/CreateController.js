const success = require("../../helper/success.js");
const error_handling = require("../../helper/error.js");
const error_handling_v2 = require("../../helper/new_error.js");
const uuid = require("uuid");
const {
  FindOneAkun,
  createAkun,
  createCustomer,
  FindOneCustomer,
  FindOneCustomerFilter,
  UpdateCustomer,
  createTransaksi,
  readAllTransaksi,
} = require("../../services/user/userRepository.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtsecret = require("../../auth_config.js");

const signup = async (req, res) => {
  try {
    let result = await createAkun({
      ...req.body,
      password: bcrypt.hashSync(req.body.password),
    });
    return success("Register Berhasil", 201, result, res);
  } catch (error) {
    console.log(error);
    return error_handling("Register Gagal", 404, error.message, res);
  }
};

const init = async (req, res) => {
  try {
    if (!req.body?.customer_xid) {
      return error_handling_v2(
        "fail",
        400,
        { customer_xid: "Missing data for required field." },
        res
      );
    }
    let check = await FindOneCustomer(req.body.customer_xid);
    if (check) {
      return error_handling_v2(
        "fail",
        400,
        { customer_xid: "Already exist." },
        res
      );
    }
    const id = uuid.v4().replace(/-/g, "");
    let result = await createCustomer({
      kode_customer: req.body.customer_xid,
      token: id,
      status: "disabled",
    });
    // return success("Register Berhasil", 201, result, res);
    return res.json({
      data: {
        token: id,
      },
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return error_handling_v2("fail", 404, error.message, res);
  }
};

const wallet = async (req, res) => {
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
    } else {
      if (get.status == "enabled") {
        return error_handling_v2("fail", 400, "Already enabled", res);
      } else {
        let change = await UpdateCustomer(
          {
            status: "enabled",
            enabled_at: new Date(Date.now()),
          },
          {
            where: {
              id: get.id,
            },
          }
        );
      }
    }
    let cek = await readAllTransaksi({
      where: {
        customer_id: get.id,
      },
    });
    let jumlah = 0;
    cek.forEach((element) => {
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

const wallet_disabled = async (req, res) => {
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
    } else {
      if (get.status == "disabled") {
        return error_handling_v2("fail", 400, "Already disabled", res);
      } else {
        if (req.body.is_disabled) {
          let change = await UpdateCustomer(
            {
              status: "disabled",
              disabled_at: new Date(Date.now()),
            },
            {
              where: {
                id: get.id,
              },
            }
          );
        }
      }
    }
    let cek = await readAllTransaksi({
      where: {
        customer_id: get.id,
      },
    });
    let jumlah = 0;
    cek.forEach((element) => {
      if (element.status == "success") {
        if (element.type == "deposit") {
          jumlah += element.amount;
        } else {
          jumlah -= element.amount;
        }
      }
    });
    if (req.body.is_disabled) {
      return res.json({
        status: "success",
        data: {
          wallet: {
            id: get.kode_customer,
            owned_by: get.token,
            status: "disabled",
            disabled_at: new Date(Date.now()),
            balance: jumlah,
          },
        },
      });
    } else {
      return res.json({
        status: "failed",
        data: {
          wallet: {
            id: get.kode_customer,
            owned_by: get.token,
            status: "enabled",
            enabled_at: get.enabled_at,
            balance: jumlah,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    return error_handling_v2("fail", 404, error.message, res);
  }
};

const deposit = async (req, res) => {
  try {
    if (!req.headers?.authorization) {
      return error_handling_v2(
        "fail",
        400,
        { authorization: "Missing data for required field." },
        res
      );
    }
    if (!req.body?.amount) {
      return error_handling_v2(
        "fail",
        400,
        { amount: "Missing data for required field." },
        res
      );
    }
    if (!req.body?.reference_id) {
      return error_handling_v2(
        "fail",
        400,
        { reference_id: "Missing data for required field." },
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
    const id = uuid.v4();
    let buat = await createTransaksi({
      kode_transaksi: id,
      amount: req.body.amount,
      reference_id: req.body.reference_id,
      deposited_by: get.kode_customer,
      deposited_at: new Date(Date.now()),
      type: "deposit",
      customer_id: get.id,
      status: "success",
      owned_by: getToken,
    });
    return res.json({
      status: "success",
      data: {
        deposit: {
          id,
          deposited_by: get.kode_customer,
          status: "success",
          deposited_at: new Date(Date.now()),
          amount: req.body.amount,
          reference_id: req.body.reference_id,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return error_handling_v2("fail", 404, error.message, res);
  }
};

const withdrawals = async (req, res) => {
  try {
    if (!req.headers?.authorization) {
      return error_handling_v2(
        "fail",
        400,
        { authorization: "Missing data for required field." },
        res
      );
    }
    if (!req.body?.amount) {
      return error_handling_v2(
        "fail",
        400,
        { amount: "Missing data for required field." },
        res
      );
    }
    if (!req.body?.reference_id) {
      return error_handling_v2(
        "fail",
        400,
        { reference_id: "Missing data for required field." },
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
    const id = uuid.v4();
    let cek = await readAllTransaksi({
      where: {
        customer_id: get.id,
      },
    });
    let jumlah = 0;
    cek.forEach((element) => {
      if (element.status == "success") {
        if (element.type == "deposit") {
          jumlah += element.amount;
        } else {
          jumlah -= element.amount;
        }
      }
    });
    let hasil = true;
    if (req.body.amount > jumlah) {
      let buat = await createTransaksi({
        kode_transaksi: id,
        amount: req.body.amount,
        reference_id: req.body.reference_id,
        withdrawn_by: get.kode_customer,
        withdrawn_at: new Date(Date.now()),
        type: "withdrawal",
        customer_id: get.id,
        owned_by: getToken,
        status: "failed",
      });
      hasil = false;
    } else {
      let buat = await createTransaksi({
        kode_transaksi: id,
        amount: req.body.amount,
        reference_id: req.body.reference_id,
        withdrawn_by: get.kode_customer,
        withdrawn_at: new Date(Date.now()),
        type: "withdrawal",
        customer_id: get.id,
        owned_by: getToken,
        status: "success",
      });
    }
    if (hasil) {
      return res.json({
        status: "success",
        data: {
          deposit: {
            id,
            withdrawn_by: get.kode_customer,
            status: "success",
            withdrawn_at: new Date(Date.now()),
            amount: req.body.amount,
            reference_id: req.body.reference_id,
          },
        },
      });
    } else {
      return res.json({
        status: "failed",
        data: {
          deposit: {
            id,
            withdrawn_by: get.kode_customer,
            status: "failed",
            withdrawn_at: new Date(Date.now()),
            amount: req.body.amount,
            reference_id: req.body.reference_id,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    return error_handling_v2("fail", 404, error.message, res);
  }
};

module.exports = { signup, init, wallet, deposit, withdrawals, wallet_disabled };
