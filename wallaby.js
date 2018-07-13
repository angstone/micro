module.exports = function () {
  return {
    files: [
      'index.js',
      'lib/**/*.js'
    ],

    tests: [
      'test/**/*spec.js'
    ],

    env: {
      type: 'node'
    }
  };
};
