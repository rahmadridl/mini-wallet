module.exports = function success(
  message,
  code,
  data,
  res,
  total,
  page,
  page_size
) {
  console.log(message);
  if (
    total === undefined &&
    page === undefined &&
    page_size === undefined &&
    data === undefined
  ) {
    var data = {
      success: true,
      code: code,
      message: message,
    };
    return res.json(data);
  }

  if (
    total === undefined &&
    page === undefined &&
    page_size === undefined &&
    data !== undefined
  ) {
    var data = {
      success: true,
      code: code,
      message: message,
      payload: data,
    };
    return res.json(data);
  }

  if (
    total !== undefined &&
    page !== undefined &&
    page_size !== undefined &&
    data !== undefined
  ) {
    var data = {
      success: true,
      code: code,
      message: message,
      properties: {
        page: page,
        total: total,
        page_size: page_size,
      },
      payload: data,
    };
    return res.json(data);
  }

  if (
    total !== undefined &&
    page == undefined &&
    page_size == undefined &&
    data !== undefined
  ) {
    var data = {
      success: true,
      code: code,
      message: message,
      properties: {
        total: total,
      },
      payload: data,
    };
    return res.json(data);
  }
};
