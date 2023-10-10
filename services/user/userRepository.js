const akun = require("../../model/user.js");
const customer = require("../../model/customer.js");
const transaksi = require("../../model/transaksi.js");
const { Op } = require("sequelize");

const createAkun = async (data, transaction) => {
  const t = transaction ? transaction : await akun.sequelize.transaction();
  try {
    let result = await akun.create(data, { transaction });
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error("[EXCEPTION] createAkun", error);
    throw new Error(error);
  }
};

const FindOneAkun = async (nama) => {
  try {
    // console.log('data_nama' + nama);
    let result = await akun.findOne({
      where: {
        username: nama,
        // nama: nama
      },
    });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] FindOneAkun", error);
    throw new Error(error);
  }
};

const FindListAkun = async () => {
  try {
    // console.log('data_nama' + nama);
    let result = await akun.findAll({});
    return result;
  } catch (error) {
    console.error("[EXCEPTION] FindListAkun", error);
    throw new Error(error);
  }
};

const createCustomer = async (data, transaction) => {
  const t = transaction ? transaction : await customer.sequelize.transaction();
  try {
    let result = await customer.create(data, { transaction });
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error("[EXCEPTION] createCustomer", error);
    throw new Error(error);
  }
};

const UpdateCustomer = async (data, filter, transaction) => {
  const t = transaction ? transaction : await customer.sequelize.transaction();
  try {
    let result = await customer.update(data, { ...filter, transaction });
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error("[EXCEPTION] UpdateCustomer", error);
    throw new Error(error);
  }
};

const FindOneCustomer = async (nama) => {
  try {
    let result = await customer.findOne({
      where: {
        kode_customer: nama,
      },
    });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] FindOneCustomer", error);
    throw new Error(error);
  }
};

const FindOneCustomerFilter = async (filter) => {
  try {
    let result = await customer.findOne({
      ...filter,
    });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] FindOneCustomerFilter", error);
    throw new Error(error);
  }
};

const createTransaksi = async (data, transaction) => {
  const t = transaction ? transaction : await transaksi.sequelize.transaction();
  try {
    let result = await transaksi.create(data, { transaction });
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error("[EXCEPTION] createTransaksi", error);
    throw new Error(error);
  }
};

const readAllTransaksi = async (filter) => {
  try {
    let result = await transaksi.findAll({
      ...filter,
    });
    return result;
  } catch (error) {
    console.error("[EXCEPTION] readAllTransaksi", error);
    throw new Error(error);
  }
};

module.exports = {
  createAkun,
  FindOneAkun,
  FindListAkun,
  createCustomer,
  UpdateCustomer,
  FindOneCustomer,
  FindOneCustomerFilter,
  createTransaksi,
  readAllTransaksi,
};
