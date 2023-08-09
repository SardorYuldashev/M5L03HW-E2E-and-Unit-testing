const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('Lists E2E', () => {
  let token;
  let list;

  beforeAll(async () => {
    await db.connect();

    return db.clean();
  });

  afterAll(() => {
    return db.disconnect();
  });

  describe("Token olish", () => {
    it("Ro'yxatdan o'tkazish", (done) => {
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

    it(`Login qilish`, async () => {
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

  describe("POST/lists", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/lists")
        .set("Authorization", null)
        .set('Accept', 'application/json')
        .send({
          name: "today"
        })
        .expect('Content-Type', /json/)
        .expect(401, done);
    });

    it(`"name" yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/lists")
        .set("Authorization", token)
        .expect(400, done);
    });

    it("Yangi list qo'shadi", async () => {
      const response = await request(app)
        .post("/lists")
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          name: "New list"
        })
        
        expect(response.body.data).toBeDefined();
        list = response.body.data;
    });
  });

  describe("GET/lists", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .get("/lists")
        .set("Authorization", null)
        .expect(401, done);
    });

    it(`token yuborsa list qaytaradi`, (done) => {
      request(app)
        .get("/lists")
        .set("Authorization", token)
        .expect(200, done);
    });
  });

  describe("GET/lists/:id", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .get(`/lists/${list._id}`)
        .set("Authorization", null)
        .expect(401, done);
    });

    it(`list topilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .get(`/lists/64d3cccfb34c584f65b78517`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it(`list mavjud bo'lsa listni qaytaradi`, (done) => {
      request(app)
        .get(`/lists/${list._id}`)
        .set("Authorization", token)
        .expect(200, done);
    });
  });

  describe("PATCH/lists/:id", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .patch(`/lists/${list._id}`)
        .set("Authorization", null)
        .expect(401, done);
    });

    it(`list topilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .patch(`/lists/64d3cccfb34c584f65b78517`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it("list topilsa tahrirlaydi", (done) => {
      request(app)
        .patch(`/lists/${list._id}`)
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          name: "New list edited"
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe("DELETE/lists/:id", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .delete(`/lists/${list._id}`)
        .set("Authorization", null)
        .expect(401, done);
    });

    it(`list topilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .delete(`/lists/64d3cccfb34c584f65b78517`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it(`list bor bo'lsa o'chiradi`, (done) => {
      request(app)
        .delete(`/lists/${list._id}`)
        .set("Authorization", token)
        .expect(200, done);
    });
  });

});