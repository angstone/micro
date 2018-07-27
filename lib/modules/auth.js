function AuthModule() {
  this.load = ['add', 'commander'];

  this.start = function() {
    this.load.add('get auth ping', (req, cb)=>{ cb(null, 'pong'); })
    this.load.commander.addCommand('auth signup', require('../rules/auth_signup_rule'), require('../reducers/auth_signup_reducer'))
    //this.load.commander.addCommand('auth login')
  }

}

module.exports = function() {
  return new AuthModule();
};
