const express = require("express");
const app = express();
const {
  getAllCategories,
  mainRoute,
  getReviewById,
  patchVotes,

  getUsers,

} = require("./controllers/categories");
const { errorMiddleware } = require("./controllers/error");

app.use(express.json());

app.get("/", mainRoute);

app.get("/api/categories", getAllCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchVotes);

app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchVotes);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use(errorMiddleware);

module.exports = app;
