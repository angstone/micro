function Reducer() {
  this.load = ['appStream', 'env'];

  /*
  this.reducers = {};

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

};

module.exports = function() { return new Reducer() };
