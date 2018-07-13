'use strict'

describe('AUTH', function() {

  let server
  let micro

  before(function(done) {
    server = MicroserviceTestServer(done);
  })

  after(function(done) {
    micro.close(()=>{
      server.kill()
      done()
    })
  })

  beforeEach(function(done) {
    micro = Micro({ nats_url });
    done()
  })

  it('Should be able to be tested', function(done) {
    done();
  })

  it('Should be able to be created', function(done) {
    micro.addProcedure({
      load: ['auth'],
    }).start();
    expect(micro).to.be.exists();
    micro.procedures.should.contain.a.thing.with.property('load');
    expect( micro.procedures.filter(procedure=>!!procedure.load.auth).length ).to.be.at.least(1);
    done()
  })

  it('Should be able to Respond a ping', function(done) {
    micro.addProcedure({
      load: ['auth'],
    }).start();
    expect(micro).to.be.exists();
    micro.act('get auth ping', (err, ans)=>{
      expect(err).not.to.be.exists()
      expect(ans).to.be.equals('pong')
      done()
    });
  })

  /*
  it('CONFIG SERVER Should be able to be created with a basic config and respond it', function(done) {
    const config = { lord: 'Jesus' };
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start();
    expect(micro).to.be.exists();
    micro.act('get config', (err, ans)=>{
      expect(err).not.to.be.exists()
      expect(ans).to.be.equals(config)
      done()
    });
  })

  it('CONFIG SERVER Should be able to set a config and respond it', function(done) {
    const config = { lord: 'Jesus Cristo' };
    micro.addProcedure({
      load: ['configServer'],
    }).start();
    expect(micro).to.be.exists();
    micro.act('set config', config, (err, ans)=>{
      expect(err).not.to.be.exists()
      micro.act('get config', config, (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans).to.be.equals(config)
        done()
      });
    });
  })

  it('CONFIG SERVER Should be able to set a deep config and respond it', function(done) {
    const config = { lord: 'Jesus Cristo The Lord', liveFor: 'mySelf' };
    const liveFor = 'love';
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start();
    expect(micro).to.be.exists();
    micro.act('set config', { liveFor }, (err, ans)=>{
      expect(err).not.to.be.exists()
      micro.act('get config', config, (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans.lord).to.be.equals(config.lord)
        expect(ans.liveFor).to.be.equals(liveFor)
        done()
      });
    });
  })

  it('CONFIG SERVER Should be able to get a deep config', function(done) {
    const liveFor = 'Love Each Other';
    const config = { lord: 'Jesus Cristo The Lord Of My Life', liveFor };
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start();
    expect(micro).to.be.exists();
    micro.act('get config', 'liveFor', (err, ans)=>{
      expect(err).not.to.be.exists()
      expect(ans).to.be.equals(liveFor)
      done()
    });
  })

  it('CONFIG SERVER Should be able to set and get a very deep config', function(done) {
    let so = { it: { will: 'be nice' }, he: 'is'};
    let newAs = { many: 'as possible', so };
    let other = { as: 'nothing', after: 'nice' };
    let config = { lord: 'JC', liveFor: { love: { each: { other } }, share: { knowledge: 'a lot' } } };
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start();
    expect(micro).to.be.exists();
    micro.act('set config', { liveFor: { love: { each: { other: { as: newAs } } } } }, (err, ans)=>{
      expect(err).not.to.be.exists()
      micro.act('get config', 'liveFor love each other as so', (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans).to.be.equals(so)
        config.liveFor.love.each.other.as = newAs;
        micro.act('get config', (err, ans)=>{
          expect(err).not.to.be.exists()
          expect(ans).to.be.equals(config);
          done()
        });
      });
    });
  })

  it('CONFIG SERVER Should be able to set and get a very deep config in this other scenary', function(done) {
    let love = 'love more';
    let config = { lord: 'JC', liveFor: { love: { each: { other:'as ourself' } }, share: { knowledge: 'a lot' } } };
    micro.addProcedure({
      load: ['configServer'],
      start: function() {
        this.load.configServer.setConfig(config);
      },
    }).start();
    expect(micro).to.be.exists();
    micro.act('set config', { liveFor: { love } }, (err, ans)=>{
      expect(err).not.to.be.exists()
      micro.act('get config', 'liveFor love', (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans).to.be.equals(love)
        config.liveFor.love = love;
        micro.act('get config', (err, ans)=>{
          expect(err).not.to.be.exists()
          expect(ans).to.be.equals(config);
          done()
        });
      });
    });
  })

  it('Should be void started', function(done) {
    micro.start(()=>{
      expect(micro).to.be.exists()
      expect(micro.env.nats_url).to.be.equals(nats_url)
      done()
    });
  })

  it('Should be able to add a command and start serving it', function(done) {
    let action = 'add';
    let func = (req, cb)=>{ cb(null, { result: req.a + req.b }) };
    micro.add(action, func).start(()=>{
      expect(micro.hemera_add_array).to.be.exists()
      expect(micro.hemera_add_array).to.be.array()
      expect(micro.hemera_add_array[0].action).to.be.equals(action)
      micro.hemera_add_array[0].func({ payload: {a:2, b:3} }, (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans.result).to.be.exists()
        expect(ans.result).to.be.equals(5)
        done()
      })
    });
  })

  it('Should be able to request/reply', function(done) {
    const micro = Micro.create({ debug: true, nats_url }).add('add', (req, cb)=>{
      cb(null, { result: req.a + req.b });
    });
    micro.start(()=>{
      setTimeout(()=>{
        micro.act('add', { a: 1, b: 2 }, (err, resp)=>{
          expect(err).not.to.be.exists()
          expect(resp.result).to.be.equals(3)
          done()
        });
      },200);
    });
  })
  */

})
