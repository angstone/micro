function CommanderModule() {
  this.load = ['add', 'ruler', 'error', 'evt', 'reducer', 'appStream'];

  this.waiting_responses = {};

  this.includeWaitingResponse = function(command_name, eventNumber, action) {
    this.waiting_responses[command_name][eventNumber] = action;
  }

  this.respondWaitingResponses = function(command_name, eventNumber) {
    if(this.waiting_responses[command_name][eventNumber]) {
      //console.log('Got EVENT HERE: ', command_name, eventNumber);
      this.waiting_responses[command_name][eventNumber]();
      delete this.waiting_responses[command_name][eventNumber];
    } else setTimeout(()=>{
      this.respondWaitingResponses(command_name, eventNumber);
    }, 50);
  }

  this.listenToReducerStream = function(command_name) {
    this.waiting_responses[command_name] = {};
    this.load.appStream.getReducerStream().on(command_name, eventNumber=>{
      if(this.waiting_responses[command_name]) this.respondWaitingResponses(command_name, eventNumber);
    });
  }

  this.addCommand = async function(command_name, rule_sheet=null, reducer=null) {
    let command = { command: command_name, rule_sheet };
    try {
      command.rule = await this.load.ruler.getRule(command_name, command.rule_sheet);
    } catch(err) {
      this.load.error.throwFatalIfUnidentified(err, this.load.error.COMMON_TYPES.RULER_MODULE_FAILURE,
        'The ruler module could not load the rule_sheet js object: '
        + ( rule_sheet == null ? command_name+'_rule' : JSON.stringify(rule_sheet) )
      );
    }
    command.has_reducer = await this.load.reducer.hasReducer(command_name, reducer);
    if(command.has_reducer) {
      if(command.rule.respond) this.listenToReducerStream(command_name);
      await this.load.reducer.addReducer(command_name, reducer);
    }
    command = await this.addProcessesTo(command);
    this.load.add(command_name, command.do);
    return
  }

  this.respond = function(command, payload, cb) {
    if(command.rule.respond) {
      if(!command.has_reducer) {
        // Dispatching the event, collect error and waiting for the response timeout error to tell client about it
        this.load.evt.send(command.command, payload)
          .then(eventNumber=>{
            command.rule.respond(eventNumber, payload).then(data=>cb(null, data)).catch(err=>{
              if(command.errorDuringDispach) cb(command.errorDuringDispach)
              else cb(err)
            })
          })
          .catch(e=>{command.errorDuringDispach = e;})
      } else {
        this.load.evt.send(command.command, payload)
          .then(eventNumber=>{
            this.includeWaitingResponse(command.command, eventNumber, ()=>{
              command.rule.respond(eventNumber, payload).then(data=>cb(null, data)).catch(err=>{
                if(command.errorDuringDispach) cb(command.errorDuringDispach)
                else cb(err)
              })
            });
          })
          .catch(e=>{command.errorDuringDispach = e;})
      }
    } else this.load.evt.send(command.command, payload).then(()=>cb(null,null)).catch(cb) // Dispatching the event and respond client
  }

  this.validate = function(command, payload, cb) {
    if(command.rule.validation) {
      command.rule.validation(payload).then(validation_rule_broken=>{
        if(validation_rule_broken) cb(this.load.error.is(this.load.error.COMMON_TYPES.VALIDATION_RULE_BROKEN, validation_rule_broken))
        else this.respond(command, payload, cb)
      }).catch(cb)
    } else this.respond(command, payload, cb)
  }

  this.preValidate = function(command, payload, cb) {
    if(command.rule.pre_validation) {
      command.rule.pre_validation(payload).then(pre_validation_rule_broken=>{
        if(pre_validation_rule_broken) cb(this.load.error.is(this.load.error.COMMON_TYPES.PRE_VALIDATION_RULE_BROKEN, pre_validation_rule_broken))
        else this.validate(command, payload, cb)
      }).catch(cb)
    } else this.validate(command, payload, cb)
  }


  this.addProcessesTo = async function(command) {
    command.do = (payload, cb) => {
      this.preValidate(command, payload, cb)
    }
    return command;
  }

}

module.exports = function() {
  return new CommanderModule();
};
