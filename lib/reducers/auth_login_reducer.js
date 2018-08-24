const reducer = {};

reducer.load = ['env'];

reducer.models = ['user', 'session'];

reducer.redux = async function(event) {
  const user = this.models.user.data({ login: event.payload.login }).first()

  const new_session = {
    id: event.eventNumber,
    express_session_id: event.payload.express_session_id,
    device_id: event.payload.device_id,
    user_id: user.id,
    expiration: Date.now()+this.load.env.auth_session_time_duration,
    role: 'new_user',
    created_at: event.created,
  }
  // if the user already has a session with the same device, the system must update the duration of the session and the express_session_id
  this.models.session.data({user_id: user.id, device_id: event.payload.device_id}).remove();
  this.models.session.data.insert(new_session);
};

module.exports = reducer;
