function RulerModule() {
  this.load = ['modeler', 'error', 'loader'];

  this.lookForModel = function(model_name) {
    let module = null;
    try {
      module = require('models/'+model_name+'_model');
      return module;
    } catch(e) { }
    try {
      module = require('../models/'+model_name+'_model');
      return module;
    } catch(e) { }
    return null;
  }

  this.loadRule = async function(rule) {
    const rule_loaded = {};
    if(rule.models && rule.models instanceof Array) {
      const models = {};
      for(const model_name of rule.models) {
        const model_sheet = this.lookForModel(model_name);
        if(model_sheet==null) this.load.error.throwFatal(this.load.error.COMMON_TYPES.SYSTEM_JS_NOT_FOUND, 'The model '+model_name.toUpperCase()+' was not found in models folder neither in lib folder')
        models[model_name] = await this.load.modeler.getModel(model_name, model_sheet);
      }
      rule_loaded.models = models;
    }
    if(rule.pre_validation) rule_loaded.pre_validation = rule.pre_validation;
    if(rule.validation) rule_loaded.validation = rule.validation;
    if(rule.respond) rule_loaded.respond = rule.respond;
    if(rule.load) rule_loaded.load = rule.load;
    else rule_loaded.load = []; 
    return this.load.loader(rule_loaded);
  };

}

module.exports = function() {
  return new RulerModule();
};
