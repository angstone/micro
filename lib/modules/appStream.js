function AppStream() {
  this.load = ['streamListener', 'env'];

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
    const next_event_number_since_last_snapshot = 0; // to do betterfy this
    ??????????????????????????????????????????????????????????/

    // stream_name, onEvent, onDropped, fromEvent=0, onLiveProcessing
    this.stream_listener_id = this.load.streamListener.listenToFrom(
      this.load.env.app_topic,
      this.organizeEvent,
      this.handleDropped,
      next_event_number_since_last_snapshot,
      ()=>{ this.is_in_live = true; }
    );
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
