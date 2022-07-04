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
  describe.only("GET /api/categories", () => {
    it("responds with an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.slugs).toEqual(mockData.categoryData);
        });
    });
    it("category objects must contain `slug` and `description` properties", () => {
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
