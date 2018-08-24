'use strict'

const jwt = require('jsonwebtoken')

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
        micro.act('auth_signup', user_signup_data, (err, ans)=>{
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
      micro.act('auth_signup', user_signup_data, (err, ans)=>{
        expect(err).not.to.be.exists();
        expect(ans).to.be.exists();
        expect(ans).to.be.a.number();
        expect(ans).to.be.at.least(1);
        setTimeout(()=>{
          micro.act('auth_signup', user_signup_data, (err, ans)=>{
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
        micro.act('auth_signup', user_signup_data, (err, ans)=>{
          expect(err).to.be.exists();
          expect(err.message).to.be.equals(AUTH_SIGNUP_MESSAGES.LOGIN_TAKEN);
          done();
        });
      }
    );
  })

  it('Should login an user', function(done) {
    const user_signup_data = {
      name: 'User that can log in',
      login: 'user_that_can_log'+randomString(),
      password: 'dinamicWord123',
      password_confirmation: 'dinamicWord123'
    }
    const user_login_data = {
      login: user_signup_data.login,
      password: user_signup_data.password,
      express_session_id: randomString(),
      device_id: randomString()
    }
    let jwt_key = '';
    micro.addProcedure({
      load: ['auth','env'],
      start: function() {
        jwt_key = this.load.env.auth_jwt_private_key;
      },
    }).start(()=>{
        micro.act('auth_signup', user_signup_data, (err, ans)=>{
          expect(err).to.be.not.exists();
          micro.act('auth_login', user_login_data, (err, ans)=>{
            expect(err).to.be.not.exists()
            expect(ans).to.be.exists()
            jwt.verify(ans, jwt_key, (err, session)=>{
              expect(err).to.be.not.exists()
              expect(session.device_id).to.be.equals(user_login_data.device_id)
              expect(session.express_session_id).to.be.equals(user_login_data.express_session_id)
              expect(session.role).to.be.exists()
              expect(session.created_at).to.be.exists()
              expect(session.expiration).to.be.exists()
              expect(session.role).to.be.an.string()
              done()
            });
          })
        });
      }
    );
  })

  it('Should login the user again if another session', function(done) {
    const user_signup_data = {
      name: 'User that can log in again',
      login: 'user_that_can_log'+randomString(),
      password: 'dinamicWord123',
      password_confirmation: 'dinamicWord123'
    }
    const user_login_data = {
      login: user_signup_data.login,
      password: user_signup_data.password,
      express_session_id: randomString(),
      device_id: randomString()
    }
    const other_session = randomString();
    let jwt_key = '';
    micro.addProcedure({
      load: ['auth','env'],
      start: function() {
        jwt_key = this.load.env.auth_jwt_private_key;
      },
    }).start(()=>{
        micro.act('auth_signup', user_signup_data, (err, ans)=>{
          expect(err).to.be.not.exists();
          micro.act('auth_login', user_login_data, (err, ans)=>{
            expect(err).to.be.not.exists()
            expect(ans).to.be.exists()
            jwt.verify(ans, jwt_key, (err, session)=>{
              expect(err).to.be.not.exists()
              micro.act('auth_login', Object.assign({}, user_login_data, { express_session_id: other_session }), (err, ans_2)=>{
                expect(err).to.be.not.exists()
                jwt.verify(ans_2, jwt_key, (err, session_2)=>{
                  expect(err).to.be.not.exists()
                  expect(session_2.device_id).to.be.equals(user_login_data.device_id)
                  expect(session_2.express_session_id).to.be.equals(other_session)
                  expect(session_2.role).to.be.exists()
                  expect(session_2.created_at).to.be.exists()
                  expect(session_2.expiration).to.be.exists()
                  expect(session_2.role).to.be.an.string()
                  done()
                })
              })
            });
          })
        });
      }
    );
  })

  it('Should reject login the user again if same session and device', function(done) {
    const AUTH_LOGIN_MESSAGES = require('../lib/rules/auth_login_messages');
    const user_signup_data = {
      name: 'User that can log in again',
      login: 'user_that_can_log'+randomString(),
      password: 'dinamicWord123',
      password_confirmation: 'dinamicWord123'
    }
    const user_login_data = {
      login: user_signup_data.login,
      password: user_signup_data.password,
      express_session_id: randomString(),
      device_id: randomString()
    }
    let jwt_key = '';
    micro.addProcedure({
      load: ['auth','env'],
      start: function() {
        jwt_key = this.load.env.auth_jwt_private_key;
      },
    }).start(()=>{
        micro.act('auth_signup', user_signup_data, (err, ans)=>{
          expect(err).to.be.not.exists();
          micro.act('auth_login', user_login_data, (err, ans)=>{
            expect(err).to.be.not.exists()
            expect(ans).to.be.exists()
            jwt.verify(ans, jwt_key, (err, session)=>{
              expect(err).to.be.not.exists()
              micro.act('auth_login', user_login_data, (err, ans_2)=>{
                expect(err).to.be.exists()
                expect(err.message).to.be.equals(AUTH_LOGIN_MESSAGES.ALREADY_LOGGED_IN)
                done()
              })
            });
          })
        });
      }
    );
  })

  it('Should reject login with wrong password', function(done) {
    const AUTH_LOGIN_MESSAGES = require('../lib/rules/auth_login_messages');
    const user_signup_data = {
      name: 'User that can log in again',
      login: 'user_that_can_log'+randomString(),
      password: 'dinamicWord123',
      password_confirmation: 'dinamicWord123'
    }
    const user_login_data = {
      login: user_signup_data.login,
      password: randomString()+'123',
      express_session_id: randomString(),
      device_id: randomString()
    }
    micro.addProcedure({
      load: ['auth','env']
    }).start(()=>{
        micro.act('auth_signup', user_signup_data, (err, ans)=>{
          expect(err).to.be.not.exists();
          micro.act('auth_login', user_login_data, (err, ans_2)=>{
            expect(err).to.be.exists()
            expect(err.message).to.be.equals(AUTH_LOGIN_MESSAGES.WRONG_PASSWORD)
            done()
          })
        });
      }
    );
  })

  it('Should reject inexistent login', function(done) {
    const AUTH_LOGIN_MESSAGES = require('../lib/rules/auth_login_messages');
    const user_login_data = {
      login: randomString(),
      password: randomString()+'123',
      express_session_id: randomString(),
      device_id: randomString()
    }
    micro.addProcedure({
      load: ['auth','env']
    }).start(()=>{
      micro.act('auth_login', user_login_data, (err, ans)=>{
        expect(err).to.be.exists()
        expect(err.message).to.be.equals(AUTH_LOGIN_MESSAGES.NO_USER)
        done()
      })
    });
  })

})
