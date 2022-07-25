const express = require("express");
const app = express();

const cors = require("cors");

const {
  getAllCategories,
  mainRoute,
  getReviewById,
  patchVotes,
  getUsers,
  getAllReviews,
} = require("./controllers/controllers");
const { errorMiddleware } = require("./controllers/error");

app.use(cors());
app.use(express.json());

app.get("/", mainRoute);

app.get("/api/categories", getAllCategories);

app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchVotes);

app.get("/api/users", getUsers);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use(errorMiddleware);

module.exports = app;
