'use strict'

describe('MICROSERVICE', function() {

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
    done()
  })

  it('Should be able to be tested', function(done) {
    done();
  })

  it('Should be able to be created', function(done) {
    micro = Micro.create({ nats_url });
    expect(micro).to.be.exists()
    expect(micro.env.nats_url).to.be.equals(nats_url)
    done()
  })

  it('Should be able to be configured', function(done) {
    const debug = false;
    const log_file_path = 'klapaucius';
    const log_info_in_file = false;
    micro = Micro.create({ nats_url, debug, log_file_path, log_info_in_file });
    expect(micro).to.be.exists()
    expect(micro.env.nats_url).to.be.equals(nats_url)
    expect(micro.env.debug).to.be.equals(debug)
    expect(micro.env.log_file_path).to.be.equals(log_file_path)
    expect(micro.env.log_info_in_file).to.be.equals(log_info_in_file)
    done()
  })

  it('Should be able to be reconfigured', function(done) {
    const debug = false;
    const log_file_path = 'japancide';
    const log_info_in_file = false;
    micro = Micro.create({ nats_url, debug, log_file_path, log_info_in_file });
    expect(micro).to.be.exists()
    expect(micro.env.nats_url).to.be.equals(nats_url)
    expect(micro.env.debug).to.be.equals(debug)
    expect(micro.env.log_file_path).to.be.equals(log_file_path)
    expect(micro.env.log_info_in_file).to.be.equals(log_info_in_file)
    done()
  })

  it('Should be able to be reconfigured back', function(done) {
    const debug = true;
    const log_file_path = 'log';
    const log_info_in_file = true;
    micro = Micro.create({ nats_url });
    expect(micro).to.be.exists()
    expect(micro.env.nats_url).to.be.equals(nats_url)
    expect(micro.env.debug).to.be.equals(debug)
    expect(micro.env.log_file_path).to.be.equals(log_file_path)
    expect(micro.env.log_info_in_file).to.be.equals(log_info_in_file)
    done()
  })

  it('Should be void started', function(done) {
    micro = Micro.create({ nats_url });
    micro.start(()=>{
      expect(micro).to.be.exists()
      expect(micro.env.nats_url).to.be.equals(nats_url)
      done()
    });
  })

  it('Should be able to add a command and start serving it', function(done) {
    micro = Micro.create({ nats_url });
    let action = 'add';
    let func = (req, cb)=>{ cb(null, { result: req.a + req.b }) };
    micro.add(action, func).start(()=>{
      expect(micro.hemera_add_array).to.be.exists()
      expect(micro.hemera_add_array).to.be.array()
      micro.hemera_add_array.should.contain.a.thing.with.property('action', action);
      micro.hemera_add_array.filter(add => add.action == action)[0].func({ payload: {a:2, b:3} }, (err, ans)=>{
        expect(err).not.to.be.exists()
        expect(ans.result).to.be.exists()
        expect(ans.result).to.be.equals(5)
        done()
      })
    });
  })

  it('Should be able to request/reply', function(done) {
    micro = Micro.create({ nats_url });
    micro.add('add', (req, cb)=>{
      cb(null, { result: req.a + req.b });
    });
    micro.start(()=>{
      //setTimeout(()=>{
        micro.act('add', { a: 1, b: 2 }, (err, resp)=>{
          expect(err).not.to.be.exists()
          expect(resp.result).to.be.equals(3)
          done()
        });
      //},10);
    });
  })

})
