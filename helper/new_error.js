module.exports = function error(message, code, description, res) {
  var data = {
    data: {
      error: description,
    },
    status: message,
  };
  console.log(data);
  res.status(code)
  return res.json(data);
};
