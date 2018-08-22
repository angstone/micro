const reducer = {};

reducer.models = ['user'];

reducer.redux = async function(eventNumber, payload) {
  const new_user = Object.assign({}, payload, {
    id: eventNumber,
    created_at: Date.now()
  })
  this.models.user.data.insert(new_user);
  //console.log('REDUCED: ', payload, eventNumber);
};

module.exports = reducer;
