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
    it("200: responds with a welcome message", () => {
      return request(app).get("/").expect(200);
    });
    it("404: error handles bad path", () => {
      return request(app)
        .get("/api/bad_path")
        .expect(404)
        .then(({ body }) => expect(body).toEqual({ msg: "Invalid Path" }));
    });
  });
  describe("/api/categories", () => {
    describe("GET", () => {
      it("200: responds with an array of category objects", () => {
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
      it("200: given a review_id, responds with the corresponding review object", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({ body: { review } }) => {
            const mockCategory = {
              slug: expect.toBeString(),
              description: expect.toBeString(),
            };
            expect(review).toHaveProperty("review_id", 1);
            expect(review).toHaveProperty("title", "Agricola");
            expect(review).toHaveProperty("review_body", "Farmyard fun!");
            expect(review).toHaveProperty("designer", "Uwe Rosenberg");
            expect(review).toHaveProperty(
              "review_img_url",
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
            );
            expect(review).toHaveProperty("votes", 1);
            expect(review.category).toMatchObject(mockCategory);

            expect(review).toHaveProperty("owner", "mallionaire");
            expect(review).toHaveProperty("created_at");
          });
      });
      it("responds with 400 for invalid inputs", () => {
        return request(app)
          .get("/api/reviews/NaN")
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
  });
});
