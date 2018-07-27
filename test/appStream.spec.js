'use strict'

describe('APP STREAM', function() {

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
      load: ['appStream'],
    }).start();
    expect(micro).to.be.exists();
    micro.procedures.should.contain.a.thing.with.property('load');
    expect( micro.procedures.filter(procedure=>!!procedure.load.appStream).length ).to.be.at.least(1);
    done()
  })

  it('Should be able to get last past event properly', function(done) {
    const test_command = 'command that is a simple test';
    const test_command_payload = { name: 'is bond' };
    micro.addProcedure({
      load: ['evt', 'appStream'],
      start: function() {
        // Start sending three test events:
        this.load.evt.send(test_command, test_command_payload).then(
          this.appStream.getPastEventsSinceLastSnapshot().then(events=>{
            console.log(events);
            expect(events[0]).to.be.exists();
          });
        );
      }
    }).start();
  })

  /*it('Should be able to get last three past events properly', function(done) {
    const test_command = 'command that is a simple test';
    const test_commands_payloads = [{ name: 'is bond' }, { james: 'bond' }, { name: 'is el', manu: 'el' }];
    micro.addProcedure({
      load: ['evt', 'appStream'],
      start: function() {
        // Start sending three test events:
        this.load.evt.send(test_command, test_commands_payloads[0]).then(()=>cb(null,null)).catch(cb)
      }
    }).start();
  })*/

})
