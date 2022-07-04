const express = require("express");
const app = express();

const { getAllCategories } = require("./controllers/categories");

app.get("/api/categories", getAllCategories);

app.get("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
