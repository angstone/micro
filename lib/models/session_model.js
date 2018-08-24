const TAFFY = require('taffy');
const uid = require('uuid/v1');

const sessionModel = {
  data: TAFFY(),
  methods: {
    reborn: ()=>{
      sessionModel.data = TAFFY();
    },
  },
};

module.exports = sessionModel;
