exports.formatReturn = (status, code, data) => {
  const jsonResponse = {
    status,
    code,
    data,
  };

  return jsonResponse;
};
