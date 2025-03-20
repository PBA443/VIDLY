const request = require("supertest");
const { Genre } = require("../../../models/genre.js");
const { User } = require("../../../models/user.js");
const mongoose = require("mongoose");
const { before } = require("lodash");
let server;
describe("/api/genres", () => {
  beforeAll(async () => {
    server = require("../../../index.js"); // Start server once
    await Genre.deleteMany({});
  });

  afterAll(async () => {
    if (server) {
      await server.close(); // Close server after all tests
      await Genre.deleteMany({});
    }
  });
  afterEach(async () => {
    await Genre.deleteMany({}); // Clean up the database
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
    });
  });
});

describe("GET /:id", () => {
  it("should return a genre if valid id is passed", async () => {
    const genre = new Genre({ name: "genre1" });
    await genre.save();

    const res = await request(server).get("/api/genres/" + genre._id);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", genre.name);
  });

  it("should return a 404 if invalid id is passed", async () => {
    const res = await request(server).get("/api/genres/1");

    expect(res.status).toBe(404);
  });
  it("should return a 404 if no genres for that id", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(server).get("/api/genres/" + id);

    expect(res.status).toBe(404);
  });
});

describe("POST /", () => {
  let token;
  let name;
  const exec = async () => {
    return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({
        name,
      });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
    name = "genre1";
  });
  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if genre is less than 3 characters", async () => {
    name = "gem";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 400 if genre is more than 20 characters", async () => {
    name = new Array(30).join("b");
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should save the genra if it is valid", async () => {
    await exec();
    const genre = await Genre.find({ name: "genre1" });
    expect(genre).not.toBeNull();
  });
  it("should return the genra if it is valid", async () => {
    const res = await exec();
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("name", "genre1");
  });
});
