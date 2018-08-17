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

  it('Should be able to get event stream properly', function(done) {
    const test_command = 'command_that_is_a_simple_test_'+(Math.random() +1).toString(36).substr(2, 5);
    const test_command_payload = { name: 'is_bond_'+(Math.random() +1).toString(36).substr(2, 5)};
    micro.addProcedure({
      load: ['evt', 'appStream'],
      start: function() {
        // Start getting event stream and subscribing it:
        this.load.appStream.event_stream$.on(test_command, (payload)=>{
          console.log("Got the event in flow success!");
          expect(payload).to.be.equals(test_command_payload);
          done();
        });
        setTimeout(()=>{
          console.log("Now sending the event used to test flow:");
          this.load.evt.send(test_command, test_command_payload);
        }, 1000);
      }
    }).start();
  })

  it('Should be able to get last three past events properly', function(done) {
    const past_command = 'command that that will be the three past_'+(Math.random() +1).toString(36).substr(2, 5);
    const past_payloads = [{ name: 'is bond' }, { james: 'bond' }, { name: 'is el', manu: 'el' }];
    micro.addProcedure({
      load: ['evt'],
      sendEventI: function(i) {
        return this.load.evt.send(past_command, past_payloads[i]);
      },
      start: async function() {

        await this.sendEventI(0);
        await this.sendEventI(1);
        await this.sendEventI(2);

        await new Promise(resolve=>setTimeout(resolve, 1000));

        new Promise(resolve=>{
          micro.close(()=>{

            micro = Micro({ nats_url });
            micro.addProcedure({
              load: ['appStream'],
              start: async function() {

                await new Promise(resolve=>setTimeout(resolve, 1000));

                const past_object = this.load.appStream.past_events_since_last_snapshot;

                expect(past_object).to.be.exists()
                expect(past_object[past_command]).to.be.exists()
                expect(past_object[past_command]).to.be.array()
                expect(past_object[past_command]).to.be.equals(past_payloads)
                done()

              }
            }).start();
          })
        }).then();

      }
    }).start();
  })

})
