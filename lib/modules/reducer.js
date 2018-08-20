function Reducer() {
  this.load = ['appStream', 'env', 'error', 'modeler', 'loader']

  this.reducers = {}

  this.reduxAllPastEvents = async function(command_name) {
    this.reducers[command_name].is_reducing = true;
    while(this.load.appStream.past_events_since_last_snapshot[command_name].length>0) {
      await this.reducers[command_name].redux(
        this.load.appStream.past_events_since_last_snapshot[command_name].shift()
      )
    }
  }

  this.executeReduxChainForCommand = function(command_name) {
    // wait other redux processes
    while(this.reducers[command_name].is_reducing) { }
    this.reduxAllPastEvents(command_name).then(()=>{
      this.reducers[command_name].is_reducing = false;
    });
  }

  this.applyReduxChainForCommand = function(command_name) {
    if(this.reducers[command_name].redux) {
      this.load.appStream.getStream().on(command_name, event=>{
        this.executeReduxChainForCommand(command_name);
      })
      if(this.load.appStream.past_events_since_last_snapshot[command_name])
        this.executeReduxChainForCommand(command_name);
    } else this.load.appStream.freeBufferForCommand(command_name);
  }

  this.lookForReducer = async function(reducer_name) {
    let reducer = null;
    try {
      reducer = require('reducers/'+reducer_name+'_reducer');
      return reducer;
    } catch(e) { }
    try {
      reducer = require('../reducers/'+reducer_name+'_reducer');
      return reducer;
    } catch(e) {
      this.load.error.throwFatal(
        this.load.error.COMMON_TYPES.SYSTEM_JS_NOT_FOUND,
        'The reducer '+reducer.toUpperCase()+
        ' was not found in reducers folder neither in lib folder')
    }
  }

  this.getReducerSheet = async function(reducer) {
    if(typeof reducer === 'string' || reducer instanceof String)
      return await this.lookForReducer(reducer);
    return reducer;
  }

  this.loadReducer = async function(reducer) {
    const reducer_sheet = await this.getReducerSheet(reducer)
    const reducer_loaded = {};
    if(reducer_sheet.models && reducer_sheet.models instanceof Array) {
      const models = {};
      for(const model_name of reducer_sheet.models) {
        models[model_name] = await this.load.modeler.getModel(model_name);
      }
      reducer_loaded.models = models;
    }
    reducer_loaded.is_reducing = false;
    if(reducer_sheet.redux) reducer_loaded.redux = reducer_sheet.redux;
    if(reducer_sheet.load) reducer_loaded.load = reducer_sheet.load;
    else reducer_loaded.load = [];
    return this.load.loader(reducer_loaded);
  }

  /*
    It can take a reducer required sheet direct,
    a reducer name or null
    (and guess the reducer name by the command name)
  */
  this.addReducer = async function(command_name, reducer=null) {
    const reducer_loaded = await this.loadReducer(reducer == null ? command_name : reducer);
    this.reducers[command_name] = reducer_loaded;
    this.applyReduxChainForCommand(command_name);
  }

};

module.exports = function() { return new Reducer() };

/*
this.isBusy = function(command_name) {
  return this.reducers[command_name] ? this.reducers[command_name].busy : true;
};

this.startReduce = function(command_name) {
  this.reducers[command_name].busy = true;
};

this.stopReduce = function(command_name) {
  this.reducers[command_name].busy = false;
}

this.countEvent = function(command_name) {
  this.reducers[command_name].events_since_last_snapshot_count++;
}

this.isOverflow = function(command_name) {
  return this.reducers[command_name].events_since_last_snapshot_count >= this.load.env.number_of_events_in_snapshot;
}

this.redux = function(command_name) {
  return this.reducers[command_name].redux;
}

this.getSnapshot = function(command_name) {
  return this.reducers[command_name].getSnapshot;
}

this.addReducer = async function(command_name, reducer) {
  await reducer.applySnapshot(await this.load.a.getLastSnapshot(command_name));
  await reducer.reduxPastEvents(await this.load.appStream.getPastEventsSinceLastSnapshot(command_name));
  this.reducers[command_name] = {
    busy: true,
    events_since_last_snapshot_count: 0,
    redux: reducer.redux,
  };
};

this.start = function() {
  const stream$ = await this.load.appStream.getStream();
  const redux_function = function(event) {
    if(this.reducers[command_name]) {
      this.startReduce(command_name);
      this.redux(command_name)(event);
      if(this.isOverflow(command_name)) this.load.appStream.createSnapshot(command_name, this.getSnapshot(command_name)());
      this.stopReduce(command_name);
    }
  };
  stream$.on(command_name, redux_function);
};
*/
