/**
 * Wrap global BDD functions
 */
module.exports = () => {
  if ('__swapped' in global) {
    return;
  }

  const globals = [
    'describe',
    'before',
    'after',
    'beforeEach',
    'afterEach',
    'it'
  ];

  globals.forEach(fn => {
    if (global.hasOwnProperty(fn)) {
      const defaults = global[fn];
      global[fn] = function(client, done) {
        defaults(client, done);
      };
    }
  });

  global.__swapped = true;
};
