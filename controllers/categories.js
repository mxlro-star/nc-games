const {
  fetchAllCategories,
  fetchReviewById,
  updateVotes,

  fetchUsers,
} = require("../models/categories");

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

  fetchReviewById(reviewId)
    .then((review) => {
      if (review.length === 0)
        return Promise.reject({ msg: "Not Found", statusCode: 404 });

      res.status(200).send({ review });
    })
    .catch((err) => next(err));
};

exports.patchVotes = (req, res, next) => {
  const reviewId = req.params.review_id;
  const incVotes = req.body.inc_votes;

  updateVotes(reviewId, incVotes)
    .then((review) => {
      if (review.length === 0)
        return Promise.reject({ msg: "Not Found", statusCode: 404 });
      res.status(200).send({ review });
    })
    .catch((err) => next(err));
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch((err) => next(err));
};
