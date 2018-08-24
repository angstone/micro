const msg = require('./auth_login_messages');
const jwt = require('jsonwebtoken');

/*

Rules for login:

The express rest gate should send the session and the device for authorization process
if the user device is already logged it will extend the session lifetime
if the user already has a session with same device and express_session_id, it should return error 'already logged'
if the user already has a session with the same device, the system must update the duration of the session and the express_session_id

security concerns:

if the user tries a wrong password, an event must be fired to auth guard
if the user tries many times an wrong password from a same device or in the last period of time, the device should be blocked
if the user tries many times an wrong password in the last period, the user password must be blocked until he decides what to do via email:
  It can asure it was him and reset his password
  It can say it wasn't here and the other devices must be blocked
  It must free the device he want to use using the email

It should check the auth guard before ran into auth cascade

*/

const rule = {};

rule.load = ['error', 'env'];

rule.models = ['user', 'session'];

rule.pre_validation = async function(data) {
  if(!data) return msg.NO_PAYLOAD;
  if(!data.login) return msg.NO_LOGIN;
  if(!data.password) return msg.NO_PASSWORD;
  if(!data.express_session_id) return msg.NO_EXPRESS_SESSION_ID;
  if(!data.device_id) return msg.NO_DEVICE_ID;
  // enshures 6 digits regular login
  if( !/^\w{6,}$/.test(data.login) ) return msg.WRONG_LOGIN;
  // enshures 8 digits password
  if( !/^\S{8,}$/.test(data.password) ) return msg.INVALID_PASSWORD;
  // enshures 3 digits
  if( !/^\S{3,}$/.test(data.express_session_id) ) return msg.INVALID_EXPRESS_SESSION_ID;
  if( !/^\S{3,}$/.test(data.device_id) ) return msg.INVALID_DEVICE_ID;
  return false;
};

rule.validation = async function(data) {
  const user = this.models.user.data({login:data.login}).first()
  if(!user) return msg.NO_USER;

  // if the user already has a session with same device and express_session_id, it should return error 'already logged'
  const old_sessions = this.models.session.data({user_id: user.id}).get()
  const same_session = old_sessions.filter(session=>{
    return (session.express_session_id == data.express_session_id && session.device_id == data.device_id);
  })
  if(same_session.length>=1) return msg.ALREADY_LOGGED_IN;

  if(user.password!=data.password) {
    return msg.WRONG_PASSWORD;
  }
  return false;
};

rule.respond = async function(eventNumber, payload) {
  //console.log('GOT EMISSION: ', eventNumber)
  let session = this.models.session.data({id:eventNumber}).first();
  if(!session) this.load.error.throw(this.load.error.COMMON_TYPES.BAD_REDUCING, 'The command auth login was not reduced OK');

  const session_to_user = {
    id: session.id,
    user_id: session.user_id,
    express_session_id: session.express_session_id,
    device_id: session.device_id,
    expiration: session.expiration,
    role: session.role,
    created_at: session.created_at,
  };

  return jwt.sign(session_to_user, this.load.env.auth_jwt_private_key);
};

module.exports = rule;
