const app = require("../app");
const request = require("supertest");

describe("GET /api/v1/listener/get-ui", () => {
  describe("get html form", () => {
    test("should respond with status code 200", async () => {
      const response = await request(app).get("/api/v1/listener/get-ui");
      expect(response.statusCode).toEqual(200);
    });
    test("should specify text/html in content type header", async () => {
      const response = await request(app).get("/api/v1/listener/get-ui");
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("text/html")
      );
    });
  });

  // here we can test where api can fail,
  describe("get all the valid objects", () => {
    // it
  });
});

