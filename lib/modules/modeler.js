function ModelerModule() {
  this.load = ['loader', 'error']

  this.models_loaded = {}

  this.lookForModel = function(model_name) {
    let model = null;
    try {
      model = require('models/'+model_name+'_model');
      return model;
    } catch(e) { }
    try {
      model = require('../models/'+model_name+'_model');
      return model;
    } catch(e) {
      this.load.error.throwFatal(
        this.load.error.COMMON_TYPES.SYSTEM_JS_NOT_FOUND,
        'The model '+model_name.toUpperCase()+
        ' was not found in models folder neither in lib folder')
    }
  }

  this.getModel = async function(model_name, model_sheet=null) {
    if(this.models_loaded[model_name]) return this.models_loaded[model_name];
    if(model_sheet==null) model_sheet = await this.lookForModel(model_name);
    this.models_loaded[model_name] = await this.loadModel(model_name, model_sheet);
    return this.models_loaded[model_name];
  }

  this.loadModel = async function(model_name, model_sheet) {
    const model_loaded = model_sheet;
    model_loaded.name = model_name;
    return this.load.loader(model_loaded);
  }

}

module.exports = function() {
  return new ModelerModule();
};
