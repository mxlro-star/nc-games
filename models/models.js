const db = require("../db/connection");

exports.fetchAllCategories = () => {
  return db
    .query("SELECT * FROM categories;")
    .then((categories) => categories.rows);
};
exports.fetchReviewById = (reviewId) => {
  if (!parseInt(reviewId))
    return Promise.reject({ msg: "Invalid Input", statusCode: 400 });

  const queryStr = `SELECT reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.body)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id`;

  return db.query(queryStr, [reviewId]).then((res) => {
    if (res.rowCount === 0)
      return Promise.reject({ msg: "Not Found", statusCode: 404 });
    return res.rows[0];
  });

  // const reviewPromise = db.query(queryStr, [reviewId]);

  // const countPromise = db.query(countQueryStr, [reviewId]);

  // return Promise.all([reviewPromise, countPromise]).then((arr) => {
  //   if (arr[0].rowCount === 0) return [];
  //   console.log(arr[0]);
  //   arr[0].rows[0].comment_count = parseInt(arr[1].rows[0].count);
  //   return arr[0].rows[0];
  // });
};

exports.updateVotes = (reviewId, incVotes) => {
  if (!parseInt(incVotes))
    return Promise.reject({ msg: "Invalid Input", statusCode: 400 });

  const queryStr = `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`;

  return db.query(queryStr, [incVotes, reviewId]).then(({ rows, rowCount }) => {
    if (rowCount === 0)
      return Promise.reject({ msg: "Not Found", statusCode: 404 });
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

exports.fetchAllReviews = () => {
  const queryStr = `SELECT * FROM reviews`;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByReview = (reviewId) => {
  const queryStr = `SELECT comment_id,votes,created_at,author,body,review_id,comment_id FROM comments WHERE comments.review_id = $1;`;

  return db.query(queryStr, [reviewId]).then(({ rows }) => {
    console.log(rows);
    return rows;
  });
};
