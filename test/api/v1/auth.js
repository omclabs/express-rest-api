/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const app = require('../../../app');

chai.should();
chai.use(chaiHttp);

describe('/api/v1/ endpoin test', () => {
  // let accessToken = '';
  let refreshToken = '';

  const password = faker.internet.password();
  const createUser = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    repeat_password: password,
  };

  after(async () => {
    await mongoose.connection.dropDatabase(() => {});
    await mongoose.connection.close();
  });

  it('/api/v1 - should get response 404 ', (done) => {
    chai
      .request(app)
      .get('/api/v1')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  describe('/api/v1/register endpoin test', () => {
    it('should get 201 response when success', (done) => {
      chai
        .request(app)
        .post('/api/v1/register')
        .send(createUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data').that.have.property('user');
          done();
        });
    });

    it('should get 422 response when user exists', (done) => {
      chai
        .request(app)
        .post('/api/v1/register')
        .send(createUser)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('/api/v1/login endpoin test', () => {
    it('should get 422 response when email or password empty', (done) => {
      chai
        .request(app)
        .post('/api/v1/login')
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should get 201 response when success', (done) => {
      chai
        .request(app)
        .post('/api/v1/login')
        .send({ email: createUser.email, password: createUser.password })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.should.have
            .property('data')
            .that.have.property('access_token');
          res.body.should.have
            .property('data')
            .that.have.property('refresh_token');

          // accessToken = res.body.data.access_token;
          refreshToken = res.body.data.refresh_token;
          done();
        });
    });
  });

  describe('/api/v1/token endpoin test', () => {
    it('should get 401 response when token not set', (done) => {
      chai
        .request(app)
        .post('/api/v1/token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should get 403 response when token invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/token')
        .set({ authorization: 'invalid token' })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should get 201 response when request new token', (done) => {
      chai
        .request(app)
        .post('/api/v1/token')
        .set({ authorization: refreshToken })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have
            .property('data')
            .that.have.property('access_token');
          done();
        });
    });
  });

  describe('/api/v1/logout endpoin test', () => {
    it('should get 401 response when token not set', (done) => {
      chai
        .request(app)
        .delete('/api/v1/logout')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should get 403 response when token invalid', (done) => {
      chai
        .request(app)
        .delete('/api/v1/logout')
        .set({ authorization: 'invalid token' })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should get 201 response when logout', (done) => {
      chai
        .request(app)
        .delete('/api/v1/logout')
        .set({ authorization: refreshToken })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
