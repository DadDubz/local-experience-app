const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/server");
const User = require("../../src/models/User");

describe("API Tests", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    // Cleanup database and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await User.deleteMany({});
  });

  describe("Auth Endpoints", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
    });

    it("should login user", async () => {
      // First create a user
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      // Test login
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });

  describe("Protected Endpoints", () => {
    let token;
    let userId;

    beforeEach(async () => {
      // Create a user and get token for protected route tests
      const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      userId = user._id;

      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      token = res.body.token;
    });

    it("should access protected route with token", async () => {
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user._id).toBe(userId.toString());
    });
  });
});