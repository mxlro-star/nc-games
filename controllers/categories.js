const { fetchAllCategories } = require("../models/categories");

exports.apiIndex = (req, res) => {
  res.status(200).send({ msg: "OK" });
};

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((slugs) => res.status(200).send({ slugs }))
    .catch((err) => next(err));
};
