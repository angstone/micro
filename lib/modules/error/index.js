const COMMON_TYPES = require('./commonTypes');
const NO_DESCRIPTION = 'No description was provided for this error.';

function ErrorModule() {
  this.load = ['logger'];

  this.is = function(commonType=COMMON_TYPES.GENERIC_OPERATIONAL, description=NO_DESCRIPTION) {
    const error = new Error(description==NO_DESCRIPTION ? commonType : description);
    error.commonType = commonType;
    error.description = description;
    error.isOperational = true;
    return error;
  };

  this.fatal = function(commonType=COMMON_TYPES.UNKKNOWN, description=NO_DESCRIPTION) {
    const error = new Error(description==NO_DESCRIPTION ? commonType : description);
    error.commonType = commonType;
    error.description = description;
    error.isOperational = false;
    return error;
  };

  this.throw = function(commonType=COMMON_TYPES.GENERIC_OPERATIONAL, description=NO_DESCRIPTION) {
    throw this.is(commonType, description);
  };

  this.throwFatal = function(commonType=COMMON_TYPES.UNKKNOWN, description=NO_DESCRIPTION) {
    throw this.fatal(commonType, description);
  };

  this.handle = function(err) {
    let err_text = 'Error! Type: '+err.commonType+' | Description: '+err.description;
    if(!err.isOperational) {
      err_text+=' | Json: '+JSON.stringify(err);
      this.load.logger.error(err_text);
      process.exit(1);
    } else {
      this.load.logger.info(err_text);
    }
  };

}

module.exports = function() {
  return new ErrorModule();
}
