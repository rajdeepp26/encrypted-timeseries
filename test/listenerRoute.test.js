const app = require("../server");
const request = require("supertest");

describe("GET /api/v1/listener", () => {
  describe("send encrypted data", () => {
    // it
    test("should respond with status code 200", async () => {
      const response = await request(app).post("/api/v1/listener");
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

// delete the test db before testing
describe("POST /api/v1/listener", () => {
  describe("send encrypted data", () => {
    beforeEach(async() => {
      console.log("before Each clear the db");
    //   await Valid.deleteMany({})
    });
    // it
    // test("should respond with status code 200", async () => {
    //   const response = await request(app).post("/api/v1/listener").send({
    //   });
    //   expect(response.statusCode).toEqual(201);
    // });
  });
});