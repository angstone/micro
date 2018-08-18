function RulerModule() {
  this.load = ['modeler', 'error', 'loader'];

  this.loadRule = async function(rule) {
    const rule_loaded = {};
    if(rule.models && rule.models instanceof Array) {
      const models = {};
      for(const model_name of rule.models) {
        models[model_name] = await this.load.modeler.getModel(model_name);
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
