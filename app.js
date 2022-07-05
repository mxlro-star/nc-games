const express = require("express");
const app = express();

const { getAllCategories, apiIndex } = require("./controllers/categories");
const { errorMiddleware } = require("./controllers/error");

app.get("/api", apiIndex);
app.get("/api/categories", getAllCategories);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use(errorMiddleware);
module.exports = app;
