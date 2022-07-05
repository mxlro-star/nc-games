const { fetchAllCategories, fetchReviewById } = require("../models/categories");

exports.mainRoute = (req, res) => {
  res.status(200).send({ msg: "Welcome to the main route" });
};

exports.getAllCategories = (req, res, next) => {
  fetchAllCategories()
    .then((categories) => res.status(200).send({ categories }))
    .catch((err) => next(err));
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;

  if (!parseInt(reviewId))
    return res.status(400).send({ msg: "Invalid Input" });

  fetchReviewById(reviewId)
    .then((review) => {
      if (review.length === 0) res.status(404).send({ msg: "Not Found" });

      res.status(200).send({ review });
    })
    .catch((err) => next(err));
};
