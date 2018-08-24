const reducer = {};

reducer.models = ['user'];

reducer.redux = async function(event) {
  const new_user = Object.assign({}, event.payload, {
    id: event.eventNumber,
    created_at: event.created
  })
  this.models.user.data.insert(new_user);
  //console.log('REDUCED: ', payload, eventNumber);
};

module.exports = reducer;
