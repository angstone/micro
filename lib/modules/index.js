function ModuleLoader() {
  this.instances = {};

  this.newInstance = (module_name) => { return () => {
    const module = require('./'+module_name)();
    if(!module.name) module.name = module_name;
    return module;
  }};

  this.singleton = (module_name) => {
    return () => {
      if(!this.instances[module_name]) {
        this.instances[module_name] = this.newInstance(module_name)()
      }
      return this.instances[module_name]
    }
  };

  this.modules = {
    //// externals
    //uid: () => require('uuid/v1'),
    //fetch: () => require('node-fetch'),
    //eventStore: () => require('event-store-client'),
    //// internals
    util: this.newInstance('util'),
    logger: this.singleton('logger'),
    configServer: this.singleton('configServer'),
    auth: this.singleton('auth'),
    commander: this.newInstance('commander'),
    ruler: this.singleton('ruler'),
    error: this.singleton('error'),
    //evt: () => require('./evt.js'),
    //tagger: () => require('./tagger.js'),
    //streamListener: () => require('./streamListener.js'),
    //dispatcher: () => require('./dispatcher.js'),
    //confirmer: () => require('./confirmer.js'),
    //operator: () => require('./operator.js'),
    //reducer: () => require('./reducer.js'),
    //render: () => require('./render.js'),
    //db: () => require('./db.js'),
    //insurer: () => require('./insurer.js'),
  };

}

module.exports = function() {
  return new ModuleLoader().modules;
};
