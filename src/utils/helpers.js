const appDebug = process.env.APP_DEBUG || true;

exports.formatReturn = (status, code, data, message) => {
  if (appDebug == "false" && code > 399) {
    message = "Oops something wrong";
  }

  let jsonResponse = {
    status: status,
    code: code,
    data: data,
    message: message,
  };

  return jsonResponse;
};
