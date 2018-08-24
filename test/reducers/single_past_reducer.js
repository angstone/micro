const reducer = {};

reducer.models = ['user'];

reducer.redux = async function(event) {
  this.models.user.data.insert({name: event.payload.name, result: event.payload.first+event.payload.second})
};

module.exports = reducer;
