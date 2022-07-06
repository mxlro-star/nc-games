exports.errorMiddleware = (err, req, res, next) => {
  const { msg } = err;
  res.status(err.statusCode).send({ msg });
};
