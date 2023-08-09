const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe("Todos E2E", () => {
  let token;
  let list;
  let todo;

  beforeAll(async () => {
    await db.connect();

    return db.clean();
  });

  afterAll(() => {
    return db.disconnect();
  });

  describe("Token olish va list yaratish", () => {
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

    it("List yaratish", async () => {
      const response = await request(app)
        .post("/lists")
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          name: "New mock list"
        })

      expect(response.body.data).toBeDefined();
      list = response.body.data;
    });
  });

  describe("POST/todos", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/todos")
        .set("Authorization", null)
        .set('Accept', 'application/json')
        .send({
          text: "New todo",
          list: list._id
        })
        .expect('Content-Type', /json/)
        .expect(401, done);
    });

    it(`"text" yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/todos")
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          list: list._id
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it(`"list" yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/todos")
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          text: "New todo"
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it(`"list" topilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .post("/todos")
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          text: "New todo",
          list: "64d3cccfb34c584f65b78517"
        })
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    it("Yangi todo qo'shadi", async () => {
      const response = await request(app)
        .post("/todos")
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          text: "New todo",
          list: list._id
        })

      expect(response.body.data).toBeDefined();
      expect(response.status).toBe(201);
      todo = response.body.data;
    });
  });

  describe("GET/todos", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .get("/todos")
        .set("Authorization", null)
        .expect(401, done);
    });

    it(`token yuborsa todolarni qaytaradi`, (done) => {
      request(app)
        .get("/todos")
        .set("Authorization", token)
        .expect(200, done);
    });
  });

  describe("GET/todos/:id", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .get(`/todos/${todo._id}`)
        .set("Authorization", null)
        .expect(401, done);
    });

    it(`todo topilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .get(`/todos/64d3d435aaaf6d103dc55958`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it(`token va id to'g'ri yuborsa todoni qaytaradi`, (done) => {
      request(app)
        .get(`/todos/${todo._id}`)
        .set("Authorization", token)
        .expect(200, done);
    });
  });

  describe("PATCH/todos/:id", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .patch(`/todos/${todo._id}`)
        .set("Authorization", null)
        .set('Accept', 'application/json')
        .send({
          text: "New todo edited"
        })
        .expect('Content-Type', /json/)
        .expect(401, done);
    });

    it(`todo topilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .patch(`/todos/64d3d435aaaf6d103dc55958`)
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          text: "New todo edited"
        })
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    it(`list topilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .patch(`/todos/${todo._id}`)
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          list: "64d3d5e04da5ac1e19891163"
        })
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    it(`todoni tahrirlaydi`, (done) => {
      request(app)
        .patch(`/todos/${todo._id}`)
        .set("Authorization", token)
        .set('Accept', 'application/json')
        .send({
          text: "New todo edited",
          list: list._id
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe("DELETE/todos", () => {
    it(`token yuborilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .delete(`/todos/${todo._id}`)
        .set("Authorization", null)
        .expect(401, done);
    });

    it(`todo topilmasa xatolik qaytaradi`, (done) => {
      request(app)
        .delete(`/todos/64d3d435aaaf6d103dc55958`)
        .set("Authorization", token)
        .expect(404, done);
    });

    it(`token va id to'g'ri yuborilsa todo o'chiriladi`, (done) => {
      request(app)
        .delete(`/todos/${todo._id}`)
        .set("Authorization", token)
        .expect(200, done);
    });
  });
});