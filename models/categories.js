const db = require("../db/connection");

exports.fetchAllCategories = () => {
  return db
    .query("SELECT * FROM categories;")
    .then((categories) => categories.rows);
};
exports.fetchReviewById = (reviewId) => {
  const queryStr = `SELECT review_id,title,review_body,designer,review_img_url,votes,owner,created_at FROM reviews JOIN categories ON reviews.category = categories.slug WHERE review_id = $1;`;
  return Promise.all([
    db.query(queryStr, [reviewId]),
    db.query(
      `SELECT slug, description FROM categories JOIN reviews ON categories.slug = reviews.category;`
    ),
  ]).then((resultArr) => {
    if (resultArr[0].rowCount === 0) return [];

    resultArr[0].rows[0].category = resultArr[1].rows[0];
    return resultArr[0].rows[0];
  });
};
