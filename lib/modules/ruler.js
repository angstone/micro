function RulerModule() {
  this.load = ['modeler', 'error'];

  this.start = function() {
  };

  this.lookForModel = function(model_name) {
    try { return require('models/'+model_name); }
    catch(e) { try { return require('../models/'+model_name); }
      catch (e) { return null; }
    }
  }

  this.loadRule = async function(rule) {
    if(rule.models && rule.models instanceof Array) {
      const models = {};
      for(const model_name of rule.models) {
        const model_sheet = this.lookForModel(model_name);
        if(model_sheet==null) this.load.error.throwFatal(this.load.error.COMMON_TYPES.SYSTEM_JS_NOT_FOUND, 'The model \''+model_name+'\' was not found in models folder on root neither in lib folder.')
        models[model_name] = await this.load.modeler.getModel(model_name, model_sheet);
      }
      this.models = models;
    }
    if(rule.pre_validation) this.pre_validation = rules.pre_validation;
    if(rule.validation) this.validation = rules.validation;
    if(rule.respondWith) this.respondWith = rules.respondWith;
    return this;
  };

}

module.exports = function() {
  return new RulerModule();
};
