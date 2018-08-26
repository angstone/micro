/*
Please make shure run

docker run -p 4222:4222 -p 8222:8222 -p 6222:6222 --name gnatsd -ti nats:latest

before
*/

const micro = require('@angstone/micro')();

micro.add('test', (req, cb)=>{
  cb(null, 'your message was: '+req.msg);
}).start(()=>{
  micro.act('test', { msg: 'I am happy!' }, (err, res)=>{
    if(err) throw err;
    console.log(res);
  })
})
