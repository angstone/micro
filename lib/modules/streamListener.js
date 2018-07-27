const EventStore = require('event-store-client');

function StreamListener() {
  this.load = ['env'];

  this.start = function() {
    this.options = {
      host: this.load.env.event_source_host,
      port: this.load.env.event_source_port,
      debug: this.load.env.event_source_debug
    };
    this.credentials = {
      username: this.load.env.event_source_username,
      password: this.load.env.event_source_password
    }
    this.connection = new EventStore.Connection(this.options);
  };

  /*
    Subscribes to a stream to receive notifications as soon as an event is written to the stream.
  */
  /*
  this.listenTo = function(stream_name, onEvent, onDropped) {
    return new Promise(resolve=>{
      this.connection.subscribeToStream(
        stream_name, // streamId - The name of the stream in the Event Store (string)
        true, // resolveLinkTos - True, to resolve links to events in other streams (boolean)
        onEvent, // onEventAppeared - A function to be called each time an event is written to the stream (function, takes in a StoredEvent object)
        resolve, // onConfirmed - A function to be called when the server has confirmed that the subscription is running (function, takes in an ISubscriptionConfirmation)
        onDropped, // onDropped - A function to be called when the subscription is cancelled (function, takes in an ISubscriptionDropped)
        this.credentials, // credentials - The user name and password needed for permission to subscribe to the stream (ICredentials, optional)
        (notHandled) => { // onNotHandled - A function to be called when the request for subscription is not handled (function, takes in an ISubscriptionNotHandled)
          const err = this.load.error.is(this.load.error.commonTypes.INFRASTRUCTURE, 'The request for the subscription to the event stream was not handled.');
          err.request_not_handled = notHandled;
          throw err;
        }
      );
    });
  };
  */

  /*
    Executes a catch-up subscription on the given stream,
    reading events from a given event number,
    and continuing with a live subscription when all historical events have been read.
  */
  this.listenToFrom = function(stream_name, onEvent, onDropped, fromEvent=0, onLiveProcessing) {
    return this.connection.subscribeToStreamFrom(
      stream_name, // streamId - The name of the stream in the Event Store (string)
      fromEvent, // fromEventNumber - Which event number to start after (if null, then from the beginning of the stream.)
      this.credentials, // credentials - The user name and password needed for permission to subscribe to the stream.
      onEvent, // onEventAppeared - Callback for each event received (historical or live)
      onLiveProcessing, // onLiveProcessingStarted - Callback when historical events have been read and live events are about to be read.
      onDropped // onDropped - Callback when subscription drops or is dropped.
    );
  };


  this.drop = function(id) {
    return new Promise(resolve => this.connection.unsubscribeFromStream(id, this.credentials, resolve));
  };


};

module.exports = function() { return new StreamListener() };

/*

backFrom: function(stream_name, eventNumber, howMany, cb=null) {
if(cb==null) { cb = howMany; howMany = eventNumber; stream_name = 'system'; }
return this.connection.readStreamEventsBackward(stream_name, eventNumber, howMany, true, true, null, this.credentials, cb);
},

fromTo: function(stream_name, eventNumberFrom, eventNumberTo, cb=null) {
if(cb==null) { cb = eventNumberTo; eventNumberTo = eventNumberFrom; stream_name = 'system'; }
return this.connection.readStreamEventsForward(stream_name, eventNumberFrom, (eventNumberTo-eventNumberFrom), tr
ue, true, null, this.credentials, cb);
},

*/
