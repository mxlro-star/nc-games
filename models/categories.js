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
