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
});
