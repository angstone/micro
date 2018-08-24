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
    logger: this.singleton('logger'),
    error: this.singleton('error'),
    util: this.newInstance('util'),
    configServer: this.singleton('configServer'),
    configClient: this.singleton('configClient'),
    modeler: this.singleton('modeler'),
    ruler: this.newInstance('ruler'),
    commander: this.singleton('commander'),
    auth: this.singleton('auth'),
    evt: this.singleton('evt'),
    reducer: this.singleton('reducer'),
    appStream: this.singleton('appStream'),
    streamListener: this.singleton('streamListener'),
    snapshooter: this.singleton('snapshooter'),
  };

}

module.exports = function() {
  return new ModuleLoader().modules;
};
