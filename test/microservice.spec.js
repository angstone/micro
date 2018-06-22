'use strict'

const Micro = require('../')
const Code = require('code')
const HemeraTestsuite = require('hemera-testsuite')

const expect = Code.expect
const chai = require('chai');
const chaiThings = require('chai-things');

chai.use(chaiThings);
const should = chai.should();

describe('Starting NATS Server for MICROSERVICE', function() {

  let PORT = 4223
  let nats_url = 'nats://localhost:' + PORT
  let server

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, done)
  })

  after(function(done) {
    server.kill()
    done()
  })

  it('MICROSERVICE Should be able to be tested', function(done) {
    done();
  })

  it('MICROSERVICE Should be able to be created', function(done) {
    const micro = Micro.create({ nats_url });
    expect(micro).to.be.exists()
    expect(micro.env.nats_url).to.be.equals(nats_url)
    done()
  })

  it('MICROSERVICE Should be void started', function(done) {
    const micro = Micro.create({ nats_url }).start(()=>{
      expect(micro).to.be.exists()
      expect(micro.env.nats_url).to.be.equals(nats_url)
      done()
    });
  })

  it('MICROSERVICE Should be able to add a command and start serving it', function(done) {
    let action = 'add';
    let func = (req, cb)=>{ cb(null, { result: req.a + req.b }) };
    const micro = Micro.create({ nats_url }).add(action, func).start(()=>{
      expect(micro.hemera_add_array).to.be.exists()
      expect(micro.hemera_add_array).to.be.array()
      micro.hemera_add_array.should.contain.a.thing.with.property('action', action);
      micro.hemera_add_array.filter(add => add.action == action)[0].func({ payload: {a:2, b:3} }, (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans.result).to.be.exists()
        expect(ans.result).to.be.equals(5)
        done()
      })
    });
  })

  it('MICROSERVICE Should be able to request/reply', function(done) {
    const micro = Micro.create({ debug: true, nats_url }).add('add', (req, cb)=>{
      cb(null, { result: req.a + req.b });
    });
    micro.start(()=>{
      setTimeout(()=>{
        micro.act('add', { a: 1, b: 2 }, (err, resp)=>{
          expect(err).not.to.be.exists()
          expect(resp.result).to.be.equals(3)
          done()
        });
      },200);
    });
  })

})
