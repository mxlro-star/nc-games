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
          .then(({ body: { review } }) => {
            expect(review).toHaveProperty("review_id", 1);
            expect(review).toHaveProperty("title", "Agricola");
            expect(review).toHaveProperty("review_body", "Farmyard fun!");
            expect(review).toHaveProperty("designer", "Uwe Rosenberg");
            expect(review).toHaveProperty(
              "review_img_url",
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
            );
            expect(review).toHaveProperty("votes", 1);
            expect(review).toHaveProperty("category", "euro game");

            expect(review).toHaveProperty("owner", "mallionaire");
            expect(review).toHaveProperty("created_at");
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
          .then(({ body }) => {
            expect(body.votes).toBe(2);
          });
      });
      it("should decrement votes", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.votes).toBe(0);
          });
      });
      it("should not allow votes to go below 0", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: -5 })
          .expect(200)
          .then(({ body }) => {
            expect(body.votes).toBe(0);
          });
      });
      it("should respond with the corresponding review object", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: 5 })
          .then(({ body }) => {
            expect(body).toHaveProperty("review_id", 1);
            expect(body).toHaveProperty("title", "Agricola");
            expect(body).toHaveProperty("review_body", "Farmyard fun!");
            expect(body).toHaveProperty("designer", "Uwe Rosenberg");
            expect(body).toHaveProperty(
              "review_img_url",
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
            );
            expect(body).toHaveProperty("votes", 6);
            expect(body).toHaveProperty("category", "euro game");

            expect(body).toHaveProperty("owner", "mallionaire");
            expect(body).toHaveProperty("created_at");
          });
      });
      it("should respond with 400 for invalid inputs", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: "a" })
          .expect(400);
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
