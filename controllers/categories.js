const { fetchAllCategories } = require("../models/categories");

exports.getAllCategories = (req, res) => {
  fetchAllCategories()
    .then((slugs) => res.status(200).send({ slugs }))
    .catch(() => res.status(500).send({ msg: "Internal Server Error" }));
};
