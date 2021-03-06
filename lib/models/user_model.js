const TAFFY = require('taffy');
const events = require('events');
const uid = require('uuid/v1');

const userModel = {
  SYSTEM_AGENT: {
    id: 1,
    name: 'SYSTEM AGENT',
    login: 'system_god_user',
    password: null,
    password_confirmation: null,
    created_at: null,
  },
  data: TAFFY(),
  methods: {
    reborn: ()=>{
      userModel.data = TAFFY([userModel.SYSTEM_AGENT]);
    }
  },
  stream$: new events.EventEmitter(),
};

module.exports = userModel;
