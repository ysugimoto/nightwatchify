const transformObject = obj => {
  return Object.keys(obj).reduce((prev, next) => {
    if (typeof obj[next] === 'function') {
      prev[next] = function(client) {
        obj[next].call(obj, client);
      };
    } else {
      prev[next] = obj[next];
    }
    return prev;
  });
};

const transformClass = Fn => {
  const NightwatchifyTestcase = Object.keys(Fn.prototype)
    .reduce((prev, next) => {
      prev.prototype[next] = function() {
        Fn.prototype[next].apply(this, arguments);
      };
      return prev;
    }, function(){})
  ;

  return new NightwatchifyTestcase();
};

/**
 * Transform testcase object|function to ES5 styled one
 *
 * @param {Funtion|Object} testcases - nightwatch testcases
 * @return {Object} inline functions
 */
module.exports = testcases => {
  switch (typeof testcases) {
    case 'function':
      return transformClass(testcases);
    case 'object':
      return transformObject(testcases);
    default:
      throw new Error('[nightwatchify] testcase must be an Object or Class');
  }
};
