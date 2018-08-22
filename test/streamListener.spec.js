'use strict'

describe('STREAM LISTENER', function() {

  let server
  let micro

  before(function(done) {
    global.process.env.DEBUG = false;
    server = MicroserviceTestServer(done);
  })

  after(function(done) {
    global.process.env.DEBUG = null;
    server.kill()
    done()
  })

  beforeEach(function(done) {
    micro = Micro({ nats_url, debug:false });
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
      load: ['streamListener'],
    }).start();
    expect(micro).to.be.exists();
    micro.procedures.should.contain.a.thing.with.property('load');
    expect( micro.procedures.filter(procedure=>!!procedure.load.streamListener).length ).to.be.at.least(1);
    done()
  })

  it('Should execute the function listenToFrom and listen to an event', function(done) {
    const wait_time = 100;
    micro.addProcedure({
      load: ['streamListener','evt', 'env'],
      start: function() {

        let event_number_expected = 0;
        let subscription = null;

        const event_type = 'test_stream_listen_to_from_'+randomString();
        const event_payload = {pay:'load', randonStr:randomString() };

        const fromEvent = 0;

        subscription = this.load.streamListener.listenToFrom(
          this.load.env.app_topic,
          (event_got) => { // onEvent
            /*console.log(event_got.eventNumber);
            console.log(event_number_expected);
            console.log(typeof event_got.eventNumber);
            console.log(typeof event_number_expected);
            console.log(event_got.eventNumber!=event_number_expected);
            console.log("em cima ta dando verdadeiro que bosta é essa?");*/
            if(event_got.eventType==event_type) {
              setTimeout(()=>{
                if(event_got.eventNumber!=event_number_expected) done('got wrong event number');
                if( JSON.stringify(event_got.data) != JSON.stringify(event_payload) ) done('got wrong event payload');
                subscription = null;
                if(subscription) this.load.streamListener.drop(subscription);
                done();
              }, wait_time)
            }
          },
          () => {}, // onDropped
          fromEvent,
          () => { // onLiveProcessing
            this.load.evt.send(event_type, event_payload).then(event_number=>{
              event_number_expected = event_number;
            });
          }
        );

      }
    }).start();
  })

  it('Should execute the function listenToFrom and listen to an event from this event', function(done) {
    micro.addProcedure({
      load: ['streamListener','evt', 'env'],
      start: async function() {

        const event_type = 'test_stream_listen_to_from_specific_'+randomString();
        const event_payload = {pay:'load', randonStr:randomString() };

        let event_number_expected = await this.load.evt.send(event_type, event_payload);

        let subscription = this.load.streamListener.listenToFrom(
          this.load.env.app_topic, // eventStream
          (event_got) => { // onEvent
            if(event_got.eventNumber == event_number_expected) {
              if(event_got.eventType == event_type) {
                if(event_got.data.randonStr == event_payload.randonStr) {
                  done();
                } else done('event got is not the same we sent!');
              } else done('event got is not the same we sent!');
            } else done('event got is not the same we sent!');
          },
          () => {}, // onDropped
          event_number_expected-1, // eventFromStartPoint
          () => {} // onLiveProcessing
        );

      }
    }).start();
  })

})
