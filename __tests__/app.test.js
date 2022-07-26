const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

afterAll(() => {
  db.end();
});
beforeEach(() => {
  return seed(testData);
});

describe("app", () => {
  describe("/", () => {
    it("should respond with a welcome message", () => {
      return request(app).get("/").expect(200);
    });
    it("should respond with 404 when passed an invalid path", () => {
      return request(app)
        .get("/api/bad_path")
        .expect(404)
        .then(({ body }) => expect(body).toEqual({ msg: "Invalid Path" }));
    });
  });
  describe("/api/categories", () => {
    describe("GET", () => {
      it("should respond with an array of category objects", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({ body }) => {
            expect(body.categories).toHaveLength(4);
            body.categories.forEach((category) => {
              expect(category).toHaveProperty("slug");
              expect(category).toHaveProperty("description");
            });
          });
      });
    });
  });
  describe("/api/reviews/:review_id", () => {
    describe("GET", () => {
      it("should respond with the corresponding review object", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then((res) => {
            expect(res.body.review).toEqual({
              title: "Agricola",
              designer: "Uwe Rosenberg",
              owner: "mallionaire",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Farmyard fun!",
              category: "euro game",
              created_at: "2021-01-18T10:00:20.514Z",
              votes: 1,
              comment_count: 0,
            });
          });
      });
      it("should include comment_count in review object", () => {
        return request(app)
          .get("/api/reviews/2")
          .expect(200)
          .then(({ body: { review } }) => {
            expect(review).toHaveProperty("comment_count");
          });
      });
      it("responds with 400 for invalid inputs", () => {
        return request(app)
          .get("/api/reviews/not_a_number")
          .expect(400)
          .then(({ body }) => expect(body).toEqual({ msg: "Invalid Input" }));
      });
      it("responds with 404 for undefined resource", () => {
        return request(app)
          .get("/api/reviews/404")
          .expect(404)
          .then(({ body }) => expect(body).toEqual({ msg: "Not Found" }));
      });
    });
    describe("PATCH", () => {
      it("should increment votes", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: 1 })
          .expect(200)

          .then(({ body: { review } }) => {
            expect(review.votes).toBe(2);
          });
      });
      it("should decrement votes", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: -1 })
          .expect(200)

          .then(({ body: { review } }) => {
            expect(review.votes).toBe(0);
          });
      });
      it("should not allow votes to go below 0", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: -5 })
          .expect(200)

          .then(({ body: { review } }) => {
            expect(review.votes).toBe(0);
          });
      });
      it("should respond with the corresponding review object", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: 5 })

          .then(({ body: { review } }) => {
            expect(review).toHaveProperty("review_id", 1);
            expect(review).toHaveProperty("title", "Agricola");
            expect(review).toHaveProperty("review_body", "Farmyard fun!");
            expect(review).toHaveProperty("designer", "Uwe Rosenberg");
            expect(review).toHaveProperty(
              "review_img_url",
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
            );
            expect(review).toHaveProperty("votes", 6);
            expect(review).toHaveProperty("category", "euro game");

            expect(review).toHaveProperty("owner", "mallionaire");
            expect(review).toHaveProperty("created_at");
          });
      });
      it("should respond with 400 for invalid inputs", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: "a" })
          .expect(400);
      });
      it("should respond with 400 when inc_votes is not defined", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ notdefined: -1 })
          .expect(400);
      });
      it("should respond with 404 for undefined resource", () => {
        return request(app)
          .patch("/api/reviews/200")
          .send({ inc_votes: 1 })
          .expect(404);
      });
    });
  });
  describe("/api/users", () => {
    describe("GET", () => {
      it("should respond with all users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toHaveProperty("username");
              expect(user).toHaveProperty("name");
              expect(user).toHaveProperty("avatar_url");
            });
          });
      });
    });
  });
});

describe("/api/reviews", () => {
  describe("GET", () => {
    it("should respond with all reviews", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toHaveProperty("title");
            expect(review).toHaveProperty("designer");
            expect(review).toHaveProperty("owner");
            expect(review).toHaveProperty("review_img_url");
            expect(review).toHaveProperty("review_body");
            expect(review).toHaveProperty("category");
            expect(review).toHaveProperty("created_at");
            expect(review).toHaveProperty("votes");
          });
        });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    it("should respond with all comments for given review id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(3);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("review_id");
          });
        });
    });
  });
  describe("POST", () => {
    it("will add a comment to a review", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .send({ username: "philippaclaire9", body: "Excellent game!" })
        .expect(201)
        .then(({ body: { comments } }) => {
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("review_id");
          });
        });
    });
  });
});
