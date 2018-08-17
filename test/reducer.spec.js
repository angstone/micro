'use strict'

describe('REDUCER', function() {

  let server
  let micro

  before(function(done) {
    server = MicroserviceTestServer(done);
  })

  after(function(done) {
    server.kill()
    done()
  })

  beforeEach(function(done) {
    micro = Micro({ nats_url });
    done()
  })

  afterEach(function(done) {
    micro.close(done)
  })

  it('Should be able to be tested', function(done) {
    done();
  })

  it('Should be able to be created', function(done) {
    micro.addProcedure({
      load: ['reducer'],
    }).start();
    expect(micro).to.be.exists();
    micro.procedures.should.contain.a.thing.with.property('reducer');
    expect( micro.procedures.filter(procedure=>!!procedure.load.ruler).length ).to.be.at.least(1);
    done()
  })

  it('Should be able to add a void reducer with only models', function(done) {
    micro.addProcedure({
      load: ['reducer'],
    }).start();
    expect(micro).to.be.exists();
    micro.procedures.should.contain.a.thing.with.property('reducer');
    expect( micro.procedures.filter(procedure=>!!procedure.load.ruler).length ).to.be.at.least(1);
    done()
  })

})
