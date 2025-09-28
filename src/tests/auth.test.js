const request = require("supertest");
const app = require("../app");

describe("Authentication Endpoints", () => {
  let authToken;
  const testUser = {
    email: "test@example.com",
    password: "passwordtest24",
    name: "Aten Test",
  };

  test("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(testUser.email);
  });

  test("should login with valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty("token");
    authToken = response.body.token;
  });

  test("should access protected route with valid token", async () => {
    const response = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.user.email).toBe(testUser.email);
  });
});
