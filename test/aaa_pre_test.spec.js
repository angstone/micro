'use strict'

describe('PRE TEST', function() {

  let server
  let micro

  before(function(done) {
    const processFirst = spawn('scripts/CheckEventStoreDocker.sh')
    processFirst.on('close', code=>{
      if(code) throw code;
    })
    processFirst.stdout.on('data', data=>{
      const output = JSON.parse(data.toString()).status;
      if(output=='NOT RUNNING') {

        // Start the docker
        console.warn('Running a docker instance of event store using docker as We believe you have installed docker-ce and followed the post-installatin steps so your current user can run a command like "docker ps"');
        console.warn('This can take a very big while if you are running the test script for the first time. If your docker is running okay just calm down and relax! It takes long..');
        this.timeout(Infinity);
        const processTwo = spawn('scripts/RunEventStoreDocker.sh')
        processTwo.stdout.on('data', data=>{console.log(data.toString());})
        processTwo.on('close', code=>{
          if(code) throw code;
          else setTimeout(()=>{
            this.timeout(10000);
            server = MicroserviceTestServer(done);
          }, 5000);
        })

      } else server = MicroserviceTestServer(done);
    });
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

  it('Should be ready to be tested', function(done) {
    done();
  })

})
