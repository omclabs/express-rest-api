const appDebug = process.env.APP_DEBUG || true;

exports.formatReturn = (status, code, data, msg) => {
  let message = msg;
  if (appDebug === 'false' && code > 399) {
    message = 'Oops something wrong';
  }

  const jsonResponse = {
    status,
    code,
    data,
    message,
  };

  return jsonResponse;
};
