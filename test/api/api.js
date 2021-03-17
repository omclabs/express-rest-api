/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

chai.should();
chai.use(chaiHttp);

describe('/api endpoin test', () => {
  it('/api - should get response 200', (done) => {
    chai
      .request(app)
      .get('/api')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('/api/someurl - should get response 404 ', (done) => {
    chai
      .request(app)
      .get('/apis')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
