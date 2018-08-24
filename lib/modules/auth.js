const randomstring = require('randomstring');

function AuthModule() {
  this.load = ['add', 'commander', 'env'/*, 'configClient'*/];

  this.start = async function() {
    this.load.env.auth_jwt_private_key = this.load.env.auth_jwt_private_key || process.env.AUTH_JWT_PRIVATE_KEY || randomstring.generate(14);
    this.load.env.auth_session_time_duration = this.load.env.auth_session_time_duration || process.env.AUTH_SESSION_TIME_DURATION || 1000*60*60*24*7; // a week for expiration

    this.load.add('get auth ping', (req, cb)=>{ cb(null, 'pong'); })
    this.load.commander.addCommand('auth_signup', require('../rules/auth_signup_rule'), require('../reducers/auth_signup_reducer'))
    this.load.commander.addCommand('auth_login')
  }

  //this.whenOnline = async function() {
    //this.load.env.auth_jwt_private_key = await this.load.configClient.getOrSetIgnoringError('auth_jwt_private_key', this.load.env.auth_jwt_private_key);
  //}

}

module.exports = function() {
  return new AuthModule();
};
