function AppStream() {
  this.load = ['streamListener', 'env', 'snapshooter'];

  this.past_events_since_last_snapshot = {};
  this.is_in_live = false;
  this.event_stream$ = new EventEmitter();

  this.organizeEvent = function(event) {
    if(!this.is_in_live) this.past_events_since_last_snapshot[event.command].push(event.payload);
    else this.event_stream$.emit(event.command, event.payload);
  };

  this.handleDropped = function() {
    //to do
  }

  this.start = async function() {
    /*  Once the snapshoots are related the commands, the snapshooter have no ways to get to know that now

    const next_event_number_since_last_snapshot = this.load.snapshooter.getNextEventNumberSinceLastSnapshot();

    */


    /*  this cant be done like that
    // stream_name, onEvent, onDropped, fromEvent=0, onLiveProcessing
    this.stream_listener_id = this.load.streamListener.listenToFrom(
      this.load.env.app_topic,
      this.organizeEvent,
      this.handleDropped,
      next_event_number_since_last_snapshot,
      ()=>{ this.is_in_live = true; }
    );
    */
  };

  this.getLastSnapshot = function(command_name) {

  };

  this.getPastEventsSinceLastSnapshot = function (command_name) {
    return this.past_events_since_last_snapshot[command_name];
  };

  this.createSnapshot = function (command_name, snapshot) {

  };

};

module.exports = function() { return new AppStream() };
