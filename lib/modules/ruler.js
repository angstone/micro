function RulerModule() {
  this.load = ['modeler', 'error', 'loader'];

  this.lookForRule = async function(rule_name) {
    try {
      return require('rules/'+rule_name+'_rule');
    } catch(e) { }
    try {
      return require('../rules/'+rule_name+'_rule');
    } catch(e) { }
    return null;
  }

  this.getRuleSheet = async function(rule) {
    if(typeof rule === 'string' || rule instanceof String) {
      const _rul = await this.lookForRule(rule);
      if(_rul) return _rul;
      else this.load.error.throwFatal(
        this.load.error.COMMON_TYPES.SYSTEM_JS_NOT_FOUND,
        'The rule '+rule.toUpperCase()+
        ' was not found in rules folder neither in lib folder');
    }
    return rule;
  }

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

  this.getRule = async function(command_name, rule) {
    const rule_sheet = await this.getRuleSheet(rule==null ? command_name : rule);
    return await this.loadRule(rule_sheet);
  }

}

module.exports = function() {
  return new RulerModule();
};
