const configServer = {
  load: ['add', 'util'],
  config: {},
  setConfig: function(config) { this.config = config; },
  start: function() {
    this.includePing();
    this.includeGetConfig();
    this.includeSetConfig();
  },
  includePing: function() {
    this.load.add('get config ping', (req, cb)=>{ cb(null, 'pong'); });
  },
  includeSetConfig: function() {
    this.load.add('set config', (req, cb)=>{
      this.config = this.load.util.mergeDeep(this.config, req);
      cb(null);
    });
  },
  includeGetConfig: function() {
    this.load.add('get config', (req, cb)=>{
      if(req && typeof req == 'string') {
        let ans = this.config;
        req.split(' ').forEach(ind => ans = ans[ind]);
        cb(null, ans);
      } else cb(null, this.config)
    });
  },
}

module.exports = configServer;
