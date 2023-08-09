const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe("Users E2E", () => {
  let token;

  beforeAll(async () => {
    await db.connect();

    return db.clean();
  });

  afterAll(() => {
    return db.disconnect();
  });

  describe("POST/users/register", () => {

    it(`"first_name" yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/users/register")
        .set('Accept', 'application/json')
        .send({
          last_name: "Karimov",
          username: "islom",
          password: "1234"
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it(`"last_name" yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/users/register")
        .set('Accept', 'application/json')
        .send({
          first_name: "Islom",
          username: "islom",
          password: "1234"
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it(`"username" yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/users/register")
        .set('Accept', 'application/json')
        .send({
          first_name: "Karimov",
          last_name: "Karimov",
          password: "1234"
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it(`"password" yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/users/register")
        .set('Accept', 'application/json')
        .send({
          first_name: "Karimov",
          last_name: "Karimov",
          username: "islom"
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it("Foydalanuvchini ro'yxatdan o'tkazishi kerak", (done) => {
      request(app)
        .post("/users/register")
        .set('Accept', 'application/json')
        .send({
          first_name: "Karimov",
          last_name: "Karimov",
          username: "islom",
          password: "1234"
        })
        .expect('Content-Type', /json/)
        .expect(201, done);
    });

  });

  describe("POST/users/login", () => {

    it(`"username" yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/users/login")
        .set('Accept', 'application/json')
        .send({
          password: "1234"
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it(`"password" yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/users/login")
        .set('Accept', 'application/json')
        .send({
          username: "islom"
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it(`foydalanuvchi topilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/users/login")
        .set('Accept', 'application/json')
        .send({
          username: "akbarshox",
          password: "1234"
        })
        .expect('Content-Type', /json/)
        .expect(401, done);
    });

    it(`password notog'ri bo'lsa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/users/login")
        .set('Accept', 'application/json')
        .send({
          username: "islom",
          password: "123456"
        })
        .expect('Content-Type', /json/)
        .expect(401, done);
    });

    it(`username va password tog'ri bo'lsa token qaytaradi`, async () => {
      const response = await request(app)
        .post("/users/login")
        .set('Accept', 'application/json')
        .send({
          username: "islom",
          password: "1234"
        });

      expect(response.body.data).toBeDefined();
      expect(response.status).toBe(200);
      token = response.body.data;
    });

  });

  describe("GET/users/me", () => {
    it(`foydalanuvchi topilmasa xatolik qaytaradi`, async () => {
      const response = await request(app)
        .get("/users/me")
        .set("Authorization", null);

      expect(response.status).toBe(401);
    });

    it(`foydalanuvchi topilsa ma'lumotlarni qaytaradi`, async () => {
      const response = await request(app)
        .get("/users/me")
        .set("Authorization", token);

      expect(response.status).toBe(200);
    });

  });

  describe("PATCH/users/me", () => {
    it(`foydalanuvchi topilmasa xatolik qaytaradi`, async () => {
      const response = await request(app)
        .patch("/users/me")
        .set("Authorization", null);

      expect(response.status).toBe(401);
    });

    it("foydalanuvchi topilsa tahrirlaydi", (done) => {
      request(app)
        .patch("/users/me")
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          first_name: "ikrom"
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe("DELETE/users/me", () => {
    it(`foydalanuvchi topilmasa xatolik qaytaradi`, async () => {
      const response = await request(app)
        .delete("/users/me")
        .set("Authorization", null);

      expect(response.status).toBe(401);
    });

    it("foydalanuvchi topilsa o'chiradi", (done) => {
      request(app)
        .delete("/users/me")
        .set("Authorization", token)
        .expect(200, done);
    })
  });
});