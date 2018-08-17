'use strict'

describe('PRE TEST', function() {

  let server
  let micro

  before(function(done) {
    console.warn('Running a docker instance of event store using docker as We believe you have installed docker-ce and followed the post-installatin steps so your current user can run a command like "docker ps"');
    console.warn('This can take a very big while if you are running the test script for the first time. If your docker is running okay just calm down and relax! It takes long..');
    this.timeout(Infinity);
    const process = spawn('scripts/RunEventStoreDocker.sh')
    process.stdout.on('data', data=>{console.log(data.toString());})
    process.on('close', code=>{
      if(code) throw code;
      else setTimeout(()=>{
        this.timeout(10000);
        server = MicroserviceTestServer(done);
      }, 5000);
    })
  })

  after(function(done) {
    server.kill()
    done()
  })

  beforeEach(function(done) {
    micro = Micro({ nats_url });
    done()
  })

  afterEach(function(done) {
    micro.close(done);
  })

  it('Should be able to be tested', function(done) {
    done();
  })

})
