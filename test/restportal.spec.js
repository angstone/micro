'use strict'

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

const HemeraTestsuite = require('hemera-testsuite')

describe('RESTPORTAL', () => {

  let PORT = 4223
  let nats_url = 'nats://localhost:' + PORT
  let server
  let configServer
  let restportal

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, done);
    restportal = require('../samples/restportal');
    configServer = require('../samples/config-server');
  })

  after(function(done) {
    server.kill();
    done();
  })

  describe('/GET ping', () => {

    it('RESTPORTAL should GET a ping', (done) => {
      chai.request(restportal)
        .get('/ping')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('string');
          res.body.should.be.eql('pong');
          done();
        });
    });

  });


  describe('/GET ping-config', () => {

    it('RESTPORTAL should GET a ping on config server', (done) => {
      chai.request(restportal)
        .get('/ping-config')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('string');
          res.body.should.be.eql('pong');
          done();
        });
    });

  });


});
