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
    micro.procedures.should.contain.a.thing.with.property('load');
    expect( micro.procedures.filter(procedure=>!!procedure.load.reducer).length ).to.be.at.least(1);
    done()
  })

  it('Should be able to add a void reducer with only models', function(done) {
    const command_name = 'void model reducer command';
    const reducer = require('./reducers/void_model_reducer');
    micro.addProcedure({
      load: ['reducer'],
      start: async function() {
        await this.load.reducer.addReducer(command_name, reducer)
        expect(this.load.reducer.reducers[command_name]).to.be.exists()
        expect(this.load.reducer.reducers[command_name].models).to.be.exists()
        expect(this.load.reducer.reducers[command_name].models).to.be.not.array()
        expect(this.load.reducer.reducers[command_name].models[reducer.models[0]]).to.be.exists()
        done()
      }
    }).start();
  })

  /*it('Should be able to add a reducer with three past commands and three future commands to reduce', function(done) {
    const command_name = 'void model reducer command';
    const reducer = require('./reducers/void_model_reducer');
    micro.addProcedure({
      load: ['reducer'],
      start: async function() {
        await this.load.reducer.addReducer(command_name, reducer)
        expect(this.load.reducer.reducers[command_name]).to.be.exists()
        expect(this.load.reducer.reducers[command_name].models).to.be.exists()
        expect(this.load.reducer.reducers[command_name].models).to.be.not.array()
        expect(this.load.reducer.reducers[command_name].models[reducer.models[0]]).to.be.exists()
        done()
      }
    }).start();
  })*/

})
