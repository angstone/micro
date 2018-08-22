'use strict'

describe('AUTH', function() {

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
      load: ['auth'],
    }).start(()=>{
      expect(micro).to.be.exists();
      micro.procedures.should.contain.a.thing.with.property('load');
      expect( micro.procedures.filter(procedure=>!!procedure.load.auth).length ).to.be.at.least(1);
      done()
    });
  })

  it('Should be able to Respond a ping', function(done) {
    micro.addProcedure({
      load: ['auth'],
    }).start(()=>{
        micro.act('get auth ping', (err, ans)=>{
          expect(err).not.to.be.exists()
          expect(ans).to.be.equals('pong')
          done()
        });
      }
    );
  })

  it('Should be able to signup an User', function(done) {
    const user_signup_data = {
      name: 'Fulanildo Martinez',
      login: 'tomatecru'+randomString(),
      password: 'magicword123',
      password_confirmation: 'magicword123'
    }
    micro.addProcedure({
      load: ['auth'],
    }).start(()=>{
        micro.act('auth signup', user_signup_data, (err, ans)=>{
          expect(err).not.to.be.exists();
          expect(ans).to.be.exists();
          expect(ans).to.be.a.number();
          expect(ans).to.be.at.least(1);
          done();
        });
      }
    );
  })

  it('Should NOT signup same User', function(done) {
    const wait_time = 100;
    const AUTH_SIGNUP_MESSAGES = require('../lib/rules/auth_signup_messages');
    const user_signup_data = {
      name: 'Sicranildo Louvato',
      login: 'ehvitamina'+randomString(),
      password: 'magicword123',
      password_confirmation: 'magicword123'
    }
    micro.addProcedure({
      load: ['auth'],
    }).start(()=>{
      micro.act('auth signup', user_signup_data, (err, ans)=>{
        expect(err).not.to.be.exists();
        expect(ans).to.be.exists();
        expect(ans).to.be.a.number();
        expect(ans).to.be.at.least(1);
        setTimeout(()=>{
          micro.act('auth signup', user_signup_data, (err, ans)=>{
            expect(err).to.be.exists();
            expect(err.message).to.be.equals(AUTH_SIGNUP_MESSAGES.LOGIN_TAKEN);
            done();
          });
        }, wait_time);
      });
    });
  })

  it('Should NEVER signup the SYSTEM AGENT again', function(done) {
    const AUTH_SIGNUP_MESSAGES = require('../lib/rules/auth_signup_messages');
    const SYSTEM_AGENT = require('../lib/models/user_model').SYSTEM_AGENT;
    const user_signup_data = {
      name: SYSTEM_AGENT.name,
      login: SYSTEM_AGENT.login,
      password: 'magicword123',
      password_confirmation: 'magicword123'
    }
    micro.addProcedure({
      load: ['auth'],
    }).start(()=>{
        micro.act('auth signup', user_signup_data, (err, ans)=>{
          expect(err).to.be.exists();
          expect(err.message).to.be.equals(AUTH_SIGNUP_MESSAGES.LOGIN_TAKEN);
          done();
        });
      }
    );
  })

})
