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

  it('Should be able to redux a single past command', function(done) {
    const wait_time = 100;
    const command_name = 'single past reducer command';
    const name_expected = 'single_reducer_past_name'+(Math.random() +1).toString(36).substr(2, 5);
    const command_payload = { name: name_expected, first: Math.random(), second: Math.random() };
    const result_expected = command_payload.first+command_payload.second;

    const reducer = require('./reducers/single_past_reducer');
    micro.addProcedure({
      load: ['reducer', 'evt', 'modeler'],
      start: async function() {
        await this.load.evt.send(command_name, command_payload)
        await new Promise(r=>setTimeout(r, wait_time))
        await this.load.reducer.addReducer(command_name, reducer)
        await new Promise(r=>setTimeout(r, wait_time))
        const user_model = await this.load.modeler.getModel('user');
        const user_created_by_redux = user_model.data({name: name_expected}).first();
        expect(user_created_by_redux).to.be.not.equals(false);
        expect(user_created_by_redux.result).to.be.equals(result_expected);
        done();
      }
    }).start();
  })


  it('Should be able to redux a single future command', function(done) {
    const wait_time = 100;
    const command_name = 'single future reducer command';
    const name_expected = 'single_reducer_future_name'+(Math.random() +1).toString(36).substr(2, 5);
    const command_payload = { name: name_expected, first: Math.random(), second: Math.random() };
    const result_expected = command_payload.first+command_payload.second;

    const reducer = require('./reducers/single_past_reducer');
    micro.addProcedure({
      load: ['reducer', 'evt', 'modeler'],
      start: async function() {
        await this.load.reducer.addReducer(command_name, reducer)
        await new Promise(r=>setTimeout(r, wait_time))
        await this.load.evt.send(command_name, command_payload)
        await new Promise(r=>setTimeout(r, wait_time))
        const user_model = await this.load.modeler.getModel('user');
        const user_created_by_redux = user_model.data({name: name_expected}).first();
        expect(user_created_by_redux).to.be.not.equals(false);
        expect(user_created_by_redux.result).to.be.equals(result_expected)
        done()
      }
    }).start();
  })

  it('Should be able to redux multiple past commands', function(done) {
    const wait_time = 100;
    const amount = 30;

    const command_name = 'multiple past reducer command';

    const name_expecteds = [];
    const command_payloads = [];
    const result_expecteds = [];
    for(let i=0; i<amount; i++) {
      name_expecteds.push('multiple_reducer_past_name'+(Math.random() +1).toString(36).substr(2, 5));
      command_payloads.push({ name: name_expecteds[i], first: Math.random(), second: Math.random() });
      result_expecteds.push(command_payloads[i].first+command_payloads[i].second);
    }

    const reducer = require('./reducers/single_past_reducer');
    micro.addProcedure({
      load: ['reducer', 'evt', 'modeler'],
      start: async function() {
        for(let i=0; i<amount; i++) {
          await this.load.evt.send(command_name, command_payloads[i])
        }
        await new Promise(r=>setTimeout(r, wait_time))
        await this.load.reducer.addReducer(command_name, reducer)
        await new Promise(r=>setTimeout(r, wait_time))

        const user_model = await this.load.modeler.getModel('user');
        for(let i=0; i<amount; i++) {
          let user_created_by_redux = user_model.data({name: name_expecteds[i]}).first();
          expect(user_created_by_redux).to.be.not.equals(false);
          expect(user_created_by_redux.result).to.be.equals(result_expecteds[i]);
        }
        done();
      }
    }).start();
  })

  it('Should be able to redux multiple future commands', function(done) {
    const wait_time = 100;
    const amount = 30;

    const command_name = 'multiple future reducer command';

    const name_expecteds = [];
    const command_payloads = [];
    const result_expecteds = [];
    for(let i=0; i<amount; i++) {
      name_expecteds.push('multiple_reducer_future_name'+(Math.random() +1).toString(36).substr(2, 5));
      command_payloads.push({ name: name_expecteds[i], first: Math.random(), second: Math.random() });
      result_expecteds.push(command_payloads[i].first+command_payloads[i].second);
    }

    const reducer = require('./reducers/single_past_reducer');
    micro.addProcedure({
      load: ['reducer', 'evt', 'modeler'],
      start: async function() {
        await this.load.reducer.addReducer(command_name, reducer)

        await new Promise(r=>setTimeout(r, wait_time))

        for(let i=0; i<amount; i++) {
          await this.load.evt.send(command_name, command_payloads[i])
        }
        await new Promise(r=>setTimeout(r, wait_time))

        const user_model = await this.load.modeler.getModel('user');

        for(let i=0; i<amount; i++) {
          let user_created_by_redux = user_model.data({name: name_expecteds[i]}).first();
          expect(user_created_by_redux).to.be.not.equals(false);
          expect(user_created_by_redux.result).to.be.equals(result_expecteds[i]);
        }
        done();
      }
    }).start();
  })


  it('Should be able to redux a two past commands and two future commands', function(done) {
    const wait_time = 100;
    const command_name = 'multiple reducer commands'+(Math.random() +1).toString(36).substr(2, 5);
    const name_expecteds = [
        'multiple_reducer_name'+(Math.random() +1).toString(36).substr(2, 5),
        'multiple_reducer_name'+(Math.random() +1).toString(36).substr(2, 5),
        'multiple_reducer_name'+(Math.random() +1).toString(36).substr(2, 5),
        'multiple_reducer_name'+(Math.random() +1).toString(36).substr(2, 5)
    ];
    const command_payloads = [
      { name: name_expecteds[0], first: Math.random(), second: Math.random() },
      { name: name_expecteds[1], first: Math.random(), second: Math.random() },
      { name: name_expecteds[2], first: Math.random(), second: Math.random() },
      { name: name_expecteds[3], first: Math.random(), second: Math.random() }
    ];
    const result_expecteds = [
      command_payloads[0].first+command_payloads[0].second,
      command_payloads[1].first+command_payloads[1].second,
      command_payloads[2].first+command_payloads[2].second,
      command_payloads[3].first+command_payloads[3].second
    ];

    const reducer = require('./reducers/single_past_reducer');
    micro.addProcedure({
      load: ['reducer', 'evt', 'modeler'],
      start: async function() {
        await this.load.evt.send(command_name, command_payloads[0]);
        await this.load.evt.send(command_name, command_payloads[1]);

        await new Promise(r=>setTimeout(r, wait_time));
        await this.load.reducer.addReducer(command_name, reducer);
        await new Promise(r=>setTimeout(r, wait_time));

        const user_model = await this.load.modeler.getModel('user');

        let user_created_by_redux = user_model.data({name: name_expecteds[0]}).first();
        expect(user_created_by_redux).to.be.not.equals(false);
        expect(user_created_by_redux.result).to.be.equals(result_expecteds[0]);

        user_created_by_redux = user_model.data({name: name_expecteds[1]}).first();
        expect(user_created_by_redux).to.be.not.equals(false);
        expect(user_created_by_redux.result).to.be.equals(result_expecteds[1]);

        await this.load.evt.send(command_name, command_payloads[2]);
        await this.load.evt.send(command_name, command_payloads[3]);

        await new Promise(r=>setTimeout(r, 1000));

        user_created_by_redux = user_model.data({name: name_expecteds[2]}).first();
        expect(user_created_by_redux).to.be.not.equals(false);
        expect(user_created_by_redux.result).to.be.equals(result_expecteds[2]);

        user_created_by_redux = user_model.data({name: name_expecteds[3]}).first();
        expect(user_created_by_redux).to.be.not.equals(false);
        expect(user_created_by_redux.result).to.be.equals(result_expecteds[3]);

        done();
      }
    }).start();
  })

})
