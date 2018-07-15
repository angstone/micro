function AuthModule() {
  this.load = ['add'];

  this.start = function() {
    this.load.add('get auth ping', (req, cb)=>{ cb(null, 'pong'); });
    this.includeSignup()
  }

  this.includeSignup = function() {
    this.load.add('auth signup', (req, cb)=>{
      //this.load.ruler.user
    })
  }

}

module.exports = function() {
  return new AuthModule();
};
