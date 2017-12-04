/**
 * Map testcase objects to inline function
 *
 * @param {Object} testcases - nightwatch testcases
 * @return {Object} inline functions
 */
module.exports = testcases => {
  return Object.keys(testcases).reduce((prev, next) => {
    if (typeof testcases[next] === 'function') {
      prev[next] = function(client) {
        testcases[next].call(testcases, client);
      };
    } else {
      prev[next] = testcases[next];
    }
    return prev;
  });
};
