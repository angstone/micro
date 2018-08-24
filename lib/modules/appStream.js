const EventEmitter = require('events');

function AppStream() {
  this.load = ['streamListener', 'env', 'error', 'evt'/*, 'snapshooter*/];

  this.past_events_since_last_snapshot = {};

  this.event_stream$ = new EventEmitter();
  this.reducer_stream$ = new EventEmitter();
  this.is_in_live = false;
  this.stream_listener_subscription = null;

  this.models_streams = {};

  this.free_buffers = {};

  this.getReducerStream = function() {
    return this.reducer_stream$;
  }

  this.getModelStream = function(model) {
    if(!this.models_streams[model]) this.models_streams[model] = new EventEmitter();
    return this.models_streams[model];
  }

  this.organizeEvent = function(event) {
    if(!this.free_buffers[event.eventType]) {
      if(!this.past_events_since_last_snapshot[event.eventType])
        this.past_events_since_last_snapshot[event.eventType] = [];
      this.past_events_since_last_snapshot[event.eventType].push({ payload: event.data, eventNumber: event.eventNumber, created: event.created });
      if(this.is_in_live) this.event_stream$.emit(event.eventType, event);
    }
  }

  this.handleDropped = function(subscription, reason/*, error*/) {
    this.load.error.throwFatal(this.load.error.COMMON_TYPES.EVENT_STREAM,
      'Subscription Dropped due to: '+reason);
  }

  this.liveStarted = function() {
    this.is_in_live = true;
  }

  this.startEventStoreIfNeeded = async function() {
    let ground_zero = await this.load.evt.get(0);
    while(ground_zero==null) {
      const ground_zero_evt_command = 'ground_zero';
      const number_given = await this.load.evt.send(ground_zero_evt_command);
      ground_zero = await this.load.evt.get(number_given);
    }
  }

  this.start = async function() {
    // grant the first event to make sure the stream exists
    await this.startEventStoreIfNeeded();

    // const next_event_number_since_last_snapshot = this.load.snapshooter.getNextEventNumberSinceLastSnapshot();
    const next_event_number_since_last_snapshot = 0;

    // stream_name, onEvent, onDropped, fromEvent=0, onLiveProcessing
    this.stream_listener_subscription = this.load.streamListener.listenToFrom(
      this.load.env.app_topic,
      this.organizeEvent.bind(this),
      this.handleDropped.bind(this),
      next_event_number_since_last_snapshot,
      this.liveStarted.bind(this)
    )
  }

  this.getStream = function() { return this.event_stream$; }

  this.freeBufferForCommand = function(command_name) {
    if(!this.free_buffers[command_name]) this.free_buffers[command_name] = true;
    if(this.past_events_since_last_snapshot[command_name])
      this.past_events_since_last_snapshot[command_name] = null;
  }

}

module.exports = function() { return new AppStream() };

/*
this.getLastSnapshot = function(command_name) {

};

this.getPastEventsSinceLastSnapshot = function (command_name) {
return this.past_events_since_last_snapshot[command_name];
};

this.createSnapshot = function (command_name, snapshot) {

};
*/
