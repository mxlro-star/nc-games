const { fetchAllCategories } = require("../models/categories");

exports.mainRoute = (req, res) => {
  res.status(200).send({ msg: "Welcome to the main route" });
};

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => res.status(200).send({ categories }))
    .catch((err) => next(err));
};
