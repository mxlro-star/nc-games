const db = require("../db/connection");

exports.fetchAllCategories = () => {
  return db
    .query("SELECT * FROM categories;")
    .then((categories) => categories.rows);
};
exports.fetchReviewById = (reviewId) => {
  if (!parseInt(reviewId))
    return Promise.reject({ msg: "Invalid Input", statusCode: 400 });

  const queryStr = `SELECT review_id,title,review_body,designer,review_img_url,votes,owner,category,created_at FROM reviews WHERE review_id = $1;`;

  return db.query(queryStr, [reviewId]).then(({ rows, rowCount }) => {
    if (rowCount === 0) return [];

    return rows[0];
  });
};

exports.updateVotes = (reviewId, incVotes) => {
  if (!parseInt(incVotes))
    return Promise.reject({ msg: "Invalid Input", statusCode: 400 });

  const queryStr = `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`;

  return db.query(queryStr, [incVotes, reviewId]).then(({ rows, rowCount }) => {
    if (rowCount === 0) return [];
    if (rows[0].votes < 0) rows[0].votes = 0;

    return rows[0];
  });
};

exports.fetchUsers = () => {
  const queryStr = `SELECT * FROM users;`;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
