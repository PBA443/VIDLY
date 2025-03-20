const { User } = require("../../../models/user.js");
const request = require("supertest");
const { Genre } = require("../../../models/genre.js");

describe("auth middleware", () => {
  beforeAll(() => {
    server = require("../../../index.js"); // Start server once
  });

  afterAll(async () => {
    if (server) {
      await server.close(); // Close server after all tests
    }
  });
  let token;
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    await Genre.deleteMany({}); // Clean up the database
  });
  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 201 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(201);
  });
});
