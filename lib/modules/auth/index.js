function AuthModule() {
  this.load = ['add'];

  this.start = function() {
    this.load.add('get auth ping', (req, cb)=>{ cb(null, 'pong'); });
  };
}

module.exports = function() {
  return new AuthModule();
};
