'use strict'

describe('COMMANDER', function() {

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
    micro.close(done);
  })

  it('Should be able to be tested', function(done) {
    done();
  })

  it('Should be able to be created', function(done) {
    micro.addProcedure({
      load: ['commander'],
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.procedures.should.contain.a.thing.with.property('load');
      expect( micro.procedures.filter(procedure=>!!procedure.load.commander).length ).to.be.at.least(1);
      done()
    });
  })

})
