const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const mockData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

afterAll(() => {
  db.end();
});
beforeEach(() => {
  return seed(mockData);
});

describe("app", () => {
  describe("/api", () => {
    it("200: responds with msg `OK``", () => {
      return request(app).get("/api").expect(200);
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
            expect(body.slugs).toEqual(mockData.categoryData);
          });
      });
      it("200: category objects must contain `slug` and `description` properties", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({ body }) => {
            expect(body.slugs[0].slug).toEqual(mockData.categoryData[0].slug);
            expect(body.slugs[0].description).toEqual(
              mockData.categoryData[0].description
            );
          });
      });
    });
  });
});
