const reducer = {};

reducer.models = ['user'];

reducer.redux = async function(eventNumber, payload) {
  this.models.user.data.insert({name: payload.name, result: payload.first+payload.second})
};

module.exports = reducer;
