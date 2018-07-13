function CommanderModule() {
  this.load = ['add', 'ruler'];

  this.start = function() {
  };
  /*addCommand: function(command, rule) {
    this.rule = this.load.ruler.loadRule(command, rule, (err, ruleLoaded)=>{
      if(err) ;
      else this.performAdd(command, ruleLoaded, cb);
    });
  },*/
}

module.exports = function() {
  return new CommanderModule();
};
