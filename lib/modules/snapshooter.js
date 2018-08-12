const fs = require('fs');

function Snapshooter() {
  this.load = ['env', 'error'];

  this.retrieveSnapshotDataSheet = function() {
    return new Promise(resolve=>{
      fs.readFile(this.load.env.snapshot_datasheet_path+'snapshot.json', 'utf8', (err, data) => {
        if(err) {
          console.log(err);
          resolve(null);
        }
        console.log(data);
        resolve( JSON.parse(data) );
      });
    });
  };

  this.start = async function() {
    this.snapshot_datasheet = await this.retrieveSnapshotDataSheet();
  };

  this.getNextEventNumberSinceLastSnapshot = function() {
    return this.snapshot_datasheet.next_event_number_since_last_snapshot;
  }

};

module.exports = function() { return new Snapshooter() };
