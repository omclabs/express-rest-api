const chai = require("chai");
const chaiHttp = require("chai-http");
const { response } = require("express");
const app = require("../app");
const authorization;

chai.should();
chai.use(chaiHttp);

describe("v1 api authentication route", () => {
  const register = "/api/v1/register";
  const login = "/api/v1/login";
  const logout = "/api/v1/logout";
  const token = "/api/v1/token";

  before(async () => {
    const result = await chai.request(server).post(signup).send(preSave);
    expect(result.status).to.equal(200);
    authorization = result.body.token;
  });

  // after all test have run we drop our test database
  after("droping test db", async () => {
    await mongoose.connection.dropDatabase(() => {
      console.log("\n Test database dropped");
    });
    await mongoose.connection.close();
  });

  describe("get /api/v1", () => {
    it("Should return 401 without token authorization", (done) => {
      chai
        .request(app)
        .get("/api/v1/")
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  //   describe("post /api/v1/register", () => {
  //     it("Should register new user", (done) => {
  //       let params = {
  //         name: "test",
  //         email: "user@test.com",
  //         password: "12345678",
  //         repeat_password: "12345678",
  //       };

  //       chai
  //         .request(app)
  //         .post("/api/v1/register")
  //         .send(params)
  //         .end((err, res) => {
  //           res.should.have.status(201);
  //           res.body.should.be.a("object");
  //           done();
  //         });
  //     });
  //   });
});
