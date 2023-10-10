module.exports = function error(message, code, description, res) {
    var data = {
      success: false,
      message: message,
      code: code,
      description: description,
    };
    return res.json(data);
  };
  